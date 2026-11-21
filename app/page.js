'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { sb } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
export default function Home() {
  const [cats, setCats] = useState([]), [prods, setProds] = useState(null)
  useEffect(() => {
    sb.from('categories').select('*').order('name').then(r => setCats(r.data || []))
    sb.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(8).then(r => setProds(r.data || []))
  }, [])
  return (<div className="space-y-8">
    <section className="bg-green-700 text-white rounded-3xl p-8 text-center space-y-4">
      <h1 className="text-3xl md:text-4xl font-extrabold">Salam! Le marché de gros pour tout le Maroc</h1>
      <p>Ach'ri b l-jomla, tbi3 b l-jomla — Livraison partout au Maroc</p>
      <form action="/products" className="flex gap-2 max-w-xl mx-auto"><input name="q" className="input !text-gray-900" placeholder="Chercher un produit (huile, farine, thé...)" /><button className="btn !bg-yellow-400 !text-black">Chercher</button></form>
    </section>
    <section><h2 className="text-2xl font-bold mb-3">Catégories</h2>
      {cats.length ? <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{cats.map(c => (
        <Link key={c.id} href={`/products?cat=${c.id}`} className="card text-center font-bold hover:shadow-lg">
          {c.image ? <img src={c.image} alt="" className="h-20 mx-auto object-cover rounded-xl mb-2" /> : <div className="text-4xl">🛍️</div>}{c.name}</Link>))}</div> : <p>Aucune catégorie.</p>}</section>
    <section><h2 className="text-2xl font-bold mb-3">Produits en vedette</h2>
      {prods === null ? <p>Chargement...</p> : prods.length ? <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{prods.map(p => <ProductCard key={p.id} p={p} />)}</div> : <p>Aucun produit pour le moment.</p>}</section>
  </div>)
}
