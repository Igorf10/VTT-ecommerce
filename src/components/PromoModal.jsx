import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'

const DISMISS_KEY = 'vtt_promo_dismissed'

export default function PromoModal() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const alreadyDismissed = sessionStorage.getItem(DISMISS_KEY)
    if (!alreadyDismissed) {
      const timer = setTimeout(() => setOpen(true), 600)
      return () => clearTimeout(timer)
    }
  }, [])

  function close() {
    setOpen(false)
    sessionStorage.setItem(DISMISS_KEY, '1')
  }

  function goToRegister() {
    close()
    navigate('/cadastro')
  }

  if (!open) return null

  return (
    <div className="promo-overlay">
      <div className="promo-card">
        <button className="modal-close" onClick={close} aria-label="Fechar">
          <X size={20} />
        </button>

        <div className="promo-card__badge">
          <span className="promo-card__badge-number">10%</span>
          <span className="promo-card__badge-label">OFF</span>
        </div>

        <h2 className="promo-card__title">
          10% de desconto na primeira compra,
          <br />
          logo após se cadastrar!
        </h2>
        <p className="promo-card__text">
          Crie sua conta grátis na VTT e ganhe um cupom de boas-vindas pra
          usar assim que fechar seu primeiro pedido.
        </p>

        <div className="promo-card__actions">
          <button className="btn btn-primary" onClick={goToRegister}>
            Quero meu desconto
          </button>
          <button className="btn btn-outline" onClick={close}>
            Agora não
          </button>
        </div>
      </div>
    </div>
  )
}
