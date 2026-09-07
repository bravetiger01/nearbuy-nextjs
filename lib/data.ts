import type {
  Expense,
  LedgerEntry,
  Payment,
  Promotion,
  Reservation,
  ScannedProduct,
  SnapProduct,
  Store,
  StoreProduct,
} from './types';

export const USER_LAT = 22.4671;
export const USER_LNG = 72.8847;
export const USER_LOC = 'SVIT College, Vasad';

export const LANG_KEYWORDS: Record<string, string> = {
  chopdi: 'notebook',
  daftar: 'notebook',
  kalam: 'pen',
  dawai: 'medicine',
  davai: 'medicine',
  dawa: 'medicine',
  tablet: 'tablet',
  capsule: 'capsule',
  goli: 'tablet',
};

export const STORES: Store[] = [
  {
    id: 1,
    name: 'SVIT Stationery Mart',
    lat: 22.4655,
    lng: 72.8858,
    distance: 0.2,
    distText: '0.2 km',
    rating: 4.8,
    phone: '+91 94265 12345',
    category: 'Stationery',
    lastUpdated: '2 hours ago',
    openNow: true,
    hours: '9:00 AM – 9:00 PM',
    color: '#8B5CF6',
    products: [
      { name: 'Classmate Notebook A4 (200 pages)', stock: 45, price: 120, category: 'Notebooks', image: '/doms nb.png' },
      { name: 'Reynolds Pen Blue (Pack of 10)', stock: 30, price: 85, category: 'Pens' },
      { name: 'Geometry Box Camlin', stock: 12, price: 180, category: 'Math' },
      { name: 'Scientific Calculator Casio fx-82MS', stock: 5, price: 850, category: 'Electronics' },
      { name: 'A4 Paper Ream (500 sheets)', stock: 20, price: 350, category: 'Paper' },
      { name: 'Stapler + Pins Set', stock: 8, price: 145, category: 'Office' },
      { name: 'Highlighter Set (5 colours)', stock: 18, price: 95, category: 'Pens' },
      { name: 'Graph Paper Book', stock: 22, price: 40, category: 'Paper' },
    ],
  },
  {
    id: 2,
    name: 'Krishna Book Store',
    lat: 22.4692,
    lng: 72.882,
    distance: 0.45,
    distText: '0.45 km',
    rating: 4.6,
    phone: '+91 98765 54321',
    category: 'Books & Stationery',
    lastUpdated: '5 hours ago',
    openNow: true,
    hours: '8:00 AM – 8:00 PM',
    color: '#A78BFA',
    products: [
      { name: 'Classmate Notebook A4 (200 pages)', stock: 60, price: 115, category: 'Notebooks', image: '/navneet nb.png' },
      { name: 'Apsara Pencil HB (Box of 10)', stock: 40, price: 35, category: 'Pens' },
      { name: 'Plastic Scale 30 cm', stock: 100, price: 10, category: 'Math' },
      { name: 'Sticky Notes Multicolour (100 pcs)', stock: 15, price: 55, category: 'Office' },
      { name: 'Examination Pad A4', stock: 25, price: 70, category: 'Notebooks' },
      { name: 'Natraj Eraser (Pack of 5)', stock: 80, price: 20, category: 'Office' },
      { name: 'Basic Scientific Calculator', stock: 8, price: 450, category: 'Electronics' },
      { name: 'Drawing Book A3', stock: 30, price: 65, category: 'Paper' },
    ],
  },
  {
    id: 3,
    name: 'Vasad Stationery House',
    lat: 22.4705,
    lng: 72.8875,
    distance: 0.78,
    distText: '0.78 km',
    rating: 4.4,
    phone: '+91 70413 88866',
    category: 'Stationery & Office',
    lastUpdated: '1 day ago',
    openNow: true,
    hours: '10:00 AM – 7:00 PM',
    color: '#7C3AED',
    products: [
      { name: 'Fevicol 250 g', stock: 20, price: 85, category: 'Office' },
      { name: 'A4 Paper Ream (500 sheets)', stock: 15, price: 340, category: 'Paper' },
      { name: 'Cello Ballpen Blue (Pack of 20)', stock: 50, price: 140, category: 'Pens' },
      { name: 'Geometry Box Camlin', stock: 7, price: 175, category: 'Math' },
      { name: 'File Folder A4 (Pack of 10)', stock: 12, price: 150, category: 'Office' },
      { name: 'Highlighter Set (3 colours)', stock: 25, price: 75, category: 'Pens' },
    ],
  },
  {
    id: 4,
    name: 'Om Paper Works',
    lat: 22.4638,
    lng: 72.8902,
    distance: 1.05,
    distText: '1.05 km',
    rating: 4.2,
    phone: '+91 99099 22211',
    category: 'Paper & Printing',
    lastUpdated: '3 hours ago',
    openNow: false,
    hours: '9:30 AM – 6:00 PM',
    color: '#5B21B6',
    products: [
      { name: 'A4 Paper Ream (500 sheets)', stock: 100, price: 330, category: 'Paper' },
      { name: 'Spiral Notebook A5', stock: 40, price: 65, category: 'Notebooks' },
      { name: 'HP 802 Ink Cartridge (Black)', stock: 3, price: 420, category: 'Electronics' },
      { name: 'Carbon Copy Paper (Pack of 50)', stock: 20, price: 95, category: 'Paper' },
      { name: 'Lamination Pouch A4 (Pack of 25)', stock: 10, price: 180, category: 'Paper' },
    ],
  },
  {
    id: 5,
    name: 'New Student Zone',
    lat: 22.4725,
    lng: 72.8795,
    distance: 1.38,
    distText: '1.38 km',
    rating: 4.7,
    phone: '+91 88888 12312',
    category: 'Student Supplies',
    lastUpdated: '30 minutes ago',
    openNow: true,
    hours: '7:00 AM – 10:00 PM',
    color: '#4C1D95',
    products: [
      { name: 'Complete Stationery Kit', stock: 15, price: 120, category: 'Office' },
      { name: 'Classmate Notebook A4 (200 pages)', stock: 80, price: 118, category: 'Notebooks', image: '/youva nb.png' },
      { name: 'Scientific Calculator Casio fx-82MS', stock: 10, price: 840, category: 'Electronics' },
      { name: 'Drawing Instruments Set', stock: 6, price: 250, category: 'Math' },
      { name: 'Geometry Box Camlin', stock: 20, price: 180, category: 'Math' },
      { name: 'Graph Paper Book', stock: 35, price: 38, category: 'Paper' },
      { name: 'Lab Coat White (S/M/L)', stock: 12, price: 380, category: 'Office' },
      { name: 'Engineering Drawing Sheet (Pack 10)', stock: 18, price: 110, category: 'Paper' },
    ],
  },
  {
    id: 6,
    name: 'JAY JALARAM MEDICAL AGENCY',
    address: 'Platinum Plaza, Umreth, F-11 Road, Vasad',
    shopDbId: '10000000-0000-0000-0000-000000000003',
    lat: 22.4690,
    lng: 72.8830,
    distance: 0.5,
    distText: '0.5 km',
    rating: 5.0,
    phone: '07383940854',
    category: 'Pharmacy',
    lastUpdated: '10 minutes ago',
    openNow: true,
    hours: '8:00 AM – 10:00 PM',
    color: '#059669',
    products: [
      { name: 'Avil Tablet', stock: 120, price: 10, category: 'Medicine', image: '/avil.png' },
      { name: 'Cetrizine Tablet', stock: 200, price: 15, category: 'Medicine', image: '/cetrizine.png' },
      { name: 'Zyrtec Tablet', stock: 80, price: 25, category: 'Medicine', image: '/zyrtec.png' },
      { name: 'First Aid Kit', stock: 10, price: 450, category: 'Medical Supplies' },
      { name: 'Digital Thermometer', stock: 15, price: 150, category: 'Electronics' },
    ],
  },
  {
    id: 7,
    name: 'Shree Raam Medical Store',
    address: 'Parbdi, Vasad',
    shopDbId: '10000000-0000-0000-0000-000000000004',
    lat: 22.4680,
    lng: 72.8840,
    distance: 0.8,
    distText: '0.8 km',
    rating: 5.0,
    phone: '09428658292',
    category: 'Pharmacy',
    lastUpdated: '1 hour ago',
    openNow: true,
    hours: '9:00 AM – 9:00 PM',
    color: '#10B981',
    products: [
      { name: 'Cremaffin Plus', stock: 30, price: 180, category: 'Medicine', image: '/Cremaffin.jpg' },
      { name: 'Dulcolax Tablet', stock: 150, price: 12, category: 'Medicine', image: '/dulcolax.jpg' },
      { name: 'Omeo Constipation Tablet', stock: 45, price: 85, category: 'Medicine', image: '/Omeo Constipation tablets.jpg' },
      { name: 'ORS Powder', stock: 100, price: 20, category: 'Medicine' },
      { name: 'Cotton Roll (100g)', stock: 25, price: 40, category: 'Medical Supplies' },
    ],
  },
  {
    id: 8,
    name: 'Mahalaxmi Medical Store',
    address: 'F357+XP, GJ SH 8, Vaherakhadi, Vasad',
    shopDbId: '10000000-0000-0000-0000-000000000005',
    lat: 22.4650,
    lng: 72.8870,
    distance: 1.2,
    distText: '1.2 km',
    rating: 5.0,
    phone: '',
    category: 'Pharmacy',
    lastUpdated: '2 hours ago',
    openNow: false,
    hours: '10:00 AM – 8:00 PM',
    color: '#34D399',
    products: [
      { name: 'Lonazep MD 0.5', stock: 50, price: 45, category: 'Medicine', image: '/lonazep.png' },
      { name: 'Stress Relief Caps', stock: 40, price: 120, category: 'Medicine', image: '/Stress relief.jpg' },
      { name: 'Strex Capsules', stock: 25, price: 150, category: 'Medicine', image: '/Strex.jpg' },
      { name: 'Vicks Vaporub', stock: 60, price: 80, category: 'Medicine' },
      { name: 'Band-Aid (Pack of 100)', stock: 35, price: 100, category: 'Medical Supplies' },
    ],
  },
];

