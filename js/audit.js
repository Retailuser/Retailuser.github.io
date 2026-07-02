import {
  currentUser,
  localAssets,
  activeAuditAsset,
  activeStreams,
  mediaInputMethods,
  html5QrScannerInstance,
  setActiveAuditAsset,
  setHtml5QrScannerInstance,
} from './state.js';
import { saveStateObject, addAuditLog } from './firebase.js';
import { getLookupUrl, escapeHtml, isLocalOnlyOrigin } from './utils.js';
import { showToast } from './ui.js';

export function openAuditModal(id) {
  if (!currentUser) {
    showToast('Access Denied.', 'error');
    return;
  }
  const asset = localAssets.find((a) => a.id === id);
  if (!asset) return;
  setActiveAuditAsset(asset);

  document.getElementById('modalHeaderAssetId').innerText = `Asset Code: ${asset.id}`;
  document.getElementById('lockedAssetId').innerText = asset.id;
  document.getElementById('lockedAssetName').innerText = asset.name;
  document.getElementById('lockedClassCode').innerText = asset.class;
  document.getElementById('lockedOriginalSerial').innerText = asset.serial;
  document.getElementById('lockedCostCenter').innerText = asset.costCenter;
  document.getElementById('lockedCoCd').innerText = `${asset.cocd || '1000'} / 10`;
  document.getElementById('lockedPillar').innerText = asset.pillar || asset.facility;
  document.getElementById('lockedPic').innerText = asset.pic || 'Unassigned';

  document.getElementById('editStatus').value = asset.status;
  document.getElementById('editTaskRequired').value = asset.taskRequired || 'Tag Asset';
  document.getElementById('editLocationLevel').value = asset.locationLevel || '';
  document.getElementById('editSizeSpecs').value = asset.sizeSpecs || '';
  document.getElementById('editRemarks').value = asset.remarks || '';

  switchMediaMethod(1, 'CAMERA');
  switchMediaMethod(2, 'CAMERA');
  document.getElementById('auditModal').classList.remove('hidden');
}

export function closeAuditModal() {
  document.getElementById('auditModal').classList.add('hidden');
  setActiveAuditAsset(null);
}

export function standardizeRemarks() {
  const remarksInput = document.getElementById('editRemarks');
  const val = remarksInput.value.trim();
  if (!val) return;
  remarksInput.value = val.replace(/\s+/g, ' ').toUpperCase();
}

export async function saveActiveAudit(syncFn) {
  if (!activeAuditAsset || !currentUser) return;
  const updatedFields = {
    status: document.getElementById('editStatus').value,
    taskRequired: document.getElementById('editTaskRequired').value,
    locationLevel: document.getElementById('editLocationLevel').value.trim(),
    sizeSpecs: document.getElementById('editSizeSpecs').value.trim(),
    remarks: document.getElementById('editRemarks').value.trim(),
    lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19),
    lastStaffId: currentUser.staffId,
  };

  const savedAsset = { ...activeAuditAsset, ...updatedFields };
  await saveStateObject('asset', activeAuditAsset.id, updatedFields, syncFn);
  await addAuditLog(currentUser.staffId, 'AUDIT_SAVE', `Asset ${activeAuditAsset.id} updated to ${updatedFields.status}`);
  closeAuditModal();
  openStickerModal(savedAsset);
}

