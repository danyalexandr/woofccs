'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 2rem',
        height: scrolled ? '64px' : '80px',
        background: scrolled ? 'rgba(13,13,13,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(77,255,210,0.1)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <div style={{
          width: 48, height: 48,
          borderRadius: '50%',
          background: '#4DFFD2',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Image 
              src="/woofccs_logo.png" 
              alt="EWoofCCS" 
              width={48} 
              height={48}
              className="w-10 h-10 md:w-12 md:h-12"
            />
        </div>
        <span style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '26px',
          letterSpacing: '4px',
          color: '#f5f5f0',
        }}>
          WOOF<span style={{ color: '#4DFFD2' }}>CCS</span>
        </span>
      </Link>

      {/* Desktop Nav */}
      <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        {['Productos', 'Contacto'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            style={{
              color: '#888',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#4DFFD2')}
            onMouseLeave={e => (e.currentTarget.style.color = '#888')}
          >
            {item}
          </a>
        ))}
        <a
          href="#contacto"
          style={{
            background: '#4DFFD2',
            color: '#0d0d0d',
            padding: '10px 22px',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '1px',
            textDecoration: 'none',
            textTransform: 'uppercase',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#4DFFD2'; }}
        >
          Pedir ahora
        </a>
      </nav>
    </header>
  )
}
