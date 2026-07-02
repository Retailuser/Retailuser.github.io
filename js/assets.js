import {
  localAssets,
  selectedFacility,
  facilitiesList,
  setSelectedFacility,
} from './state.js';

export function renderFacilityTabs() {
  const container = document.getElementById('facilityTabs');
  if (!container) return;
  container.innerHTML = '';

  facilitiesList.forEach((fac) => {
    const count = localAssets.filter((a) => a.facility === fac).length;
    const checked = localAssets.filter((a) => a.facility === fac && a.status === 'Done').length;
    const colorClass =
      selectedFacility === fac
        ? 'bg-[#005EA6] text-white border-blue-500 font-extrabold shadow'
        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-750 hover:bg-slate-850 font-semibold';

    container.innerHTML += `
          <button onclick="selectFacility('${fac.replace(/'/g, "\\'")}')" class="px-4 py-2.5 rounded-xl border text-xs whitespace-nowrap transition flex items-center space-x-2 ${colorClass}">
            <span>${fac}</span>
            <span class="px-2 py-0.5 rounded text-[9px] bg-black/40 text-slate-200 font-mono">${checked}/${count}</span>
          </button>
        `;
  });
}

export function selectFacility(fac) {
  setSelectedFacility(fac);
  renderFacilityTabs();
  renderAssetsGrid();
}

export function filterActiveAssets() {
  renderAssetsGrid();
}

export function renderAssetsGrid() {
  const grid = document.getElementById('assetGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const searchInput = document.getElementById('assetSearchInput');
  const searchQuery = (searchInput?.value || '').toLowerCase().trim();
  let assets = localAssets.filter((a) => a.facility === selectedFacility);

  if (searchQuery) {
    assets = assets.filter(
      (a) =>
        a.name.toLowerCase().includes(searchQuery) ||
        a.id.toLowerCase().includes(searchQuery) ||
        (a.serial || '').toLowerCase().includes(searchQuery)
    );
  }

  const statusOrder = { Pending: 0, 'In Progress': 1, Done: 2 };
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
    const isPending = asset.status === 'Pending';
    const isInProgress = asset.status === 'In Progress';
    const isDone = asset.status === 'Done';

    let statusClass = 'bg-slate-950 text-slate-500 border-slate-800/80';
    if (isPending) statusClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    if (isInProgress) statusClass = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (isDone) statusClass = 'bg-emerald-500/10 text-accentTeal border-emerald-500/20';

    const priorityContainerClass = isPending ? 'border-amber-500/30 priority-active' : 'border-slate-855';

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
                  <i class="fa-solid fa-tag"></i> Class: ${asset.class} • S/N: ${asset.serial}
                </p>
              </div>
              <div class="bg-slate-950 p-3.5 rounded-xl space-y-2 border border-slate-900 text-[10.5px]">
                <div class="flex justify-between"><span class="text-slate-500">Location Level:</span><span class="text-slate-300 font-bold">${asset.locationLevel || 'Not Specified'}</span></div>
                <div class="flex justify-between"><span class="text-slate-500">Model Specs:</span><span class="text-slate-300 font-bold truncate max-w-[155px]">${asset.sizeSpecs || 'Not Specified'}</span></div>
                <div class="flex justify-between"><span class="text-slate-500">Remarks:</span><span class="text-slate-300 italic truncate max-w-[155px]">${asset.remarks || 'No notes'}</span></div>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-slate-855 flex items-center justify-between gap-2">
              <div class="text-[10px]"><span class="block text-slate-500">Last Verified:</span><span class="font-bold text-slate-400 font-mono">${(asset.lastUpdated || '').substring(0, 10) || 'N/A'}</span></div>
              <div class="flex gap-1.5">
                <button onclick="printAssetSticker('${asset.id}')" class="px-2.5 py-2 rounded-xl text-[10px] font-bold bg-slate-900 border border-slate-800 hover:border-red-500 text-red-400 transition" title="Print QR Sticker"><i class="fa-solid fa-qrcode"></i></button>
                <button onclick="openAuditModal('${asset.id}')" class="px-3.5 py-2 rounded-xl text-[10px] font-bold bg-[#005EA6] hover:bg-blue-600 text-white transition flex items-center gap-1.5 shadow-md shadow-blue-950/40">Audit & Tag</button>
              </div>
            </div>
          </div>
        `;
  });
}