export function openStickerModal(asset) {
  if (!asset) {
    showToast('Asset not found for sticker.', 'error');
    return;
  }
  document.getElementById('stickerAssetName').innerText = asset.name.substring(0, 20).toUpperCase();
  document.getElementById('stickerAssetId').innerText = asset.id;
  document.getElementById('stickerClass').innerText = asset.class.toUpperCase();
  document.getElementById('stickerDate').innerText = asset.lastUpdated.split(' ')[0];
  document.getElementById('stickerLocation').innerText = (asset.locationLevel || 'Unspecified').toUpperCase();
  document.getElementById('stickerStaffId').innerText = `Staff ID: ${asset.lastStaffId}`;
  const lookupUrl = getLookupUrl(asset.id);
  document.getElementById('stickerQrImg').src = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(lookupUrl)}`;
  document.getElementById('stickerModal').classList.remove('hidden');
  if (isLocalOnlyOrigin()) {
    showToast('QR uses this site URL. For phone scanning, print stickers from your deployed site (e.g. GitHub Pages).', 'info');
  }
}

export function closeStickerModal() {
  document.getElementById('stickerModal').classList.add('hidden');
}

export function triggerThermalPrint() {
  window.print();
}

export function printAssetSticker(id) {
  const asset = localAssets.find((a) => a.id === id);
  if (asset) openStickerModal(asset);
  else showToast('Asset not found.', 'error');
}

export function switchMediaMethod(boxNum, method) {
  mediaInputMethods[boxNum] = method;
  const camBtn = document.getElementById(`methodCamBtn${boxNum}`);
  const galBtn = document.getElementById(`methodGalBtn${boxNum}`);
  const actBtn = document.getElementById(`cameraBtn${boxNum}`);
  const video = document.getElementById(`video${boxNum}`);
  const placeholder = document.getElementById(`placeholder${boxNum}`);
  const img = document.getElementById(`mediaImg${boxNum}`);
  const qrContainer = document.getElementById('qrReaderContainer1');

  if (html5QrScannerInstance && boxNum === 1) {
    try {
      html5QrScannerInstance.stop();
    } catch (e) {}
    setHtml5QrScannerInstance(null);
  }
  if (activeStreams[boxNum]) {
    activeStreams[boxNum].getTracks().forEach((t) => t.stop());
    activeStreams[boxNum] = null;
  }

  video.classList.add('hidden');
  img.classList.add('hidden');
  if (qrContainer) qrContainer.classList.add('hidden');
  placeholder.classList.remove('hidden');

  if (method === 'CAMERA') {
    camBtn.className = 'px-2 py-1 rounded bg-blue-600 text-white transition';
    galBtn.className = 'px-2 py-1 rounded text-slate-400 transition';
    actBtn.innerHTML = boxNum === 1 ? 'Boot QR Scanner' : 'Launch Camera';
  } else {
    galBtn.className = 'px-2 py-1 rounded bg-blue-600 text-white transition';
    camBtn.className = 'px-2 py-1 rounded text-slate-400 transition';
    actBtn.innerHTML = 'Choose from Gallery';
  }
}

export function executeMediaTrigger(boxNum) {
  if (mediaInputMethods[boxNum] === 'CAMERA') {
    if (boxNum === 1) triggerLiveQRDecoder();
    else triggerNativeCamera(2);
  } else {
    document.getElementById(`fileInput${boxNum}`).click();
  }
}

export function handleGalleryUpload(boxNum, event) {
  const file = event.target.value ? event.target.files[0] : null;
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById(`placeholder${boxNum}`).classList.add('hidden');
    const img = document.getElementById(`mediaImg${boxNum}`);
    img.src = e.target.result;
    img.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}

export function triggerLiveQRDecoder() {
  const targetDiv = document.getElementById('qrReaderContainer1');
  const placeholder = document.getElementById('placeholder1');
  const actBtn = document.getElementById('cameraBtn1');
  const img = document.getElementById('mediaImg1');

  if (html5QrScannerInstance) {
    html5QrScannerInstance.stop().then(() => {
      setHtml5QrScannerInstance(null);
      targetDiv.classList.add('hidden');
      placeholder.classList.remove('hidden');
      actBtn.innerHTML = 'Boot QR Scanner';
    });
    return;
  }

  placeholder.classList.add('hidden');
  img.classList.add('hidden');
  targetDiv.classList.remove('hidden');
  actBtn.innerHTML = 'Kill Scanner Stream';
  setHtml5QrScannerInstance(new Html5Qrcode('qrReaderContainer1'));

  html5QrScannerInstance.start(
    { facingMode: 'environment' },
    { fps: 15, qrbox: { width: 220, height: 140 } },
    (decodedText) => {
      showToast(`Tag Decoded: ${decodedText}`, 'success');
      document.getElementById('editRemarks').value = `[STICKER SCAN VERIFIED] CODE: ${decodedText}`;
      html5QrScannerInstance.stop().then(() => {
        setHtml5QrScannerInstance(null);
        targetDiv.classList.add('hidden');
        placeholder.classList.remove('hidden');
        actBtn.innerHTML = 'Boot QR Scanner';
      });
    },
    () => {}
  ).catch(() => {
    setHtml5QrScannerInstance(null);
    targetDiv.classList.add('hidden');
    placeholder.classList.remove('hidden');
    actBtn.innerHTML = 'Boot QR Scanner';
  });
}

export async function triggerNativeCamera(boxNum) {
  const video = document.getElementById(`video${boxNum}`);
  const placeholder = document.getElementById(`placeholder${boxNum}`);
  const img = document.getElementById(`mediaImg${boxNum}`);
  const button = document.getElementById(`cameraBtn${boxNum}`);

  if (activeStreams[boxNum]) {
    const canvas = document.getElementById(`canvas${boxNum}`);
    canvas.getContext('2d').drawImage(video, 0, 0, 640, 480);
    activeStreams[boxNum].getTracks().forEach((track) => track.stop());
    activeStreams[boxNum] = null;
    video.classList.add('hidden');
    img.src = canvas.toDataURL('image/jpeg');
    img.classList.remove('hidden');
    button.innerHTML = 'Retake Photo';
    return;
  }

  placeholder.classList.add('hidden');
  img.classList.add('hidden');
  video.classList.remove('hidden');
  button.innerHTML = 'Capture Frame';

  try {
    activeStreams[boxNum] = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false,
    });
    video.srcObject = activeStreams[boxNum];
  } catch (err) {
    placeholder.classList.remove('hidden');
    video.classList.add('hidden');
    button.innerHTML = 'Launch Camera';
  }
}