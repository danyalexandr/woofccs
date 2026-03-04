'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const NAV = [
  { href: '/admin/orders',   icon: '📋', label: 'Pedidos' },
  { href: '/admin/products', icon: '🦴', label: 'Productos' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const [adminEmail, setAdminEmail] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/admin')
      } else {
        setAdminEmail(data.session.user.email ?? '')
        setChecking(false)
      }
    })
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  if (checking) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', letterSpacing: '4px', color: '#4DFFD2' }}>
        CARGANDO...
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', fontFamily: 'DM Sans, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap');`}</style>

      {/* Sidebar */}
      <aside style={{
        width: '220px', flexShrink: 0,
        background: '#0d0d0d', borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        padding: '1.5rem 0',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#4DFFD2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', color: '#0d0d0d' }}>W</span>
            </div>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '3px', color: '#f5f5f0' }}>
              WOOF<span style={{ color: '#4DFFD2' }}>CCS</span>
            </span>
          </Link>
          <div style={{ fontSize: '10px', color: '#333', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '6px', paddingLeft: '40px' }}>
            Admin
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
          {NAV.map(({ href, icon, label }) => {
            const active = pathname.startsWith(href)
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '8px', marginBottom: '4px',
                textDecoration: 'none',
                background: active ? 'rgba(77,255,210,0.08)' : 'transparent',
                border: active ? '1px solid rgba(77,255,210,0.15)' : '1px solid transparent',
                color: active ? '#4DFFD2' : '#666',
                fontSize: '14px', fontWeight: 500,
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#f5f5f0' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#666' }}
              >
                <span>{icon}</span>
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '11px', color: '#444', marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {adminEmail}
          </div>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '8px', background: 'transparent',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px',
            color: '#555', fontSize: '12px', cursor: 'pointer', letterSpacing: '1px',
            textTransform: 'uppercase', transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif',
          }}
            onMouseEnter={e => { (e.currentTarget.style.borderColor = 'rgba(231,76,60,0.4)'); (e.currentTarget.style.color = '#E74C3C') }}
            onMouseLeave={e => { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'); (e.currentTarget.style.color = '#555') }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '2.5rem' }}>
        {children}
      </main>
    </div>
  )
}
