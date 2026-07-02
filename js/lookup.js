import { APP } from './config.js';
import { currentUser, localAssets, setPendingLookupId } from './state.js';
import { escapeHtml, getLookupUrl, parseLookupIdFromUrl, resolveAppPath } from './utils.js';
import { showToast } from './ui.js';

export function renderAssetLookup(asset) {
  const payload = document.getElementById('lookupPayload');
  if (!payload) return;

  const statusColors = {
    Pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'In Progress': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    Done: 'text-accentTeal bg-emerald-500/10 border-emerald-500/20',
  };
  const statusClass = statusColors[asset.status] || 'text-slate-400 bg-slate-800 border-slate-700';
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
            <p class="text-xs text-slate-400"><i class="fa-solid fa-building text-blue-500 mr-1"></i> ${escapeHtml(asset.facility || 'Penang')} • ${escapeHtml(asset.pillar || '-')}</p>
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
              <div class="col-span-2"><span class="text-slate-500 block text-[9px] uppercase">Cost Center Description</span><span class="font-bold text-slate-200">${escapeHtml(asset.costCenterDesc || '-')}</span></div>
              <div class="col-span-2"><span class="text-slate-500 block text-[9px] uppercase">Responsible PIC</span><span class="font-bold text-slate-200">${escapeHtml(asset.pic || 'Unassigned')}</span></div>
            </div>
          </div>
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h5 class="text-[10px] font-black uppercase tracking-widest text-accentTeal">Field Audit Data</h5>
            <div class="grid grid-cols-2 gap-3 text-[11px]">
              <div><span class="text-slate-500 block text-[9px] uppercase">Task Required</span><span class="font-bold text-slate-200">${escapeHtml(asset.taskRequired || 'Tag Asset')}</span></div>
              <div><span class="text-slate-500 block text-[9px] uppercase">Location Level</span><span class="font-bold text-slate-200">${escapeHtml(asset.locationLevel || 'Not specified')}</span></div>
              <div class="col-span-2"><span class="text-slate-500 block text-[9px] uppercase">Size / Model</span><span class="font-bold text-slate-200">${escapeHtml(asset.sizeSpecs || 'Not specified')}</span></div>
              <div class="col-span-2"><span class="text-slate-500 block text-[9px] uppercase">Remarks</span><span class="font-bold text-slate-300 italic">${escapeHtml(asset.remarks || 'No remarks')}</span></div>
              <div><span class="text-slate-500 block text-[9px] uppercase">Last Updated</span><span class="font-bold text-slate-400 font-mono">${escapeHtml(asset.lastUpdated || '-')}</span></div>
              <div><span class="text-slate-500 block text-[9px] uppercase">Verified By</span><span class="font-bold text-slate-400 font-mono">${escapeHtml(asset.lastStaffId || '-')}</span></div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-3 pt-2">
          <button onclick="printAssetSticker('${asset.id}')" class="px-4 py-2.5 bg-[#ED1C24] hover:bg-red-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-2">
            <i class="fa-solid fa-print"></i> Print QR Sticker
          </button>
          ${currentUser ? `<button onclick="openAuditModal('${asset.id}')" class="px-4 py-2.5 bg-[#005EA6] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-2"><i class="fa-solid fa-pen-to-square"></i> Open Audit</button>` : ''}
        </div>
      `;
}

export function triggerUrlLookup(lookupId) {
  window.location.href = getLookupUrl(lookupId);
}

export function triggerLandingLookup() {
  const id = document.getElementById('landingLookupInput').value.trim();
  if (!id) {
    showToast('Please enter an Asset ID to inspect.', 'error');
    return;
  }
  triggerUrlLookup(id);
}

export function performLookup(lookupId) {
  const normalizedId = String(lookupId).trim();
  const asset = localAssets.find(
    (a) => a.id === normalizedId || a.id === String(parseInt(normalizedId, 10))
  );
  const payload = document.getElementById('lookupPayload');
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

export function initLookupFromUrl() {
  const lookupId = parseLookupIdFromUrl();
  const payload = document.getElementById('lookupPayload');

  if (!lookupId) {
    if (payload) {
      payload.innerHTML = `
          <div class="text-center py-12 space-y-3">
            <i class="fa-solid fa-qrcode text-4xl text-slate-600"></i>
            <h4 class="text-white font-bold">Asset Lookup</h4>
            <p class="text-xs text-slate-400">Scan a printed asset QR code or open a link like:</p>
            <p class="text-[10px] font-mono text-blue-400 break-all px-4">${escapeHtml(getLookupUrl('18012384'))}</p>
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
            <p class="text-xs text-slate-400">Fetching record from the asset register…</p>
          </div>`;
  }

  if (localAssets.length > 0) {
    performLookup(lookupId);
  } else {
    setPendingLookupId(lookupId);
  }
}
