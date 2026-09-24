import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setStatus('sending')
    try {
      await login(form)
      const redirectTo = location.state?.from || '/'
      navigate(redirectTo)
    } catch (err) {
      setError(err.message || 'Não foi possível entrar.')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <div className="container checkout-page">
      <h1 className="section__title">Entrar</h1>
      <p className="section__hint">Acesse sua conta pra ver seus pedidos na VTT.</p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="form-footnote">
        Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </div>
  )
}
