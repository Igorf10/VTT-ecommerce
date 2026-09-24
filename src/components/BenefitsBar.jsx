import { CreditCard, Star, Truck } from 'lucide-react'

function PixIcon({ size = 24, className }) {
  return <img src="/pix-icon.png" alt="" width={size} height={size} className={className} />
}

const BENEFITS = [
  {
    icon: Truck,
    title: 'Frete grátis',
    text: 'Compras acima de R$ 999,99*',
  },
  {
    icon: CreditCard,
    title: 'Parcelamento',
    text: '18x sem juros',
  },
  {
    icon: PixIcon,
    title: 'Pagamento à vista',
    text: '5% de desconto no Pix',
  },
  {
    icon: Star,
    title: 'Produtos originais',
    text: 'À pronta entrega',
  },
]

export default function BenefitsBar() {
  return (
    <div className="benefits-bar">
      <div className="container benefits-bar__grid">
        {BENEFITS.map(({ icon: Icon, title, text }) => (
          <div className="benefit-item" key={title}>
            <Icon size={26} className="benefit-item__icon" />
            <div>
              <div className="benefit-item__title">{title}</div>
              <div className="benefit-item__text">{text}</div>
            </div>
          </div>
        ))}
      </div>
      <p className="benefits-bar__note">
        *Frete grátis válido para todo o Brasil em compras acima de R$ 999,99.
      </p>
    </div>
  )
}
