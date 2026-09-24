import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../api/api.js'
import ProductCard from '../components/ProductCard.jsx'
import BenefitsBar from '../components/BenefitsBar.jsx'
import BrandCarousel from '../components/BrandCarousel.jsx'

export default function Home() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [onlyPromo, setOnlyPromo] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const searchTerm = searchParams.get('busca') || ''

  useEffect(() => {
    let cancelled = false

    async function load() {
      setStatus('loading')
      try {
        const data = await getProducts()
        if (!cancelled) {
          setProducts(data)
          setStatus('ready')
        }
      } catch (err) {
        if (!cancelled) setStatus('error')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.category))]
    return ['Todos', ...unique]
  }, [products])

  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean))],
    [products]
  )
  const activeBrand = searchParams.get('marca') || null

  const promoCount = useMemo(
    () => products.filter((p) => p.oldPrice && p.oldPrice > p.price).length,
    [products]
  )

  const visibleProducts = useMemo(() => {
    let list = products
    if (activeCategory !== 'Todos') {
      list = list.filter((p) => p.category === activeCategory)
    }
    if (onlyPromo) {
      list = list.filter((p) => p.oldPrice && p.oldPrice > p.price)
    }
    if (activeBrand) {
      list = list.filter((p) => p.brand === activeBrand)
    }
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase()
      list = list.filter(
        (p) =>
          p.description.toLowerCase().includes(term) ||
          p.name.toLowerCase().includes(term)
      )
    }
    return list
  }, [products, activeCategory, onlyPromo, activeBrand, searchTerm])

  function selectBrand(brand) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (brand) {
        next.set('marca', brand)
      } else {
        next.delete('marca')
      }
      return next
    })
  }

  function clearSearch() {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('busca')
      return next
    })
  }

  return (
    <>
      <section className="hero">
        <img
          src="/hero-fight-bg.webp"
          alt=""
          aria-hidden="true"
          className="hero__bg"
        />
        <div className="hero__overlay" aria-hidden="true" />
        <div className="container hero__grid">
          <div>
            <p className="hero__eyebrow">Academia VTT · Vale Tudo Team</p>
            <h1 className="hero__title">
              Equipamento de quem <span>treina pra valer</span>.
            </h1>
            <p className="hero__text">
              Luvas, kimonos, proteção e suplementação usados pelos nossos
              lutadores dentro do próprio tatame. Sem enrolação, direto pro treino.
            </p>
            <a href="#produtos" className="btn btn-primary">
              Ver produtos
            </a>
          </div>

          <div className="hero__stat">
            <div className="hero__stat-number">12+</div>
            <div className="hero__stat-label">anos formando atletas de MMA e Jiu-Jitsu</div>
            <ul className="hero__stat-list">
              <li>Equipamento testado em sparring real</li>
              <li>Suplementação com formulação própria</li>
              <li>Entrega pra todo o Brasil</li>
            </ul>
          </div>
        </div>
      </section>

      <BenefitsBar />

      {brands.length > 0 && (
        <BrandCarousel brands={brands} activeBrand={activeBrand} onSelect={selectBrand} />
      )}

      <section className="section container" id="produtos">
        <div className="section__head">
          <h2 className="section__title">Loja VTT</h2>
          <p className="section__hint">
            Produtos consumidos direto da nossa API — estoque e preço sempre atualizados.
          </p>
        </div>

        {searchTerm && (
          <div className="search-active">
            Resultados para <strong>"{searchTerm}"</strong>
            <button onClick={clearSearch}>Limpar busca</button>
          </div>
        )}

        {activeBrand && (
          <div className="search-active">
            Marca: <strong>{activeBrand}</strong>
            <button onClick={() => selectBrand(null)}>Limpar filtro</button>
          </div>
        )}

        {status === 'ready' && (categories.length > 1 || promoCount > 0) && (
          <div className="category-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}

            {promoCount > 0 && (
              <button
                className={`category-chip category-chip--promo ${onlyPromo ? 'active' : ''}`}
                onClick={() => setOnlyPromo((v) => !v)}
              >
                🔥 Em promoção ({promoCount})
              </button>
            )}
          </div>
        )}

        {status === 'loading' && (
          <div className="state-block">
            <strong>Carregando arsenal...</strong>
            Buscando os produtos na API.
          </div>
        )}

        {status === 'error' && (
          <div className="state-block">
            <strong>Não rolou conectar na API.</strong>
            Confirme se o mock está no ar: <code>npm run server</code>
          </div>
        )}

        {status === 'ready' && visibleProducts.length === 0 && (
          <div className="state-block">
            <strong>Nada por aqui ainda.</strong>
            {searchTerm
              ? 'Nenhum produto bate com essa busca.'
              : activeBrand
              ? 'Nenhum produto dessa marca nessa categoria agora.'
              : onlyPromo
              ? 'Nenhum produto em promoção nessa categoria agora.'
              : 'Nenhum produto encontrado nessa categoria.'}
          </div>
        )}

        {status === 'ready' && visibleProducts.length > 0 && (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
