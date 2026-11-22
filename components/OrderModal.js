'use client'
import { useEffect, useState } from 'react'
import { dh } from '../lib/hooks'
import { WHATSAPP_NUMBER } from '../lib/config'
// Popup order form: builds the WhatsApp message from the real product name and price
export default function OrderModal({ p, onClose }) {
  const [f, setF] = useState({ name: '', phone: '', city: '', address: '', qty: 1 })
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const qty = Math.max(1, parseInt(f.qty) || 1), total = Math.round(Number(p.price) * qty * 100) / 100
  useEffect(() => { const k = e => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [onClose])
  function send(e) {
    e.preventDefault()
    const text = `Bonjour, je veux commander:\n- Produit: ${p.name}\n- Prix: ${p.price} MAD\n- Quantité: ${qty}\n- Total: ${total} MAD\n- Nom: ${f.name.trim()}\n- Téléphone: ${f.phone.trim()}\n- Ville: ${f.city.trim()}\n- Adresse: ${f.address.trim()}`
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <form onSubmit={send} onClick={e => e.stopPropagation()} className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl p-5 space-y-2 max-h-[92vh] overflow-y-auto text-left" role="dialog" aria-modal="true">
        <div className="flex justify-between items-start gap-2"><div className="min-w-0"><h2 className="text-xl font-black truncate">{p.name}</h2><p className="font-bold">{dh(p.price)} <span className="text-sm text-gray-500 font-normal">/ {p.unit}</span></p></div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="text-2xl font-bold px-2">✕</button></div>
        <input className="input" required placeholder="Nom complet" value={f.name} onChange={set('name')} />
        <input className="input" required type="tel" placeholder="Téléphone" value={f.phone} onChange={set('phone')} />
        <input className="input" required placeholder="Ville" value={f.city} onChange={set('city')} />
        <input className="input" required placeholder="Adresse" value={f.address} onChange={set('address')} />
        <label className="block font-bold text-sm">Quantité<input className="input mt-1" type="number" min="1" value={f.qty} onChange={set('qty')} /></label>
        <p className="font-black text-lg">Total : {dh(total)}</p>
        <button className="w-full rounded-xl bg-[#25D366] text-white font-bold py-3 text-lg">Commander sur WhatsApp</button>
      </form>
    </div>)
}
