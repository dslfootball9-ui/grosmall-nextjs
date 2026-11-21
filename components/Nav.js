'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMe, useCart, roleHome } from '../lib/hooks'
import { sb } from '../lib/supabase'
const I = { // simple stroke icons for the bottom navigation
  home: 'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z', grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  cart: 'M2 3h3l2.7 11.5a2 2 0 0 0 2 1.5h7.6a2 2 0 0 0 2-1.5L21 7H6', user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0' }
const Ic = ({ d }) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
export default function Nav() {
  const { user, profile } = useMe(), { count } = useCart(), path = usePathname()
  const [splash, setSplash] = useState(true), [off, setOff] = useState(false)
  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {})
    if (sessionStorage.getItem('gm_splash')) setSplash(false); else { sessionStorage.setItem('gm_splash', '1'); setTimeout(() => setSplash(false), 1300) }
    setOff(!navigator.onLine)
    const goOff = () => { sessionStorage.setItem('gm_off', '1'); setOff(true) }
    const goOn = () => { setOff(false); if (sessionStorage.getItem('gm_off')) { sessionStorage.removeItem('gm_off'); location.reload() } } // reconnect = reload fresh data, cart stays in localStorage
    window.addEventListener('offline', goOff); window.addEventListener('online', goOn)
    return () => { window.removeEventListener('offline', goOff); window.removeEventListener('online', goOn) }
  }, [])
  const acct = user ? roleHome(profile?.role) : '/login'
  const tabs = [['/', 'Accueil', I.home], ['/products', 'Produits', I.grid], ['/cart', 'Panier', I.cart], [acct, user ? 'Compte' : 'Connexion', I.user]]
  return (<>
    {splash && <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center gap-3"><img src="/logo.png" alt="Gros Mall" className="w-32" /><p className="text-[#FFD500] text-3xl font-black">Gros Mall</p></div>}
    {off && <div className="bg-[#FFD500] text-black text-center text-sm font-bold p-1">Hors ligne — votre panier est conservé</div>}
    <header className="bg-black sticky top-0 z-20"><div className="max-w-6xl mx-auto flex items-center justify-between p-3 gap-3">
      <Link href="/" className="flex items-center gap-2"><img src="/logo.png" alt="" className="h-10" /><span className="text-[#FFD500] text-2xl font-black leading-none">Gros<br />Mall</span></Link>
      <div className="flex items-center gap-4 text-[#FFD500]">
        <Link href="/products" className="hidden md:block font-bold">Produits</Link>
        {user && <Link href={acct} className="hidden md:block font-bold">Mon espace</Link>}
        <button aria-label="Notifications" onClick={() => alert('Aucune nouvelle notification')}><svg width="26" height="26" viewBox="0 0 24 24" fill="#FFD500"><path d="M12 22a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22zm7-6v-5a7 7 0 0 0-5.5-6.8v-.7a1.5 1.5 0 0 0-3 0v.7A7 7 0 0 0 5 11v5l-2 2v1h18v-1z" /></svg></button>
        <Link href="/cart" aria-label="Panier" className="relative"><Ic d={I.cart} />{count > 0 && <i className="absolute -top-2 -right-2 bg-[#FFD500] text-black text-xs font-bold not-italic rounded-full px-1.5 ring-2 ring-black">{count}</i>}</Link>
        {user ? <button className="text-sm font-bold border border-[#FFD500] rounded-lg px-2 py-1" onClick={() => sb.auth.signOut().then(() => (location.href = '/'))}>Sortir</button>
          : <Link href="/login" className="hidden md:block bg-[#FFD500] text-black rounded-full px-4 py-1 font-bold">Connexion</Link>}
      </div></div></header>
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-black rounded-t-2xl flex">{tabs.map(([h, l, d]) => (
      <Link key={l} href={h} className={`flex-1 flex flex-col items-center py-2 text-xs ${path === h || (h !== '/' && path.startsWith(h)) ? 'text-[#FFD500] font-bold' : 'text-gray-400'}`}><Ic d={d} />{l}</Link>))}</nav>
  </>)
}
