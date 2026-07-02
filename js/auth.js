import { APP, DEFAULT_USERS } from './config.js';
import {
  currentUser,
  localUsers,
  setCurrentUser,
} from './state.js';
import { isFirebaseReady, saveStateObject, addAuditLog, fetchCloudUser, cloudUserExists } from './firebase.js';
import { initNavHeader, showToast } from './ui.js';

export function initAuthenticatedSession() {
  initNavHeader();
  window.location.href = APP.dashboard;
}

export async function handleLoginSubmit(e) {
  e.preventDefault();
  const staffId = document.getElementById('loginStaffId').value.trim().toLowerCase();
  const pass = document.getElementById('loginPassword').value.trim();

  if (DEFAULT_USERS[staffId] && DEFAULT_USERS[staffId].hash === pass) {
    setCurrentUser(DEFAULT_USERS[staffId]);
    await addAuditLog(staffId, 'LOGIN', 'Signed in');
    initAuthenticatedSession();
    return;
  }

  showToast('Checking credentials...', 'info');

  try {
    let userData = null;

    if (isFirebaseReady) {
      userData = await fetchCloudUser(staffId);
    }

    if (!userData && localUsers[staffId]) {
      userData = localUsers[staffId];
    }

    if (!userData) {
      showToast('Staff ID not found.', 'error');
      return;
    }

    if (userData.hash !== pass) {
      showToast('Invalid password.', 'error');
      return;
    }

    if (userData.status !== 'APPROVED') {
      showToast('Account pending approval. Contact your administrator.', 'error');
      return;
    }

    setCurrentUser(userData);
    await addAuditLog(staffId, 'LOGIN', 'Signed in via staff account');
    initAuthenticatedSession();
  } catch (error) {
    showToast('Login failed. Check your connection.', 'error');
  }
}

export async function handleRegisterSubmit(e, syncFn) {
  e.preventDefault();
  const name = document.getElementById('registerName').value.trim();
  const staffId = document.getElementById('registerStaffId').value.trim().toLowerCase();
  const role = document.getElementById('registerRole').value;
  const pass = document.getElementById('registerPassword').value.trim();

  if (pass.length < 4) {
    showToast('Password must be at least 4 characters.', 'error');
    return;
  }

  if (localUsers[staffId] || DEFAULT_USERS[staffId]) {
    showToast('Staff ID already exists. Choose a different ID.', 'error');
    return;
  }

  if (isFirebaseReady) {
    const exists = await cloudUserExists(staffId);
    if (exists) {
      showToast('Staff ID already registered.', 'error');
      return;
    }
  }

  showToast('Submitting registration...', 'info');

  const newRecord = { name, staffId, role, status: 'PENDING', hash: pass };

  try {
    await saveStateObject('user', staffId, newRecord, syncFn);
    await addAuditLog(staffId, 'REGISTER', `New ${role} registration pending approval`);
    showToast('Registration submitted. Wait for admin approval.', 'success');
    document.getElementById('registerForm').reset();
    switchGatewayTab('login');
  } catch (error) {
    showToast('Registration failed. Try again.', 'error');
  }
}

export async function handleLogout() {
  if (currentUser) await addAuditLog(currentUser.staffId, 'LOGOUT', 'Session ended');
  setCurrentUser(null);
  window.location.href = APP.home;
}

export function switchGatewayTab(tab) {
  const tabL = document.getElementById('tabLogin');
  const tabR = document.getElementById('tabRegister');
  const formL = document.getElementById('loginForm');
  const formR = document.getElementById('registerForm');

  if (tab === 'login') {
    tabL.className = 'flex-1 pb-3 text-sm font-bold border-b-2 border-[#005EA6] text-slate-100 transition';
    tabR.className = 'flex-1 pb-3 text-sm font-semibold text-slate-400 border-b-2 border-transparent hover:text-slate-600 transition';
    formL.classList.remove('hidden');
    formR.classList.add('hidden');
  } else {
    tabR.className = 'flex-1 pb-3 text-sm font-bold border-b-2 border-[#005EA6] text-slate-100 transition';
    tabL.className = 'flex-1 pb-3 text-sm font-semibold text-slate-400 border-b-2 border-transparent hover:text-slate-600 transition';
    formR.classList.remove('hidden');
    formL.classList.add('hidden');
  }
}

export function requireAuth() {
  if (!currentUser || currentUser.status !== 'APPROVED') {
    window.location.href = APP.login;
    return false;
  }
  return true;
}

export function requireAdmin() {
  if (!requireAuth()) return false;
  if (currentUser.role !== 'ADMIN') {
    window.location.href = APP.dashboard;
    return false;
  }
  return true;
}

export function enterPortalSecurely() {
  if (currentUser && currentUser.status === 'APPROVED') {
    window.location.href = APP.dashboard;
  } else {
    window.location.href = APP.login;
  }
}

export function resetToHome() {
  if (currentUser && currentUser.status === 'APPROVED') {
    window.location.href = APP.dashboard;
  } else {
    window.location.href = APP.home;
  }
}

export function showAdminSection() {
  if (!currentUser || currentUser.role !== 'ADMIN') {
    showToast('Admin access required.', 'error');
    return;
  }
  window.location.href = APP.admin;
}