export const INITIAL_LEDGER: LedgerEntry[] = [
  { date: '2026-09-07', desc: 'Sales — Notebooks & Pens', type: 'credit', amount: 4820, balance: 124680 },
  { date: '2026-09-07', desc: 'Supplier payment — Paper', type: 'debit', amount: 8500, balance: 119860 },
  { date: '2026-09-06', desc: 'Sales — Electronics & Calc', type: 'credit', amount: 3200, balance: 128360 },
  { date: '2026-09-06', desc: 'Electricity Bill — Sep', type: 'debit', amount: 1840, balance: 125160 },
  { date: '2026-09-05', desc: 'Bulk order — SVIT College', type: 'credit', amount: 18500, balance: 127000 },
  { date: '2026-09-04', desc: 'Stock purchase — Notebooks', type: 'debit', amount: 12000, balance: 108500 },
  { date: '2026-09-04', desc: 'UPI payment received', type: 'credit', amount: 6400, balance: 120500 },
  { date: '2026-09-03', desc: 'Rent — September 2026', type: 'debit', amount: 8000, balance: 114100 },
];

export const INITIAL_EXPENSES: Expense[] = [
  { date: '2026-09-07', name: 'Electricity Bill', category: 'Electricity', amount: 1840 },
  { date: '2026-09-05', name: 'Store Rent (Sep)', category: 'Rent', amount: 8000 },
  { date: '2026-09-04', name: 'Staff Salary', category: 'Staff Salary', amount: 12000 },
  { date: '2026-09-02', name: 'Transport Charges', category: 'Transport', amount: 1200 },
  { date: '2026-09-01', name: 'Shop Maintenance', category: 'Miscellaneous', amount: 2400 },
  { date: '2026-08-31', name: 'Stock Purchase', category: 'Stock Purchase', amount: 7010 },
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  { id: 'R001', customer: 'Rahul Patel', product: 'Casio fx-82MS Calculator', qty: 1, time: '11:30 AM', status: 'pending' },
  { id: 'R002', customer: 'Priya Shah', product: 'Classmate Notebook A4 (200 pages)', qty: 3, time: '2:00 PM', status: 'confirmed' },
  { id: 'R003', customer: 'Arjun Mehta', product: 'Geometry Box Camlin', qty: 1, time: '4:30 PM', status: 'pending' },
  { id: 'R004', customer: 'Sneha Rao', product: 'A4 Paper Ream', qty: 2, time: '6:00 PM', status: 'confirmed' },
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'P001',
    name: 'Back to College Sale',
    products: ['Classmate Notebook A4 (200 pages)', 'Reynolds Pen Blue (Pack of 10)'],
    discountPct: 15,
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    active: true,
  },
  {
    id: 'P002',
    name: 'Calculator Bundle Offer',
    products: ['Scientific Calculator Casio fx-82MS', 'Geometry Box Camlin'],
    discountPct: 10,
    startDate: '2026-09-05',
    endDate: '2026-09-20',
    active: true,
  },
  {
    id: 'P003',
    name: 'Paper & Office Clearance',
    products: ['A4 Paper Ream (500 sheets)', 'Stapler + Pins Set'],
    discountPct: 20,
    startDate: '2026-09-10',
    endDate: '2026-09-15',
    active: false,
  },
];

