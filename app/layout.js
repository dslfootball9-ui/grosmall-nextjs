import './globals.css'
import Link from 'next/link'
import Nav from '../components/Nav'
export const metadata = { title: 'Gros Mall - Marché de gros au Maroc', description: 'Achetez et vendez des produits alimentaires en gros partout au Maroc',
  manifest: '/manifest.json', icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' }, appleWebApp: { capable: true, title: 'Gros Mall', statusBarStyle: 'black' } }
export const viewport = { themeColor: '#111111', width: 'device-width', initialScale: 1 }
export default function Root({ children }) {
  return (<html lang="fr"><body className="bg-[#F8F8F8] text-gray-900 min-h-screen pb-20 md:pb-0"><Nav />
    <main className="max-w-6xl mx-auto p-4 min-h-[60vh]">{children}</main>
    <footer className="bg-black text-gray-300 text-sm p-6 text-center space-y-2"><p className="text-[#FFD500] font-black text-lg">Gros Mall</p>
      <p className="flex flex-wrap justify-center gap-x-4 gap-y-1"><Link href="/privacy-policy">Confidentialité</Link><Link href="/conditions-generales">Conditions</Link><a href="mailto:contact@grosmall.ma">Contact</a><Link href="/supprimer-compte">Supprimer mon compte</Link></p>
      <p>© Gros Mall - Maroc</p></footer></body></html>)
}
