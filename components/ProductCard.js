import Link from 'next/link'
import { dh } from '../lib/hooks'
export default function ProductCard({ p }) {
  return (
    <Link href={`/products/${p.id}`} className="card !p-0 overflow-hidden block hover:shadow-lg">
      {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full aspect-square object-cover" loading="lazy" />
        : <div className="aspect-square bg-green-100 flex items-center justify-center text-5xl">📦</div>}
      <div className="p-3"><h3 className="font-bold truncate">{p.name}</h3>
        <p className="text-green-700 font-extrabold">{dh(p.price)} <span className="text-xs text-gray-500">/ {p.unit}</span></p>
        {p.wholesale_price && <p className="text-xs text-gray-600">Gros (10+): {dh(p.wholesale_price)}</p>}</div>
    </Link>)
}
