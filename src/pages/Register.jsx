import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [status, setStatus] = useState('idle')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('As senhas não conferem.')
      return
    }
    if (form.password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    setStatus('sending')
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Não foi possível criar a conta.')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <div className="container checkout-page">
      <h1 className="section__title">Criar conta</h1>
      <p className="section__hint">Cadastre-se pra acompanhar seus pedidos na VTT.</p>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nome completo</label>
          <input id="name" name="name" required value={form.name} onChange={handleChange} />
        </div>

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

        <div className="form-row">
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
          <div>
            <label htmlFor="confirmPassword">Confirmar senha</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <p className="form-footnote">
        Já tem conta? <Link to="/entrar">Entrar</Link>
      </p>
    </div>
  )
}
