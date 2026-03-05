'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/CartContext'
import Image from 'next/image'

const NAV_LINKS = ['Productos', 'Contacto']

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <style>{`
        .woof-nav { display: flex !important; }
        .woof-burger { display: none !important; }
        .woof-drawer { display: none !important; }
        @media (max-width: 768px) {
          .woof-nav { display: none !important; }
          .woof-burger { display: flex !important; }
          .woof-drawer { display: flex !important; }
        }
        @keyframes cartBounce { 0%,100%{transform:scale(1)} 40%{transform:scale(1.3)} 70%{transform:scale(0.9)} }
      `}</style>

      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 1.5rem',
        height: scrolled ? '60px' : '72px',
        background: scrolled || menuOpen ? 'rgba(13,13,13,0.98)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(77,255,210,0.1)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'height 0.3s, background 0.3s',
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', zIndex: 101 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#4DFFD2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src="/woofccs_logo.png" alt="WoofCCS Logo" width={40} height={40} style={{ display: 'block' }} />
          </div>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', letterSpacing: '4px', color: '#f5f5f0' }}>
            WOOF<span style={{ color: '#4DFFD2' }}>CCS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="woof-nav" style={{ gap: '2rem', alignItems: 'center' }}>
          {NAV_LINKS.map(item => (
            <a key={item} href={`#${item.toLowerCase()}`}
              style={{ color: '#888', textDecoration: 'none', fontSize: '13px', fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#4DFFD2')}
              onMouseLeave={e => (e.currentTarget.style.color = '#888')}
            >{item}</a>
          ))}

          {/* Cart button */}
          <button onClick={openCart} style={{
            position: 'relative',
            background: count > 0 ? 'rgba(77,255,210,0.1)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${count > 0 ? 'rgba(77,255,210,0.3)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '8px', padding: '8px 16px',
            color: count > 0 ? '#4DFFD2' : '#888',
            cursor: 'pointer', fontSize: '13px', fontFamily: 'DM Sans, sans-serif',
            display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'all 0.2s',
          }}>
            🛒
            {count > 0 && (
              <span style={{
                fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px',
                animation: 'cartBounce 0.4s ease',
              }}>
                {count}
              </span>
            )}
          </button>
        </nav>

        {/* Mobile: cart + hamburger */}
        <div className="woof-burger" style={{ alignItems: 'center', gap: '12px' }}>
          {/* Mobile cart button */}
          <button onClick={openCart} style={{
            position: 'relative', background: 'none', border: 'none',
            cursor: 'pointer', fontSize: '18px', padding: '4px',
            zIndex: 101,
          }}>
            🛒
            {count > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: '#4DFFD2', color: '#0d0d0d',
                borderRadius: '50%', width: 18, height: 18,
                fontSize: '10px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {count}
              </span>
            )}
          </button>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(o => !o)}
            style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '5px', width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer', zIndex: 101, padding: 0 }}
          >
            <span style={{ display: 'block', width: 22, height: 2, background: '#f5f5f0', borderRadius: 2, transition: 'all 0.3s', transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
            <span style={{ display: 'block', width: 22, height: 2, background: '#f5f5f0', borderRadius: 2, transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: 22, height: 2, background: '#f5f5f0', borderRadius: 2, transition: 'all 0.3s', transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className="woof-drawer" style={{
        position: 'fixed', inset: 0, zIndex: 99, background: '#0d0d0d',
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '0.25rem',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {NAV_LINKS.map((item, i) => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '48px', letterSpacing: '4px',
              color: '#f5f5f0', textDecoration: 'none',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
              transition: `color 0.2s, opacity 0.3s ${i * 60}ms, transform 0.3s ${i * 60}ms`,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#4DFFD2')}
            onMouseLeave={e => (e.currentTarget.style.color = '#f5f5f0')}
          >{item}</a>
        ))}
        <button onClick={() => { openCart(); setMenuOpen(false) }} style={{
          marginTop: '2rem', background: '#4DFFD2', color: '#0d0d0d',
          padding: '16px 40px', borderRadius: '4px', border: 'none',
          fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', letterSpacing: '3px', cursor: 'pointer',
          opacity: menuOpen ? 1 : 0,
          transition: 'opacity 0.3s 0.28s',
        }}>🛒 Ver Carrito {count > 0 ? `(${count})` : ''}</button>
      </div>
    </>
  )
}
