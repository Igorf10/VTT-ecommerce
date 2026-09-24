import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { submitOrder } from '../api/api.js'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { formatBRL } from '../utils/format.js'

const emptyForm = {
  name: '',
  email: '',
  address: '',
  city: '',
  cardNumber: '',
  cardName: '',
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(() =>
    isAuthenticated ? { ...emptyForm, name: user.name, email: user.email } : emptyForm
  )
  const [status, setStatus] = useState('idle') // idle | sending | done
  const [order, setOrder] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    const result = await submitOrder({
      userId: user?.id || null,
      customer: form,
      items,
      total: subtotal,
    })
    setOrder(result)
    setStatus('done')
    clearCart()
  }

  if (items.length === 0 && status !== 'done') {
    return (
      <div className="container checkout-page">
        <div className="state-block">
          <strong>Nada pra finalizar.</strong>
          Seu carrinho está vazio.
          <div style={{ marginTop: 20 }}>
            <Link to="/" className="btn btn-primary">
              Ver produtos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'done') {
    return (
      <div className="container checkout-page">
        <div className="success-box">
          <strong>Pedido confirmado!</strong>
          Código {order.id}. Bora treinar enquanto o kit chega.
          <div style={{ marginTop: 20 }}>
            <button className="btn btn-outline" onClick={() => navigate('/')}>
              Voltar pra loja
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container checkout-page">
      <Link to="/carrinho" className="back-link">
        ← Voltar pro carrinho
      </Link>
      <h1 className="section__title">Finalizar compra</h1>
      <p className="section__hint">Total do pedido: {formatBRL(subtotal)}</p>

      {!isAuthenticated && (
        <div className="guest-banner">
          Comprando como visitante — o pedido não vai aparecer em "Meus pedidos".{' '}
          <Link to="/entrar" state={{ from: '/checkout' }}>
            Entrar
          </Link>{' '}
          ou <Link to="/cadastro">criar conta</Link> pra acompanhar depois.
        </div>
      )}

      <form className="form-grid" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nome completo</label>
          <input id="name" name="name" required value={form.name} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="address">Endereço de entrega</label>
          <input id="address" name="address" required value={form.address} onChange={handleChange} />
        </div>

        <div>
          <label htmlFor="city">Cidade</label>
          <input id="city" name="city" required value={form.city} onChange={handleChange} />
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="cardName">Nome no cartão</label>
            <input
              id="cardName"
              name="cardName"
              required
              value={form.cardName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="cardNumber">Número do cartão</label>
            <input
              id="cardNumber"
              name="cardNumber"
              required
              placeholder="•••• •••• •••• ••••"
              value={form.cardNumber}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Processando...' : 'Confirmar pedido'}
        </button>
      </form>
    </div>
  )
}
