import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { formatBRL } from '../utils/format.js'

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, subtotal } = useCart()
  const navigate = useNavigate()

  function handleClearCart() {
    const confirmed = window.confirm(
      'Tem certeza que quer esvaziar o carrinho? Essa ação remove todos os itens.'
    )
    if (confirmed) clearCart()
  }

  if (items.length === 0) {
    return (
      <div className="container cart-page">
        <div className="state-block">
          <strong>Seu carrinho está vazio.</strong>
          Bora equipar o treino.
          <div style={{ marginTop: 20 }}>
            <Link to="/" className="btn btn-primary">
              Ver produtos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container cart-page">
      <div className="cart-page__head">
        <h1 className="section__title">Seu carrinho</h1>
        <button className="btn btn-outline" onClick={handleClearCart}>
          Esvaziar carrinho
        </button>
      </div>

      <div className="cart-layout">
        <div>
          {items.map((item) => (
            <div className="cart-row" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div>
                <div className="cart-row__name">{item.name}</div>
                <div style={{ color: 'var(--bone-dim)', fontSize: 13 }}>
                  {formatBRL(item.price)} / un.
                </div>
                <button className="cart-row__remove" onClick={() => removeItem(item.id)}>
                  Remover
                </button>
              </div>
              <div className="qty-control">
                <button onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Diminuir">
                  −
                </button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Aumentar">
                  +
                </button>
              </div>
              <div className="price">{formatBRL(item.price * item.qty)}</div>
            </div>
          ))}
        </div>

        <aside className="summary-box">
          <h2 className="summary-box__title">Resumo</h2>
          <div className="summary-line">
            <span>Subtotal</span>
            <span>{formatBRL(subtotal)}</span>
          </div>
          <div className="summary-line">
            <span>Frete</span>
            <span>Calculado no checkout</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span className="price">{formatBRL(subtotal)}</span>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 20 }}
            onClick={() => navigate('/checkout')}
          >
            Finalizar compra
          </button>
        </aside>
      </div>
    </div>
  )
}
