import { MapPin, X } from 'lucide-react'

// Dados de exemplo — troque pelos endereços reais das unidades da VTT.
const STORES = [
  {
    name: 'VTT Centro',
    address: 'Av. Rio Branco, 156 — Centro, Rio de Janeiro/RJ',
    hours: 'Seg a sáb, 6h às 22h',
    phone: '(21) 99999-0001',
  },
  {
    name: 'VTT Zona Sul',
    address: 'Rua Barão de Ipanema, 88 — Copacabana, Rio de Janeiro/RJ',
    hours: 'Seg a sáb, 6h às 22h',
    phone: '(21) 99999-0002',
  },
  {
    name: 'VTT Niterói',
    address: 'Av. Roberto Silveira, 240 — Icaraí, Niterói/RJ',
    hours: 'Seg a sex, 7h às 21h · Sáb, 8h às 14h',
    phone: '(21) 99999-0003',
  },
]

export default function StoresModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fechar">
          <X size={20} />
        </button>

        <h2 className="modal-card__title">Nossas unidades</h2>
        <p className="modal-card__subtitle">Treine com a gente ou venha buscar seu pedido.</p>

        <div className="store-list">
          {STORES.map((store) => (
            <div className="store-item" key={store.name}>
              <MapPin size={20} className="store-item__icon" />
              <div>
                <div className="store-item__name">{store.name}</div>
                <div className="store-item__address">{store.address}</div>
                <div className="store-item__meta">
                  {store.hours} · {store.phone}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
