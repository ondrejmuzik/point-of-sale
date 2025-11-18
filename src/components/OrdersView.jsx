import React from 'react';
import PendingOrderCard from './PendingOrderCard';
import CompletedOrderCard from './CompletedOrderCard';

const OrdersView = ({
  pendingOrders,
  completedOrders,
  onToggleItemReady,
  onMarkAllReady,
  onEditOrder,
  onCompleteOrder,
  onReopenOrder,
  onDeleteOrder
}) => {
  return (
    <section className="section">
      <div className="container">
        <div className="mb-6">
          <h2 className="title is-3 has-text-danger">Pending Orders</h2>
          {pendingOrders.length === 0 ? (
            <div className="notification is-light">
              <p className="has-text-centered has-text-grey is-size-5">No pending orders</p>
            </div>
          ) : (
            <div className="orders-list">
              {pendingOrders.map(order => (
                <PendingOrderCard
                  key={order.id}
                  order={order}
                  onToggleItemReady={onToggleItemReady}
                  onMarkAllReady={onMarkAllReady}
                  onEdit={onEditOrder}
                  onComplete={onCompleteOrder}
                  onDelete={onDeleteOrder}
                />
              ))}
            </div>
          )}
        </div>

        {completedOrders.length > 0 && (
          <div>
            <h2 className="title is-3 has-text-grey">Completed</h2>
            <div className="orders-list">
              {completedOrders.map(order => (
                <CompletedOrderCard
                  key={order.id}
                  order={order}
                  onReopen={onReopenOrder}
                  onDelete={onDeleteOrder}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrdersView;
