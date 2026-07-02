import { firebaseConfig, DEFAULT_USERS } from './config.js';
import {
  localAssets,
  localUsers,
  localAuditLogs,
  refreshFacilitiesList,
  persistAssets,
  persistUsers,
  persistAuditLogs,
  takePendingLookupId,
} from './state.js';
import { renderAuditLogs, updateHeroStats } from './ui.js';

export let db = null;
export let auth = null;
export let storage = null;
export let analytics = null;
export let isFirebaseReady = false;

let collection;
let doc;
let setDoc;
let getDoc;
let getDocs;
let onSnapshot;
let initializeApp;
let initializeFirestore;
let persistentLocalCache;
let persistentMultipleTabManager;
let getAuth;
let getStorage;
let getAnalytics;

let snapshotHandlers = {
  onAssetsUpdated: null,
  onUsersUpdated: null,
  onLookupReady: null,
};

export function isOfflineFileMode() {
  return window.location.protocol === 'file:';
}

async function loadFirebaseSdk() {
  const [appMod, firestoreMod, authMod, storageMod, analyticsMod] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js'),
    import('https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/12.15.0/firebase-storage.js'),
    import('https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js'),
  ]);

  initializeApp = appMod.initializeApp;
  ({
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    onSnapshot,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
  } = firestoreMod);
  getAuth = authMod.getAuth;
  getStorage = storageMod.getStorage;
  getAnalytics = analyticsMod.getAnalytics;
}

export function registerSnapshotHandlers(handlers) {
  snapshotHandlers = { ...snapshotHandlers, ...handlers };
}

export async function fetchCloudUser(staffId) {
  if (!isFirebaseReady || !db) return null;
  const snap = await getDoc(doc(db, 'users', staffId));
  return snap.exists() ? snap.data() : null;
}

export async function cloudUserExists(staffId) {
  if (!isFirebaseReady || !db) return false;
  const snap = await getDoc(doc(db, 'users', staffId));
  return snap.exists();
}

export async function initFirebase() {
  if (isOfflineFileMode()) {
    isFirebaseReady = false;
    return false;
  }

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    isFirebaseReady = false;
    return false;
  }

  try {
    await loadFirebaseSdk();

    const app = initializeApp(firebaseConfig);
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    });
    auth = getAuth(app);
    storage = getStorage(app);
    try {
      analytics = getAnalytics(app);
    } catch (_) {
      analytics = null;
    }

    try {
      await getDocs(collection(db, 'assets'));
    } catch (permErr) {
      console.warn('Firestore unavailable — using offline data:', permErr.message);
      isFirebaseReady = false;
      return false;
    }

    isFirebaseReady = true;
    setupLiveSnapshotStreaming();
    await loadCloudDatabase();
    await seedDefaultUsers();
    return true;
  } catch (e) {
    console.warn('Firebase connection unavailable — using offline data:', e.message || e);
    isFirebaseReady = false;
    return false;
  }
}

export async function seedDefaultUsers() {
  if (!isFirebaseReady) return;
  for (const [id, user] of Object.entries(DEFAULT_USERS)) {
    const snap = await getDoc(doc(db, 'users', id));
    if (!snap.exists()) {
      await setDoc(doc(db, 'users', id), user);
    }
  }
}

export function setupLiveSnapshotStreaming() {
  if (!isFirebaseReady) return;

  onSnapshot(
    collection(db, 'users'),
    (snapshot) => {
      snapshot.forEach((d) => {
        localUsers[d.id] = d.data();
      });
      persistUsers();
      snapshotHandlers.onUsersUpdated?.();
    },
    (error) => {
      console.warn('Firestore users sync disabled:', error.message);
    }
  );

  onSnapshot(
    collection(db, 'assets'),
    (snapshot) => {
      if (snapshot.empty && localAssets.length > 0) {
        snapshotHandlers.onAssetsUpdated?.();
        return;
      }

      localAssets.length = 0;
      snapshot.forEach((d) => {
        localAssets.push(d.data());
      });
      persistAssets();
      refreshFacilitiesList();
      updateHeroStats();
      snapshotHandlers.onAssetsUpdated?.();

      const id = takePendingLookupId();
      if (id) {
        snapshotHandlers.onLookupReady?.(id);
      }
    },
    (error) => {
      console.warn('Firestore assets sync disabled:', error.message);
      snapshotHandlers.onAssetsUpdated?.();
    }
  );

  onSnapshot(
    collection(db, 'auditLogs'),
    (snapshot) => {
      localAuditLogs.length = 0;
      snapshot.forEach((d) => {
        localAuditLogs.push({ id: d.id, ...d.data() });
      });
      localAuditLogs.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
      persistAuditLogs();
      renderAuditLogs();
    },
    (error) => {
      console.warn('Firestore audit log sync disabled:', error.message);
    }
  );
}

export async function loadCloudDatabase() {
  if (!isFirebaseReady) return;
  try {
    const assetsCol = collection(db, 'assets');
    const assetSnap = await getDocs(assetsCol);
    if (assetSnap.empty) {
      for (const asset of localAssets) {
        await setDoc(doc(db, 'assets', asset.id), asset);
      }
    }
  } catch (err) {
    console.warn('Cloud seed skipped (offline mode):', err.message || err);
  }
}

export async function saveStateObject(type, id, object, syncFn) {
  if (type === 'asset' || type === 'assets') {
    const idx = localAssets.findIndex((a) => a.id === id);
    let merged;
    if (idx > -1) {
      merged = { ...localAssets[idx], ...object, id };
      localAssets[idx] = merged;
    } else {
      merged = { ...object, id };
      localAssets.push(merged);
    }
    persistAssets();
    refreshFacilitiesList();
    if (isFirebaseReady) {
      await setDoc(doc(db, 'assets', id), merged, { merge: true });
    }
  } else if (type === 'user' || type === 'users') {
    localUsers[id] = { ...localUsers[id], ...object, staffId: id };
    persistUsers();
    if (isFirebaseReady) {
      await setDoc(doc(db, 'users', id), localUsers[id], { merge: true });
    }
  }

  updateHeroStats();
  syncFn?.();
}

export async function addAuditLog(staffId, action, context) {
  const entry = {
    staffId: staffId || 'SYSTEM',
    action,
    context: context || '',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  localAuditLogs.unshift(entry);
  if (localAuditLogs.length > 500) localAuditLogs.splice(500);
  persistAuditLogs();

  if (isFirebaseReady) {
    const logId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await setDoc(doc(db, 'auditLogs', logId), entry);
  }

  renderAuditLogs();
}