export const INITIAL_PAYMENTS: Payment[] = [
  { id: 'TXN-2026-0091', orderId: 'R001', customer: 'Rahul Patel', amount: 850, method: 'upi', date: '2026-09-07', status: 'paid' },
  { id: 'TXN-2026-0090', orderId: 'R002', customer: 'Priya Shah', amount: 360, method: 'cash', date: '2026-09-07', status: 'paid' },
  { id: 'TXN-2026-0089', orderId: 'WALK-IN', customer: 'Walk-in Customer', amount: 520, method: 'upi', date: '2026-09-07', status: 'paid' },
  { id: 'TXN-2026-0088', orderId: 'WALK-IN', customer: 'Walk-in Customer', amount: 1200, method: 'card', date: '2026-09-06', status: 'paid' },
  { id: 'TXN-2026-0087', orderId: 'R003', customer: 'Arjun Mehta', amount: 180, method: 'cash', date: '2026-09-06', status: 'pending' },
  { id: 'TXN-2026-0086', orderId: 'ONLINE-012', customer: 'Online Order', amount: 2800, method: 'online', date: '2026-09-05', status: 'paid' },
  { id: 'TXN-2026-0085', orderId: 'R004', customer: 'Sneha Rao', amount: 700, method: 'upi', date: '2026-09-05', status: 'paid' },
  { id: 'TXN-2026-0084', orderId: 'WALK-IN', customer: 'Walk-in Customer', amount: 95, method: 'cash', date: '2026-09-04', status: 'paid' },
  { id: 'TXN-2026-0083', orderId: 'ONLINE-011', customer: 'Online Order', amount: 3400, method: 'online', date: '2026-09-04', status: 'failed' },
  { id: 'TXN-2026-0082', orderId: 'WALK-IN', customer: 'Walk-in Customer', amount: 450, method: 'card', date: '2026-09-03', status: 'paid' },
];

