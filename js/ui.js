import { APP } from './config.js';
import { currentUser, localAssets, localAuditLogs } from './state.js';
import { escapeHtml } from './utils.js';

export function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  let theme = 'bg-slate-900 border-slate-800 text-slate-100';
  let icon = '<i class="fa-solid fa-circle-info text-blue-500"></i>';
  if (type === 'success') icon = '<i class="fa-solid fa-circle-check text-accentTeal"></i>';
  else if (type === 'error') icon = '<i class="fa-solid fa-triangle-exclamation text-red-500"></i>';

  toast.className = `flex items-center space-x-3 p-4 rounded-xl border shadow-xl max-w-sm pointer-events-auto transition duration-350 animate-in slide-in-from-bottom-5 ${theme}`;
  toast.innerHTML = `<div>${icon}</div><p class="text-xs font-semibold leading-normal">${message}</p>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.className += ' opacity-0 transform translate-y-2';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

export function initNavHeader() {
  const guestGroup = document.getElementById('navGuestGroup');
  const authGroup = document.getElementById('navAuthGroup');
  const adminBtn = document.getElementById('adminPanelBtn');
  const adminTabNav = document.getElementById('adminTabNav');
  const logoLink = document.getElementById('logoHomeLink');

  if (currentUser && currentUser.status === 'APPROVED') {
    guestGroup?.classList.add('hidden');
    authGroup?.classList.remove('hidden');

    const navUsername = document.getElementById('navUsername');
    const navRole = document.getElementById('navRole');
    if (navUsername) navUsername.innerText = currentUser.name;
    if (navRole) navRole.innerText = currentUser.role === 'ADMIN' ? 'Administrator' : 'Field Worker';

    if (currentUser.role === 'ADMIN') {
      adminBtn?.classList.remove('hidden');
      adminTabNav?.classList.remove('hidden');
    } else {
      adminBtn?.classList.add('hidden');
      adminTabNav?.classList.add('hidden');
    }

    if (logoLink) logoLink.href = APP.dashboard;
  } else {
    guestGroup?.classList.remove('hidden');
    authGroup?.classList.add('hidden');
    adminBtn?.classList.add('hidden');
    adminTabNav?.classList.add('hidden');
    if (logoLink) logoLink.href = APP.home;
  }
}

export function setActiveNavTab(page) {
  const tabField = document.getElementById('btnTabField');
  const tabAdmin = document.getElementById('btnTabAdmin');
  if (!tabField || !tabAdmin) return;

  tabField.classList.remove('active');
  tabAdmin.classList.remove('active');

  if (page === 'dashboard') tabField.classList.add('active');
  if (page === 'admin') tabAdmin.classList.add('active');
}

export function updateHeroStats() {
  const total = localAssets.length;
  const checked = localAssets.filter((a) => a.status === 'Done').length;
  const pending = localAssets.filter((a) => a.status !== 'Done').length;
  const percent = total > 0 ? Math.round((checked / total) * 100) : 0;

  const heroTotalEl = document.getElementById('heroStatTotal');
  if (heroTotalEl) heroTotalEl.innerText = `${total} Assets`;
  const heroBarEl = document.getElementById('heroStatProgressBar');
  if (heroBarEl) heroBarEl.style.width = `${percent}%`;
  const heroPctEl = document.getElementById('heroStatPercent');
  if (heroPctEl) heroPctEl.innerText = `${percent}%`;

  const statDoneEl = document.getElementById('statDoneCount');
  if (statDoneEl) statDoneEl.innerText = checked;
  const statPendingEl = document.getElementById('statPendingCount');
  if (statPendingEl) statPendingEl.innerText = pending;
  const statPctEl = document.getElementById('statPercent');
  if (statPctEl) statPctEl.innerText = `${percent}%`;
}

export function renderAuditLogs() {
  const tbody = document.getElementById('auditLogTableBody');
  if (!tbody) return;

  const search = (document.getElementById('auditLogSearch')?.value || '').toLowerCase().trim();
  let logs = [...localAuditLogs];
  if (search) {
    logs = logs.filter(
      (l) =>
        (l.staffId || '').toLowerCase().includes(search) ||
        (l.action || '').toLowerCase().includes(search) ||
        (l.context || '').toLowerCase().includes(search)
    );
  }

  if (logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="py-6 text-center text-slate-600">No audit events recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = logs.slice(0, 100).map(
    (l) => `
        <tr class="border-b border-slate-900/80 hover:bg-slate-900/30">
          <td class="py-2 font-mono text-slate-500">${escapeHtml(l.timestamp || '-')}</td>
          <td class="py-2 font-mono text-blue-400">${escapeHtml(l.staffId || '-')}</td>
          <td class="py-2 font-bold text-slate-300">${escapeHtml(l.action || '-')}</td>
          <td class="py-2 text-slate-400">${escapeHtml(l.context || '-')}</td>
        </tr>
      `
  ).join('');
}

export function syncGlobalState(renderAssetsGrid, renderUserVerificationQueue) {
  renderAssetsGrid?.();
  renderUserVerificationQueue?.();
  renderAuditLogs();
}
