'use client'

import { useEffect, useRef } from 'react'

export default function Hero() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '0 2rem',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(77,255,210,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(77,255,210,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Glow blob */}
      <div style={{
        position: 'absolute',
        width: '600px', height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(77,255,210,0.08) 0%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', position: 'relative', maxWidth: '900px' }}>
        {/* Tag */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(77,255,210,0.1)',
          border: '1px solid rgba(77,255,210,0.3)',
          borderRadius: '100px',
          padding: '6px 16px',
          marginBottom: '2rem',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4DFFD2', display: 'inline-block' }} />
          <span style={{ fontSize: '12px', letterSpacing: '2px', color: '#4DFFD2', textTransform: 'uppercase', fontWeight: 500 }}>
            Caracas · Nutrición Natural
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(50px, 10vw, 120px)',
          lineHeight: 0.9,
          letterSpacing: '-1px',
          marginBottom: '1.5rem',
        }}>
          <span style={{ display: 'block', color: '#f5f5f0' }}>ALIMENTO</span>
          <span style={{ display: 'block', color: '#4DFFD2', WebkitTextStroke: '1px rgba(77,255,210,0.5)' }}>100% NATURAL</span>
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#888',
          maxWidth: '480px',
          margin: '0 auto 3rem',
          lineHeight: 1.7,
          fontWeight: 300,
        }}>
          Alimentos naturales, balanceados y deliciosos para que tu perro viva su mejor vida.
          Delivery en Caracas.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#productos" style={{
            background: '#4DFFD2',
            color: '#0d0d0d',
            padding: '16px 36px',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '2px',
            textDecoration: 'none',
            textTransform: 'uppercase',
            transition: 'transform 0.2s, box-shadow 0.2s',
            display: 'inline-block',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(77,255,210,0.25)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
          >
            Ver Productos
          </a>
          <a href="#contacto" style={{
            border: '1px solid rgba(245,245,240,0.2)',
            color: '#f5f5f0',
            padding: '16px 36px',
            borderRadius: '4px',
            fontWeight: 500,
            fontSize: '14px',
            letterSpacing: '2px',
            textDecoration: 'none',
            textTransform: 'uppercase',
            transition: 'border-color 0.2s',
            display: 'inline-block',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#4DFFD2' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(245,245,240,0.2)' }}
          >
            Hacer Pedido
          </a>
        </div>

        {/* Stats */}
        {/* <div style={{
          display: 'flex', gap: '3rem', justifyContent: 'center',
          marginTop: '5rem',
          paddingTop: '3rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexWrap: 'wrap',
        }}>
          {[
            { n: '20+', label: 'Marcas Premium' },
            { n: '200+', label: 'Productos' },
            { n: '48h', label: 'Delivery Caracas' },
          ].map(({ n, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '44px', color: '#4DFFD2', lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: '12px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  )
}
