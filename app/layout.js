import './globals.css'
import Nav from '../components/Nav'
export const metadata = { title: 'GrosMall - Marché de gros au Maroc', description: 'Achetez et vendez des produits alimentaires en gros partout au Maroc' }
export default function Root({ children }) {
  return (<html lang="fr"><body className="bg-green-50 text-gray-900 min-h-screen"><Nav /><main className="max-w-6xl mx-auto p-4">{children}</main>
    <footer className="text-center text-sm text-gray-500 p-6">© GrosMall - Maroc</footer></body></html>)
}
