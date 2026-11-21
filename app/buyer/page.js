'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { sb } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { useMe, STATUS, dh, roleHome } from '../../lib/hooks'
export default function Buyer() {
  const { user, profile, loading } = useMe(), [o, setO] = useState(null), rt = useRouter()
  useEffect(() => { if (user) sb.from('orders').select('*, order_items(quantity,price,products(name))').eq('buyer_id', user.id).order('created_at', { ascending: false }).then(r => setO(r.data || [])) }, [user])
  useEffect(() => { if (loading) return; if (!user) rt.replace('/login'); else if (profile && profile.role !== 'buyer') rt.replace(roleHome(profile.role)) }, [loading, user, profile])
  if (loading) return <p>Chargement...</p>
  if (!user) return <Link href="/login" className="btn">Connexion</Link>
  return (<div className="space-y-3"><h1 className="text-2xl font-bold">Mes commandes</h1>
    {o === null ? <p>Chargement...</p> : !o.length ? <p>Aucune commande.</p> : o.map(x => (<div key={x.id} className="card space-y-1">
      <div className="flex justify-between"><b>{dh(x.total)}</b><span className="bg-green-100 text-green-800 rounded-full px-3 text-sm font-bold">{STATUS[x.status]}</span></div>
      <p className="text-sm">{(x.order_items || []).map(i => `${i.products?.name || 'Produit'} ×${i.quantity}`).join(', ')}</p>
      <p className="text-xs text-gray-500">{new Date(x.created_at).toLocaleDateString('fr-FR')} • {x.delivery_address}</p></div>))}</div>)
}
