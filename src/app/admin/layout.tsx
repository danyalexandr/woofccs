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

  const isLoginPage = pathname === '/admin'

  useEffect(() => {
    if (isLoginPage) { setChecking(false); return }
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace('/admin')
      else { setAdminEmail(data.session.user.email ?? ''); setChecking(false) }
    })
  }, [pathname])

  if (isLoginPage) return <>{children}</>

  if (checking) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', letterSpacing: '4px', color: '#4DFFD2' }}>
        VERIFICANDO...
      </div>
    </div>
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'DM Sans, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap');

        .admin-wrapper {
          display: flex;
          min-height: 100vh;
        }

        /* Sidebar desktop */
        .admin-sidebar {
          width: 200px;
          flex-shrink: 0;
          background: #0d0d0d;
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          padding: 1.5rem 0;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .admin-main {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          /* space for bottom nav on mobile */
        }

        /* Bottom nav mobile */
        .admin-bottom-nav {
          display: none;
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            display: none !important;
          }
          .admin-main {
            padding: 1rem 1rem 5rem; /* bottom padding for nav */
          }
          .admin-bottom-nav {
            display: flex !important;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            z-index: 50;
            background: rgba(13,13,13,0.97);
            border-top: 1px solid rgba(255,255,255,0.07);
            backdrop-filter: blur(12px);
          }
          .admin-page-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
          }
          .admin-page-header button {
            width: 100%;
          }
          .admin-products-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important;
          }
          .admin-orders-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="admin-wrapper">
        {/* Sidebar — desktop only */}
        <aside className="admin-sidebar">
          <div style={{ padding: '0 1.25rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#4DFFD2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '15px', color: '#0d0d0d' }}>W</span>
              </div>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', letterSpacing: '3px', color: '#f5f5f0' }}>
                WOOF<span style={{ color: '#4DFFD2' }}>CCS</span>
              </span>
            </Link>
            <div style={{ fontSize: '10px', color: '#333', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px', paddingLeft: '38px' }}>Admin</div>
          </div>

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
                  fontSize: '14px', fontWeight: 500, transition: 'all 0.2s',
                }}>
                  <span>{icon}</span>{label}
                </Link>
              )
            })}
          </nav>

          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '11px', color: '#333', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {adminEmail}
            </div>
            <button onClick={handleLogout} style={{
              width: '100%', padding: '7px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px',
              color: '#555', fontSize: '11px', cursor: 'pointer', letterSpacing: '1px',
              textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif',
            }}>Salir</button>
          </div>
        </aside>

        {/* Main content */}
        <main className="admin-main">
          {/* Mobile top bar */}
          <div style={{ display: 'none' }} className="mobile-topbar">
          </div>
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <nav className="admin-bottom-nav">
        {NAV.map(({ href, icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '10px 0', textDecoration: 'none',
              color: active ? '#4DFFD2' : '#444',
              fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
              gap: '4px', transition: 'color 0.2s',
              borderTop: active ? '2px solid #4DFFD2' : '2px solid transparent',
            }}>
              <span style={{ fontSize: '20px' }}>{icon}</span>
              {label}
            </Link>
          )
        })}
        <button onClick={handleLogout} style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '10px 0', background: 'none', border: 'none',
          color: '#333', fontSize: '10px', letterSpacing: '1px',
          textTransform: 'uppercase', gap: '4px', cursor: 'pointer',
          borderTop: '2px solid transparent',
        }}>
          <span style={{ fontSize: '20px' }}>🚪</span>
          Salir
        </button>
      </nav>
    </div>
  )
}