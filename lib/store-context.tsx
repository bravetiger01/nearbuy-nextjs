'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  AI_RECS,
  STORES,
  INITIAL_EXPENSES,
  INITIAL_LEDGER,
  INITIAL_RESERVATIONS,
  INITIAL_PROMOTIONS,
  INITIAL_PAYMENTS,
  createOwnerInventory,
} from './data';
import type {
  ChatMessage,
  Expense,
  LedgerEntry,
  Mode,
  Payment,
  Promotion,
  Reservation,
  RiderContext,
  StoreProduct,
  StoreResult,
  ToastType,
} from './types';

export type ModalName =
  | 'login'
  | 'reserve'
  | 'rider'
  | 'fashion'
  | 'snap'
  | 'voice'
  | 'product'
  | 'addProduct'
  | 'addTxn'
  | 'addExp'
  | null;

export type SortBy = 'distance' | 'stock' | 'updated' | 'rating';

interface ToastState {
  msg: string;
  type: ToastType;
}

interface ReserveContext {
  storeId: number;
  productName: string;
  price: number;
  storeName?: string;
}

interface AppContextValue {
  mode: Mode;
  switchMode: (m: Mode) => void;

  theme: 'light' | 'dark';
  toggleTheme: () => void;

  toast: ToastState | null;
  showToast: (msg: string, type?: ToastType) => void;

  activeModal: ModalName;
  openModal: (m: Exclude<ModalName, null>) => void;
  closeModal: (m: Exclude<ModalName, null>) => void;

  searchTerm: string;
  handleSearchInput: (value: string) => void;
  setSearchTerm: (v: string) => void;
  suggestions: string[];
  setSuggestions: (v: string[]) => void;
  currentQuery: string;
  currentResults: StoreResult[];
  currentResultView: 'list' | 'map';
  setCurrentResultView: (v: 'list' | 'map') => void;
  sortBy: SortBy;
  setSortBy: (v: SortBy) => void;
  doSearch: (q?: string) => void;
  quickSearch: (term: string) => void;
  aiRecs: string[];
  resultsRef: React.RefObject<HTMLDivElement | null>;

  lang: string;
  setLang: (v: string) => void;

  loggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
  isOwner: boolean;
  ownerLogout: () => void;
  isRider: boolean;
  riderLogout: () => void;

  ownerInventory: StoreProduct[];
  toggleListing: (idx: number) => void;
  saveProduct: (p: Omit<StoreProduct, 'id'> & { id?: number }) => void;
  deleteProduct: (idx: number) => void;
  updateStock: (id: number, newStock: number) => void;
  editProduct: StoreProduct | null;
  setEditProduct: (p: StoreProduct | null) => void;

  ledger: LedgerEntry[];
  addTransaction: (t: Omit<LedgerEntry, 'balance'>) => void;

  expenses: Expense[];
  addExpense: (e: Expense) => void;

  reservations: Reservation[];
  addReservation: (r: Reservation) => void;

  promotions: Promotion[];
  addPromotion: (p: Promotion) => void;
  togglePromotion: (id: string) => void;
  deletePromotion: (id: string) => void;

  payments: Payment[];
  addPayment: (p: Payment) => void;

  chatMessages: ChatMessage[];
  addChatMessage: (m: ChatMessage) => void;
  clearChat: () => void;

  riderCtx: RiderContext | null;
  setRiderCtx: (c: RiderContext | null) => void;
  reserveCtx: ReserveContext | null;
  setReserveCtx: (c: ReserveContext | null) => void;
  productStoreId: number | null;
  openProductModal: (storeId: number) => void;

