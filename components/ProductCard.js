'use client'
import { useState } from 'react'
import { dh } from '../lib/hooks'
import OrderModal from './OrderModal'
// Acheter is a <button>, never a link. If the page passes onBuy, the page owns the popup; otherwise the card opens its own.
export default function ProductCard({ p, onBuy }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card !p-0 overflow-hidden">
      {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full aspect-square object-cover" loading="lazy" />
        : <div className="aspect-square bg-green-100 flex items-center justify-center text-5xl">📦</div>}
      <div className="p-3"><h3 className="font-bold truncate">{p.name}</h3>
        <p className="text-black font-extrabold text-lg">{dh(p.price)} <span className="text-xs text-gray-500 font-normal">/ {p.unit}</span></p>
        {p.wholesale_price && <p className="text-xs text-gray-600">Gros (10+): {dh(p.wholesale_price)}</p>}
        <button type="button" className="mt-2 w-full bg-[#FFD500] text-black font-bold rounded-lg py-2" onClick={() => (onBuy ? onBuy(p) : setOpen(true))}>Acheter</button></div>
      {open && !onBuy && <OrderModal p={p} onClose={() => setOpen(false)} />}
    </div>)
}
