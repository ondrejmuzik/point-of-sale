import React from 'react';

const PendingOrderCard = ({
  order,
  onToggleItemReady,
  onMarkAllReady,
  onEdit,
  onComplete,
  onDelete
}) => {
  const allReady = order.items.every(item => item.ready);
  const readyCount = order.items.filter(item => item.ready).length;

  return (
    <article className="box order-card has-background-danger-light">
      <header className="level is-mobile mb-4">
        <div className="level-left">
          <div className="level-item">
            <div>
              <h3 className="title is-4 has-text-danger">Order #{order.orderNumber}</h3>
              <p className="subtitle is-6 has-text-grey">{order.timestamp}</p>
              <p className="subtitle is-6 has-text-danger has-text-weight-semibold">
                {readyCount} of {order.items.length} items ready
              </p>
            </div>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <p className="title is-3">${order.total}</p>
          </div>
        </div>
      </header>

      <div className="order-items mb-4">
        {order.items.map((item) => (
          <button
            key={item.itemId}
            onClick={() => onToggleItemReady(order.id, item.itemId)}
            className={`button is-fullwidth is-justify-content-space-between mb-2 ${
              item.ready ? 'is-success' : 'is-light'
            }`}
          >
            <span>
              {item.ready && <span className="mr-2">✅</span>}
              {item.name}
            </span>
            <span className="has-text-weight-bold">${item.price.toFixed(2)}</span>
          </button>
        ))}
      </div>

      <div className="buttons mb-3">
        <button
          onClick={() => onMarkAllReady(order.id)}
          className="button is-danger"
        >
          Mark All Ready
        </button>
        <button
          onClick={() => onEdit(order)}
          className="button is-warning"
        >
          Edit Order
        </button>
      </div>

      <div className="buttons">
        <button
          onClick={() => onComplete(order)}
          className={`button is-large ${allReady ? 'is-success' : 'is-warning'}`}
          style={{ flex: 1 }}
        >
          <span className="icon mr-2">
            <span>✅</span>
          </span>
          <span>{allReady ? 'Complete Order' : 'Force Complete'}</span>
        </button>
        <button
          onClick={() => onDelete(order)}
          className="button is-danger is-large"
        >
          🗑️
        </button>
      </div>
    </article>
  );
};

export default PendingOrderCard;
