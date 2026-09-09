#!/usr/bin/env node
/*
 * Simulateur PMS - backend local, ZERO dependance (http + crypto + https natifs).
 * - mint un token private_key_jwt (comme testKit/get-token.js)
 * - /api/pay  : ouvre une session (POST /sessions) selon le mode metier + montant, renvoie le clientSession
 * - /api/op   : console d'operations (capture / refund / cancel / reversal / adjust / extend / get / mit / tokens)
 * La cle privee reste locale, pas de CORS.
 *
 * Lancer :  node server.js   puis http://localhost:3000
 */
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const cfg = require('./config');

const PEM = fs.readFileSync(path.join(__dirname, cfg.privateKeyFile.replace(/^\.\//, '')), 'utf8');
const API = cfg.baseUrl + '/api/public/v1';

// ---------- OAuth : private_key_jwt ----------
function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function buildAssertion() {
  const now = Math.floor(Date.now() / 1000);
  const skew = 60; // antidate iat/nbf (sinon Hydra "Token used before issued")
  const header = { alg: 'RS256', typ: 'JWT', kid: cfg.kid };
  const payload = {
    iss: cfg.clientId, sub: cfg.clientId, aud: cfg.aud,
    jti: 'jti-' + now + '-' + Math.random().toString(36).slice(2),
    iat: now - skew, nbf: now - skew, exp: now + 300,
  };
  const input = b64url(JSON.stringify(header)) + '.' + b64url(JSON.stringify(payload));
  return input + '.' + b64url(crypto.sign('RSA-SHA256', Buffer.from(input), PEM));
}
let tokenCache = { value: null, exp: 0 };
async function getToken() {
  const now = Math.floor(Date.now() / 1000);
  if (tokenCache.value && tokenCache.exp - 30 > now) return tokenCache.value;
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    client_assertion: buildAssertion(),
    scope: cfg.scope, audience: cfg.tokenAudience,
  }).toString();
  const res = await httpsRequest(cfg.tokenUrl, 'POST', { 'Content-Type': 'application/x-www-form-urlencoded' }, body);
  if (res.status !== 200) throw new Error('Token ' + res.status + ' : ' + res.body);
  const json = JSON.parse(res.body);
  tokenCache = { value: json.access_token, exp: now + (json.expires_in || 300) };
  return tokenCache.value;
}

// ---------- appel authentifie de NOTRE API ----------
async function apiCall(method, urlPath, bodyObj) {
  const token = await getToken();
  const headers = { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json' };
  let payload;
  if (bodyObj !== undefined && bodyObj !== null && method !== 'GET' && method !== 'DELETE') {
    headers['Content-Type'] = 'application/json';
    headers['Idempotency-Key'] = crypto.randomUUID();
    payload = JSON.stringify(bodyObj);
    headers['Content-Length'] = Buffer.byteLength(payload); // forcer Content-Length, sinon Node envoie du chunked et la gateway timeout ("context deadline exceeded")
  } else if (method === 'POST') {
    headers['Idempotency-Key'] = crypto.randomUUID();
  }
  const res = await httpsRequest(API + urlPath, method, headers, payload);
  let parsed = null;
  try { parsed = res.body ? JSON.parse(res.body) : null; } catch (e) { parsed = res.body; }
  return { httpStatus: res.status, body: parsed };
}

// ---------- /api/pay : ouverture de session ----------
async function openSession({ mode, amount, label, shopperReference, shopperCountryCode, consentMode }) {
  const m = cfg.paymentModes[mode];
  if (!m) throw new Error('Mode inconnu : ' + mode);
  if (!amount || !amount.value) throw new Error('Montant manquant');
  const reqBody = {
    amount: { value: amount.value, currency: amount.currency || 'EUR' },
    reference: 'sim-' + mode + '-' + Date.now(),
    publicStoreId: cfg.publicStoreId,
    returnUrl: 'http://localhost:' + (process.env.PORT || cfg.port) + '/',
    shopperCountryCode: shopperCountryCode || 'FR',
    capture: m.capture,
    moto: false,
    preAuth: !!m.preAuth,
    tokenization: m.tokenization
      ? { shopperReference: shopperReference || ('sim-' + mode + '-' + Date.now()), recurringModel: m.tokenization.recurringModel,
          consentMode: consentMode || m.tokenization.consentMode } // #2793 : ASK_FOR_CONSENT affiche la case ; le front peut surcharger
      : null,
    // Detail panier : requis pour afficher Klarna / BNPL (un article couvrant le montant total).
    lineItems: [
      { id: 'sim-item', description: label || 'Article', quantity: 1, amountIncludingTax: amount.value },
    ],
  };
  const res = await apiCall('POST', '/sessions', reqBody);
  if (res.httpStatus !== 200) throw new Error('sessions ' + res.httpStatus + ' : ' + JSON.stringify(res.body));
  return {
    clientSession: res.body.clientSession,
    clientKey: cfg.clientKey,
    environment: cfg.adyenEnvironment,
    label: label || 'Paiement',
    amount: reqBody.amount,
    reference: reqBody.reference,
  };
}

// ---------- /api/op : console d'operations ----------
async function operation(p) {
  const ref = p.pspReference;
  const store = cfg.publicStoreId;
  const money = (p.amount != null) ? { value: Number(p.amount), currency: p.currency || 'EUR' } : null;
  switch (p.op) {
    case 'get':      return apiCall('GET', '/payments/' + enc(ref) + '?publicStoreId=' + store);
    case 'capture':  return apiCall('POST', '/payments/' + enc(ref) + '/captures', { amount: money, publicStoreId: store });
    case 'refund':   return apiCall('POST', '/payments/' + enc(ref) + '/refunds', { amount: money, publicStoreId: store });
    case 'cancel':   return apiCall('POST', '/payments/' + enc(ref) + '/cancels', { publicStoreId: store });
    case 'reversal': return apiCall('POST', '/payments/' + enc(ref) + '/reversals', { publicStoreId: store });
    case 'adjust':   return apiCall('POST', '/payments/' + enc(ref) + '/amount', { amount: money, publicStoreId: store });
    case 'extend':   return apiCall('POST', '/payments/' + enc(ref) + '/extend', { amount: money, publicStoreId: store, reason: p.reason || null });
    case 'mit':      return apiCall('POST', '/payments', { amount: money, publicStoreId: store, token: p.token, shopperReference: p.shopperReference, recurringModel: p.recurringModel || 'UNSCHEDULED', reference: 'sim-mit-' + Date.now() });
    case 'tokens':   return apiCall('GET', '/stored-payment-methods?shopperReference=' + enc(p.shopperReference) + '&publicStoreId=' + store);
    case 'token-del':return apiCall('DELETE', '/stored-payment-methods/' + enc(p.token) + '?shopperReference=' + enc(p.shopperReference) + '&publicStoreId=' + store);
    default: throw new Error('Operation inconnue : ' + p.op);
  }
}
function enc(s) { return encodeURIComponent(s == null ? '' : s); }

// ---------- util HTTPS ----------
function httpsRequest(url, method, headers, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request({ method, hostname: u.hostname, path: u.pathname + u.search, headers },
      (r) => { let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => resolve({ status: r.statusCode, body: d })); });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// ---------- serveur HTTP local ----------
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };
const PUBLIC = path.join(__dirname, 'public');
function sendJson(res, status, obj) { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); }
function serveStatic(req, res) {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.normalize(path.join(PUBLIC, p));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}
function readBody(req) { return new Promise((r) => { let d = ''; req.on('data', (c) => (d += c)); req.on('end', () => r(d)); }); }

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'POST' && req.url === '/api/pay') {
      return sendJson(res, 200, await openSession(JSON.parse((await readBody(req)) || '{}')));
    }
    if (req.method === 'POST' && req.url === '/api/op') {
      const out = await operation(JSON.parse((await readBody(req)) || '{}'));
      return sendJson(res, 200, out); // { httpStatus, body } : on relaie tel quel a la console
    }
    if (req.method === 'POST' && req.url === '/api/pos') {
      return sendJson(res, 501, {
        error: 'TPE non disponible en local',
        detail: 'Le paiement au terminal appelle /payments/pos avec un deviceId (POIID) d un terminal Adyen enregistre. A brancher quand un terminal de test est dispo.',
      });
    }
    if (req.method === 'GET' && req.url === '/api/config') {
      return sendJson(res, 200, { store: cfg.publicStoreId, env: cfg.adyenEnvironment });
    }
    return serveStatic(req, res);
  } catch (e) { sendJson(res, 500, { error: String(e.message || e) }); }
});

const PORT = process.env.PORT || cfg.port;
server.listen(PORT, () => {
  console.log('\n  Simulateur PMS -> http://localhost:' + PORT);
  console.log('  Boutique de test : ' + cfg.publicStoreId + ' (env ' + cfg.adyenEnvironment + ')');
  console.log('  Ctrl+C pour arreter.\n');
});
