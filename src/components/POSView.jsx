import React from 'react';
import { products, cupDeposit } from '../constants/products';
import ProductButton from './ProductButton';
import CartItem from './CartItem';

const POSView = ({
  orderNumber,
  editingOrder,
  cart,
  clickedButton,
  onAddToCart,
  onAddCupReturn,
  onUpdateQuantity,
  onClearCart,
  onCancelEdit,
  onCompleteOrder,
  getTotal
}) => {
  return (
    <section className="section">
      <div className="container">
        <div className="box">
          <h2 className="title is-3">
            {editingOrder ? `Edit Order #${editingOrder.orderNumber}` : `Order #${orderNumber}`}
          </h2>

          <div className="product-list mb-4">
            {products.map(product => (
              <div key={product.id} className="mb-3">
                <ProductButton
                  product={product}
                  onClick={onAddToCart}
                  isClicked={clickedButton === product.id}
                />
              </div>
            ))}
          </div>

          <button
            onClick={onAddCupReturn}
            className="button is-danger is-light is-large is-fullwidth mb-5"
          >
            <span className="has-text-weight-bold">Return Cup</span>
            <span className="has-text-weight-bold ml-auto">-${cupDeposit.toFixed(2)}</span>
          </button>

          {cart.length > 0 && (
            <div className="cart">
              <hr />
              <h3 className="title is-4 mt-5">Current Order</h3>
              <div className="cart__items">
                {cart.map(item => (
                  <CartItem
                    key={item.cartKey}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                  />
                ))}
              </div>

              <hr className="my-5" />

              <div className="level is-mobile mb-5">
                <div className="level-left">
                  <div className="level-item">
                    <p className="title is-2">Total:</p>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <p className="title is-2 has-text-danger">${getTotal()}</p>
                  </div>
                </div>
              </div>

              <div className="buttons">
                <button
                  onClick={onClearCart}
                  className="button is-light is-large"
                >
                  Clear
                </button>
                {editingOrder && (
                  <button
                    onClick={onCancelEdit}
                    className="button is-warning is-large"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  onClick={onCompleteOrder}
                  className="button is-success is-large ml-auto"
                >
                  {editingOrder ? 'Update Order' : 'Complete Order'}
                </button>
              </div>
            </div>
          )}

          {cart.length === 0 && (
            <div className="notification is-light">
              <p className="has-text-centered has-text-grey is-size-5">
                Select items to start an order
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default POSView;
