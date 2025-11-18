import React from 'react';

const CompletedOrderCard = ({ order, onReopen, onDelete }) => {
  return (
    <article className="box order-card has-background-grey-lighter" style={{ opacity: 0.8 }}>
      <header className="level is-mobile mb-3">
        <div className="level-left">
          <div className="level-item">
            <div>
              <h3 className="title is-5 has-text-grey">Order #{order.orderNumber}</h3>
              <p className="subtitle is-6 has-text-grey-light">{order.timestamp}</p>
            </div>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <p className="title is-4 has-text-grey">${order.total}</p>
          </div>
        </div>
      </header>

      <div className="order-items mb-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="box is-size-7 py-2 px-3 mb-1 has-background-white">
            <div className="level is-mobile">
              <div className="level-left">
                <div className="level-item">
                  <span className="has-text-grey">{item.name}</span>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <span className="has-text-grey has-text-weight-semibold">${item.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="buttons">
        <button
          onClick={() => onReopen(order.id)}
          className="button is-light"
        >
          Reopen
        </button>
        <button
          onClick={() => onDelete(order)}
          className="button is-danger"
        >
          🗑️
        </button>
      </div>
    </article>
  );
};

export default CompletedOrderCard;
