import { Link } from 'react-router-dom'
import {
  Facebook,
  Instagram,
  MapPin,
  Phone,
  ShieldCheck,
  Store,
  Youtube,
  Zap,
} from 'lucide-react'

// Dados de exemplo — troque pelos contatos, redes e links institucionais reais da VTT.
const PHONE = '(21) 99999-0000'
const WHATSAPP_DISPLAY = '(21) 99999-0000'

const INSTITUTIONAL_LINKS = [
  { label: 'Quem somos', href: '#' },
  { label: 'Meios de pagamento e de frete', href: '#' },
  { label: 'Política de privacidade', href: '#' },
  { label: 'Política de trocas e devoluções', href: '#' },
]

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', icon: Facebook },
  { label: 'Instagram', href: '#', icon: Instagram },
  { label: 'YouTube', href: '#', icon: Youtube },
]

const PAYMENT_LOGOS = [
  { name: 'Visa', src: '/visa.png' },
  { name: 'Mastercard', src: '/mastercard.png' },
  { name: 'Elo', src: '/elo.png' },
]

const SHIPPING_METHODS = [
  { name: 'Correios', logo: '/correios.png' },
  { name: 'Jadlog', logo: '/jadlog.png' },
  { name: 'Retire na loja', icon: Store },
  { name: 'Entrega expressa', icon: Zap },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-newsletter">
        <div className="container footer-newsletter__inner">
          <div>
            <h3 className="footer-newsletter__title">
              Cadastre-se e ganhe 10% de desconto
            </h3>
            <p className="footer-newsletter__text">
              Crie sua conta grátis e ganhe um cupom de boas-vindas pra usar
              na primeira compra.
            </p>
          </div>
          <Link to="/cadastro" className="btn btn-primary footer-newsletter__cta">
            Cadastrar agora
          </Link>
        </div>
      </div>

      <div className="container footer-columns">
        <div className="footer-about">
          <img src="/logo-vtt.png" alt="VTT" className="footer-about__logo" />
          <div>
            <p className="footer-about__text">
              A VTT — Vale Tudo Team é uma academia de luta especializada em
              MMA, Jiu-Jitsu e Muay Thai. Desde a fundação, formamos atletas
              competitivos e oferecemos equipamento testado no próprio
              tatame, com entrega pra todo o Brasil.
            </p>
            <div className="footer-about__location">
              <MapPin size={16} />
              <span>
                <strong>Onde estamos:</strong> Rua Adalberto Seixas, 509 —
                São Gonçalo/RJ
              </span>
            </div>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-col__title">Atendimento</h4>
          <ul className="footer-col__list">
            <li>
              <Phone size={14} /> {PHONE}
            </li>
            <li className="footer-col__whatsapp">WhatsApp: {WHATSAPP_DISPLAY}</li>
            <li>Seg. a sex., 9h às 18h</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col__title">Institucional</h4>
          <ul className="footer-col__list">
            {INSTITUTIONAL_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-col__title">Redes sociais</h4>
          <div className="footer-social">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a href={href} key={label} aria-label={label} title={label}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container footer-badges">
        <div className="footer-badge-group">
          <h4 className="footer-col__title">Formas de pagamento</h4>
          <div className="footer-badge-row">
            {PAYMENT_LOGOS.map((method) => (
              <span className="footer-badge footer-badge--logo" key={method.name}>
                <img src={method.src} alt={method.name} />
              </span>
            ))}
            <span className="footer-badge footer-badge--logo footer-badge--pix">
              <img src="/pix-icon.png" alt="" width={14} height={14} />
              Pix
            </span>
          </div>
        </div>

        <div className="footer-badge-group">
          <h4 className="footer-col__title">Selos de segurança</h4>
          <div className="footer-badge-row">
            <span className="footer-badge footer-badge--seal">
              <ShieldCheck size={16} />
              Site protegido
            </span>
          </div>
        </div>

        <div className="footer-badge-group">
          <h4 className="footer-col__title">Formas de envio</h4>
          <div className="footer-badge-row">
            {SHIPPING_METHODS.map((method) =>
              method.logo ? (
                <span className="footer-badge footer-badge--logo" key={method.name}>
                  <img src={method.logo} alt={method.name} />
                </span>
              ) : (
                <span className="footer-badge" key={method.name}>
                  <method.icon size={14} />
                  {method.name}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      <div className="container site-footer__grid">
        <span>© {new Date().getFullYear()} VTT — Vale Tudo Team. Todos os direitos reservados.</span>
        <span>Desenvolvimento: Guard Data</span>
      </div>
    </footer>
  )
}
