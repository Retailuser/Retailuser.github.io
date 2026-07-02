import { APP, PENANG_KEYWORDS } from './config.js';

export function escapeHtml(str) {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Folder URL for the app (works on GitHub Pages subpaths, e.g. /TNB/). */
export function getAppBaseUrl() {
  const { origin, pathname } = window.location;
  const dir = pathname.replace(/[^/]+$/, '');
  return `${origin}${dir.endsWith('/') ? dir : `${dir}/`}`;
}

/** Resolve any app-relative path to a full absolute URL. */
export function resolveAppPath(relativePath) {
  return new URL(relativePath, getAppBaseUrl()).href;
}

/** Public asset lookup URL encoded in printed/scanned QR codes. */
export function getLookupUrl(assetId) {
  const url = new URL(APP.lookup, getAppBaseUrl());
  url.searchParams.set('lookupId', String(assetId).trim());
  return url.href;
}

/** Read asset id from lookup page URL (?lookupId= or #id). */
export function parseLookupIdFromUrl(href = window.location.href) {
  const url = new URL(href);
  const fromQuery = url.searchParams.get('lookupId');
  if (fromQuery) return String(fromQuery).trim();

  const hash = url.hash.replace(/^#/, '').trim();
  if (hash && /^[A-Za-z0-9_-]+$/.test(hash)) return hash;

  return null;
}

export function isLocalOnlyOrigin() {
  const { hostname, protocol } = window.location;
  return protocol === 'file:' || hostname === 'localhost' || hostname === '127.0.0.1';
}

export function inferFacility(costCenterDesc, pillar) {
  const text = `${costCenterDesc || ''} ${pillar || ''}`.toLowerCase();
  if (text.includes('seberang jaya') || text.includes('seb jaya')) return 'Seberang Jaya';
  if (text.includes('nibong tebal') || text.includes('n. tebal')) return 'Nibong Tebal';
  if (text.includes('bayan baru')) return 'Bayan Baru';
  if (text.includes('bertam')) return 'Bertam';
  if (text.includes('anson') || text.includes('jln anson')) return 'Jln Anson';
  return 'State Penang';
}

export function isPenangText(text) {
  const lower = String(text || '').toLowerCase();
  return PENANG_KEYWORDS.some((k) => lower.includes(k));
}

export function mapCsvStatus(statusVal, taggingDate) {
  if (taggingDate && String(taggingDate).trim()) return 'Done';
  const s = String(statusVal || '').trim();
  if (s === '1') return 'Done';
  if (s === '2') return 'In Progress';
  if (s === '3' || s === '4') return 'Pending';
  if (s.toLowerCase() === 'done') return 'Done';
  if (s.toLowerCase().includes('progress')) return 'In Progress';
  return 'Pending';
}

export function mapTaskRequired(task) {
  const t = String(task || 'Tag').trim();
  if (t.toLowerCase() === 'tag' || t.toLowerCase() === 'tag asset') return 'Tag Asset';
  if (['Transfer', 'Scrap', 'Write-off'].includes(t)) return t;
  return t || 'Tag Asset';
}

export function normalizeHeader(h) {
  return String(h || '').replace(/\s+/g, ' ').trim().toLowerCase();
}
