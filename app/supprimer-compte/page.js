'use client'
import { useState } from 'react'
import Link from 'next/link'
import { sb } from '../../lib/supabase'
import { useMe } from '../../lib/hooks'
export default function Delete() {
  const { user, loading } = useMe(), [msg, setMsg] = useState(''), [busy, setBusy] = useState(false)
  async function del() {
    if (!confirm('Supprimer définitivement votre compte et toutes vos données ?')) return
    setBusy(true); const { error } = await sb.rpc('delete_my_account')
    if (error) { setMsg(error.message); setBusy(false); return }
    await sb.auth.signOut(); location.href = '/'
  }
  return (<div className="card max-w-lg mx-auto space-y-3"><h1 className="text-2xl font-black">Supprimer mon compte</h1>
    <p>Cette action supprime définitivement votre compte, votre profil, vos produits et vos commandes. Elle est irréversible.</p>
    {loading ? <p>Chargement...</p> : user ? <><button className="btn w-full" disabled={busy} onClick={del}>{busy ? '...' : 'Supprimer définitivement mon compte'}</button>{msg && <p className="font-bold">{msg}</p>}</>
      : <><p>Connectez-vous pour supprimer votre compte vous-même.</p><Link href="/login" className="btn w-full">Connexion</Link></>}
    <p className="text-sm text-gray-600">Vous ne pouvez pas vous connecter ? Écrivez à <a className="underline font-bold" href="mailto:xlaaz.business@gmail.com">contact@grosmall.ma</a>.</p></div>)
}
