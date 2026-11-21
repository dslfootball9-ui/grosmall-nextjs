'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { sb, upload } from '../../lib/supabase'
import { useMe, STATUS, dh } from '../../lib/hooks'
const EMPTY = { name: '', description: '', category_id: '', price: '', wholesale_price: '', stock: '', unit: 'kg', image_url: '' }
export default function Seller() {
  const { user, profile, loading } = useMe()
  const [cats, setCats] = useState([]), [mine, setMine] = useState([]), [orders, setOrders] = useState([]), [f, setF] = useState(EMPTY), [file, setFile] = useState(null), [msg, setMsg] = useState(''), [busy, setBusy] = useState(false)
  const set = k => e => setF({ ...f, [k]: e.target.value })
  async function load() {
    sb.from('categories').select('*').order('name').then(r => setCats(r.data || []))
    sb.from('products').select('*').eq('seller_id', user.id).order('created_at', { ascending: false }).then(r => setMine(r.data || []))
    sb.from('orders').select('*, order_items(quantity,price,products(name))').eq('seller_id', user.id).order('created_at', { ascending: false }).then(r => setOrders(r.data || []))
  }
  useEffect(() => { if (user) load() }, [user])
  if (loading) return <p>Chargement...</p>
  if (!user || !['seller', 'admin'].includes(profile?.role)) return <div className="card"><p>Espace réservé aux vendeurs.</p><Link href="/login" className="btn mt-3">Connexion</Link></div>
  async function save(e) {
    e.preventDefault(); setBusy(true); setMsg('')
    try {
      const image_url = file ? await upload(file) : f.image_url // Cloudinary unsigned upload
      const body = { name: f.name, description: f.description, category_id: f.category_id || null, price: +f.price, wholesale_price: f.wholesale_price ? +f.wholesale_price : null, stock: +f.stock || 0, unit: f.unit, image_url }
      const { error } = f.id ? await sb.from('products').update(body).eq('id', f.id) : await sb.from('products').insert({ ...body, seller_id: user.id, is_active: true })
      if (error) throw error
      setF(EMPTY); setFile(null); setMsg('Produit enregistré ✔'); load()
    } catch (x) { setMsg(x.message) }
    setBusy(false)
  }
  const del = async id => { if (confirm('Supprimer ce produit ?')) { await sb.from('products').delete().eq('id', id); load() } }
  const status = async (id, s) => { await sb.from('orders').update({ status: s }).eq('id', id); load() }
  return (<div className="space-y-6"><h1 className="text-2xl font-bold">Espace vendeur</h1>
    <form onSubmit={save} className="card grid md:grid-cols-2 gap-2"><h2 className="md:col-span-2 font-bold">{f.id ? 'Modifier le produit' : 'Ajouter un produit'}</h2>
      <input className="input" required placeholder="Nom du produit" value={f.name} onChange={set('name')} />
      <select className="input" value={f.category_id || ''} onChange={set('category_id')}><option value="">Catégorie</option>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <input className="input" required type="number" min="0" step="0.01" placeholder="Prix (DH)" value={f.price} onChange={set('price')} />
      <input className="input" type="number" min="0" step="0.01" placeholder="Prix de gros (DH)" value={f.wholesale_price || ''} onChange={set('wholesale_price')} />
      <input className="input" required type="number" min="0" placeholder="Stock" value={f.stock} onChange={set('stock')} />
      <select className="input" value={f.unit} onChange={set('unit')}><option value="kg">kg</option><option value="box">box (caisse)</option><option value="pack">pack</option></select>
      <textarea className="input md:col-span-2" rows="3" placeholder="Description" value={f.description || ''} onChange={set('description')} />
      <input className="input md:col-span-2" type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
      {f.image_url && !file && <img src={f.image_url} alt="" className="h-20 rounded-xl" />}
      {msg && <p className="md:col-span-2 text-sm">{msg}</p>}
      <button className="btn md:col-span-2" disabled={busy}>{busy ? 'Envoi...' : f.id ? 'Enregistrer' : 'Publier'}</button>
      {f.id && <button type="button" className="btn2 md:col-span-2" onClick={() => { setF(EMPTY); setFile(null) }}>Annuler</button>}</form>
    <section><h2 className="text-xl font-bold mb-2">Mes produits ({mine.length})</h2>{mine.length ? mine.map(p => (<div key={p.id} className="card flex gap-3 items-center mb-2">
      {p.image_url ? <img src={p.image_url} alt="" className="w-16 h-16 rounded-xl object-cover" /> : <div className="w-16 h-16 bg-green-100 rounded-xl" />}
      <div className="flex-1 min-w-0"><b className="block truncate">{p.name}</b><span className="text-sm">{dh(p.price)} • stock {p.stock}</span></div>
      <button className="btn2" onClick={() => { setF({ ...p, price: p.price, stock: p.stock }); window.scrollTo(0, 0) }}>Modifier</button><button className="btn2 !border-red-500 !text-red-600" onClick={() => del(p.id)}>Supprimer</button></div>)) : <p>Aucun produit.</p>}</section>
    <section><h2 className="text-xl font-bold mb-2">Commandes reçues ({orders.length})</h2>{orders.length ? orders.map(o => (<div key={o.id} className="card mb-2 space-y-1">
      <div className="flex justify-between gap-2"><b>{dh(o.total)}</b><select className="input !w-auto !p-1" value={o.status} onChange={e => status(o.id, e.target.value)}>{Object.keys(STATUS).map(s => <option key={s} value={s}>{STATUS[s]}</option>)}</select></div>
      <p className="text-sm">{(o.order_items || []).map(i => `${i.products?.name || 'Produit'} ×${i.quantity}`).join(', ')}</p><p className="text-sm">📍 {o.delivery_address} • 📞 <a className="underline" href={`tel:${o.phone}`}>{o.phone}</a></p></div>)) : <p>Aucune commande.</p>}</section></div>)
}
