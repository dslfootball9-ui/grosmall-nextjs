'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { sb } from '../../lib/supabase'
import ProductCard from '../../components/ProductCard'
function List() {
  const sp = useSearchParams()
  const [q, setQ] = useState(sp.get('q') || ''), [cat, setCat] = useState(sp.get('cat') || ''), [min, setMin] = useState(''), [max, setMax] = useState('')
  const [cats, setCats] = useState([]), [rows, setRows] = useState(null)
  useEffect(() => { sb.from('categories').select('*').order('name').then(r => setCats(r.data || [])) }, [])
  useEffect(() => {
    let x = sb.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false })
    if (q) x = x.ilike('name', `%${q}%`); if (cat) x = x.eq('category_id', cat); if (min) x = x.gte('price', min); if (max) x = x.lte('price', max)
    x.then(r => setRows(r.data || []))
  }, [q, cat, min, max])
  return (<div className="space-y-4"><h1 className="text-2xl font-bold">Produits</h1>
    <div className="card grid md:grid-cols-4 gap-2">
      <input className="input" placeholder="Rechercher..." value={q} onChange={e => setQ(e.target.value)} />
      <select className="input" value={cat} onChange={e => setCat(e.target.value)}><option value="">Toutes les catégories</option>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <input className="input" type="number" min="0" placeholder="Prix min (DH)" value={min} onChange={e => setMin(e.target.value)} />
      <input className="input" type="number" min="0" placeholder="Prix max (DH)" value={max} onChange={e => setMax(e.target.value)} /></div>
    {rows === null ? <p>Chargement...</p> : rows.length ? <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{rows.map(p => <ProductCard key={p.id} p={p} />)}</div> : <p>Aucun produit trouvé.</p>}</div>)
}
export default function Page() { return <Suspense fallback={<p>Chargement...</p>}><List /></Suspense> }
