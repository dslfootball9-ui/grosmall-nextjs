'use client'
import { useEffect, useState } from 'react'
import { sb, upload } from '../../lib/supabase'
import { useMe, dh } from '../../lib/hooks'
export default function Admin() {
  const { user, profile, loading } = useMe(), [tab, setTab] = useState('users'), [users, setUsers] = useState([]), [cats, setCats] = useState([]), [prods, setProds] = useState([])
  const [name, setName] = useState(''), [file, setFile] = useState(null), [msg, setMsg] = useState('')
  const load = () => {
    sb.from('profiles').select('*').order('created_at', { ascending: false }).then(r => setUsers(r.data || []))
    sb.from('categories').select('*').order('name').then(r => setCats(r.data || []))
    sb.from('products').select('*').order('created_at', { ascending: false }).then(r => setProds(r.data || []))
  }
  useEffect(() => { if (profile?.role === 'admin') load() }, [profile])
  if (loading) return <p>Chargement...</p>
  if (profile?.role !== 'admin') return <p className="card">Accès réservé à l'administrateur.</p>
  async function addCat(e) { e.preventDefault(); try { const image = file ? await upload(file) : null; const { error } = await sb.from('categories').insert({ name, image }); if (error) throw error; setName(''); setFile(null); setMsg(''); load() } catch (x) { setMsg(x.message) } }
  const act = async (q) => { const { error } = await q; if (error) alert(error.message); load() }
  return (<div className="space-y-4"><h1 className="text-2xl font-bold">Administration</h1>
    <div className="flex gap-2">{[['users', 'Utilisateurs'], ['cats', 'Catégories'], ['prods', 'Produits']].map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={tab === k ? 'btn' : 'btn2'}>{l}</button>)}</div>
    {tab === 'users' && users.map(u => (<div key={u.id} className="card flex justify-between items-center gap-2 flex-wrap"><div className="min-w-0"><b>{u.full_name || u.email}</b><p className="text-sm text-gray-600">{u.email} • {u.phone} • {u.city}</p></div>
      <select className="input !w-auto" value={u.role} disabled={u.id === user.id} onChange={e => act(sb.from('profiles').update({ role: e.target.value }).eq('id', u.id))}><option value="buyer">buyer</option><option value="seller">seller</option><option value="admin">admin</option></select></div>))}
    {tab === 'cats' && <><form onSubmit={addCat} className="card flex gap-2 flex-wrap"><input className="input !w-auto flex-1" required placeholder="Nom de la catégorie" value={name} onChange={e => setName(e.target.value)} /><input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} /><button className="btn">Ajouter</button>{msg && <p className="text-red-600 w-full">{msg}</p>}</form>
      {cats.map(c => (<div key={c.id} className="card flex justify-between items-center"><span>{c.image && <img src={c.image} alt="" className="inline h-10 rounded mr-2" />}{c.name}</span><button className="text-red-600 font-bold" onClick={() => confirm('Supprimer ?') && act(sb.from('categories').delete().eq('id', c.id))}>Supprimer</button></div>))}</>}
    {tab === 'prods' && prods.map(p => (<div key={p.id} className="card flex justify-between items-center gap-2"><div className="min-w-0"><b className="block truncate">{p.name}</b><span className="text-sm">{dh(p.price)} • stock {p.stock}</span></div>
      <div className="flex gap-2"><button className="btn2" onClick={() => act(sb.from('products').update({ is_active: !p.is_active }).eq('id', p.id))}>{p.is_active ? 'Masquer' : 'Activer'}</button><button className="btn2 !border-red-500 !text-red-600" onClick={() => confirm('Supprimer ?') && act(sb.from('products').delete().eq('id', p.id))}>X</button></div></div>))}</div>)
}
