import React, { useState, useEffect } from 'react';
import PendingOrderCard from '../ui/PendingOrderCard';
import CompletedOrderCard from '../ui/CompletedOrderCard';

const OrdersView = ({
  pendingOrders,
  completedOrders,
  onEditOrder,
  onCompleteOrder,
  onReopenOrder,
  onDeleteOrder
}) => {
  // State for lazy loading completed orders
  const [visibleCount, setVisibleCount] = useState(5);

  // Handle real-time updates - maintain scroll position
  useEffect(() => {
    // Only reset if visible count exceeds total (e.g., after deletions)
    if (visibleCount > completedOrders.length) {
      setVisibleCount(Math.min(5, completedOrders.length));
    }
  }, [completedOrders.length, visibleCount]);

  // Calculate visible orders and button states
  const visibleOrders = completedOrders.slice(0, visibleCount);
  const hasMoreOrders = visibleCount < completedOrders.length;

  // Event handlers
  const handleLoadMore = () => {
    const newCount = Math.min(visibleCount + 10, completedOrders.length);
    setVisibleCount(newCount);
  };

  const handleLoadAll = () => {
    setVisibleCount(completedOrders.length);
  };

  return (
    <section className="section orders-view">
      <div className="container">
        <div className="mb-6">
          <h2 className="title is-3">Nové objednávky</h2>
          {pendingOrders.length === 0 ? (
            <div className="notification is-light">
              <p className="has-text-centered has-text-grey is-size-5">Žádné objednávky</p>
            </div>
          ) : (
            <div className="orders-list">
              {pendingOrders.map(order => (
                <PendingOrderCard
                  key={order.id}
                  order={order}
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
            <h2 className="title is-3 has-text-grey">Vyřízené</h2>
            <div className="orders-list">
              {visibleOrders.map(order => (
                <CompletedOrderCard
                  key={order.id}
                  order={order}
                  onReopen={onReopenOrder}
                  onDelete={onDeleteOrder}
                />
              ))}
            </div>

            <div className="mt-6 has-text-centered">
              {hasMoreOrders ? (
                <div className="buttons is-centered">
                  <button
                    onClick={handleLoadMore}
                    className="button is-link"
                  >
                    Zobrazit další&hellip;
                  </button>
                  <button
                    onClick={handleLoadAll}
                    className="button is-warning"
                  >
                    Zobrazit vše
                  </button>
                </div>
              ) : (
                <p className="has-text-grey is-size-7">
                  Zobrazují se všechny vyřízené objednávky
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrdersView;
