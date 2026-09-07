'use client';

import { AppProvider, useApp } from '../lib/store-context';
import ModeSwitcher from '../components/ModeSwitcher';
import Toast from '../components/Toast';
import CustomerView from '../components/customer/CustomerView';
import OwnerView from '../components/owner/OwnerView';
import LoginModal from '../components/modals/LoginModal';
import ReserveModal from '../components/modals/ReserveModal';
import RiderModal from '../components/modals/RiderModal';
import FashionModal from '../components/modals/FashionModal';
import SnapModal from '../components/modals/SnapModal';
import VoiceModal from '../components/modals/VoiceModal';
import ProductModal from '../components/modals/ProductModal';
import AddProductModal from '../components/modals/AddProductModal';
import AddTxnModal from '../components/modals/AddTxnModal';
import AddExpModal from '../components/modals/AddExpModal';

import RiderView from '../components/rider/RiderView';

function CurrentView() {
  const { mode } = useApp();
  if (mode === 'customer') return <CustomerView />;
  if (mode === 'owner') return <OwnerView />;
  if (mode === 'rider') return <RiderView />;
  return null;
}

function ModalHosts() {
  const { activeModal } = useApp();
  return (
    <>
      {activeModal === 'login' && <LoginModal />}
      {activeModal === 'reserve' && <ReserveModal />}
      {activeModal === 'rider' && <RiderModal />}
      {activeModal === 'fashion' && <FashionModal />}
      {activeModal === 'snap' && <SnapModal />}
      {activeModal === 'voice' && <VoiceModal />}
      {activeModal === 'product' && <ProductModal />}
      {activeModal === 'addProduct' && <AddProductModal />}
      {activeModal === 'addTxn' && <AddTxnModal />}
      {activeModal === 'addExp' && <AddExpModal />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ModeSwitcher />
      <CurrentView />
      <Toast />
      <ModalHosts />
    </AppProvider>
  );
}