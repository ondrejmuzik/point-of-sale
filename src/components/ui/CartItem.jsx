const CartItem = ({ item, onUpdateQuantity, cupItem }) => {
  const getItemClass = () => {
    if (item.isReturn) return 'order-summary__item--return';
    if (item.id === 'cup' || item.id === 'cup-extra') return 'order-summary__item--cup';
    return '';
  };

  const isBeverage = item.id !== 'cup' && item.id !== 'cup-extra' && item.id !== 'return';

  return (
    <>
      <div className={`order-summary__item ${getItemClass()}`}>
        <div className="order-summary__item-details">
          <span className="order-summary__item-name">{item.name}</span>
          <div className="order-summary__item-quantity">
            <span>x{item.quantity}</span>
          </div>
          <span className="order-summary__item-price">{(item.price * item.quantity).toFixed(0)},-</span>
        </div>
        <button
          onClick={() => onUpdateQuantity(item.cartKey, -item.quantity)}
          className="order-summary__item-remove"
        >
          ✕
        </button>
      </div>

      {/* Show cup under beverage */}
      {isBeverage && cupItem && (
        <div className="order-summary__item order-summary__item--grouped-cup">
          <div className="order-summary__item-details">
            <span className="order-summary__item-name order-summary__item-name--muted">{cupItem.name}</span>
            <div className="order-summary__item-quantity order-summary__item-quantity--muted">
              <span>x{item.quantity}</span>
            </div>
            <span className="order-summary__item-price order-summary__item-price--muted">{(cupItem.price * item.quantity).toFixed(0)},-</span>
          </div>
        </div>
      )}
    </>
  );
};

export default CartItem;
