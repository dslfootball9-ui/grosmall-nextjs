'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { sb } from '../../lib/supabase'
import { useCart, useMe, unit, dh } from '../../lib/hooks'
export default function Checkout() {
  const { user, profile, loading } = useMe(), c = useCart(), r = useRouter()
  const [addr, setAddr] = useState(''), [phone, setPhone] = useState(''), [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  useEffect(() => { if (profile) { setPhone(p => p || profile.phone || ''); setAddr(a => a || profile.city || '') } }, [profile])
  if (loading) return <p>Chargement...</p>
  if (!user) return <div className="card text-center space-y-3"><p>Connectez-vous pour commander.</p><Link href="/login" className="btn">Connexion</Link></div>
  if (!c.items.length) return <p>Votre panier est vide.</p>
  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('')
    try {
      const by = {}; c.items.forEach(i => (by[i.seller_id] = by[i.seller_id] || []).push(i)) // one order per seller
      for (const sid in by) {
        const L = by[sid], total = L.reduce((s, i) => s + unit(i) * i.qty, 0)
        const { data: o, error } = await sb.from('orders').insert({ buyer_id: user.id, seller_id: sid, total, status: 'pending', delivery_address: addr, phone }).select().single()
        if (error) throw error
        const { error: e2 } = await sb.from('order_items').insert(L.map(i => ({ order_id: o.id, product_id: i.id, quantity: i.qty, price: unit(i) })))
        if (e2) throw e2
      }
      c.clear(); r.push('/buyer')
    } catch (x) { setErr(x.message); setBusy(false) }
  }
  return (<form onSubmit={submit} className="card max-w-lg mx-auto space-y-3"><h1 className="text-2xl font-bold">Finaliser la commande</h1>
    <p>{c.items.length} article(s) — <b>{dh(c.total)}</b></p>
    <input className="input" required placeholder="Adresse de livraison (ville, quartier, rue)" value={addr} onChange={e => setAddr(e.target.value)} />
    <input className="input" required type="tel" placeholder="Téléphone" value={phone} onChange={e => setPhone(e.target.value)} />
    <p className="text-sm text-gray-600">Paiement à la livraison.</p>
    {err && <p className="text-red-600">{err}</p>}<button className="btn w-full" disabled={busy}>{busy ? '...' : 'Confirmer la commande'}</button></form>)
}
