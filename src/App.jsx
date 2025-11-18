import React, { useState } from 'react';
import { useOrders } from './hooks/useOrders';
import { useCart } from './hooks/useCart';
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

  const {
    orders,
    orderNumber,
    pendingOrders,
    completedOrders,
    addOrder,
    updateOrder,
    toggleItemReady,
    markAllItemsReady,
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
      message: 'Are you sure you want to clear the current order?',
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

  const requestCompleteOrder = (order) => {
    const allReady = order.items.every(item => item.ready);

    if (!allReady) {
      setConfirmAction({
        type: 'completeOrderNotReady',
        message: 'Not all items are marked as ready. Complete the order anyway?',
        onConfirm: async () => {
          await toggleOrderComplete(order.id);
          setConfirmAction(null);
        }
      });
    } else {
      setConfirmAction({
        type: 'completeOrder',
        message: `Mark Order #${order.orderNumber} as complete?`,
        onConfirm: async () => {
          await toggleOrderComplete(order.id);
          setConfirmAction(null);
        }
      });
    }
  };

  const requestDeleteOrder = (order) => {
    setConfirmAction({
      type: 'deleteOrder',
      message: `Delete Order #${order.orderNumber}? This cannot be undone.`,
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
    <div className="app has-background-warning-light" style={{ minHeight: '100vh' }}>
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
          message={`Order ${editingOrder ? 'Updated' : 'Placed'}!`}
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
          onToggleItemReady={toggleItemReady}
          onMarkAllReady={markAllItemsReady}
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
