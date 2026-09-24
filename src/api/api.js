import axios from 'axios'

// Troque VITE_API_URL no .env quando for apontar para a API real.
// Enquanto isso, roda contra o mock local (json-server + db.json).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000,
})

export async function getProducts({ category } = {}) {
  const { data } = await api.get('/products', {
    params: category && category !== 'Todos' ? { category } : {},
  })
  return data
}

export async function getProductById(id) {
  const { data } = await api.get(`/products/${id}`)
  return data
}

export async function getCategories() {
  const products = await getProducts()
  return [...new Set(products.map((p) => p.category))]
}

// ---------- Pedidos ----------

// Agora grava de verdade no mock (json-server). Troque por POST /orders
// na sua API real quando tiver backend de pedidos de produção.
export async function submitOrder({ userId, customer, items, total }) {
  const { data } = await api.post('/orders', {
    userId: userId || null,
    customer,
    items,
    total,
    status: 'confirmado',
    createdAt: new Date().toISOString(),
  })
  return data
}

export async function getOrdersByUser(userId) {
  const { data } = await api.get('/orders', { params: { userId } })
  return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

// ---------- Autenticação ----------
//
// AVISO IMPORTANTE: isto é um mock de autenticação para desenvolvimento.
// O json-server guarda a senha em texto puro e não faz hash nem emite
// token de sessão de verdade — não use isso em produção. Quando plugar
// sua API real, troque por um backend que faça hash de senha (ex.
// bcrypt) e autenticação por token (JWT/sessão), nunca comparando senha
// em texto puro como aqui.

export async function registerUser({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase()

  const { data: existing } = await api.get('/users', {
    params: { email: normalizedEmail },
  })
  if (existing.length > 0) {
    throw new Error('Já existe uma conta com esse e-mail.')
  }

  const { data: user } = await api.post('/users', {
    name,
    email: normalizedEmail,
    password, // texto puro só porque é mock local — nunca faça isso em produção
    createdAt: new Date().toISOString(),
  })

  return sanitizeUser(user)
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase()

  const { data: matches } = await api.get('/users', {
    params: { email: normalizedEmail, password },
  })

  if (matches.length === 0) {
    throw new Error('E-mail ou senha incorretos.')
  }

  return sanitizeUser(matches[0])
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user
  return safeUser
}

export default api

