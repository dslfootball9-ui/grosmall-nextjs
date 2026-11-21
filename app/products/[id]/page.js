'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { sb } from '../../../lib/supabase'
import { useCart, dh } from '../../../lib/hooks'
export default function Detail() {
  const { id } = useParams(), r = useRouter(), cart = useCart()
  const [p, setP] = useState(undefined), [q, setQ] = useState(1)
  useEffect(() => { sb.from('products').select('*, categories(name)').eq('id', id).maybeSingle().then(x => setP(x.data)) }, [id])
  if (p === undefined) return <p>Chargement...</p>
  if (!p) return <p>Produit introuvable.</p>
  return (<div className="grid md:grid-cols-2 gap-6">
    {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full rounded-2xl" /> : <div className="aspect-square bg-green-100 rounded-2xl flex items-center justify-center text-7xl">📦</div>}
    <div className="space-y-3"><h1 className="text-3xl font-extrabold">{p.name}</h1><p className="text-gray-600">{p.categories?.name}</p>
      <p className="text-2xl text-green-700 font-extrabold">{dh(p.price)} <span className="text-sm text-gray-500">/ {p.unit}</span></p>
      {p.wholesale_price && <p className="font-bold">Prix de gros (10+ {p.unit}) : {dh(p.wholesale_price)}</p>}
      <p>Stock : {p.stock > 0 ? `${p.stock} ${p.unit}` : 'Rupture de stock'}</p><p className="whitespace-pre-line">{p.description}</p>
      {p.stock > 0 && <><input className="input" type="number" min="1" max={p.stock} value={q} onChange={e => setQ(Math.max(1, +e.target.value || 1))} />
        <button className="btn w-full" onClick={() => { cart.add(p, q); r.push('/cart') }}>Ajouter au panier</button></>}</div></div>)
}
