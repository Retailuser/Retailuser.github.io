(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // js/config.js
  var firebaseConfig = {
    apiKey: "AIzaSyApvYIkmdJ7UUL8HB0eUqiD3QFq4zFee1g",
    authDomain: "asset-management-system-5f93f.firebaseapp.com",
    projectId: "asset-management-system-5f93f",
    storageBucket: "asset-management-system-5f93f.firebasestorage.app",
    messagingSenderId: "849553013843",
    appId: "1:849553013843:web:3541c68c157cd31c11daa6",
    measurementId: "G-02C04Q39C5"
  };
  var DEFAULT_USERS = {
    admin123: { name: "System Administrator", staffId: "admin123", role: "ADMIN", status: "APPROVED", hash: "tnbVM" },
    staff123: { name: "Field Worker Demo", staffId: "staff123", role: "FIELD_WORKER", status: "APPROVED", hash: "password" }
  };
  var DEFAULT_ASSETS = [
    {
      id: "18012384",
      name: "0820A0 1 UNIT HD PAPER SHREDDER:SEB JAYA",
      class: "FFE98200",
      serial: "EB36202654001",
      cocd: "6003",
      busA: "3620",
      costCenter: "C362000",
      costCenterDesc: "Customer Service Seberang Jaya",
      pillar: "SMER P. Pinang - Cust.Care",
      pic: "Siti Azima Binti Abd Hamid (100996247)",
      status: "Pending",
      taskRequired: "Tag Asset",
      locationLevel: "Aras 1 / Bilik Kedai Tenaga",
      sizeSpecs: "Aurora Paper Shredder, Model : AS352MQ",
      remarks: "",
      lastUpdated: "2026-06-23 10:00:00",
      lastStaffId: "SYS-INIT",
      facility: "Seberang Jaya"
    }
  ];
  var PENANG_KEYWORDS = [
    "penang",
    "pulau pinang",
    "p. pinang",
    "p.pinang",
    "seberang jaya",
    "seb jaya",
    "nibong tebal",
    "n. tebal",
    "bayan baru",
    "bertam",
    "anson",
    "george town",
    "butterworth",
    "bukit minyak",
    "permatang pauh"
  ];
  var OTHER_STATE_MARKERS = [
    "PERAK",
    "KEDAH",
    "SELANGOR",
    "JOHOR",
    "MELAKA",
    "NEGERI SEMBILAN",
    "PAHANG",
    "TERENGGANU",
    "KELANTAN",
    "SABAH",
    "SARAWAK",
    "KUALA LUMPUR",
    "PUTRAJAYA",
    "LABUAN"
  ];
  var MOTHER_FILE_HEADERS = [
    "No.",
    "Asset",
    "SNo.",
    "CoCd",
    "BusA",
    "Cost Ctr",
    "Cost Center Description",
    "Pillar",
    "Level",
    "Class",
    "RUC number",
    "TType",
    "Serial number",
    "Asset description",
    "Additional description",
    "Quantity",
    "Cap.date",
    "Pstng Date",
    "Acquisition Cost",
    "Accumulated Depr",
    "NBV",
    "PIC (BC)",
    "PIC (Full name & ID staff)",
    "Task Required (Tag/Transfer/Scrap/Write-off )",
    "Location (LEVEL/ROOM/PIC)",
    "*Size/Model/Series Number",
    "**Status ",
    "Remarks (Why cant tag - system/renovation)",
    "Tagging date",
    "Tagged by (Full name & ID staff)",
    "Picture 1",
    "Picture 2"
  ];
  var APP = {
    home: "index.html",
    login: "login.html",
    dashboard: "dashboard.html",
    admin: "admin.html",
    lookup: "lookup.html"
  };
  var STORAGE_KEYS = {
    assets: "tnb_ams_assets",
    users: "tnb_ams_users",
    auditLogs: "tnb_ams_audit_logs",
    facilities: "tnb_ams_facilities",
    activeUser: "tnb_ams_active_user",
    theme: "tnb_ams_theme"
  };
  var DEFAULT_FACILITIES = [
    "Jln Anson",
    "State Penang",
    "Bertam",
    "Bayan Baru",
    "Nibong Tebal",
    "Seberang Jaya"
  ];

  // js/state.js
  function loadJsonStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null || raw === "") {
        return Array.isArray(fallback) ? [...fallback] : { ...fallback };
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(fallback)) {
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...fallback];
      }
      if (typeof fallback === "object" && fallback !== null) {
        return parsed && typeof parsed === "object" && Object.keys(parsed).length > 0 ? parsed : { ...fallback };
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
    }
  }
  var localAssets = loadJsonStorage(STORAGE_KEYS.assets, DEFAULT_ASSETS);
  var localUsers = loadJsonStorage(STORAGE_KEYS.users, DEFAULT_USERS);
  var localAuditLogs = loadJsonStorage(STORAGE_KEYS.auditLogs, []);
  var currentUser = null;
  var selectedFacility = "Seberang Jaya";
  var activeAuditAsset = null;
  var activeStreams = {};
  var mediaInputMethods = { 1: "CAMERA", 2: "CAMERA" };
  var facilitiesList = loadJsonStorage(STORAGE_KEYS.facilities, DEFAULT_FACILITIES);
  var pendingLookupId = null;
  var html5QrScannerInstance = null;
  function bootstrapLocalData() {
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
  function setSelectedFacility(fac) {
    selectedFacility = fac;
  }
  function setActiveAuditAsset(asset) {
    activeAuditAsset = asset;
  }
  function setHtml5QrScannerInstance(instance) {
    html5QrScannerInstance = instance;
  }
  function setPendingLookupId(id) {
    pendingLookupId = id;
  }
  function takePendingLookupId() {
    const id = pendingLookupId;
    pendingLookupId = null;
    return id;
  }
  function loadSavedUser() {
    const savedUser = localStorage.getItem(STORAGE_KEYS.activeUser);
    if (savedUser) {
      try {
        currentUser = JSON.parse(savedUser);
      } catch (e) {
        currentUser = null;
      }
    }
  }
  function setCurrentUser(user) {
    currentUser = user;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.activeUser, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.activeUser);
    }
  }
  function persistAssets() {
    safePersist(STORAGE_KEYS.assets, localAssets);
  }
  function persistUsers() {
    safePersist(STORAGE_KEYS.users, localUsers);
  }
  function persistAuditLogs() {
    safePersist(STORAGE_KEYS.auditLogs, localAuditLogs);
  }
  function persistFacilities() {
    safePersist(STORAGE_KEYS.facilities, facilitiesList);
  }
  function refreshFacilitiesList() {
    const fromAssets = [...new Set(localAssets.map((a) => a.facility).filter(Boolean))];
    facilitiesList = [.../* @__PURE__ */ new Set([...facilitiesList, ...fromAssets])].sort();
    persistFacilities();
  }

  // js/utils.js
  function escapeHtml(str) {
    return String(str ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function getAppBaseUrl() {
    const { origin, pathname } = window.location;
    const dir = pathname.replace(/[^/]+$/, "");
    return `${origin}${dir.endsWith("/") ? dir : `${dir}/`}`;
  }
  function resolveAppPath(relativePath) {
    return new URL(relativePath, getAppBaseUrl()).href;
  }
  function getLookupUrl(assetId) {
    const url = new URL(APP.lookup, getAppBaseUrl());
    url.searchParams.set("lookupId", String(assetId).trim());
    return url.href;
  }
  function parseLookupIdFromUrl(href = window.location.href) {
    const url = new URL(href);
    const fromQuery = url.searchParams.get("lookupId");
    if (fromQuery) return String(fromQuery).trim();
    const hash = url.hash.replace(/^#/, "").trim();
    if (hash && /^[A-Za-z0-9_-]+$/.test(hash)) return hash;
    return null;
  }
  function isLocalOnlyOrigin() {
    const { hostname, protocol } = window.location;
    return protocol === "file:" || hostname === "localhost" || hostname === "127.0.0.1";
  }
  function inferFacility(costCenterDesc, pillar) {
    const text = `${costCenterDesc || ""} ${pillar || ""}`.toLowerCase();
    if (text.includes("seberang jaya") || text.includes("seb jaya")) return "Seberang Jaya";
    if (text.includes("nibong tebal") || text.includes("n. tebal")) return "Nibong Tebal";
    if (text.includes("bayan baru")) return "Bayan Baru";
    if (text.includes("bertam")) return "Bertam";
    if (text.includes("anson") || text.includes("jln anson")) return "Jln Anson";
    return "State Penang";
  }
  function isPenangText(text) {
    const lower = String(text || "").toLowerCase();
    return PENANG_KEYWORDS.some((k) => lower.includes(k));
  }
  function mapCsvStatus(statusVal, taggingDate) {
    if (taggingDate && String(taggingDate).trim()) return "Done";
    const s = String(statusVal || "").trim();
    if (s === "1") return "Done";
    if (s === "2") return "In Progress";
    if (s === "3" || s === "4") return "Pending";
    if (s.toLowerCase() === "done") return "Done";
    if (s.toLowerCase().includes("progress")) return "In Progress";
    return "Pending";
  }
  function mapTaskRequired(task) {
    const t = String(task || "Tag").trim();
    if (t.toLowerCase() === "tag" || t.toLowerCase() === "tag asset") return "Tag Asset";
    if (["Transfer", "Scrap", "Write-off"].includes(t)) return t;
    return t || "Tag Asset";
  }
  function normalizeHeader(h) {
    return String(h || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  // js/ui.js
  function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    const toast = document.createElement("div");
    let theme = "bg-slate-900 border-slate-800 text-slate-100";
    let icon = '<i class="fa-solid fa-circle-info text-blue-500"></i>';
    if (type === "success") icon = '<i class="fa-solid fa-circle-check text-accentTeal"></i>';
    else if (type === "error") icon = '<i class="fa-solid fa-triangle-exclamation text-red-500"></i>';
    toast.className = `flex items-center space-x-3 p-4 rounded-xl border shadow-xl max-w-sm pointer-events-auto transition duration-350 animate-in slide-in-from-bottom-5 ${theme}`;
    toast.innerHTML = `<div>${icon}</div><p class="text-xs font-semibold leading-normal">${message}</p>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.className += " opacity-0 transform translate-y-2";
      setTimeout(() => toast.remove(), 400);
    }, 4e3);
  }
  function initNavHeader() {
    const guestGroup = document.getElementById("navGuestGroup");
    const authGroup = document.getElementById("navAuthGroup");
    const adminBtn = document.getElementById("adminPanelBtn");
    const adminTabNav = document.getElementById("adminTabNav");
    const logoLink = document.getElementById("logoHomeLink");
    if (currentUser && currentUser.status === "APPROVED") {
      guestGroup?.classList.add("hidden");
      authGroup?.classList.remove("hidden");
      const navUsername = document.getElementById("navUsername");
      const navRole = document.getElementById("navRole");
      if (navUsername) navUsername.innerText = currentUser.name;
      if (navRole) navRole.innerText = currentUser.role === "ADMIN" ? "Administrator" : "Field Worker";
      if (currentUser.role === "ADMIN") {
        adminBtn?.classList.remove("hidden");
        adminTabNav?.classList.remove("hidden");
      } else {
        adminBtn?.classList.add("hidden");
        adminTabNav?.classList.add("hidden");
      }
      if (logoLink) logoLink.href = APP.dashboard;
    } else {
      guestGroup?.classList.remove("hidden");
      authGroup?.classList.add("hidden");
      adminBtn?.classList.add("hidden");
      adminTabNav?.classList.add("hidden");
      if (logoLink) logoLink.href = APP.home;
    }
  }
  function setActiveNavTab(page2) {
    const tabField = document.getElementById("btnTabField");
    const tabAdmin = document.getElementById("btnTabAdmin");
    if (!tabField || !tabAdmin) return;
    tabField.classList.remove("active");
    tabAdmin.classList.remove("active");
    if (page2 === "dashboard") tabField.classList.add("active");
    if (page2 === "admin") tabAdmin.classList.add("active");
  }
  function updateHeroStats() {
    const total = localAssets.length;
    const checked = localAssets.filter((a) => a.status === "Done").length;
    const pending = localAssets.filter((a) => a.status !== "Done").length;
    const percent = total > 0 ? Math.round(checked / total * 100) : 0;
    const heroTotalEl = document.getElementById("heroStatTotal");
    if (heroTotalEl) heroTotalEl.innerText = `${total} Assets`;
    const heroBarEl = document.getElementById("heroStatProgressBar");
    if (heroBarEl) heroBarEl.style.width = `${percent}%`;
    const heroPctEl = document.getElementById("heroStatPercent");
    if (heroPctEl) heroPctEl.innerText = `${percent}%`;
    const statDoneEl = document.getElementById("statDoneCount");
    if (statDoneEl) statDoneEl.innerText = checked;
    const statPendingEl = document.getElementById("statPendingCount");
    if (statPendingEl) statPendingEl.innerText = pending;
    const statPctEl = document.getElementById("statPercent");
    if (statPctEl) statPctEl.innerText = `${percent}%`;
  }
  function renderAuditLogs() {
    const tbody = document.getElementById("auditLogTableBody");
    if (!tbody) return;
    const search = (document.getElementById("auditLogSearch")?.value || "").toLowerCase().trim();
    let logs = [...localAuditLogs];
    if (search) {
      logs = logs.filter(
        (l) => (l.staffId || "").toLowerCase().includes(search) || (l.action || "").toLowerCase().includes(search) || (l.context || "").toLowerCase().includes(search)
      );
    }
    if (logs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="py-6 text-center text-slate-600">No audit events recorded yet.</td></tr>`;
      return;
    }
    tbody.innerHTML = logs.slice(0, 100).map(
      (l) => `
        <tr class="border-b border-slate-900/80 hover:bg-slate-900/30">
          <td class="py-2 font-mono text-slate-500">${escapeHtml(l.timestamp || "-")}</td>
          <td class="py-2 font-mono text-blue-400">${escapeHtml(l.staffId || "-")}</td>
          <td class="py-2 font-bold text-slate-300">${escapeHtml(l.action || "-")}</td>
          <td class="py-2 text-slate-400">${escapeHtml(l.context || "-")}</td>
        </tr>
      `
    ).join("");
  }
  function syncGlobalState(renderAssetsGrid2, renderUserVerificationQueue2) {
    renderAssetsGrid2?.();
    renderUserVerificationQueue2?.();
    renderAuditLogs();
  }

  // js/firebase.js
  var db = null;
  var auth = null;
  var storage = null;
  var analytics = null;
  var isFirebaseReady = false;
  var collection;
  var doc;
  var setDoc;
  var getDoc;
  var getDocs;
  var onSnapshot;
  var initializeApp;
  var initializeFirestore;
  var persistentLocalCache;
  var persistentMultipleTabManager;
  var getAuth;
  var getStorage;
  var getAnalytics;
  var snapshotHandlers = {
    onAssetsUpdated: null,
    onUsersUpdated: null,
    onLookupReady: null
  };
  function isOfflineFileMode() {
    return window.location.protocol === "file:";
  }
  async function loadFirebaseSdk() {
    const [appMod, firestoreMod, authMod, storageMod, analyticsMod] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js"),
      import("https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/12.15.0/firebase-storage.js"),
      import("https://www.gstatic.com/firebasejs/12.15.0/firebase-analytics.js")
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
      persistentMultipleTabManager
    } = firestoreMod);
    getAuth = authMod.getAuth;
    getStorage = storageMod.getStorage;
    getAnalytics = analyticsMod.getAnalytics;
  }
  function registerSnapshotHandlers(handlers) {
    snapshotHandlers = { ...snapshotHandlers, ...handlers };
  }
  async function fetchCloudUser(staffId) {
    if (!isFirebaseReady || !db) return null;
    const snap = await getDoc(doc(db, "users", staffId));
    return snap.exists() ? snap.data() : null;
  }
  async function cloudUserExists(staffId) {
    if (!isFirebaseReady || !db) return false;
    const snap = await getDoc(doc(db, "users", staffId));
    return snap.exists();
  }
  async function initFirebase() {
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
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
      });
      auth = getAuth(app);
      storage = getStorage(app);
      try {
        analytics = getAnalytics(app);
      } catch (_) {
        analytics = null;
      }
      try {
        await getDocs(collection(db, "assets"));
      } catch (permErr) {
        console.warn("Firestore unavailable \u2014 using offline data:", permErr.message);
        isFirebaseReady = false;
        return false;
      }
      isFirebaseReady = true;
      setupLiveSnapshotStreaming();
      await loadCloudDatabase();
      await seedDefaultUsers();
      return true;
    } catch (e) {
      console.warn("Firebase connection unavailable \u2014 using offline data:", e.message || e);
      isFirebaseReady = false;
      return false;
    }
  }
  async function seedDefaultUsers() {
    if (!isFirebaseReady) return;
    for (const [id, user] of Object.entries(DEFAULT_USERS)) {
      const snap = await getDoc(doc(db, "users", id));
      if (!snap.exists()) {
        await setDoc(doc(db, "users", id), user);
      }
    }
  }
  function setupLiveSnapshotStreaming() {
    if (!isFirebaseReady) return;
    onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        snapshot.forEach((d) => {
          localUsers[d.id] = d.data();
        });
        persistUsers();
        snapshotHandlers.onUsersUpdated?.();
      },
      (error) => {
        console.warn("Firestore users sync disabled:", error.message);
      }
    );
    onSnapshot(
      collection(db, "assets"),
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
        console.warn("Firestore assets sync disabled:", error.message);
        snapshotHandlers.onAssetsUpdated?.();
      }
    );
    onSnapshot(
      collection(db, "auditLogs"),
      (snapshot) => {
        localAuditLogs.length = 0;
        snapshot.forEach((d) => {
          localAuditLogs.push({ id: d.id, ...d.data() });
        });
        localAuditLogs.sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));
        persistAuditLogs();
        renderAuditLogs();
      },
      (error) => {
        console.warn("Firestore audit log sync disabled:", error.message);
      }
    );
  }
  async function loadCloudDatabase() {
    if (!isFirebaseReady) return;
    try {
      const assetsCol = collection(db, "assets");
      const assetSnap = await getDocs(assetsCol);
      if (assetSnap.empty) {
        for (const asset of localAssets) {
          await setDoc(doc(db, "assets", asset.id), asset);
        }
      }
    } catch (err) {
      console.warn("Cloud seed skipped (offline mode):", err.message || err);
    }
  }
  async function saveStateObject(type, id, object, syncFn) {
    if (type === "asset" || type === "assets") {
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
        await setDoc(doc(db, "assets", id), merged, { merge: true });
      }
    } else if (type === "user" || type === "users") {
      localUsers[id] = { ...localUsers[id], ...object, staffId: id };
      persistUsers();
      if (isFirebaseReady) {
        await setDoc(doc(db, "users", id), localUsers[id], { merge: true });
      }
    }
    updateHeroStats();
    syncFn?.();
  }
  async function addAuditLog(staffId, action, context) {
    const entry = {
      staffId: staffId || "SYSTEM",
      action,
      context: context || "",
      timestamp: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19)
    };
    localAuditLogs.unshift(entry);
    if (localAuditLogs.length > 500) localAuditLogs.splice(500);
    persistAuditLogs();
    if (isFirebaseReady) {
      const logId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      await setDoc(doc(db, "auditLogs", logId), entry);
    }
    renderAuditLogs();
  }

  // js/theme.js
  function toggleTheme() {
    const root = document.documentElement;
    const goingLight = root.classList.contains("dark");
    root.classList.toggle("dark", !goingLight);
    root.classList.toggle("light", goingLight);
    localStorage.setItem(STORAGE_KEYS.theme, goingLight ? "light" : "dark");
    updateThemeIcon();
  }
  function updateThemeIcon() {
    const btn = document.getElementById("themeToggleBtn");
    if (!btn) return;
    const isDark = document.documentElement.classList.contains("dark");
    btn.innerHTML = isDark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    btn.title = isDark ? "Switch to light theme" : "Switch to dark theme";
  }

  // js/auth.js
  function initAuthenticatedSession() {
    initNavHeader();
    window.location.href = APP.dashboard;
  }
  async function handleLoginSubmit(e) {
    e.preventDefault();
    const staffId = document.getElementById("loginStaffId").value.trim().toLowerCase();
    const pass = document.getElementById("loginPassword").value.trim();
    if (DEFAULT_USERS[staffId] && DEFAULT_USERS[staffId].hash === pass) {
      setCurrentUser(DEFAULT_USERS[staffId]);
      await addAuditLog(staffId, "LOGIN", "Signed in");
      initAuthenticatedSession();
      return;
    }
    showToast("Checking credentials...", "info");
    try {
      let userData = null;
      if (isFirebaseReady) {
        userData = await fetchCloudUser(staffId);
      }
      if (!userData && localUsers[staffId]) {
        userData = localUsers[staffId];
      }
      if (!userData) {
        showToast("Staff ID not found.", "error");
        return;
      }
      if (userData.hash !== pass) {
        showToast("Invalid password.", "error");
        return;
      }
      if (userData.status !== "APPROVED") {
        showToast("Account pending approval. Contact your administrator.", "error");
        return;
      }
      setCurrentUser(userData);
      await addAuditLog(staffId, "LOGIN", "Signed in via staff account");
      initAuthenticatedSession();
    } catch (error) {
      showToast("Login failed. Check your connection.", "error");
    }
  }
  async function handleRegisterSubmit(e, syncFn) {
    e.preventDefault();
    const name = document.getElementById("registerName").value.trim();
    const staffId = document.getElementById("registerStaffId").value.trim().toLowerCase();
    const role = document.getElementById("registerRole").value;
    const pass = document.getElementById("registerPassword").value.trim();
    if (pass.length < 4) {
      showToast("Password must be at least 4 characters.", "error");
      return;
    }
    if (localUsers[staffId] || DEFAULT_USERS[staffId]) {
      showToast("Staff ID already exists. Choose a different ID.", "error");
      return;
    }
    if (isFirebaseReady) {
      const exists = await cloudUserExists(staffId);
      if (exists) {
        showToast("Staff ID already registered.", "error");
        return;
      }
    }
    showToast("Submitting registration...", "info");
    const newRecord = { name, staffId, role, status: "PENDING", hash: pass };
    try {
      await saveStateObject("user", staffId, newRecord, syncFn);
      await addAuditLog(staffId, "REGISTER", `New ${role} registration pending approval`);
      showToast("Registration submitted. Wait for admin approval.", "success");
      document.getElementById("registerForm").reset();
      switchGatewayTab("login");
    } catch (error) {
      showToast("Registration failed. Try again.", "error");
    }
  }
  async function handleLogout() {
    if (currentUser) await addAuditLog(currentUser.staffId, "LOGOUT", "Session ended");
    setCurrentUser(null);
    window.location.href = APP.home;
  }
  function switchGatewayTab(tab) {
    const tabL = document.getElementById("tabLogin");
    const tabR = document.getElementById("tabRegister");
    const formL = document.getElementById("loginForm");
    const formR = document.getElementById("registerForm");
    if (tab === "login") {
      tabL.className = "flex-1 pb-3 text-sm font-bold border-b-2 border-[#005EA6] text-slate-100 transition";
      tabR.className = "flex-1 pb-3 text-sm font-semibold text-slate-400 border-b-2 border-transparent hover:text-slate-600 transition";
      formL.classList.remove("hidden");
      formR.classList.add("hidden");
    } else {
      tabR.className = "flex-1 pb-3 text-sm font-bold border-b-2 border-[#005EA6] text-slate-100 transition";
      tabL.className = "flex-1 pb-3 text-sm font-semibold text-slate-400 border-b-2 border-transparent hover:text-slate-600 transition";
      formR.classList.remove("hidden");
      formL.classList.add("hidden");
    }
  }
  function requireAuth() {
    if (!currentUser || currentUser.status !== "APPROVED") {
      window.location.href = APP.login;
      return false;
    }
    return true;
  }
  function requireAdmin() {
    if (!requireAuth()) return false;
    if (currentUser.role !== "ADMIN") {
      window.location.href = APP.dashboard;
      return false;
    }
    return true;
  }
  function enterPortalSecurely() {
    if (currentUser && currentUser.status === "APPROVED") {
      window.location.href = APP.dashboard;
    } else {
      window.location.href = APP.login;
    }
  }
  function resetToHome() {
    if (currentUser && currentUser.status === "APPROVED") {
      window.location.href = APP.dashboard;
    } else {
      window.location.href = APP.home;
    }
  }
  function showAdminSection() {
    if (!currentUser || currentUser.role !== "ADMIN") {
      showToast("Admin access required.", "error");
      return;
    }
    window.location.href = APP.admin;
  }

  // js/assets.js
  function renderFacilityTabs() {
    const container = document.getElementById("facilityTabs");
    if (!container) return;
    container.innerHTML = "";
    facilitiesList.forEach((fac) => {
      const count = localAssets.filter((a) => a.facility === fac).length;
      const checked = localAssets.filter((a) => a.facility === fac && a.status === "Done").length;
      const colorClass = selectedFacility === fac ? "bg-[#005EA6] text-white border-blue-500 font-extrabold shadow" : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-750 hover:bg-slate-850 font-semibold";
      container.innerHTML += `
          <button onclick="selectFacility('${fac.replace(/'/g, "\\'")}')" class="px-4 py-2.5 rounded-xl border text-xs whitespace-nowrap transition flex items-center space-x-2 ${colorClass}">
            <span>${fac}</span>
            <span class="px-2 py-0.5 rounded text-[9px] bg-black/40 text-slate-200 font-mono">${checked}/${count}</span>
          </button>
        `;
    });
  }
  function selectFacility(fac) {
    setSelectedFacility(fac);
    renderFacilityTabs();
    renderAssetsGrid();
  }
  function filterActiveAssets() {
    renderAssetsGrid();
  }
  function renderAssetsGrid() {
    const grid = document.getElementById("assetGrid");
    if (!grid) return;
    grid.innerHTML = "";
    const searchInput = document.getElementById("assetSearchInput");
    const searchQuery = (searchInput?.value || "").toLowerCase().trim();
    let assets = localAssets.filter((a) => a.facility === selectedFacility);
    if (searchQuery) {
      assets = assets.filter(
        (a) => a.name.toLowerCase().includes(searchQuery) || a.id.toLowerCase().includes(searchQuery) || (a.serial || "").toLowerCase().includes(searchQuery)
      );
    }
    const statusOrder = { Pending: 0, "In Progress": 1, Done: 2 };
    assets.sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9));
    if (assets.length === 0) {
      grid.innerHTML = `
          <div class="col-span-full py-16 text-center text-slate-500 border border-dashed border-slate-800/80 rounded-2xl">
            <i class="fa-solid fa-cubes text-4xl mb-3 block text-slate-700"></i>
            <p class="text-xs">No assets map inside this branch tab.</p>
          </div>
        `;
      return;
    }
    assets.forEach((asset) => {
      const isPending = asset.status === "Pending";
      const isInProgress = asset.status === "In Progress";
      const isDone = asset.status === "Done";
      let statusClass = "bg-slate-950 text-slate-500 border-slate-800/80";
      if (isPending) statusClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
      if (isInProgress) statusClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
      if (isDone) statusClass = "bg-emerald-500/10 text-accentTeal border-emerald-500/20";
      const priorityContainerClass = isPending ? "border-amber-500/30 priority-active" : "border-slate-855";
      grid.innerHTML += `
          <div class="glass-panel p-5 rounded-2xl border transition duration-300 flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-2xl ${priorityContainerClass}">
            <div class="space-y-4">
              <div class="flex items-start justify-between">
                <span class="px-2.5 py-1 rounded text-[9px] font-black tracking-wider border uppercase ${statusClass}">
                  ${asset.status}
                </span>
                <span class="text-[10px] font-bold text-slate-400 tracking-wider font-mono">${asset.id}</span>
              </div>
              <div>
                <h4 class="font-extrabold text-sm text-slate-100 leading-snug">${asset.name}</h4>
                <p class="text-[9.5px] text-slate-500 mt-1 uppercase tracking-wide flex items-center gap-1.5 font-mono">
                  <i class="fa-solid fa-tag"></i> Class: ${asset.class} \u2022 S/N: ${asset.serial}
                </p>
              </div>
              <div class="bg-slate-950 p-3.5 rounded-xl space-y-2 border border-slate-900 text-[10.5px]">
                <div class="flex justify-between"><span class="text-slate-500">Location Level:</span><span class="text-slate-300 font-bold">${asset.locationLevel || "Not Specified"}</span></div>
                <div class="flex justify-between"><span class="text-slate-500">Model Specs:</span><span class="text-slate-300 font-bold truncate max-w-[155px]">${asset.sizeSpecs || "Not Specified"}</span></div>
                <div class="flex justify-between"><span class="text-slate-500">Remarks:</span><span class="text-slate-300 italic truncate max-w-[155px]">${asset.remarks || "No notes"}</span></div>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-slate-855 flex items-center justify-between gap-2">
              <div class="text-[10px]"><span class="block text-slate-500">Last Verified:</span><span class="font-bold text-slate-400 font-mono">${(asset.lastUpdated || "").substring(0, 10) || "N/A"}</span></div>
              <div class="flex gap-1.5">
                <button onclick="printAssetSticker('${asset.id}')" class="px-2.5 py-2 rounded-xl text-[10px] font-bold bg-slate-900 border border-slate-800 hover:border-red-500 text-red-400 transition" title="Print QR Sticker"><i class="fa-solid fa-qrcode"></i></button>
                <button onclick="openAuditModal('${asset.id}')" class="px-3.5 py-2 rounded-xl text-[10px] font-bold bg-[#005EA6] hover:bg-blue-600 text-white transition flex items-center gap-1.5 shadow-md shadow-blue-950/40">Audit & Tag</button>
              </div>
            </div>
          </div>
        `;
    });
  }

  // js/audit.js
  function openAuditModal(id) {
    if (!currentUser) {
      showToast("Access Denied.", "error");
      return;
    }
    const asset = localAssets.find((a) => a.id === id);
    if (!asset) return;
    setActiveAuditAsset(asset);
    document.getElementById("modalHeaderAssetId").innerText = `Asset Code: ${asset.id}`;
    document.getElementById("lockedAssetId").innerText = asset.id;
    document.getElementById("lockedAssetName").innerText = asset.name;
    document.getElementById("lockedClassCode").innerText = asset.class;
    document.getElementById("lockedOriginalSerial").innerText = asset.serial;
    document.getElementById("lockedCostCenter").innerText = asset.costCenter;
    document.getElementById("lockedCoCd").innerText = `${asset.cocd || "1000"} / 10`;
    document.getElementById("lockedPillar").innerText = asset.pillar || asset.facility;
    document.getElementById("lockedPic").innerText = asset.pic || "Unassigned";
    document.getElementById("editStatus").value = asset.status;
    document.getElementById("editTaskRequired").value = asset.taskRequired || "Tag Asset";
    document.getElementById("editLocationLevel").value = asset.locationLevel || "";
    document.getElementById("editSizeSpecs").value = asset.sizeSpecs || "";
    document.getElementById("editRemarks").value = asset.remarks || "";
    switchMediaMethod(1, "CAMERA");
    switchMediaMethod(2, "CAMERA");
    document.getElementById("auditModal").classList.remove("hidden");
  }
  function closeAuditModal() {
    document.getElementById("auditModal").classList.add("hidden");
    setActiveAuditAsset(null);
  }
  function standardizeRemarks() {
    const remarksInput = document.getElementById("editRemarks");
    const val = remarksInput.value.trim();
    if (!val) return;
    remarksInput.value = val.replace(/\s+/g, " ").toUpperCase();
  }
  async function saveActiveAudit(syncFn) {
    if (!activeAuditAsset || !currentUser) return;
    const updatedFields = {
      status: document.getElementById("editStatus").value,
      taskRequired: document.getElementById("editTaskRequired").value,
      locationLevel: document.getElementById("editLocationLevel").value.trim(),
      sizeSpecs: document.getElementById("editSizeSpecs").value.trim(),
      remarks: document.getElementById("editRemarks").value.trim(),
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19),
      lastStaffId: currentUser.staffId
    };
    const savedAsset = { ...activeAuditAsset, ...updatedFields };
    await saveStateObject("asset", activeAuditAsset.id, updatedFields, syncFn);
    await addAuditLog(currentUser.staffId, "AUDIT_SAVE", `Asset ${activeAuditAsset.id} updated to ${updatedFields.status}`);
    closeAuditModal();
    openStickerModal(savedAsset);
  }
  function openStickerModal(asset) {
    if (!asset) {
      showToast("Asset not found for sticker.", "error");
      return;
    }
    document.getElementById("stickerAssetName").innerText = asset.name.substring(0, 20).toUpperCase();
    document.getElementById("stickerAssetId").innerText = asset.id;
    document.getElementById("stickerClass").innerText = asset.class.toUpperCase();
    document.getElementById("stickerDate").innerText = asset.lastUpdated.split(" ")[0];
    document.getElementById("stickerLocation").innerText = (asset.locationLevel || "Unspecified").toUpperCase();
    document.getElementById("stickerStaffId").innerText = `Staff ID: ${asset.lastStaffId}`;
    const lookupUrl = getLookupUrl(asset.id);
    document.getElementById("stickerQrImg").src = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(lookupUrl)}`;
    document.getElementById("stickerModal").classList.remove("hidden");
    if (isLocalOnlyOrigin()) {
      showToast("QR uses this site URL. For phone scanning, print stickers from your deployed site (e.g. GitHub Pages).", "info");
    }
  }
  function closeStickerModal() {
    document.getElementById("stickerModal").classList.add("hidden");
  }
  function triggerThermalPrint() {
    window.print();
  }
  function printAssetSticker(id) {
    const asset = localAssets.find((a) => a.id === id);
    if (asset) openStickerModal(asset);
    else showToast("Asset not found.", "error");
  }
  function switchMediaMethod(boxNum, method) {
    mediaInputMethods[boxNum] = method;
    const camBtn = document.getElementById(`methodCamBtn${boxNum}`);
    const galBtn = document.getElementById(`methodGalBtn${boxNum}`);
    const actBtn = document.getElementById(`cameraBtn${boxNum}`);
    const video = document.getElementById(`video${boxNum}`);
    const placeholder = document.getElementById(`placeholder${boxNum}`);
    const img = document.getElementById(`mediaImg${boxNum}`);
    const qrContainer = document.getElementById("qrReaderContainer1");
    if (html5QrScannerInstance && boxNum === 1) {
      try {
        html5QrScannerInstance.stop();
      } catch (e) {
      }
      setHtml5QrScannerInstance(null);
    }
    if (activeStreams[boxNum]) {
      activeStreams[boxNum].getTracks().forEach((t) => t.stop());
      activeStreams[boxNum] = null;
    }
    video.classList.add("hidden");
    img.classList.add("hidden");
    if (qrContainer) qrContainer.classList.add("hidden");
    placeholder.classList.remove("hidden");
    if (method === "CAMERA") {
      camBtn.className = "px-2 py-1 rounded bg-blue-600 text-white transition";
      galBtn.className = "px-2 py-1 rounded text-slate-400 transition";
      actBtn.innerHTML = boxNum === 1 ? "Boot QR Scanner" : "Launch Camera";
    } else {
      galBtn.className = "px-2 py-1 rounded bg-blue-600 text-white transition";
      camBtn.className = "px-2 py-1 rounded text-slate-400 transition";
      actBtn.innerHTML = "Choose from Gallery";
    }
  }
  function executeMediaTrigger(boxNum) {
    if (mediaInputMethods[boxNum] === "CAMERA") {
      if (boxNum === 1) triggerLiveQRDecoder();
      else triggerNativeCamera(2);
    } else {
      document.getElementById(`fileInput${boxNum}`).click();
    }
  }
  function handleGalleryUpload(boxNum, event) {
    const file = event.target.value ? event.target.files[0] : null;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById(`placeholder${boxNum}`).classList.add("hidden");
      const img = document.getElementById(`mediaImg${boxNum}`);
      img.src = e.target.result;
      img.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
  function triggerLiveQRDecoder() {
    const targetDiv = document.getElementById("qrReaderContainer1");
    const placeholder = document.getElementById("placeholder1");
    const actBtn = document.getElementById("cameraBtn1");
    const img = document.getElementById("mediaImg1");
    if (html5QrScannerInstance) {
      html5QrScannerInstance.stop().then(() => {
        setHtml5QrScannerInstance(null);
        targetDiv.classList.add("hidden");
        placeholder.classList.remove("hidden");
        actBtn.innerHTML = "Boot QR Scanner";
      });
      return;
    }
    placeholder.classList.add("hidden");
    img.classList.add("hidden");
    targetDiv.classList.remove("hidden");
    actBtn.innerHTML = "Kill Scanner Stream";
    setHtml5QrScannerInstance(new Html5Qrcode("qrReaderContainer1"));
    html5QrScannerInstance.start(
      { facingMode: "environment" },
      { fps: 15, qrbox: { width: 220, height: 140 } },
      (decodedText) => {
        showToast(`Tag Decoded: ${decodedText}`, "success");
        document.getElementById("editRemarks").value = `[STICKER SCAN VERIFIED] CODE: ${decodedText}`;
        html5QrScannerInstance.stop().then(() => {
          setHtml5QrScannerInstance(null);
          targetDiv.classList.add("hidden");
          placeholder.classList.remove("hidden");
          actBtn.innerHTML = "Boot QR Scanner";
        });
      },
      () => {
      }
    ).catch(() => {
      setHtml5QrScannerInstance(null);
      targetDiv.classList.add("hidden");
      placeholder.classList.remove("hidden");
      actBtn.innerHTML = "Boot QR Scanner";
    });
  }
  async function triggerNativeCamera(boxNum) {
    const video = document.getElementById(`video${boxNum}`);
    const placeholder = document.getElementById(`placeholder${boxNum}`);
    const img = document.getElementById(`mediaImg${boxNum}`);
    const button = document.getElementById(`cameraBtn${boxNum}`);
    if (activeStreams[boxNum]) {
      const canvas = document.getElementById(`canvas${boxNum}`);
      canvas.getContext("2d").drawImage(video, 0, 0, 640, 480);
      activeStreams[boxNum].getTracks().forEach((track) => track.stop());
      activeStreams[boxNum] = null;
      video.classList.add("hidden");
      img.src = canvas.toDataURL("image/jpeg");
      img.classList.remove("hidden");
      button.innerHTML = "Retake Photo";
      return;
    }
    placeholder.classList.add("hidden");
    img.classList.add("hidden");
    video.classList.remove("hidden");
    button.innerHTML = "Capture Frame";
    try {
      activeStreams[boxNum] = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });
      video.srcObject = activeStreams[boxNum];
    } catch (err) {
      placeholder.classList.remove("hidden");
      video.classList.add("hidden");
      button.innerHTML = "Launch Camera";
    }
  }

  // js/csv.js
  function findHeaderRow(rows) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i] || [];
      const cells = row.map((c) => normalizeHeader(c));
      const hasNo = cells.some((c) => c === "no." || c === "no");
      const hasAsset = cells.some((c) => c === "asset");
      if (hasNo && hasAsset) return i;
    }
    return -1;
  }
  function buildColumnMap(headerRow) {
    const map = {};
    headerRow.forEach((cell, idx) => {
      const key = normalizeHeader(cell);
      if (!key) return;
      if (key === "no." || key === "no") map.no = idx;
      else if (key === "asset") map.asset = idx;
      else if (key === "sno.") map.sno = idx;
      else if (key === "cocd") map.cocd = idx;
      else if (key === "busa") map.busa = idx;
      else if (key === "cost ctr") map.costCtr = idx;
      else if (key.includes("cost center description")) map.costCenterDesc = idx;
      else if (key === "pillar") map.pillar = idx;
      else if (key === "level") map.level = idx;
      else if (key === "class") map.class = idx;
      else if (key.includes("ruc")) map.ruc = idx;
      else if (key === "ttype") map.ttype = idx;
      else if (key === "serial number") map.serial = idx;
      else if (key.includes("asset description")) map.assetDesc = idx;
      else if (key.includes("additional description")) map.additionalDesc = idx;
      else if (key === "quantity") map.quantity = idx;
      else if (key.includes("pic (full")) map.pic = idx;
      else if (key.includes("task required")) map.taskRequired = idx;
      else if (key.includes("location")) map.location = idx;
      else if (key.includes("size/model") || key.includes("series number")) map.sizeSpecs = idx;
      else if (key.includes("status")) map.status = idx;
      else if (key.includes("remarks")) map.remarks = idx;
      else if (key.includes("tagging date")) map.taggingDate = idx;
      else if (key.includes("tagged by")) map.taggedBy = idx;
    });
    return map;
  }
  function parseSpreadsheetRows(rows) {
    const headerIdx = findHeaderRow(rows);
    if (headerIdx === -1) throw new Error("Could not find asset header row (No., Asset, ...).");
    const colMap = buildColumnMap(rows[headerIdx]);
    if (colMap.asset === void 0) throw new Error('Missing required "Asset" column.');
    const assets = [];
    let inPenangSection = false;
    let rowNum = 0;
    for (let i = headerIdx + 1; i < rows.length; i++) {
      const row = rows[i] || [];
      const firstCell = String(row[0] ?? "").trim().toUpperCase();
      if (firstCell === "PENANG" || firstCell.includes("PULAU PINANG")) {
        inPenangSection = true;
        continue;
      }
      if (inPenangSection && OTHER_STATE_MARKERS.some((s) => firstCell === s || firstCell.startsWith(s + ","))) {
        inPenangSection = false;
      }
      const assetId = getCell(row, colMap.asset);
      if (!assetId || !/^\d+$/.test(assetId)) continue;
      const costCenterDesc = getCell(row, colMap.costCenterDesc);
      const pillar = getCell(row, colMap.pillar);
      const location = getCell(row, colMap.location);
      const assetDesc = getCell(row, colMap.assetDesc);
      const penangMatch = inPenangSection || isPenangText(costCenterDesc) || isPenangText(pillar) || isPenangText(location) || isPenangText(assetDesc);
      if (!penangMatch) continue;
      rowNum++;
      const taggingDate = getCell(row, colMap.taggingDate);
      const statusRaw = getCell(row, colMap.status);
      assets.push({
        id: assetId,
        name: assetDesc || `Asset ${assetId}`,
        class: getCell(row, colMap.class),
        serial: getCell(row, colMap.serial),
        cocd: getCell(row, colMap.cocd),
        busA: getCell(row, colMap.busa),
        costCenter: getCell(row, colMap.costCtr),
        costCenterDesc,
        pillar,
        level: getCell(row, colMap.level),
        ruc: getCell(row, colMap.ruc),
        ttype: getCell(row, colMap.ttype),
        additionalDesc: getCell(row, colMap.additionalDesc),
        quantity: getCell(row, colMap.quantity),
        pic: getCell(row, colMap.pic).replace(/\n/g, " ").trim(),
        status: mapCsvStatus(statusRaw, taggingDate),
        taskRequired: mapTaskRequired(getCell(row, colMap.taskRequired)),
        locationLevel: location,
        sizeSpecs: getCell(row, colMap.sizeSpecs),
        remarks: getCell(row, colMap.remarks),
        taggingDate,
        taggedBy: getCell(row, colMap.taggedBy),
        lastUpdated: taggingDate || (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19),
        lastStaffId: getCell(row, colMap.taggedBy) ? "CSV-IMPORT" : "SYS-INIT",
        facility: inferFacility(costCenterDesc, pillar),
        importRowNo: rowNum
      });
    }
    return assets;
  }
  async function readSpreadsheetFile(file) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false });
  }
  function getCell(row, colIdx) {
    if (colIdx === void 0 || colIdx === null) return "";
    return String(row[colIdx] ?? "").trim();
  }

  // js/admin.js
  function renderUserVerificationQueue() {
    const container = document.getElementById("userVerificationQueue");
    if (!container) return;
    container.innerHTML = "";
    const pendings = Object.values(localUsers).filter((u) => u.status === "PENDING");
    if (pendings.length === 0) {
      container.innerHTML = `<div class="py-8 text-center text-slate-500 text-[10px] w-full">No registrations pending verification approval.</div>`;
      return;
    }
    pendings.forEach((user) => {
      container.innerHTML += `
          <div id="user-row-${user.staffId}" class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px] gap-2 w-full">
            <div>
              <span class="block font-black text-slate-200 leading-tight">${user.name}</span>
              <span class="block text-[9.5px] text-slate-500 font-mono">ID: ${user.staffId} \u2022 ${user.role}</span>
            </div>
            <div class="flex space-x-1.5">
              <button onclick="approveUserRegistry('${user.staffId}')" class="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[9px]">Approve</button>
              <button onclick="rejectUserRegistry('${user.staffId}')" class="px-3 py-1 rounded-lg bg-red-600/20 text-red-400 font-bold text-[9px]">Reject</button>
            </div>
          </div>`;
    });
  }
  async function approveUserRegistry(staffId, syncFn) {
    if (!currentUser || currentUser.role !== "ADMIN") return;
    await saveStateObject("user", staffId, { status: "APPROVED" }, syncFn);
    await addAuditLog(currentUser.staffId, "USER_APPROVE", `Approved staff ID: ${staffId}`);
    showToast("User approved.", "success");
  }
  async function rejectUserRegistry(staffId, syncFn) {
    if (!currentUser || currentUser.role !== "ADMIN") return;
    await saveStateObject("user", staffId, { status: "REJECTED" }, syncFn);
    await addAuditLog(currentUser.staffId, "USER_REJECT", `Rejected staff ID: ${staffId}`);
  }
  async function exportMotherFile() {
    if (!currentUser || currentUser.role !== "ADMIN") {
      showToast("Admin access required to export.", "error");
      return;
    }
    const penangAssets = localAssets.filter(
      (a) => isPenangText(a.costCenterDesc) || isPenangText(a.pillar) || isPenangText(a.facility) || PENANG_KEYWORDS.some((k) => (a.facility || "").toLowerCase().includes(k))
    );
    const rows = [MOTHER_FILE_HEADERS];
    penangAssets.forEach((a, i) => {
      const statusNum = a.status === "Done" ? "1" : a.status === "In Progress" ? "2" : "";
      rows.push([
        i + 1,
        a.id,
        a.sno || "0",
        a.cocd || "",
        a.busA || "",
        a.costCenter || "",
        a.costCenterDesc || "",
        a.pillar || "",
        a.level || "",
        a.class || "",
        a.ruc || "",
        a.ttype || "",
        a.serial || "",
        a.name || "",
        a.additionalDesc || "",
        a.quantity || "1",
        "",
        "",
        "",
        "",
        "",
        "",
        a.pic || "",
        (a.taskRequired || "Tag Asset").replace("Tag Asset", "Tag"),
        a.locationLevel || "",
        a.sizeSpecs || "",
        statusNum,
        a.remarks || "",
        a.taggingDate || "",
        a.taggedBy || a.lastStaffId || "",
        "",
        ""
      ]);
    });
    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Penang Assets");
    const dateStr = (/* @__PURE__ */ new Date()).toISOString().substring(0, 10);
    XLSX.writeFile(wb, `TNB_Penang_Mother_File_${dateStr}.csv`, { bookType: "csv" });
    await addAuditLog(currentUser.staffId, "EXPORT", `Exported ${penangAssets.length} Penang assets`);
    showToast(`Exported ${penangAssets.length} Penang assets to CSV.`, "success");
  }
  async function handleCsvUpload(e, syncFn) {
    if (!currentUser || currentUser.role !== "ADMIN") {
      showToast("Admin access required for import.", "error");
      e.target.value = "";
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    showToast(`Parsing ${file.name}...`, "info");
    try {
      const rows = await readSpreadsheetFile(file);
      const parsed = parseSpreadsheetRows(rows);
      if (parsed.length === 0) {
        showToast("No Penang assets found in file. Check format and region filters.", "error");
        e.target.value = "";
        return;
      }
      let imported = 0;
      let updated = 0;
      for (const asset of parsed) {
        const exists = localAssets.some((a) => a.id === asset.id);
        await saveStateObject("asset", asset.id, asset, syncFn);
        if (exists) updated++;
        else imported++;
      }
      refreshFacilitiesList();
      if (!facilitiesList.includes(selectedFacility)) {
        setSelectedFacility(parsed[0].facility || facilitiesList[0]);
      }
      renderFacilityTabs();
      syncFn?.();
      await addAuditLog(currentUser.staffId, "CSV_IMPORT", `Imported ${imported} new, updated ${updated} from ${file.name}`);
      showToast(`Penang import complete: ${imported} new, ${updated} updated (${parsed.length} total).`, "success");
    } catch (err) {
      console.error(err);
      showToast(`Import failed: ${err.message}`, "error");
    }
    e.target.value = "";
  }

  // js/lookup.js
  function renderAssetLookup(asset) {
    const payload = document.getElementById("lookupPayload");
    if (!payload) return;
    const statusColors = {
      Pending: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      "In Progress": "text-blue-400 bg-blue-500/10 border-blue-500/20",
      Done: "text-accentTeal bg-emerald-500/10 border-emerald-500/20"
    };
    const statusClass = statusColors[asset.status] || "text-slate-400 bg-slate-800 border-slate-700";
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getLookupUrl(asset.id))}`;
    payload.innerHTML = `
        <div class="flex flex-col md:flex-row gap-6 items-start">
          <div class="w-full md:w-48 flex-shrink-0 text-center space-y-2">
            <div class="bg-white p-3 rounded-xl inline-block border-2 border-slate-700">
              <img src="${qrUrl}" alt="Asset QR Code" class="w-40 h-40 object-contain mx-auto">
            </div>
            <p class="text-[10px] text-slate-500 font-mono break-all">${escapeHtml(getLookupUrl(asset.id))}</p>
          </div>
          <div class="flex-grow space-y-4 w-full">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 rounded-lg text-xs font-black border uppercase ${statusClass}">${escapeHtml(asset.status)}</span>
              <span class="text-[10px] text-slate-500 font-mono">Asset #${escapeHtml(asset.id)}</span>
            </div>
            <h4 class="text-xl font-black text-white leading-snug">${escapeHtml(asset.name)}</h4>
            <p class="text-xs text-slate-400"><i class="fa-solid fa-building text-blue-500 mr-1"></i> ${escapeHtml(asset.facility || "Penang")} \u2022 ${escapeHtml(asset.pillar || "-")}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h5 class="text-[10px] font-black uppercase tracking-widest text-blue-400">Corporate Identification</h5>
            <div class="grid grid-cols-2 gap-3 text-[11px]">
              <div><span class="text-slate-500 block text-[9px] uppercase">Class</span><span class="font-bold text-slate-200 font-mono">${escapeHtml(asset.class)}</span></div>
              <div><span class="text-slate-500 block text-[9px] uppercase">Serial No.</span><span class="font-bold text-slate-200 font-mono">${escapeHtml(asset.serial)}</span></div>
              <div><span class="text-slate-500 block text-[9px] uppercase">CoCd</span><span class="font-bold text-slate-200 font-mono">${escapeHtml(asset.cocd)}</span></div>
              <div><span class="text-slate-500 block text-[9px] uppercase">Cost Center</span><span class="font-bold text-slate-200 font-mono">${escapeHtml(asset.costCenter)}</span></div>
              <div class="col-span-2"><span class="text-slate-500 block text-[9px] uppercase">Cost Center Description</span><span class="font-bold text-slate-200">${escapeHtml(asset.costCenterDesc || "-")}</span></div>
              <div class="col-span-2"><span class="text-slate-500 block text-[9px] uppercase">Responsible PIC</span><span class="font-bold text-slate-200">${escapeHtml(asset.pic || "Unassigned")}</span></div>
            </div>
          </div>
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h5 class="text-[10px] font-black uppercase tracking-widest text-accentTeal">Field Audit Data</h5>
            <div class="grid grid-cols-2 gap-3 text-[11px]">
              <div><span class="text-slate-500 block text-[9px] uppercase">Task Required</span><span class="font-bold text-slate-200">${escapeHtml(asset.taskRequired || "Tag Asset")}</span></div>
              <div><span class="text-slate-500 block text-[9px] uppercase">Location Level</span><span class="font-bold text-slate-200">${escapeHtml(asset.locationLevel || "Not specified")}</span></div>
              <div class="col-span-2"><span class="text-slate-500 block text-[9px] uppercase">Size / Model</span><span class="font-bold text-slate-200">${escapeHtml(asset.sizeSpecs || "Not specified")}</span></div>
              <div class="col-span-2"><span class="text-slate-500 block text-[9px] uppercase">Remarks</span><span class="font-bold text-slate-300 italic">${escapeHtml(asset.remarks || "No remarks")}</span></div>
              <div><span class="text-slate-500 block text-[9px] uppercase">Last Updated</span><span class="font-bold text-slate-400 font-mono">${escapeHtml(asset.lastUpdated || "-")}</span></div>
              <div><span class="text-slate-500 block text-[9px] uppercase">Verified By</span><span class="font-bold text-slate-400 font-mono">${escapeHtml(asset.lastStaffId || "-")}</span></div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-3 pt-2">
          <button onclick="printAssetSticker('${asset.id}')" class="px-4 py-2.5 bg-[#ED1C24] hover:bg-red-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-2">
            <i class="fa-solid fa-print"></i> Print QR Sticker
          </button>
          ${currentUser ? `<button onclick="openAuditModal('${asset.id}')" class="px-4 py-2.5 bg-[#005EA6] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-2"><i class="fa-solid fa-pen-to-square"></i> Open Audit</button>` : ""}
        </div>
      `;
  }
  function triggerUrlLookup(lookupId) {
    window.location.href = getLookupUrl(lookupId);
  }
  function triggerLandingLookup() {
    const id = document.getElementById("landingLookupInput").value.trim();
    if (!id) {
      showToast("Please enter an Asset ID to inspect.", "error");
      return;
    }
    triggerUrlLookup(id);
  }
  function performLookup(lookupId) {
    const normalizedId = String(lookupId).trim();
    const asset = localAssets.find(
      (a) => a.id === normalizedId || a.id === String(parseInt(normalizedId, 10))
    );
    const payload = document.getElementById("lookupPayload");
    if (!payload) return;
    if (!asset) {
      payload.innerHTML = `
          <div class="text-center py-12 space-y-3">
            <i class="fa-solid fa-circle-xmark text-4xl text-red-500"></i>
            <h4 class="text-white font-bold">Asset Not Found</h4>
            <p class="text-xs text-slate-400">No record for ID: <span class="font-mono text-red-400">${escapeHtml(normalizedId)}</span></p>
            <a href="${resolveAppPath(APP.home)}" class="inline-block mt-4 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300">Return Home</a>
          </div>`;
      return;
    }
    renderAssetLookup(asset);
  }
  function initLookupFromUrl() {
    const lookupId = parseLookupIdFromUrl();
    const payload = document.getElementById("lookupPayload");
    if (!lookupId) {
      if (payload) {
        payload.innerHTML = `
          <div class="text-center py-12 space-y-3">
            <i class="fa-solid fa-qrcode text-4xl text-slate-600"></i>
            <h4 class="text-white font-bold">Asset Lookup</h4>
            <p class="text-xs text-slate-400">Scan a printed asset QR code or open a link like:</p>
            <p class="text-[10px] font-mono text-blue-400 break-all px-4">${escapeHtml(getLookupUrl("18012384"))}</p>
            <a href="${resolveAppPath(APP.home)}" class="inline-block mt-4 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300">Return Home</a>
          </div>`;
      }
      return;
    }
    if (payload) {
      payload.innerHTML = `
          <div class="text-center py-12 space-y-3">
            <i class="fa-solid fa-spinner fa-spin text-3xl text-blue-500"></i>
            <h4 class="text-white font-bold">Loading Asset ${escapeHtml(lookupId)}</h4>
            <p class="text-xs text-slate-400">Fetching record from the asset register\u2026</p>
          </div>`;
    }
    if (localAssets.length > 0) {
      performLookup(lookupId);
    } else {
      setPendingLookupId(lookupId);
    }
  }

  // js/main.js
  var page = document.body.dataset.page;
  function createSyncFn() {
    return () => syncGlobalState(renderAssetsGrid, renderUserVerificationQueue);
  }
  registerSnapshotHandlers({
    onAssetsUpdated: () => {
      renderFacilityTabs();
      renderAssetsGrid();
      if (page === "lookup") {
        const id = takePendingLookupId();
        if (id) performLookup(id);
      }
    },
    onUsersUpdated: () => renderUserVerificationQueue(),
    onLookupReady: (id) => {
      if (page === "lookup") performLookup(id);
      else triggerUrlLookup(id);
    }
  });
  window.toggleTheme = toggleTheme;
  window.showToast = showToast;
  window.switchGatewayTab = switchGatewayTab;
  window.handleLoginSubmit = handleLoginSubmit;
  window.handleRegisterSubmit = (e) => handleRegisterSubmit(e, createSyncFn());
  window.handleLogout = handleLogout;
  window.enterPortalSecurely = enterPortalSecurely;
  window.resetToHome = resetToHome;
  window.showAdminSection = showAdminSection;
  window.selectFacility = selectFacility;
  window.filterActiveAssets = filterActiveAssets;
  window.openAuditModal = openAuditModal;
  window.closeAuditModal = closeAuditModal;
  window.standardizeRemarks = standardizeRemarks;
  window.saveActiveAudit = () => saveActiveAudit(createSyncFn());
  window.openStickerModal = openStickerModal;
  window.closeStickerModal = closeStickerModal;
  window.triggerThermalPrint = triggerThermalPrint;
  window.printAssetSticker = printAssetSticker;
  window.switchMediaMethod = switchMediaMethod;
  window.executeMediaTrigger = executeMediaTrigger;
  window.handleGalleryUpload = handleGalleryUpload;
  window.triggerNativeCamera = triggerNativeCamera;
  window.approveUserRegistry = (staffId) => approveUserRegistry(staffId, createSyncFn());
  window.rejectUserRegistry = (staffId) => rejectUserRegistry(staffId, createSyncFn());
  window.exportMotherFile = exportMotherFile;
  window.handleCsvUpload = (e) => handleCsvUpload(e, createSyncFn());
  window.renderAuditLogs = renderAuditLogs;
  window.triggerLandingLookup = triggerLandingLookup;
  window.triggerUrlLookup = triggerUrlLookup;
  window.addEventListener("load", async () => {
    try {
      updateThemeIcon();
      bootstrapLocalData();
      loadSavedUser();
      initNavHeader();
      const firebaseOk = await initFirebase();
      refreshFacilitiesList();
      if (!firebaseOk) {
        renderFacilityTabs();
        syncGlobalState(renderAssetsGrid, renderUserVerificationQueue);
      }
      if (isOfflineFileMode() && page === "home") {
        showToast("Offline mode: using saved data on this device. Cloud sync needs http/https.", "info");
      }
      switch (page) {
        case "home":
          if (currentUser && currentUser.status === "APPROVED") {
            window.location.href = APP.dashboard;
            return;
          }
          updateHeroStats();
          renderAuditLogs();
          break;
        case "login":
          if (currentUser && currentUser.status === "APPROVED") {
            window.location.href = APP.dashboard;
            return;
          }
          break;
        case "dashboard":
          if (!requireAuth()) return;
          initNavHeader();
          setActiveNavTab("dashboard");
          renderFacilityTabs();
          renderAssetsGrid();
          updateHeroStats();
          break;
        case "admin":
          if (!requireAdmin()) return;
          initNavHeader();
          setActiveNavTab("admin");
          renderUserVerificationQueue();
          renderAuditLogs();
          break;
        case "lookup":
          initLookupFromUrl();
          updateHeroStats();
          break;
        default:
          break;
      }
    } catch (err) {
      console.error("TNB AMS failed to initialize:", err);
      showToast("Page failed to load. Check the browser console.", "error");
    }
  });
})();