// Analytics data per period
export const ANALYTICS_DATA = {
  today: {
    labels: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM'],
    revenue: [820, 1240, 980, 650, 400, 1100, 1480, 920, 740, 1860, 1130],
    orders: [4, 7, 5, 3, 2, 6, 8, 4, 4, 9, 6],
  },
  week: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    revenue: [8200, 12400, 9800, 11200, 14500, 18000, 10200],
    orders: [32, 48, 41, 44, 58, 72, 39],
  },
  month: {
    labels: ['W1', 'W2', 'W3', 'W4'],
    revenue: [18400, 22800, 21600, 21520],
    orders: [142, 168, 155, 159],
  },
  quarter: {
    labels: ['Jul', 'Aug', 'Sep'],
    revenue: [72000, 84320, 84320],
    orders: [512, 624, 624],
  },
};

export const BEST_SELLERS = [
  { name: 'Classmate Notebook A4 (200 pages)', sold: 340, revenue: 40800, category: 'Notebooks' },
  { name: 'Reynolds Pen Blue (Pack of 10)', sold: 210, revenue: 17850, category: 'Pens' },
  { name: 'Scientific Calculator Casio fx-82MS', sold: 42, revenue: 35700, category: 'Electronics' },
  { name: 'Geometry Box Camlin', sold: 98, revenue: 17640, category: 'Math' },
  { name: 'A4 Paper Ream (500 sheets)', sold: 75, revenue: 26250, category: 'Paper' },
];

export const SLOW_MOVERS = [
  { name: 'Graph Paper Book', sold: 12, revenue: 480, category: 'Paper' },
  { name: 'Stapler + Pins Set', sold: 8, revenue: 1160, category: 'Office' },
  { name: 'Highlighter Set (5 colours)', sold: 14, revenue: 1330, category: 'Pens' },
];

export const AI_RECS: Record<string, string[]> = {
  notebook: ['Pen', 'Pencil', 'Eraser', 'Geometry Box'],
  pen: ['Notebook', 'Highlighter', 'Eraser', 'Pencil'],
  calculator: ['Geometry Box', 'Graph Paper', 'Drawing Instruments'],
  geometry: ['Calculator', 'Pencil', 'Graph Paper', 'Scale'],
  paper: ['Pen', 'Notebook', 'Stapler', 'File Folder'],
  highlighter: ['Pen', 'Notebook', 'Sticky Notes'],
  eraser: ['Pencil', 'Pen', 'Notebook'],
  stapler: ['File Folder', 'A4 Paper', 'Sticky Notes'],
  medicine: ['First Aid Kit', 'Thermometer', 'Band-Aid'],
  tablet: ['Water Bottle', 'Vitamins', 'Band-Aid'],
};

