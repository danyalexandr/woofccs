'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/products'

interface Props {
  product: Product
  onClose: () => void
}

export default function ProductModal({ product, onClose }: Props) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleAdd = () => {
    // In production: add to cart state / Supabase
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    // Scroll to order form
    setTimeout(() => {
      document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
      onClose()
    }, 600)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>

      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#141414',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          maxWidth: '760px',
          width: '100%',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          animation: 'slideUp 0.3s ease',
        }}
      >
        {/* Left: Image */}
        <div style={{
          background: `linear-gradient(135deg, ${product.color}20 0%, ${product.color}05 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '120px',
          padding: '3rem',
          position: 'relative',
        }}>
          <span style={{ filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.5))' }}>{product.emoji}</span>
          <div style={{
            position: 'absolute', bottom: 16, left: 16,
            background: `${product.color}20`,
            border: `1px solid ${product.color}50`,
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '12px',
            color: product.color,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}>
            {product.brand}
          </div>
        </div>

        {/* Right: Details */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          {/* Close btn */}
          <button
            onClick={onClose}
            style={{
              alignSelf: 'flex-end',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#888',
              width: 32, height: 32,
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '16px',
              marginBottom: '1rem',
              transition: 'all 0.2s',
            }}
          >
            ✕
          </button>

          <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            {product.category} · {product.weight_kg}kg
          </div>

          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '36px',
            letterSpacing: '1px',
            color: '#f5f5f0',
            marginBottom: '1rem',
          }}>
            {product.name}
          </h2>

          <p style={{ fontSize: '14px', color: '#777', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            {product.description}
          </p>

          {/* Benefits */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
            {product.benefits.map(b => (
              <span key={b} style={{
                background: 'rgba(77,255,210,0.07)',
                border: '1px solid rgba(77,255,210,0.2)',
                color: '#4DFFD2',
                padding: '4px 12px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 500,
              }}>
                ✓ {b}
              </span>
            ))}
          </div>

          {/* Ingredients */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '1.5rem',
          }}>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Ingredientes</div>
            <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.6 }}>{product.ingredients}</div>
          </div>

          {/* Price */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px', color: '#4DFFD2' }}>
              ${(product.price_usd * qty).toFixed(2)}
            </span>
            <span style={{ fontSize: '13px', color: '#555', marginLeft: '6px' }}>USD</span>
          </div>

          {/* Quantity Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#1e1e1e', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{
                  width: 40, height: 40, background: 'none', border: 'none',
                  color: '#888', fontSize: '20px', cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}
              >
                −
              </button>
              <span style={{
                width: 40, textAlign: 'center',
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '20px',
                color: '#f5f5f0',
              }}>
                {qty}
              </span>
              <button
                onClick={() => setQty(q => q + 1)}
                style={{
                  width: 40, height: 40, background: 'none', border: 'none',
                  color: '#888', fontSize: '20px', cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}
              >
                +
              </button>
            </div>
            <span style={{ fontSize: '13px', color: '#444' }}>unidades</span>
          </div>

          {/* CTA */}
          <button
            onClick={handleAdd}
            disabled={!product.in_stock}
            style={{
              width: '100%',
              padding: '14px',
              background: added ? '#1e1e1e' : (product.in_stock ? '#4DFFD2' : '#2a2a2a'),
              color: added ? '#4DFFD2' : (product.in_stock ? '#0d0d0d' : '#555'),
              border: added ? '1px solid #4DFFD2' : 'none',
              borderRadius: '8px',
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '18px',
              letterSpacing: '2px',
              cursor: product.in_stock ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s',
            }}
          >
            {!product.in_stock ? 'AGOTADO' : added ? '✓ AGREGADO · IR AL PEDIDO' : `AGREGAR AL PEDIDO · $${(product.price_usd * qty).toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  )
}
