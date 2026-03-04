'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) { setError('Ingresa email y contraseña.'); return }
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Credenciales incorrectas.')
      setLoading(false)
      return
    }
    router.push('/admin/orders')
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap');`}</style>

      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(77,255,210,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(77,255,210,0.03) 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: '#4DFFD2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '26px', color: '#0d0d0d' }}>W</span>
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', letterSpacing: '6px', color: '#f5f5f0' }}>
            WOOF<span style={{ color: '#4DFFD2' }}>CCS</span>
          </h1>
          <p style={{ fontSize: '13px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px' }}>
            Panel Administrativo
          </p>
        </div>

        {/* Form */}
        <div style={{
          background: '#111', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px', padding: '2rem',
        }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="admin@woofccs.com"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'rgba(77,255,210,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Contraseña</label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'rgba(77,255,210,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          {error && (
            <div style={{
              marginBottom: '1rem', padding: '10px 14px',
              background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.25)',
              borderRadius: '8px', color: '#E74C3C', fontSize: '13px',
            }}>{error}</div>
          )}

          <button onClick={handleLogin} disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? '#1e1e1e' : '#4DFFD2',
            color: loading ? '#555' : '#0d0d0d',
            border: 'none', borderRadius: '8px',
            fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '3px',
            cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
          }}>
            {loading ? 'INGRESANDO...' : 'INGRESAR →'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '12px', color: '#333' }}>
          <a href="/" style={{ color: '#555', textDecoration: 'none' }}>← Volver a la tienda</a>
        </p>
      </div>
    </div>
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
  fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box',
}
