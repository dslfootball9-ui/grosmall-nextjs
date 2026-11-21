'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { sb } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import OrderModal from '../components/OrderModal'
export default function Home() {
  const [cats, setCats] = useState([]), [prods, setProds] = useState(null), [selectedProduct, setSelectedProduct] = useState(null)
  useEffect(() => {
    sb.from('categories').select('*').order('name').then(r => setCats(r.data || []))
    sb.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(8).then(r => setProds(r.data || []))
  }, [])
  return (<div className="space-y-5">
    <form action="/products" className="flex items-center gap-2 bg-white border-2 border-black rounded-full px-4 shadow">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFD500" strokeWidth="3" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
      <input name="q" className="flex-1 py-3 bg-transparent outline-none min-w-0" placeholder="Rechercher produits, catégories..." /></form>
    <div className="flex gap-2 overflow-x-auto pb-1"><Link href="/products" className="chip on">Tous</Link>{cats.map(c => <Link key={c.id} href={`/products?cat=${c.id}`} className="chip">{c.name}</Link>)}</div>
    <div className="bg-[#FFD500] text-black rounded-2xl p-5"><b className="block text-2xl font-black">OFFRES GROS PRIX</b><span className="text-sm">Jusqu'à -30% sur les achats en gros • Livraison partout au Maroc</span></div>
    <section><h2 className="text-2xl font-bold mb-3">Produits populaires</h2>
      {prods === null ? <p>Chargement...</p> : prods.length ? <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{prods.map(p => <ProductCard key={p.id} p={p} onBuy={setSelectedProduct} />)}</div> : <p>Aucun produit pour le moment.</p>}</section>
    {selectedProduct && <OrderModal p={selectedProduct} onClose={() => setSelectedProduct(null)} />}
  </div>)
}
