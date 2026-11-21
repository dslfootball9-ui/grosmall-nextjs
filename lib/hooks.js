'use client'
import { useEffect, useState } from 'react'
import { sb } from './supabase'
export const STATUS = { pending: 'En attente', confirmed: 'Confirmée', delivered: 'Livrée', cancelled: 'Annulée' }
export const dh = n => `${Number(n || 0).toLocaleString('fr-FR')} DH`
export const unit = i => (i.wholesale_price && i.qty >= 10 ? i.wholesale_price : i.price) // wholesale price from 10 units
export function useMe() {
  const [s, set] = useState({ user: null, profile: null, loading: true })
  useEffect(() => {
    let on = true
    async function load(u) {
      let p = null
      if (u) p = (await sb.from('profiles').select('*').eq('id', u.id).single()).data
      on && set({ user: u || null, profile: p, loading: false })
    }
    sb.auth.getSession().then(({ data }) => load(data.session?.user))
    const { data: l } = sb.auth.onAuthStateChange((_, se) => load(se?.user))
    return () => { on = false; l.subscription.unsubscribe() }
  }, [])
  return s
}
export function useCart() {
  const [items, set] = useState([])
  const read = () => { try { return JSON.parse(localStorage.getItem('gm_cart') || '[]') } catch { return [] } }
  useEffect(() => { set(read()); const f = () => set(read()); window.addEventListener('gm_cart', f); return () => window.removeEventListener('gm_cart', f) }, [])
  const save = l => { localStorage.setItem('gm_cart', JSON.stringify(l)); window.dispatchEvent(new Event('gm_cart')) }
  return {
    items, count: items.reduce((s, i) => s + i.qty, 0), total: items.reduce((s, i) => s + unit(i) * i.qty, 0),
    add: (p, q = 1) => { const l = read(), x = l.find(i => i.id === p.id); x ? (x.qty = Math.min(x.qty + q, p.stock || 9999)) : l.push({ id: p.id, name: p.name, price: p.price, wholesale_price: p.wholesale_price, image_url: p.image_url, seller_id: p.seller_id, stock: p.stock, unit: p.unit, qty: q }); save(l) },
    setQty: (id, q) => save(read().map(i => i.id === id ? { ...i, qty: Math.max(1, Math.min(q, i.stock || 9999)) } : i)),
    remove: id => save(read().filter(i => i.id !== id)), clear: () => save([])
  }
}
