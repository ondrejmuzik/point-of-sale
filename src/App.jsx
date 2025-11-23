import React, { useState } from 'react';
import { useOrders } from './hooks/useOrders';
import { useCart } from './hooks/useCart';
import { useWakeLock } from './hooks/useWakeLock';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import POSView from './components/POSView';
import OrdersView from './components/OrdersView';
import StatisticsView from './components/StatisticsView';
import ConfirmModal from './components/ConfirmModal';
import SuccessMessage from './components/SuccessMessage';

const BeveragePOS = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [confirmAction, setConfirmAction] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

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
    deleteOrder
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
      message: 'Opravdu chcete smazat aktuální objednávku?',
      onConfirm: () => {
        clearCart();
        setConfirmAction(null);
      }
    });
  };

  const completeOrder = async () => {
    if (cart.length === 0) return;

    if (editingOrder) {
      await updateOrder(editingOrder.id, cart, getTotal);
      setEditingOrder(null);
    } else {
      await addOrder(cart, getTotal);
    }

    clearCart();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const requestCompleteOrder = async (order) => {
    await toggleOrderComplete(order.id);
  };

  const requestDeleteOrder = (order) => {
    setConfirmAction({
      type: 'deleteOrder',
      message: `Smazat objednávku #${order.orderNumber}? Toto je nevratná operace.`,
      onConfirm: async () => {
        await deleteOrder(order.id);
        setConfirmAction(null);
      }
    });
  };

  const editOrder = (order) => {
    setEditingOrder(order);
    loadCartFromOrder(order);
    setActiveTab('pos');
  };

  const cancelEdit = () => {
    setEditingOrder(null);
    clearCart();
  };

  return (
    <div className="app has-background-light" style={{ minHeight: '100vh' }}>
      <Header />

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

      {activeTab === 'pos' && (
        <POSView
          orderNumber={orderNumber}
          editingOrder={editingOrder}
          cart={cart}
          clickedButton={clickedButton}
          onAddToCart={addToCart}
          onAddCupReturn={addCupReturn}
          onUpdateQuantity={updateQuantity}
          onClearCart={requestClearCart}
          onCancelEdit={cancelEdit}
          onCompleteOrder={completeOrder}
          getTotal={getTotal}
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
    </div>
  );
};

export default BeveragePOS;
