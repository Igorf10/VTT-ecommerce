import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../api/api.js'
import { useCart } from '../context/CartContext.jsx'
import { formatBRL } from '../utils/format.js'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState('loading')
  const [qty, setQty] = useState(1)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    getProductById(id)
      .then((data) => {
        if (!cancelled) {
          setProduct(data)
          setStatus('ready')
          setQty(1)
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (status === 'loading') {
    return (
      <div className="container">
        <div className="state-block">
          <strong>Carregando produto...</strong>
        </div>
      </div>
    )
  }

  if (status === 'error' || !product) {
    return (
      <div className="container">
        <div className="state-block">
          <strong>Produto não encontrado.</strong>
          <Link to="/" className="btn btn-outline" style={{ marginTop: 20 }}>
            Voltar pra loja
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container pdp">
      <div>
        <div className="pdp__media">
          <img src={product.image} alt={product.name} />
        </div>
      </div>

      <div>
        <Link to="/" className="back-link">
          ← Voltar pra loja
        </Link>
        <p className="pdp__category">{product.category}</p>
        <h1 className="pdp__title">{product.name}</h1>
        <div className="pdp__price">{formatBRL(product.price)}</div>
        <p className="pdp__desc">{product.description}</p>

        <div className="qty-control">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade">
            −
          </button>
          <span>{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} aria-label="Aumentar quantidade">
            +
          </button>
        </div>

        <div className="pdp__actions">
          <button className="btn btn-primary" onClick={() => addItem(product, qty)}>
            Adicionar ao carrinho
          </button>
          <button
            className="btn btn-outline"
            onClick={() => {
              addItem(product, qty)
              navigate('/carrinho')
            }}
          >
            Comprar agora
          </button>
        </div>
      </div>
    </div>
  )
}
