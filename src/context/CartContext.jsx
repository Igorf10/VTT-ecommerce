import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'vtt_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        )
      }
      return [...prev, { ...product, qty }]
    })
  }

  function updateQty(id, qty) {
    if (qty < 1) return
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  )

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * i.price, 0),
    [items]
  )

  const value = {
    items,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    totalItems,
    subtotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart precisa estar dentro de <CartProvider>')
  return ctx
}
