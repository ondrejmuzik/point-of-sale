import React from 'react';
import { products, cupDeposit } from '../../constants/products';
import ProductButton from '../ui/ProductButton';
import CartItem from '../ui/CartItem';
import cupIcon from '../../assets/cup.svg';
import cupReturnIcon from '../../assets/cup-return.svg';
import qrCodeIcon from '../../assets/qr-code.svg';

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
  onShowQRCode,
  getTotal
}) => {
  // Sort cart items based on product grid order and filter out auto cups
  const getSortedCart = () => {
    const productOrder = products.map(p => p.id);
    // Define order: products first, then extra cups, then cup return
    const orderMap = {};
    productOrder.forEach((id, index) => {
      orderMap[id] = index;
    });
    orderMap['cup-extra'] = productOrder.length;
    orderMap['cup-return'] = productOrder.length + 1;

    // Filter out auto cup items as they'll be shown under beverages
    const filteredCart = cart.filter(item => item.id !== 'cup');

    return filteredCart.sort((a, b) => {
      const orderA = orderMap[a.id] ?? orderMap[a.cartKey] ?? 999;
      const orderB = orderMap[b.id] ?? orderMap[b.cartKey] ?? 999;
      return orderA - orderB;
    });
  };

  const sortedCart = getSortedCart();
  const cupItem = cart.find(item => item.id === 'cup');

  // Scroll to cart section
  const scrollToCart = () => {
    const cartElement = document.querySelector('.order-summary');
    if (cartElement) {
      cartElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="section pos-view">
      <div className="container">
        <div className="columns">
          {/* Left Side - Product Grid */}
          <div className="column is-6">
            <div className="product-grid">
              {products.map(product => (
                <ProductButton
                  key={product.id}
                  product={product}
                  onClick={onAddToCart}
                  isClicked={clickedButton === product.id}
                />
              ))}

              {/* Buy Cup Button */}
              <button
                onClick={() => onAddToCart({ id: 'cup', name: 'Kelímek', price: cupDeposit, icon: 'cup.svg' })}
                className="product-card product-card--cup"
              >
                <div className="product-card__icon">
                  <img src={cupIcon} alt="Kelímek" />
                </div>
                <div className="product-card__name">Kelímek</div>
                <div className="product-card__price">{cupDeposit.toFixed(0)},-</div>
              </button>

              {/* Cup Return Button */}
              <button
                onClick={onAddCupReturn}
                className="product-card product-card--return"
              >
                <div className="product-card__icon">
                  <img src={cupReturnIcon} alt="Vrácení kelímku" />
                </div>
                <div className="product-card__name">Vrácení kelímku</div>
                <div className="product-card__price">{-cupDeposit.toFixed(0)},-</div>
              </button>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="column is-6">
            <div className="order-summary">
              <div className="order-summary__inner">
                <h2 className="order-summary__title">Objednávka</h2>

                {cart.length > 0 ? (
                  <>
                    <div className="order-summary__items">
                      {sortedCart.map(item => (
                        <CartItem
                          key={item.cartKey}
                          item={item}
                          onUpdateQuantity={onUpdateQuantity}
                          cupItem={cupItem}
                        />
                      ))}
                    </div>

                    <div className="order-summary__total">
                      <span className="order-summary__total-label">Celkem:</span>
                      <span className={`order-summary__total-amount ${parseFloat(getTotal()) < 0 ? 'order-summary__total-amount--negative' : ''}`}>{getTotal()},-</span>
                    </div>

                    <div className="buttons">
                      <button
                        onClick={onShowQRCode}
                        className="button is-success is-large is-fullwidth is-rounded"
                        disabled={parseFloat(getTotal()) <= 0}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <img src={qrCodeIcon} alt="QR platba" style={{ width: '32px', height: '32px' }} />
                      </button>
                      <button
                        onClick={onCompleteOrder}
                        className="button is-danger is-large is-fullwidth is-rounded order-summary__pay-button has-text-white"
                      >
                        {editingOrder ? 'Uložit změny' : 'Dokončit'}
                      </button>
                    </div>

                    <div className="buttons mt-3">
                      <button
                        onClick={onClearCart}
                        className="button is-light is-fullwidth"
                      >
                        Stornovat
                      </button>
                      {editingOrder && (
                        <button
                          onClick={onCancelEdit}
                          className="button is-warning is-fullwidth"
                        >
                          Zrušit změny
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="order-summary__empty">
                    <p className="has-text-centered has-text-grey">
                      Přidejte položky do objednávky
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Cart Summary at Bottom */}
      {cart.length > 0 && (
        <div className="cart-summary-fixed">
          <div className="cart-summary-fixed__content">
            <div className="cart-summary-fixed__total" onClick={scrollToCart}>
              <span className="cart-summary-fixed__label">Celkem:</span>
              <span className={`cart-summary-fixed__amount ${parseFloat(getTotal()) < 0 ? 'cart-summary-fixed__amount--negative' : ''}`}>
                {getTotal()},-
              </span>
            </div>
            <button
              onClick={onCompleteOrder}
              className="button is-danger is-large is-rounded cart-summary-fixed__pay-button has-text-white"
            >
              {editingOrder ? 'Uložit' : 'Dokončit'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default POSView;
