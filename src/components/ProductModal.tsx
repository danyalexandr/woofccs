'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/products'

interface Props {
  product: Product
  onClose: () => void
  onAddToOrder: (item: { product: Product; qty: number }) => void  // ← nuevo
}

export default function ProductModal({ product, onClose, onAddToOrder }: Props) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  
  const handleAdd = () => {
    // Emite el item al padre
    onAddToOrder({ product, qty })
    setAdded(true)
     // Scroll al formulario
    setTimeout(() => {
      document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)}

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
      overflowY: 'auto',
    }}>
      <style>{`
        @keyframes slideUp { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        .modal-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 760px;
          width: 100%;
        }
        @media (max-width: 640px) {
          .modal-inner {
            grid-template-columns: 1fr !important;
            max-height: 90vh;
            overflow-y: auto;
          }
          .modal-image-pane {
            min-height: 180px !important;
            font-size: 80px !important;
            padding: 2rem !important;
          }
        }
      `}</style>

      <div onClick={e => e.stopPropagation()}
        className="modal-inner"
        style={{
          background: '#141414', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', overflow: 'hidden',
          animation: 'slideUp 0.3s ease',
          margin: 'auto',
        }}
      >
        {/* Left: Image */}
        <div className="modal-image-pane" style={{
          background: `linear-gradient(135deg, ${product.color}20 0%, ${product.color}05 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '100px', padding: '3rem', position: 'relative', minHeight: '260px',
        }}>
          <span style={{ filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.5))' }}>{product.emoji}</span>
          <div style={{
            position: 'absolute', bottom: 16, left: 16,
            background: `${product.color}20`, border: `1px solid ${product.color}50`,
            padding: '6px 14px', borderRadius: '6px',
            fontSize: '10px', color: product.color, letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700,
          }}>{product.brand}</div>
        </div>

        {/* Right: Details */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <button onClick={onClose} style={{
            alignSelf: 'flex-end', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)', color: '#888',
            width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: '16px', marginBottom: '0.75rem',
          }}>✕</button>

          <div style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
            {product.category} · {product.weight_kg}kg
          </div>
          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '30px', letterSpacing: '1px', color: '#f5f5f0', marginBottom: '0.75rem' }}>
            {product.name}
          </h2>
          <p style={{ fontSize: '13px', color: '#777', lineHeight: 1.7, marginBottom: '1rem' }}>{product.description}</p>

          {/* Benefits */}
          {/* <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
            {product.benefits.map(b => (
              <span key={b} style={{
                background: 'rgba(77,255,210,0.07)', border: '1px solid rgba(77,255,210,0.2)',
                color: '#4DFFD2', padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 500,
              }}>✓ {b}</span>
            ))}
          </div> */}

          {/* Ingredients */}
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px', padding: '10px', marginBottom: '1rem',
          }}>
            <div style={{ fontSize: '10px', color: '#555', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '3px' }}>Ingredientes</div>
            <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.6 }}>{product.ingredients}</div>
          </div>

          {/* Price */}
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '30px', color: '#4DFFD2' }}>
              ${(product.price_usd * qty).toFixed(2)}
            </span>
            <span style={{ fontSize: '12px', color: '#555', marginLeft: '4px' }}>USD</span>
          </div>

          {/* Quantity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#1e1e1e', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              {[{ label: '−', fn: () => setQty(q => Math.max(1, q - 1)) }, { label: '+', fn: () => setQty(q => q + 1) }].map((btn, i) => (
                i === 0 ? (
                  <button key={i} onClick={btn.fn} style={{ width: 40, height: 40, background: 'none', border: 'none', color: '#888', fontSize: '20px', cursor: 'pointer' }}>{btn.label}</button>
                ) : (
                  <>
                    <span key="n" style={{ width: 40, textAlign: 'center', fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', color: '#f5f5f0' }}>{qty}</span>
                    <button key={i} onClick={btn.fn} style={{ width: 40, height: 40, background: 'none', border: 'none', color: '#888', fontSize: '20px', cursor: 'pointer' }}>{btn.label}</button>
                  </>
                )
              ))}
            </div>
            <span style={{ fontSize: '13px', color: '#444' }}>unidades</span>
          </div>

          <button onClick={handleAdd} disabled={!product.in_stock} style={{
            width: '100%', padding: '14px',
            background: added ? '#1e1e1e' : (product.in_stock ? '#4DFFD2' : '#2a2a2a'),
            color: added ? '#4DFFD2' : (product.in_stock ? '#0d0d0d' : '#555'),
            border: added ? '1px solid #4DFFD2' : 'none',
            borderRadius: '8px', fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', letterSpacing: '2px',
            cursor: product.in_stock ? 'pointer' : 'not-allowed', transition: 'all 0.3s',
          }}>
            {!product.in_stock ? 'AGOTADO' : added ? '✓ IR AL PEDIDO' : `AGREGAR · $${(product.price_usd * qty).toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  )
}