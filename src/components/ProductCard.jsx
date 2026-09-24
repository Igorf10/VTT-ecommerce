import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatBRL } from '../utils/format.js'

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  return (
    <article className="product-card">
      <Link to={`/produto/${product.id}`} className="product-card__media">
        <span className="product-card__tag">{product.category}</span>
        {product.oldPrice && product.oldPrice > product.price && (
          <span className="product-card__promo">Promoção</span>
        )}
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>

      <div className="product-card__body">
        <Link to={`/produto/${product.id}`} className="product-card__name">
          {product.name}
        </Link>

        <div className="product-card__price-row">
          <span className="price">{formatBRL(product.price)}</span>
          {product.oldPrice && (
            <span className="price--old">{formatBRL(product.oldPrice)}</span>
          )}
        </div>

        <div className="product-card__actions">
          <button className="btn btn-primary" onClick={() => addItem(product, 1)}>
            Adicionar
          </button>
        </div>
      </div>
    </article>
  )
}
