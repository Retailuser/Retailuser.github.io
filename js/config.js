export const firebaseConfig = {
  apiKey: 'AIzaSyApvYIkmdJ7UUL8HB0eUqiD3QFq4zFee1g',
  authDomain: 'asset-management-system-5f93f.firebaseapp.com',
  projectId: 'asset-management-system-5f93f',
  storageBucket: 'asset-management-system-5f93f.firebasestorage.app',
  messagingSenderId: '849553013843',
  appId: '1:849553013843:web:3541c68c157cd31c11daa6',
  measurementId: 'G-02C04Q39C5',
};

export const DEFAULT_USERS = {
  admin123: { name: 'System Administrator', staffId: 'admin123', role: 'ADMIN', status: 'APPROVED', hash: 'tnbVM' },
  staff123: { name: 'Field Worker Demo', staffId: 'staff123', role: 'FIELD_WORKER', status: 'APPROVED', hash: 'password' },
};

export const DEFAULT_ASSETS = [
  {
    id: '18012384',
    name: '0820A0 1 UNIT HD PAPER SHREDDER:SEB JAYA',
    class: 'FFE98200',
    serial: 'EB36202654001',
    cocd: '6003',
    busA: '3620',
    costCenter: 'C362000',
    costCenterDesc: 'Customer Service Seberang Jaya',
    pillar: 'SMER P. Pinang - Cust.Care',
    pic: 'Siti Azima Binti Abd Hamid (100996247)',
    status: 'Pending',
    taskRequired: 'Tag Asset',
    locationLevel: 'Aras 1 / Bilik Kedai Tenaga',
    sizeSpecs: 'Aurora Paper Shredder, Model : AS352MQ',
    remarks: '',
    lastUpdated: '2026-06-23 10:00:00',
    lastStaffId: 'SYS-INIT',
    facility: 'Seberang Jaya',
  },
];

export const PENANG_KEYWORDS = [
  'penang', 'pulau pinang', 'p. pinang', 'p.pinang', 'seberang jaya', 'seb jaya',
  'nibong tebal', 'n. tebal', 'bayan baru', 'bertam', 'anson', 'george town',
  'butterworth', 'bukit minyak', 'permatang pauh',
];

export const OTHER_STATE_MARKERS = [
  'PERAK', 'KEDAH', 'SELANGOR', 'JOHOR', 'MELAKA', 'NEGERI SEMBILAN', 'PAHANG',
  'TERENGGANU', 'KELANTAN', 'SABAH', 'SARAWAK', 'KUALA LUMPUR', 'PUTRAJAYA', 'LABUAN',
];

export const MOTHER_FILE_HEADERS = [
  'No.', 'Asset', 'SNo.', 'CoCd', 'BusA', 'Cost Ctr', 'Cost Center Description', 'Pillar', 'Level', 'Class',
  'RUC number', 'TType', 'Serial number', 'Asset description', 'Additional description', 'Quantity',
  'Cap.date', 'Pstng Date', 'Acquisition Cost', 'Accumulated Depr', 'NBV', 'PIC (BC)',
  'PIC (Full name & ID staff)', 'Task Required (Tag/Transfer/Scrap/Write-off )', 'Location (LEVEL/ROOM/PIC)',
  '*Size/Model/Series Number', '**Status ', 'Remarks (Why cant tag - system/renovation)', 'Tagging date',
  'Tagged by (Full name & ID staff)', 'Picture 1', 'Picture 2',
];

export const APP = {
  home: 'index.html',
  login: 'login.html',
  dashboard: 'dashboard.html',
  admin: 'admin.html',
  lookup: 'lookup.html',
};

export const STORAGE_KEYS = {
  assets: 'tnb_ams_assets',
  users: 'tnb_ams_users',
  auditLogs: 'tnb_ams_audit_logs',
  facilities: 'tnb_ams_facilities',
  activeUser: 'tnb_ams_active_user',
  theme: 'tnb_ams_theme',
};

export const DEFAULT_FACILITIES = [
  'Jln Anson', 'State Penang', 'Bertam', 'Bayan Baru', 'Nibong Tebal', 'Seberang Jaya',
];
