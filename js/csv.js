import { OTHER_STATE_MARKERS } from './config.js';
import {
  inferFacility,
  isPenangText,
  mapCsvStatus,
  mapTaskRequired,
  normalizeHeader,
} from './utils.js';

function findHeaderRow(rows) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] || [];
    const cells = row.map((c) => normalizeHeader(c));
    const hasNo = cells.some((c) => c === 'no.' || c === 'no');
    const hasAsset = cells.some((c) => c === 'asset');
    if (hasNo && hasAsset) return i;
  }
  return -1;
}

function buildColumnMap(headerRow) {
  const map = {};
  headerRow.forEach((cell, idx) => {
    const key = normalizeHeader(cell);
    if (!key) return;
    if (key === 'no.' || key === 'no') map.no = idx;
    else if (key === 'asset') map.asset = idx;
    else if (key === 'sno.') map.sno = idx;
    else if (key === 'cocd') map.cocd = idx;
    else if (key === 'busa') map.busa = idx;
    else if (key === 'cost ctr') map.costCtr = idx;
    else if (key.includes('cost center description')) map.costCenterDesc = idx;
    else if (key === 'pillar') map.pillar = idx;
    else if (key === 'level') map.level = idx;
    else if (key === 'class') map.class = idx;
    else if (key.includes('ruc')) map.ruc = idx;
    else if (key === 'ttype') map.ttype = idx;
    else if (key === 'serial number') map.serial = idx;
    else if (key.includes('asset description')) map.assetDesc = idx;
    else if (key.includes('additional description')) map.additionalDesc = idx;
    else if (key === 'quantity') map.quantity = idx;
    else if (key.includes('pic (full')) map.pic = idx;
    else if (key.includes('task required')) map.taskRequired = idx;
    else if (key.includes('location')) map.location = idx;
    else if (key.includes('size/model') || key.includes('series number')) map.sizeSpecs = idx;
    else if (key.includes('status')) map.status = idx;
    else if (key.includes('remarks')) map.remarks = idx;
    else if (key.includes('tagging date')) map.taggingDate = idx;
    else if (key.includes('tagged by')) map.taggedBy = idx;
  });
  return map;
}

export function parseSpreadsheetRows(rows) {
  const headerIdx = findHeaderRow(rows);
  if (headerIdx === -1) throw new Error('Could not find asset header row (No., Asset, ...).');

  const colMap = buildColumnMap(rows[headerIdx]);
  if (colMap.asset === undefined) throw new Error('Missing required "Asset" column.');

  const assets = [];
  let inPenangSection = false;
  let rowNum = 0;

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i] || [];
    const firstCell = String(row[0] ?? '').trim().toUpperCase();

    if (firstCell === 'PENANG' || firstCell.includes('PULAU PINANG')) {
      inPenangSection = true;
      continue;
    }
    if (inPenangSection && OTHER_STATE_MARKERS.some((s) => firstCell === s || firstCell.startsWith(s + ','))) {
      inPenangSection = false;
    }

    const assetId = getCell(row, colMap.asset);
    if (!assetId || !/^\d+$/.test(assetId)) continue;

    const costCenterDesc = getCell(row, colMap.costCenterDesc);
    const pillar = getCell(row, colMap.pillar);
    const location = getCell(row, colMap.location);
    const assetDesc = getCell(row, colMap.assetDesc);

    const penangMatch =
      inPenangSection ||
      isPenangText(costCenterDesc) ||
      isPenangText(pillar) ||
      isPenangText(location) ||
      isPenangText(assetDesc);

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
      pic: getCell(row, colMap.pic).replace(/\n/g, ' ').trim(),
      status: mapCsvStatus(statusRaw, taggingDate),
      taskRequired: mapTaskRequired(getCell(row, colMap.taskRequired)),
      locationLevel: location,
      sizeSpecs: getCell(row, colMap.sizeSpecs),
      remarks: getCell(row, colMap.remarks),
      taggingDate,
      taggedBy: getCell(row, colMap.taggedBy),
      lastUpdated: taggingDate || new Date().toISOString().replace('T', ' ').substring(0, 19),
      lastStaffId: getCell(row, colMap.taggedBy) ? 'CSV-IMPORT' : 'SYS-INIT',
      facility: inferFacility(costCenterDesc, pillar),
      importRowNo: rowNum,
    });
  }

  return assets;
}

export async function readSpreadsheetFile(file) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false });
}

export function getCell(row, colIdx) {
  if (colIdx === undefined || colIdx === null) return '';
  return String(row[colIdx] ?? '').trim();
}
