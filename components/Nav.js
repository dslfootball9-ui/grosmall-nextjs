'use client'
import Link from 'next/link'
import { useMe, useCart } from '../lib/hooks'
import { sb } from '../lib/supabase'
export default function Nav() {
  const { user, profile } = useMe(), { count } = useCart()
  const dash = { admin: '/admin', seller: '/seller', buyer: '/buyer' }[profile?.role]
  return (
    <header className="bg-green-700 text-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-3 gap-3 flex-wrap">
        <Link href="/" className="text-2xl font-extrabold">🛒 GrosMall</Link>
        <nav className="flex items-center gap-4 text-sm font-semibold">
          <Link href="/products">Produits</Link><Link href="/cart">Panier ({count})</Link>
          {user ? <>{dash && <Link href={dash}>Mon espace</Link>}<button onClick={() => sb.auth.signOut().then(() => (location.href = '/'))}>Déconnexion</button></>
            : <Link href="/login" className="bg-white text-green-700 rounded-full px-4 py-1">Connexion</Link>}
        </nav>
      </div>
    </header>)
}
