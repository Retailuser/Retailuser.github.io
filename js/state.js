import {
  DEFAULT_ASSETS,
  DEFAULT_USERS,
  DEFAULT_FACILITIES,
  STORAGE_KEYS,
} from './config.js';

function loadJsonStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null || raw === '') {
      return Array.isArray(fallback) ? [...fallback] : { ...fallback };
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback)) {
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...fallback];
    }
    if (typeof fallback === 'object' && fallback !== null) {
      return parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0
        ? parsed
        : { ...fallback };
    }
    return parsed ?? fallback;
  } catch (_) {
    return Array.isArray(fallback) ? [...fallback] : { ...fallback };
  }
}

function safePersist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {
    /* file:// or private mode may block storage — keep in-memory data for this session */
  }
}

export let localAssets = loadJsonStorage(STORAGE_KEYS.assets, DEFAULT_ASSETS);
export let localUsers = loadJsonStorage(STORAGE_KEYS.users, DEFAULT_USERS);
export let localAuditLogs = loadJsonStorage(STORAGE_KEYS.auditLogs, []);
export let currentUser = null;
export let selectedFacility = 'Seberang Jaya';
export let activeAuditAsset = null;
export let activeStreams = {};
export let mediaInputMethods = { 1: 'CAMERA', 2: 'CAMERA' };
export let facilitiesList = loadJsonStorage(STORAGE_KEYS.facilities, DEFAULT_FACILITIES);
export let pendingLookupId = null;
export let html5QrScannerInstance = null;

/** Ensure demo/default records exist when opening via file:// or empty storage. */
export function bootstrapLocalData() {
  if (localAssets.length === 0) {
    localAssets.push(...DEFAULT_ASSETS);
  }
  if (Object.keys(localUsers).length === 0) {
    Object.assign(localUsers, DEFAULT_USERS);
  }
  refreshFacilitiesList();
  persistAssets();
  persistUsers();
  persistFacilities();
}

export function setSelectedFacility(fac) {
  selectedFacility = fac;
}

export function setActiveAuditAsset(asset) {
  activeAuditAsset = asset;
}

export function setHtml5QrScannerInstance(instance) {
  html5QrScannerInstance = instance;
}

export function setPendingLookupId(id) {
  pendingLookupId = id;
}

export function takePendingLookupId() {
  const id = pendingLookupId;
  pendingLookupId = null;
  return id;
}

export function loadSavedUser() {
  const savedUser = localStorage.getItem(STORAGE_KEYS.activeUser);
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
    } catch (e) {
      currentUser = null;
    }
  }
}

export function setCurrentUser(user) {
  currentUser = user;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.activeUser, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.activeUser);
  }
}

export function persistAssets() {
  safePersist(STORAGE_KEYS.assets, localAssets);
}

export function persistUsers() {
  safePersist(STORAGE_KEYS.users, localUsers);
}

export function persistAuditLogs() {
  safePersist(STORAGE_KEYS.auditLogs, localAuditLogs);
}

export function persistFacilities() {
  safePersist(STORAGE_KEYS.facilities, facilitiesList);
}

export function refreshFacilitiesList() {
  const fromAssets = [...new Set(localAssets.map((a) => a.facility).filter(Boolean))];
  facilitiesList = [...new Set([...facilitiesList, ...fromAssets])].sort();
  persistFacilities();
}
