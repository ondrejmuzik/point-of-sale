import React from 'react';

const CartItem = ({ item, onUpdateQuantity }) => {
  return (
    <div className={`box cart-item ${item.isReturn ? 'has-background-danger-light' : ''}`}>
      <div className="level is-mobile">
        <div className="level-left">
          <div className="level-item">
            <div>
              <p className="has-text-weight-semibold is-size-5">{item.name}</p>
              <p className="has-text-grey">${item.price.toFixed(2)} each</p>
            </div>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <div className="field has-addons">
              <p className="control">
                <button
                  onClick={() => onUpdateQuantity(item.cartKey, -1)}
                  className="button"
                >
                  ➖
                </button>
              </p>
              <p className="control">
                <input
                  className="input has-text-centered"
                  type="text"
                  value={item.quantity}
                  readOnly
                  style={{ width: '60px' }}
                />
              </p>
              <p className="control">
                <button
                  onClick={() => onUpdateQuantity(item.cartKey, 1)}
                  className="button"
                >
                  ➕
                </button>
              </p>
            </div>
          </div>
          <div className="level-item">
            <p className="has-text-weight-bold is-size-5">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
