import wineIcon from '../assets/wine.svg';
import appleIcon from '../assets/apple.svg';
import appleExtraIcon from '../assets/apple-devil.svg';

const ProductButton = ({ product, onClick, isClicked }) => {
  // Image mapping for products
  const getProductImage = (iconName) => {
    const images = {
      'wine.svg': wineIcon,
      'apple.svg': appleIcon,
      'apple-extra.svg': appleExtraIcon
    };
    return images[iconName] || wineIcon;
  };

  return (
    <button
      onClick={() => onClick(product)}
      className={`product-card ${isClicked ? 'product-card--clicked' : ''}`}
    >
      <div className="product-card__icon">
        <img src={getProductImage(product.icon)} alt={product.name} />
      </div>
      <div className="product-card__name">{product.name}</div>
      <div className="product-card__price">{product.price.toFixed(0)},-</div>
    </button>
  );
};

export default ProductButton;
