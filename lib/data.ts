import type {
  Expense,
  LedgerEntry,
  Reservation,
  ScannedProduct,
  SnapProduct,
  Store,
  StoreProduct,
} from './types';

export const USER_LAT = 22.4671;
export const USER_LNG = 72.8847;
export const USER_LOC = 'SVIT College, Vasad';

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
      { name: 'Classmate Notebook A4 (200 pages)', stock: 45, price: 120, category: 'Notebooks' },
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
      { name: 'Classmate Notebook A4 (200 pages)', stock: 60, price: 115, category: 'Notebooks' },
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
      { name: 'Classmate Notebook A4 (200 pages)', stock: 80, price: 118, category: 'Notebooks' },
      { name: 'Scientific Calculator Casio fx-82MS', stock: 10, price: 840, category: 'Electronics' },
      { name: 'Drawing Instruments Set', stock: 6, price: 250, category: 'Math' },
      { name: 'Geometry Box Camlin', stock: 20, price: 180, category: 'Math' },
      { name: 'Graph Paper Book', stock: 35, price: 38, category: 'Paper' },
      { name: 'Lab Coat White (S/M/L)', stock: 12, price: 380, category: 'Office' },
      { name: 'Engineering Drawing Sheet (Pack 10)', stock: 18, price: 110, category: 'Paper' },
    ],
  },
];

export const INITIAL_LEDGER: LedgerEntry[] = [
  { date: '2026-08-07', desc: 'Sales — Notebooks & Pens', type: 'credit', amount: 4820, balance: 124680 },
  { date: '2026-08-07', desc: 'Supplier payment — Paper', type: 'debit', amount: 8500, balance: 119860 },
  { date: '2026-08-06', desc: 'Sales — Electronics & Calc', type: 'credit', amount: 3200, balance: 128360 },
  { date: '2026-08-06', desc: 'Electricity Bill — Aug', type: 'debit', amount: 1840, balance: 125160 },
  { date: '2026-08-05', desc: 'Bulk order — SVIT College', type: 'credit', amount: 18500, balance: 127000 },
  { date: '2026-08-04', desc: 'Stock purchase — Notebooks', type: 'debit', amount: 12000, balance: 108500 },
  { date: '2026-08-04', desc: 'UPI payment received', type: 'credit', amount: 6400, balance: 120500 },
  { date: '2026-08-03', desc: 'Rent — August 2026', type: 'debit', amount: 8000, balance: 114100 },
];

export const INITIAL_EXPENSES: Expense[] = [
  { date: '2026-08-07', name: 'Electricity Bill', category: 'Electricity', amount: 1840 },
  { date: '2026-08-05', name: 'Store Rent (Aug)', category: 'Rent', amount: 8000 },
  { date: '2026-08-04', name: 'Staff Salary', category: 'Staff Salary', amount: 12000 },
  { date: '2026-08-02', name: 'Transport Charges', category: 'Transport', amount: 1200 },
  { date: '2026-08-01', name: 'Shop Maintenance', category: 'Miscellaneous', amount: 2400 },
  { date: '2026-07-31', name: 'Stock Purchase', category: 'Stock Purchase', amount: 7010 },
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  { id: 'R001', customer: 'Rahul Patel', product: 'Casio fx-82MS Calculator', qty: 1, time: '11:30 AM', status: 'pending' },
  { id: 'R002', customer: 'Priya Shah', product: 'Classmate Notebook A4 (200 pages)', qty: 3, time: '2:00 PM', status: 'confirmed' },
  { id: 'R003', customer: 'Arjun Mehta', product: 'Geometry Box Camlin', qty: 1, time: '4:30 PM', status: 'pending' },
  { id: 'R004', customer: 'Sneha Rao', product: 'A4 Paper Ream', qty: 2, time: '6:00 PM', status: 'confirmed' },
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
};

export const SNAP_PRODUCTS: SnapProduct[] = [
  { name: 'Casio fx-82MS Scientific Calculator', desc: '12-digit display, 240 functions', found: true, store: 'SVIT Stationery Mart', stock: 5, dist: '0.2 km' },
  { name: 'Classmate Notebook A4 200 pages', desc: 'Hard cover, ruled, 200 gsm', found: true, store: 'Krishna Book Store', stock: 60, dist: '0.45 km' },
  { name: 'Reynolds Ball Pen Blue', desc: 'Comfortable grip, smooth flow', found: true, store: 'Vasad Stationery House', stock: 50, dist: '0.78 km' },
  { name: 'Geometry Box Camlin', desc: '9-piece set with compass, etc.', found: true, store: 'New Student Zone', stock: 20, dist: '1.38 km' },
  { name: 'A4 Paper Ream 75 GSM', desc: 'JK Easy Copier 75 GSM, 500 sh.', found: true, store: 'Om Paper Works', stock: 100, dist: '1.05 km' },
];

export const SCANNED_BILL_PRODUCTS: ScannedProduct[] = [
  { name: 'Classmate Notebook A4 (200pg)', qty: 50, unitPrice: 105, category: 'Notebooks' },
  { name: 'Reynolds Pen Blue (Box/20)', qty: 10, unitPrice: 75, category: 'Pens' },
  { name: 'Apsara Pencil HB (Box/10)', qty: 20, unitPrice: 30, category: 'Pens' },
  { name: 'A4 Paper Ream 500 sheets', qty: 5, unitPrice: 310, category: 'Paper' },
  { name: 'Geometry Box Camlin', qty: 15, unitPrice: 160, category: 'Math' },
  { name: 'Highlighter Set 5 colours', qty: 8, unitPrice: 85, category: 'Pens' },
];

export function createOwnerInventory(): StoreProduct[] {
  return STORES[0].products.map((p, i) => ({ ...p, id: i, listed: true }));
}

export const FASHION_STORES = [
  { label: 'Zudio — Anand', short: 'Zudio' },
  { label: 'H&M — Ahmedabad', short: 'H&M' },
  { label: 'Max Fashion — Anand', short: 'Max Fashion' },
  { label: 'Westside — Vadodara', short: 'Westside' },
  { label: 'FBB (Big Bazaar Fashion) — Anand', short: 'FBB' },
  { label: 'Trends — Anand', short: 'Trends' },
];