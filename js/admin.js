import { MOTHER_FILE_HEADERS, PENANG_KEYWORDS } from './config.js';
import {
  currentUser,
  localAssets,
  localUsers,
  selectedFacility,
  facilitiesList,
  refreshFacilitiesList,
  setSelectedFacility,
} from './state.js';
import { saveStateObject, addAuditLog } from './firebase.js';
import { isPenangText } from './utils.js';
import { parseSpreadsheetRows, readSpreadsheetFile } from './csv.js';
import { showToast } from './ui.js';
import { renderFacilityTabs } from './assets.js';

export function renderUserVerificationQueue() {
  const container = document.getElementById('userVerificationQueue');
  if (!container) return;
  container.innerHTML = '';
  const pendings = Object.values(localUsers).filter((u) => u.status === 'PENDING');

  if (pendings.length === 0) {
    container.innerHTML = `<div class="py-8 text-center text-slate-500 text-[10px] w-full">No registrations pending verification approval.</div>`;
    return;
  }

  pendings.forEach((user) => {
    container.innerHTML += `
          <div id="user-row-${user.staffId}" class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px] gap-2 w-full">
            <div>
              <span class="block font-black text-slate-200 leading-tight">${user.name}</span>
              <span class="block text-[9.5px] text-slate-500 font-mono">ID: ${user.staffId} • ${user.role}</span>
            </div>
            <div class="flex space-x-1.5">
              <button onclick="approveUserRegistry('${user.staffId}')" class="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[9px]">Approve</button>
              <button onclick="rejectUserRegistry('${user.staffId}')" class="px-3 py-1 rounded-lg bg-red-600/20 text-red-400 font-bold text-[9px]">Reject</button>
            </div>
          </div>`;
  });
}

export async function approveUserRegistry(staffId, syncFn) {
  if (!currentUser || currentUser.role !== 'ADMIN') return;
  await saveStateObject('user', staffId, { status: 'APPROVED' }, syncFn);
  await addAuditLog(currentUser.staffId, 'USER_APPROVE', `Approved staff ID: ${staffId}`);
  showToast('User approved.', 'success');
}

export async function rejectUserRegistry(staffId, syncFn) {
  if (!currentUser || currentUser.role !== 'ADMIN') return;
  await saveStateObject('user', staffId, { status: 'REJECTED' }, syncFn);
  await addAuditLog(currentUser.staffId, 'USER_REJECT', `Rejected staff ID: ${staffId}`);
}

export async function exportMotherFile() {
  if (!currentUser || currentUser.role !== 'ADMIN') {
    showToast('Admin access required to export.', 'error');
    return;
  }

  const penangAssets = localAssets.filter(
    (a) =>
      isPenangText(a.costCenterDesc) ||
      isPenangText(a.pillar) ||
      isPenangText(a.facility) ||
      PENANG_KEYWORDS.some((k) => (a.facility || '').toLowerCase().includes(k))
  );

  const rows = [MOTHER_FILE_HEADERS];
  penangAssets.forEach((a, i) => {
    const statusNum = a.status === 'Done' ? '1' : a.status === 'In Progress' ? '2' : '';
    rows.push([
      i + 1,
      a.id,
      a.sno || '0',
      a.cocd || '',
      a.busA || '',
      a.costCenter || '',
      a.costCenterDesc || '',
      a.pillar || '',
      a.level || '',
      a.class || '',
      a.ruc || '',
      a.ttype || '',
      a.serial || '',
      a.name || '',
      a.additionalDesc || '',
      a.quantity || '1',
      '',
      '',
      '',
      '',
      '',
      '',
      a.pic || '',
      (a.taskRequired || 'Tag Asset').replace('Tag Asset', 'Tag'),
      a.locationLevel || '',
      a.sizeSpecs || '',
      statusNum,
      a.remarks || '',
      a.taggingDate || '',
      a.taggedBy || a.lastStaffId || '',
      '',
      '',
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Penang Assets');
  const dateStr = new Date().toISOString().substring(0, 10);
  XLSX.writeFile(wb, `TNB_Penang_Mother_File_${dateStr}.csv`, { bookType: 'csv' });
  await addAuditLog(currentUser.staffId, 'EXPORT', `Exported ${penangAssets.length} Penang assets`);
  showToast(`Exported ${penangAssets.length} Penang assets to CSV.`, 'success');
}

export async function handleCsvUpload(e, syncFn) {
  if (!currentUser || currentUser.role !== 'ADMIN') {
    showToast('Admin access required for import.', 'error');
    e.target.value = '';
    return;
  }

  const file = e.target.files?.[0];
  if (!file) return;

  showToast(`Parsing ${file.name}...`, 'info');

  try {
    const rows = await readSpreadsheetFile(file);
    const parsed = parseSpreadsheetRows(rows);

    if (parsed.length === 0) {
      showToast('No Penang assets found in file. Check format and region filters.', 'error');
      e.target.value = '';
      return;
    }

    let imported = 0;
    let updated = 0;
    for (const asset of parsed) {
      const exists = localAssets.some((a) => a.id === asset.id);
      await saveStateObject('asset', asset.id, asset, syncFn);
      if (exists) updated++;
      else imported++;
    }

    refreshFacilitiesList();
    if (!facilitiesList.includes(selectedFacility)) {
      setSelectedFacility(parsed[0].facility || facilitiesList[0]);
    }
    renderFacilityTabs();
    syncFn?.();
    await addAuditLog(currentUser.staffId, 'CSV_IMPORT', `Imported ${imported} new, updated ${updated} from ${file.name}`);
    showToast(`Penang import complete: ${imported} new, ${updated} updated (${parsed.length} total).`, 'success');
  } catch (err) {
    console.error(err);
    showToast(`Import failed: ${err.message}`, 'error');
  }

  e.target.value = '';
}