  ownerSection: string;
  setOwnerSection: (s: string) => void;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeMobileSidebar: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('customer');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeModal, setActiveModal] = useState<ModalName>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [rawResults, setRawResults] = useState<StoreResult[]>([]);
  const [currentResultView, setCurrentResultView] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<SortBy>('distance');
  const [aiRecs, setAiRecs] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const [lang, setLang] = useState('en-US');
  const [loggedIn, setLoggedIn] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isRider, setIsRider] = useState(false);

  const [ownerInventory, setOwnerInventory] = useState<StoreProduct[]>(() => createOwnerInventory());
  const [editProduct, setEditProduct] = useState<StoreProduct | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>(() => INITIAL_LEDGER);
  const [expenses, setExpenses] = useState<Expense[]>(() => INITIAL_EXPENSES);
  const [reservations, setReservations] = useState<Reservation[]>(() => INITIAL_RESERVATIONS);
  const [promotions, setPromotions] = useState<Promotion[]>(() => INITIAL_PROMOTIONS);
  const [payments, setPayments] = useState<Payment[]>(() => INITIAL_PAYMENTS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [riderCtx, setRiderCtx] = useState<RiderContext | null>(null);
  const [reserveCtx, setReserveCtx] = useState<ReserveContext | null>(null);
  const [productStoreId, setProductStoreId] = useState<number | null>(null);

  const [ownerSection, setOwnerSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const showToast = useCallback((msg: string, type: ToastType = 'info') => {
    setToast({ msg, type });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const switchMode = useCallback((m: Mode) => {
    setMode(m);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const openModal = useCallback((m: Exclude<ModalName, null>) => setActiveModal(m), []);
  const closeModal = useCallback((m: Exclude<ModalName, null>) => {
    setActiveModal((cur) => (cur === m ? null : cur));
  }, []);

  const handleSearchInput = useCallback((value: string) => {
    setSearchTerm(value);
    const q = value.trim();
    if (q.length < 2 || !q) {
      setSuggestions([]);
      return;
    }
    const all: string[] = [];
    STORES.forEach((s) =>
      s.products.forEach((p) => {
        if (p.name.toLowerCase().includes(q.toLowerCase()) && !all.includes(p.name)) all.push(p.name);
      })
    );
    setSuggestions(all.length ? all.slice(0, 6) : []);
  }, []);

  const doSearch = useCallback(
    (q?: string) => {
      const query = (q ?? searchTerm).trim();
      if (!query) {
        showToast('Enter a product to search', 'info');
        return;
      }
      const ql = query.toLowerCase();
      setCurrentQuery(query);
      setSuggestions([]);
      const results: StoreResult[] = STORES.map((store) => {
        const matches = store.products.filter((p) => p.name.toLowerCase().includes(ql));
        return { ...store, matchedProducts: matches };
      }).filter((s) => s.matchedProducts.length > 0);

      setRawResults(results);
      setCurrentResultView('list');

      let recs: string[] = [];
      for (const [key, val] of Object.entries(AI_RECS)) {
        if (ql.includes(key)) {
          recs = val;
          break;
        }
      }
      setAiRecs(recs);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    },
    [searchTerm, showToast]
  );

  const quickSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      setSuggestions([]);
      doSearch(term);
    },
    [doSearch]
  );

  const toggleListing = useCallback((idx: number) => {
    setOwnerInventory((prev) => prev.map((p, i) => (i === idx ? { ...p, listed: !p.listed } : p)));
  }, []);

  const saveProduct = useCallback((p: Omit<StoreProduct, 'id'> & { id?: number }) => {
    setOwnerInventory((prev) => {
      if (typeof p.id === 'number') {
        return prev.map((x) => (x.id === p.id ? { ...x, ...p, id: x.id } : x));
      }
      return [...prev, { ...p, id: Date.now() }];
    });
  }, []);

  const deleteProduct = useCallback((idx: number) => {
    setOwnerInventory((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const updateStock = useCallback((id: number, newStock: number) => {
    setOwnerInventory((prev) => prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p)));
  }, []);

  const addTransaction = useCallback((t: Omit<LedgerEntry, 'balance'>) => {
    setLedger((prev) => {
      const lastBal = prev[0]?.balance ?? 124680;
      const newBal = t.type === 'credit' ? lastBal + t.amount : lastBal - t.amount;
      return [{ ...t, balance: newBal }, ...prev];
    });
  }, []);

  const addExpense = useCallback((e: Expense) => {
    setExpenses((prev) => [e, ...prev]);
  }, []);

  const addReservation = useCallback((r: Reservation) => {
    setReservations((prev) => [r, ...prev]);
  }, []);

  const addPromotion = useCallback((p: Promotion) => {
    setPromotions((prev) => [p, ...prev]);
  }, []);

  const togglePromotion = useCallback((id: string) => {
    setPromotions((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  }, []);

  const deletePromotion = useCallback((id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addPayment = useCallback((p: Payment) => {
    setPayments((prev) => [p, ...prev]);
  }, []);

  const addChatMessage = useCallback((m: ChatMessage) => {
    setChatMessages((prev) => [...prev, m]);
  }, []);

  const clearChat = useCallback(() => {
    setChatMessages([]);
  }, []);

  const ownerLogout = useCallback(() => {
    setIsOwner(false);
    setLoggedIn(false);
    setMode('customer');
    setOwnerSection('dashboard');
  }, []);

  const riderLogout = useCallback(() => {
    setIsRider(false);
    setLoggedIn(false);
    setMode('customer');
  }, []);

  const openProductModal = useCallback((storeId: number) => {
    setProductStoreId(storeId);
    setActiveModal('product');
  }, []);

  const currentResults = useMemo(() => {
    const sorted = [...rawResults];
    if (sortBy === 'distance') sorted.sort((a, b) => a.distance - b.distance);
    else if (sortBy === 'stock')
      sorted.sort((a, b) => {
        const as = a.matchedProducts.reduce((t, p) => t + p.stock, 0);
        const bs = b.matchedProducts.reduce((t, p) => t + p.stock, 0);
        return bs - as;
      });
    else if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'updated') {
      const ord: Record<string, number> = {
        '30 minutes ago': 0,
        '2 hours ago': 1,
        '3 hours ago': 2,
        '5 hours ago': 3,
        '1 day ago': 4,
      };
      sorted.sort((a, b) => (ord[a.lastUpdated] ?? 99) - (ord[b.lastUpdated] ?? 99));
    }
    return sorted;
  }, [rawResults, sortBy]);

  const toggleSidebar = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches) {
      setMobileSidebarOpen((o) => !o);
    } else {
      setSidebarCollapsed((c) => !c);
    }
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  // Expose setIsOwner via setLoggedIn for owner login
  const handleSetLoggedIn = useCallback((v: boolean) => {
    setLoggedIn(v);
  }, []);

  // We need to expose isOwner setter separately; we'll do it via a special mechanism
  // The login modal will call switchMode('owner') which triggers mode change
  // We intercept switchMode to also set isOwner
  const handleSwitchMode = useCallback((m: Mode) => {
    setMode(m);
    if (m === 'owner') {
      setIsOwner(true);
      setIsRider(false);
    } else if (m === 'rider') {
      setIsRider(true);
      setIsOwner(false);
    }
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      mode,
      switchMode: handleSwitchMode,
      theme,
      toggleTheme,
      toast,
      showToast,
      activeModal,
      openModal,
      closeModal,
      searchTerm,
      handleSearchInput,
      setSearchTerm,
      suggestions,
      setSuggestions,
      currentQuery,
      currentResults,
      currentResultView,
      setCurrentResultView,
      sortBy,
      setSortBy,
      doSearch,
      quickSearch,
      aiRecs,
      resultsRef,
      lang,
      setLang,
      loggedIn,
      setLoggedIn: handleSetLoggedIn,
      isOwner,
      ownerLogout,
      isRider,
      riderLogout,
      ownerInventory,
      toggleListing,
      saveProduct,
      deleteProduct,
      updateStock,
      editProduct,
      setEditProduct,
      ledger,
      addTransaction,
      expenses,
      addExpense,
      reservations,
      addReservation,
      promotions,
      addPromotion,
      togglePromotion,
      deletePromotion,
      payments,
      addPayment,
      chatMessages,
      addChatMessage,
      clearChat,
      riderCtx,
      setRiderCtx,
      reserveCtx,
      setReserveCtx,
      productStoreId,
      openProductModal,
      ownerSection,
      setOwnerSection,
      sidebarCollapsed,
      mobileSidebarOpen,
      toggleSidebar,
      closeMobileSidebar,
    }),
    [
      mode,
      handleSwitchMode,
      theme,
      toggleTheme,
      toast,
      showToast,
      activeModal,
      openModal,
      closeModal,
      searchTerm,
      handleSearchInput,
      suggestions,
      currentQuery,
      currentResults,
      currentResultView,
      sortBy,
      setSortBy,
      doSearch,
      quickSearch,
      aiRecs,
      lang,
      loggedIn,
      handleSetLoggedIn,
      isOwner,
      ownerLogout,
      isRider,
      riderLogout,
      ownerInventory,
      toggleListing,
      saveProduct,
      deleteProduct,
      updateStock,
      editProduct,
      setEditProduct,
      ledger,
      addTransaction,
      expenses,
      addExpense,
      reservations,
      addReservation,
      promotions,
      addPromotion,
      togglePromotion,
      deletePromotion,
      payments,
      addPayment,
      chatMessages,
      addChatMessage,
      clearChat,
      riderCtx,
      reserveCtx,
      productStoreId,
      openProductModal,
      ownerSection,
      sidebarCollapsed,
      mobileSidebarOpen,
      toggleSidebar,
      closeMobileSidebar,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}