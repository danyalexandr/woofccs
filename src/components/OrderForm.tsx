'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Product } from '@/lib/supabase'  // ← tipo desde supabase

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl ? createClient(supabaseUrl, supabaseKey) : null

interface FormData {
  name: string
  phone: string
  email: string
  address: string
  products: string
}

interface Props {
  pendingItem: { product: Product; qty: number } | null
  onClear: () => void
}

const INITIAL: FormData = { name: '', phone: '', email: '', address: '', products: '' }

export default function OrderForm({ pendingItem, onClear }: Props) {
  const [form, setForm] = useState<FormData>(INITIAL)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  // Recibe producto desde el modal y pre-llena el campo
  useEffect(() => {
    if (!pendingItem) return
    const line = `${pendingItem.product.name} (${pendingItem.product.weight_kg}kg) x${pendingItem.qty}`
    setForm(f => ({
      ...f,
      products: f.products ? `${f.products}\n${line}` : line,
    }))
    onClear()
  }, [pendingItem])

  const update = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.products) {
      setError('Por favor completa los campos obligatorios.')
      return
    }
    setError('')
    setStatus('loading')
    try {
      if (supabase) {
        const { error: dbError } = await supabase.from('orders').insert([{
          ...form,
          created_at: new Date().toISOString(),
          status: 'pending',
        }])
        if (dbError) throw dbError
      }
      setStatus('success')
      setForm(INITIAL)
    } catch (err: any) {
      setStatus('error')
      setError(err.message || 'Ocurrió un error. Intenta de nuevo.')
    }
  }

  return (
    <>
      <style>{`
        .order-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        @media (max-width: 640px) {
          .order-grid { grid-template-columns: 1fr !important; }
          .order-box { padding: 1.25rem !important; }
        }
      `}</style>

      <section id="contacto" style={{ padding: '6rem 2rem', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', letterSpacing: '4px', color: '#4DFFD2', textTransform: 'uppercase' }}>
              — Hacer Pedido
            </span>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(38px, 6vw, 60px)', lineHeight: 1, marginTop: '8px', color: '#f5f5f0' }}>
              SOLICITA TU<br />PEDIDO
            </h2>
            <p style={{ fontSize: '15px', color: '#666', marginTop: '1rem', lineHeight: 1.6 }}>
              Completa el formulario y te contactamos en menos de 24 horas para confirmar disponibilidad y coordinar la entrega.
            </p>
          </div>

          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(77,255,210,0.05)', border: '1px solid rgba(77,255,210,0.2)', borderRadius: '16px' }}>
              <div style={{ fontSize: '64px', marginBottom: '1rem' }}>🐾</div>
              <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: '#4DFFD2', marginBottom: '0.5rem' }}>¡PEDIDO ENVIADO!</h3>
              <p style={{ color: '#777', fontSize: '15px' }}>Te contactaremos pronto al número proporcionado para confirmar tu pedido.</p>
              <button onClick={() => setStatus('idle')} style={{
                marginTop: '2rem', padding: '12px 28px',
                background: 'rgba(77,255,210,0.1)', border: '1px solid rgba(77,255,210,0.3)',
                color: '#4DFFD2', borderRadius: '8px', cursor: 'pointer',
                fontSize: '14px', fontFamily: 'DM Sans, sans-serif',
              }}>Hacer otro pedido</button>
            </div>
          ) : (
            <div className="order-box" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '2.5rem' }}>
              <div className="order-grid">
                <Field label="Nombre completo *" value={form.name} onChange={update('name')} placeholder="Tu nombre" />
                <Field label="Teléfono / WhatsApp *" value={form.phone} onChange={update('phone')} placeholder="+58 412 000 0000" type="tel" />
                <Field label="Email" value={form.email} onChange={update('email')} placeholder="tu@email.com" type="email" />
                <Field label="Dirección de entrega" value={form.address} onChange={update('address')} placeholder="Municipio, sector..." />
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <label style={labelStyle}>Productos deseados *</label>
                <textarea
                  value={form.products}
                  onChange={update('products')}
                  placeholder="Ej: Adult Performance 7.5kg x2, Snack Training x1..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'DM Sans, sans-serif' }}
                />
              </div>

              {error && (
                <div style={{ marginTop: '1rem', padding: '12px 16px', background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '8px', color: '#E74C3C', fontSize: '14px' }}>
                  {error}
                </div>
              )}

              <button onClick={handleSubmit} disabled={status === 'loading'} style={{
                marginTop: '2rem', width: '100%', padding: '16px',
                background: status === 'loading' ? '#1e1e1e' : '#4DFFD2',
                color: status === 'loading' ? '#555' : '#0d0d0d',
                border: 'none', borderRadius: '8px',
                fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', letterSpacing: '3px',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer', transition: 'all 0.3s',
              }}>
                {status === 'loading' ? 'ENVIANDO...' : 'ENVIAR SOLICITUD →'}
              </button>

              <p style={{ fontSize: '14px', color: '#444', textAlign: 'center', marginTop: '1rem' }}>
                También puedes escribirnos por{' '}
                <a href="https://wa.me/541126322496" style={{ color: '#4DFFD2', textDecoration: 'none' }}>WhatsApp</a>
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '11px', letterSpacing: '1.5px',
  textTransform: 'uppercase', color: '#555', marginBottom: '8px', fontWeight: 500,
}
const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
  padding: '12px 16px', color: '#f5f5f0', fontSize: '14px',
  outline: 'none', transition: 'border-color 0.2s',
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string; type?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ ...inputStyle, borderColor: focused ? 'rgba(77,255,210,0.4)' : 'rgba(255,255,255,0.08)' }}
      />
    </div>
  )
}
