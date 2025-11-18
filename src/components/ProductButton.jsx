import React from 'react';

const ProductButton = ({ product, onClick, isClicked }) => {
  return (
    <button
      onClick={() => onClick(product)}
      className={`button is-large is-fullwidth is-success is-light product-button ${isClicked ? 'is-focused' : ''}`}
    >
      <span className="is-size-5 has-text-weight-bold">{product.name}</span>
      <span className="is-size-5 has-text-weight-bold ml-auto">${product.price.toFixed(2)}</span>
    </button>
  );
};

export default ProductButton;
