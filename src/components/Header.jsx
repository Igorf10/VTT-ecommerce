import { useState } from 'react'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { MapPin, Search } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import StoresModal from './StoresModal.jsx'

// Troque pelo número real da VTT, no formato 55DDDNÚMERO (só dígitos).
const WHATSAPP_NUMBER = '5521999990000'
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Oi! Vim do site da VTT e queria tirar uma dúvida.'
)}`

function WhatsAppIcon(props) {
  // Ícone estilizado (não é o logo oficial da Meta/WhatsApp) só pra identificar o canal de contato.
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.41-1.36a9.9 9.9 0 0 0 4.63 1.15h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.51 2 12.04 2zm0 18.02h-.01a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.07.77.82-2.99-.2-.31a8.13 8.13 0 0 1-1.25-4.28c0-4.5 3.66-8.16 8.15-8.16 2.18 0 4.22.85 5.76 2.4a8.09 8.09 0 0 1 2.39 5.77c0 4.5-3.67 8.11-8.16 8.11zm4.47-6.1c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.65-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.4.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.42-.55-.42-.14-.01-.31-.01-.47-.01-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.44-.59 1.64-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28z" />
    </svg>
  )
}

export default function Header() {
  const { totalItems } = useCart()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [storesOpen, setStoresOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('busca') || '')

  function handleSearch(e) {
    e.preventDefault()
    const trimmed = searchTerm.trim()
    navigate(trimmed ? `/?busca=${encodeURIComponent(trimmed)}` : '/')
  }

  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <div className="site-header__left">
          <div className="contact-icons">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-button icon-button--whatsapp"
              aria-label="Falar no WhatsApp"
              title="Falar no WhatsApp"
            >
              <WhatsAppIcon width={18} height={18} />
            </a>
            <button
              className="icon-button"
              aria-label="Ver endereço das lojas"
              title="Nossas unidades"
              onClick={() => setStoresOpen(true)}
            >
              <MapPin size={18} />
            </button>
          </div>

          <NavLink to="/" className="brand">
            <img src="/logo-vtt.png" alt="VTT — Vale Tudo Team" className="brand__logo" />
            <span className="brand__slogan">
              Academia VTT
              <br />
              Vale Tudo Team
            </span>
          </NavLink>
        </div>

        <form className="search-bar" onSubmit={handleSearch} role="search">
          <Search size={16} className="search-bar__icon" />
          <input
            type="search"
            placeholder="Buscar produtos pela descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar produtos"
          />
        </form>

        <nav className="main-nav">
          <NavLink to="/" end>
            Loja
          </NavLink>

          {isAuthenticated ? (
            <NavLink to="/minha-conta">Olá, {user.name.split(' ')[0]}</NavLink>
          ) : (
            <NavLink to="/entrar">Entrar</NavLink>
          )}

          <NavLink to="/carrinho" className="cart-link">
            Carrinho
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </NavLink>
        </nav>
      </div>

      {storesOpen && <StoresModal onClose={() => setStoresOpen(false)} />}
    </header>
  )
}
