import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOrdersByUser } from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { formatBRL } from '../utils/format.js'

const statusLabel = {
  confirmado: 'Confirmado',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

function formatDate(iso) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export default function Account() {
  const { user, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    let cancelled = false

    async function load() {
      setStatus('loading')
      try {
        const data = await getOrdersByUser(user.id)
        if (!cancelled) {
          setOrders(data)
          setStatus('ready')
        }
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [user.id])

  return (
    <div className="container account-page">
      <div className="account-page__head">
        <div>
          <h1 className="section__title">Minha conta</h1>
          <p className="section__hint">
            {user.name} · {user.email}
          </p>
        </div>
        <button className="btn btn-outline" onClick={logout}>
          Sair
        </button>
      </div>

      <h2 className="account-page__subtitle">Meus pedidos</h2>

      {status === 'loading' && (
        <div className="state-block">
          <strong>Carregando seus pedidos...</strong>
        </div>
      )}

      {status === 'error' && (
        <div className="state-block">
          <strong>Não rolou carregar seus pedidos.</strong>
          Confirme se o mock está no ar: <code>npm run server</code>
        </div>
      )}

      {status === 'ready' && orders.length === 0 && (
        <div className="state-block">
          <strong>Você ainda não fez nenhum pedido.</strong>
          <div style={{ marginTop: 20 }}>
            <Link to="/" className="btn btn-primary">
              Ver produtos
            </Link>
          </div>
        </div>
      )}

      {status === 'ready' && orders.length > 0 && (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card__head">
                <div>
                  <span className="order-card__id">Pedido {order.id}</span>
                  <span className="order-card__date">{formatDate(order.createdAt)}</span>
                </div>
                <span className={`order-status order-status--${order.status}`}>
                  {statusLabel[order.status] || order.status}
                </span>
              </div>

              <div className="order-card__items">
                {order.items.map((item) => (
                  <div className="order-card__item" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <div className="order-card__item-name">{item.name}</div>
                      <div className="order-card__item-qty">
                        {item.qty}x {formatBRL(item.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-card__footer">
                <span>Entrega: {order.customer?.address}, {order.customer?.city}</span>
                <span className="price">{formatBRL(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