export const SNAP_PRODUCTS: SnapProduct[] = [
  { name: 'Casio fx-82MS Scientific Calculator', desc: '12-digit display, 240 functions', found: true, store: 'SVIT Stationery Mart', stock: 5, dist: '0.2 km' },
  { name: 'Classmate Notebook A4 200 pages', desc: 'Hard cover, ruled, 200 gsm', found: true, store: 'Krishna Book Store', stock: 60, dist: '0.45 km' },
  { name: 'Reynolds Ball Pen Blue', desc: 'Comfortable grip, smooth flow', found: true, store: 'Vasad Stationery House', stock: 50, dist: '0.78 km' },
  { name: 'Geometry Box Camlin', desc: '9-piece set with compass, etc.', found: true, store: 'New Student Zone', stock: 20, dist: '1.38 km' },
  { name: 'A4 Paper Ream 75 GSM', desc: 'JK Easy Copier 75 GSM, 500 sh.', found: true, store: 'Om Paper Works', stock: 100, dist: '1.05 km' },
];

export const SCANNED_BILL_PRODUCTS: ScannedProduct[] = [
  { name: 'Classmate Notebook A4 (200pg)', qty: 50, unitPrice: 105, sellingPrice: 135, category: 'Notebooks', hsn: '', include: true },
  { name: 'Reynolds Pen Blue (Box/20)', qty: 10, unitPrice: 75, sellingPrice: 95, category: 'Pens', hsn: '', include: true },
  { name: 'Apsara Pencil HB (Box/10)', qty: 20, unitPrice: 30, sellingPrice: 40, category: 'Pens', hsn: '', include: true },
  { name: 'A4 Paper Ream 500 sheets', qty: 5, unitPrice: 310, sellingPrice: 380, category: 'Paper', hsn: '', include: true },
  { name: 'Geometry Box Camlin', qty: 15, unitPrice: 160, sellingPrice: 210, category: 'Math', hsn: '', include: true },
  { name: 'Highlighter Set 5 colours', qty: 8, unitPrice: 85, sellingPrice: 120, category: 'Pens', hsn: '', include: true },
];

export function createOwnerInventory(): StoreProduct[] {
  const raw = STORES[0].products;
  const skus = ['STN-NB-001', 'STN-PN-002', 'STN-MT-003', 'STN-EL-004', 'STN-PP-005', 'STN-OF-006', 'STN-PN-007', 'STN-PP-008'];
  const costs = [80, 55, 120, 600, 240, 95, 65, 25];
  const suppliers = ['Classmate Corp', 'Reynolds India', 'Camlin Ltd', 'Casio India', 'JK Paper', 'Kangaro', 'Faber-Castell', 'Navneet'];
  const thresholds = [20, 15, 8, 3, 10, 5, 10, 10];
  const descs = [
    'Premium ruled notebook, hard cover, 200 pages',
    'Smooth flow ballpen, Pack of 10',
    'Complete geometry set with compass',
    'Scientific calculator, 240 functions',
    'JK Copier 75 GSM, 500 sheets',
    'Metal stapler with 1000 pins',
    'Vibrant highlighters, 5 colours',
    '1cm grid paper, 32 pages',
  ];
  return raw.map((p, i) => ({
    ...p,
    id: i,
    listed: true,
    sku: skus[i] || `STN-00${i}`,
    costPrice: costs[i] || Math.round(p.price * 0.65),
    minThreshold: thresholds[i] || 10,
    supplier: suppliers[i] || 'Supplier',
    description: descs[i] || '',
  }));
}

export const FASHION_STORES = [
  { label: 'Zudio — Anand', short: 'Zudio' },
  { label: 'H&M — Ahmedabad', short: 'H&M' },
  { label: 'Max Fashion — Anand', short: 'Max Fashion' },
  { label: 'Westside — Vadodara', short: 'Westside' },
  { label: 'FBB (Big Bazaar Fashion) — Anand', short: 'FBB' },
  { label: 'Trends — Anand', short: 'Trends' },
];