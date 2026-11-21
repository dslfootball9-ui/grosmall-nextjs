"use client"
import { useState } from "react"

export default function ContactPage() {
  const email = "xlaaz.business@gmail.com"
  const [copied, setCopied] = useState(false)
  const [name, setName] = useState("")
  const [msg, setMsg] = useState("")

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendWhatsApp = () => {
    const text = `Bonjour Gros Mall, je suis ${name} : ${msg}`
    window.open(`https://wa.me/212665800734?text=${encodeURIComponent(text)}`, "_blank")
  }

  return (
    <div style={{ padding: 16, maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ fontSize: 26, fontWeight: "bold" }}>Contact</h1>
      <p style={{ color: "#666", marginTop: 6 }}>Une question ? Contactez-nous.</p>
      <div style={{ background: "#fff", padding: 16, borderRadius: 12, marginTop: 16, border: "1px solid #eee" }}>
        <b>Email</b>
        <p style={{ margin: "8px 0" }}>{email}</p>
        <button onClick={copyEmail} style={{ width: "100%", padding: 12, borderRadius: 10, background: "#000", color: "#FFD500", fontWeight: "bold", border: "none" }}>
          {copied ? "✅ Copié !" : "📋 Copier l'email"}
        </button>
      </div>
      <div style={{ background: "#fff", padding: 16, borderRadius: 12, marginTop: 12, border: "1px solid #eee" }}>
        <b>Envoyer un message</b>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ddd", marginTop: 10 }} />
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Votre message..." rows={4} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ddd", marginTop: 8 }} />
        <button onClick={sendWhatsApp} style={{ width: "100%", padding: 14, borderRadius: 10, background: "#25D366", color: "#fff", fontWeight: "bold", border: "none", marginTop: 8, fontSize: 16 }}>
          Envoyer via WhatsApp
        </button>
      </div>
    </div>
  )
}