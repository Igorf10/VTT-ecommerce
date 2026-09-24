import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function BrandCarousel({ brands, activeBrand, onSelect }) {
  const trackRef = useRef(null)

  function scroll(direction) {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * 260, behavior: 'smooth' })
  }

  if (brands.length === 0) return null

  return (
    <div className="brand-carousel">
      <div className="container">
        <h2 className="brand-carousel__title">Escolha pela marca</h2>

        <div className="brand-carousel__row">
          <button
            className="brand-carousel__arrow"
            onClick={() => scroll(-1)}
            aria-label="Marcas anteriores"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="brand-carousel__track" ref={trackRef}>
            {brands.map((brand) => (
              <button
                key={brand}
                className={`brand-chip ${activeBrand === brand ? 'active' : ''}`}
                onClick={() => onSelect(activeBrand === brand ? null : brand)}
              >
                {brand}
              </button>
            ))}
          </div>

          <button
            className="brand-carousel__arrow"
            onClick={() => scroll(1)}
            aria-label="Próximas marcas"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
