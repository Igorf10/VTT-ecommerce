import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container">
      <div className="state-block">
        <strong>404 — Fora do tatame.</strong>
        Essa página não existe.
        <div style={{ marginTop: 20 }}>
          <Link to="/" className="btn btn-primary">
            Voltar pra loja
          </Link>
        </div>
      </div>
    </div>
  )
}
