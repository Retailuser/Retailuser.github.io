import { APP } from './config.js';
import { loadSavedUser, takePendingLookupId, currentUser, refreshFacilitiesList, bootstrapLocalData } from './state.js';
import { initFirebase, registerSnapshotHandlers, isOfflineFileMode } from './firebase.js';
import { updateThemeIcon, toggleTheme } from './theme.js';
import { showToast, initNavHeader, renderAuditLogs, updateHeroStats, syncGlobalState, setActiveNavTab } from './ui.js';
import {
  handleLoginSubmit,
  handleRegisterSubmit,
  handleLogout,
  switchGatewayTab,
  requireAuth,
  requireAdmin,
  enterPortalSecurely,
  resetToHome,
  showAdminSection,
} from './auth.js';
import { renderFacilityTabs, renderAssetsGrid, selectFacility, filterActiveAssets } from './assets.js';
import {
  openAuditModal,
  closeAuditModal,
  standardizeRemarks,
  saveActiveAudit,
  openStickerModal,
  closeStickerModal,
  triggerThermalPrint,
  printAssetSticker,
  switchMediaMethod,
  executeMediaTrigger,
  handleGalleryUpload,
  triggerNativeCamera,
} from './audit.js';
import {
  renderUserVerificationQueue,
  approveUserRegistry,
  rejectUserRegistry,
  exportMotherFile,
  handleCsvUpload,
} from './admin.js';
import {
  triggerLandingLookup,
  triggerUrlLookup,
  performLookup,
  initLookupFromUrl,
} from './lookup.js';

const page = document.body.dataset.page;

function createSyncFn() {
  return () => syncGlobalState(renderAssetsGrid, renderUserVerificationQueue);
}

registerSnapshotHandlers({
  onAssetsUpdated: () => {
    renderFacilityTabs();
    renderAssetsGrid();
    if (page === 'lookup') {
      const id = takePendingLookupId();
      if (id) performLookup(id);
    }
  },
  onUsersUpdated: () => renderUserVerificationQueue(),
  onLookupReady: (id) => {
    if (page === 'lookup') performLookup(id);
    else triggerUrlLookup(id);
  },
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

window.addEventListener('load', async () => {
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

    if (isOfflineFileMode() && page === 'home') {
      showToast('Offline mode: using saved data on this device. Cloud sync needs http/https.', 'info');
    }

    switch (page) {
      case 'home':
        if (currentUser && currentUser.status === 'APPROVED') {
          window.location.href = APP.dashboard;
          return;
        }
        updateHeroStats();
        renderAuditLogs();
        break;

      case 'login':
        if (currentUser && currentUser.status === 'APPROVED') {
          window.location.href = APP.dashboard;
          return;
        }
        break;

      case 'dashboard':
        if (!requireAuth()) return;
        initNavHeader();
        setActiveNavTab('dashboard');
        renderFacilityTabs();
        renderAssetsGrid();
        updateHeroStats();
        break;

      case 'admin':
        if (!requireAdmin()) return;
        initNavHeader();
        setActiveNavTab('admin');
        renderUserVerificationQueue();
        renderAuditLogs();
        break;

      case 'lookup':
        initLookupFromUrl();
        updateHeroStats();
        break;

      default:
        break;
    }
  } catch (err) {
    console.error('TNB AMS failed to initialize:', err);
    showToast('Page failed to load. Check the browser console.', 'error');
  }
});
