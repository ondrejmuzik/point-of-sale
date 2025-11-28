import React, { useState } from 'react';
import { useOrders } from './hooks/useOrders';
import { useCart } from './hooks/useCart';
import { useWakeLock } from './hooks/useWakeLock';
import { useAuth } from './hooks/useAuth';
import Header from './components/ui/Header';
import TabNavigation from './components/ui/TabNavigation';
import POSView from './components/views/POSView';
import OrdersView from './components/views/OrdersView';
import StatisticsView from './components/views/StatisticsView';
import SettingsView from './components/views/SettingsView';
import ConfirmModal from './components/modals/ConfirmModal';
import SuccessMessage from './components/modals/SuccessMessage';
import PaymentQRCode from './components/modals/PaymentQRCode';
import PasswordModal from './components/modals/PasswordModal';

const BeveragePOS = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [confirmAction, setConfirmAction] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isStaffOrder, setIsStaffOrder] = useState(false);
  const [orderNote, setOrderNote] = useState('');

  // Authentication
  const { isAuthenticated, login, logout } = useAuth();

  // Keep screen awake on mobile devices
  useWakeLock();

  const {
    orders,
    orderNumber,
    pendingOrders,
    completedOrders,
    addOrder,
    updateOrder,
    toggleOrderComplete,
    deleteOrder,
    updateOrderNote,
    getOrdersForExport,
    purgeAllOrders,
    resetOrderNumber
  } = useOrders();

  const {
    cart,
    clickedButton,
    addToCart,
    addCupReturn,
    updateQuantity,
    clearCart,
    getTotal,
    loadCartFromOrder
  } = useCart();

  const requestClearCart = () => {
    setConfirmAction({
      type: 'clearCart',
      message: 'Opravdu chcete zrušit aktuální objednávku?',
      onConfirm: () => {
        clearCart();
        setOrderNote('');
        setConfirmAction(null);
      }
    });
  };

  const completeOrder = async () => {
    if (cart.length === 0) return;

    if (editingOrder) {
      await updateOrder(editingOrder.id, cart, getTotal, orderNote);
      setEditingOrder(null);
    } else {
      await addOrder(cart, getTotal, isStaffOrder, orderNote);
    }

    clearCart();
    setOrderNote('');
    setIsStaffOrder(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const requestCompleteOrder = async (order) => {
    await toggleOrderComplete(order.id);
  };

  const requestDeleteOrder = (order) => {
    setConfirmAction({
      type: 'deleteOrder',
      message: `Smazat objednávku #${order.order_number}? Toto je nevratná operace.`,
      onConfirm: async () => {
        await deleteOrder(order.id);
        setConfirmAction(null);
      }
    });
  };

  const editOrder = (order) => {
    setEditingOrder(order);
    setOrderNote(order.note || '');
    loadCartFromOrder(order);
    setActiveTab('pos');

    // Scroll to cart on mobile after a short delay to allow tab transition
    setTimeout(() => {
      const cartElement = document.querySelector('.order-summary');
      if (cartElement) {
        cartElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const cancelEdit = () => {
    setEditingOrder(null);
    setOrderNote('');
    clearCart();
  };

  // Show password modal if not authenticated
  if (!isAuthenticated) {
    return <PasswordModal onSubmit={login} />;
  }

  return (
    <div className="app has-background-light" style={{ minHeight: '100vh' }} data-theme="light">
      <Header onSettingsClick={() => setActiveTab('settings')} />

      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCount={pendingOrders.length}
      />

      {confirmAction && (
        <ConfirmModal
          message={confirmAction.message}
          onCancel={() => setConfirmAction(null)}
          onConfirm={confirmAction.onConfirm}
        />
      )}

      {showSuccess && (
        <SuccessMessage
          message={editingOrder ? 'Objednávka upravena!' : 'Objednávka vytvořena!'}
        />
      )}

      {showQRCode && (
        <PaymentQRCode
          amount={parseFloat(getTotal())}
          orderNumber={orderNumber}
          onClose={() => setShowQRCode(false)}
        />
      )}

      {activeTab === 'pos' && (
        <POSView
          orderNumber={orderNumber}
          editingOrder={editingOrder}
          cart={cart}
          clickedButton={clickedButton}
          orderNote={orderNote}
          onOrderNoteChange={setOrderNote}
          onAddToCart={addToCart}
          onAddCupReturn={addCupReturn}
          onUpdateQuantity={updateQuantity}
          onClearCart={requestClearCart}
          onCancelEdit={cancelEdit}
          onCompleteOrder={completeOrder}
          onShowQRCode={() => setShowQRCode(true)}
          getTotal={getTotal}
          isStaffOrder={isStaffOrder}
          onToggleStaffOrder={() => setIsStaffOrder(!isStaffOrder)}
        />
      )}

      {activeTab === 'orders' && (
        <OrdersView
          pendingOrders={pendingOrders}
          completedOrders={completedOrders}
          onEditOrder={editOrder}
          onCompleteOrder={requestCompleteOrder}
          onReopenOrder={toggleOrderComplete}
          onDeleteOrder={requestDeleteOrder}
        />
      )}

      {activeTab === 'stats' && (
        <StatisticsView orders={orders} />
      )}

      {activeTab === 'settings' && (
        <SettingsView
          orders={orders}
          getOrdersForExport={getOrdersForExport}
          purgeAllOrders={purgeAllOrders}
          resetOrderNumber={resetOrderNumber}
          onLogout={logout}
        />
      )}
    </div>
  );
};

export default BeveragePOS;
