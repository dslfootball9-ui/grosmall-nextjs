'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { sb } from '../../lib/supabase'
export default function Login() {
  const r = useRouter(), [mode, setMode] = useState('login'), [f, setF] = useState({ email: '', password: '', full_name: '', phone: '', city: '', role: 'buyer' })
  const [msg, setMsg] = useState(''), [busy, setBusy] = useState(false), set = k => e => setF({ ...f, [k]: e.target.value })
  async function submit(e) {
    e.preventDefault(); setBusy(true); setMsg('')
    const res = mode === 'login' ? await sb.auth.signInWithPassword({ email: f.email, password: f.password })
      : await sb.auth.signUp({ email: f.email, password: f.password, options: { data: { full_name: f.full_name, phone: f.phone, city: f.city, role: f.role } } })
    setBusy(false)
    if (res.error) return setMsg(res.error.message)
    if (mode === 'signup' && !res.data.session) return setMsg('Compte créé ! Vérifiez votre email pour confirmer, puis connectez-vous.')
    const p = (await sb.from('profiles').select('role').eq('id', res.data.user.id).single()).data
    r.push({ admin: '/admin', seller: '/seller' }[p?.role] || '/buyer')
  }
  return (<form onSubmit={submit} className="card max-w-md mx-auto space-y-3"><h1 className="text-2xl font-bold">{mode === 'login' ? 'Connexion' : 'Créer un compte'}</h1>
    {mode === 'signup' && <><input className="input" required placeholder="Nom complet" value={f.full_name} onChange={set('full_name')} />
      <input className="input" required type="tel" placeholder="Téléphone" value={f.phone} onChange={set('phone')} />
      <input className="input" required placeholder="Ville" value={f.city} onChange={set('city')} />
      <select className="input" value={f.role} onChange={set('role')}><option value="buyer">Acheteur (kan chri)</option><option value="seller">Vendeur (kan tbi3)</option></select></>}
    <input className="input" required type="email" placeholder="Email" value={f.email} onChange={set('email')} />
    <input className="input" required type="password" minLength={6} placeholder="Mot de passe (6+ caractères)" value={f.password} onChange={set('password')} />
    {msg && <p className="text-red-600 text-sm">{msg}</p>}<button className="btn w-full" disabled={busy}>{busy ? '...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}</button>
    <button type="button" className="w-full text-green-700 font-bold" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Pas de compte ? Inscription' : 'Déjà inscrit ? Connexion'}</button></form>)
}
