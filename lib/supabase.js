import { createClient } from '@supabase/supabase-js'
// Publishable (anon) key is safe in the browser; real protection = RLS in supabase.sql
export const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://geiazakjhchfgznnjcxl.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_KEY || 'sb_publishable_qtbxjD5ApmpWhqEfD2WlMg_uaCJh8lu')
const CLOUD = 'fzj3wbmi', PRESET = 'grosmall_preset'
// Cloudinary unsigned upload -> returns the image URL
export async function upload(file) {
  const f = new FormData(); f.append('file', file); f.append('upload_preset', PRESET)
  const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: 'POST', body: f })
  const d = await r.json(); if (!d.secure_url) throw new Error(d.error?.message || 'Upload impossible')
  return d.secure_url
}
