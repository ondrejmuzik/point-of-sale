const CartItem = ({ item, onUpdateQuantity }) => {
  return (
    <div className={`order-summary__item ${item.isReturn ? 'order-summary__item--return' : ''}`}>
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
  );
};

export default CartItem;
