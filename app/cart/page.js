'use client'
import Link from 'next/link'
import { useCart, unit, dh } from '../../lib/hooks'
export default function Cart() {
  const c = useCart()
  if (!c.items.length) return <div className="card text-center space-y-3"><p>Votre panier est vide.</p><Link href="/products" className="btn">Voir les produits</Link></div>
  return (<div className="space-y-3"><h1 className="text-2xl font-bold">Panier</h1>
    {c.items.map(i => (<div key={i.id} className="card flex gap-3 items-center">
      {i.image_url ? <img src={i.image_url} alt="" className="w-20 h-20 rounded-xl object-cover" /> : <div className="w-20 h-20 rounded-xl bg-green-100 flex items-center justify-center text-3xl">📦</div>}
      <div className="flex-1 min-w-0"><b className="block truncate">{i.name}</b><span>{dh(unit(i))} / {i.unit}</span></div>
      <div className="flex items-center gap-2"><button className="btn2 !px-3 !py-1" onClick={() => c.setQty(i.id, i.qty - 1)}>−</button><b>{i.qty}</b><button className="btn2 !px-3 !py-1" onClick={() => c.setQty(i.id, i.qty + 1)}>+</button></div>
      <button onClick={() => c.remove(i.id)} aria-label="Supprimer">🗑️</button></div>))}
    <div className="card flex justify-between items-center"><b className="text-xl">Total : {dh(c.total)}</b><Link href="/checkout" className="btn">Commander</Link></div></div>)
}
