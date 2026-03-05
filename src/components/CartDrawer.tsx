'use client'

import { useEffect } from 'react'
import { useCart } from '@/lib/CartContext'

const WHATSAPP_NUMBER = '541126322496'

export default function CartDrawer() {
  const { items, total, count, isOpen, closeCart, clearCart } = useCart()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeCart])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleWhatsApp = () => {
    if (items.length === 0) return
    const lines = items.map(i =>
      `• ${i.product.name} (${i.product.weight_kg}kg) x${i.qty} — $${(i.product.price_usd * i.qty).toFixed(2)}`
    ).join('\n')
    const message = `¡Hola! Quiero hacer un pedido:\n\n${lines}\n\n*Total: $${total.toFixed(2)} USD*`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <>
      <style>{`@keyframes fadeIn { from{opacity:0} to{opacity:1} }`}</style>

      {isOpen && (
        <div onClick={closeCart} style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }} />
      )}

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 301,
        width: '100%', maxWidth: '400px',
        background: '#0f0f0f', borderLeft: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        fontFamily: 'DM Sans, sans-serif',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', letterSpacing: '3px', color: '#f5f5f0' }}>
              CARRITO
            </span>
            {count > 0 && (
              <span style={{ background: '#4DFFD2', color: '#0d0d0d', borderRadius: '100px', padding: '2px 9px', fontSize: '12px', fontWeight: 700 }}>
                {count}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Vaciar carrito */}
            {items.length > 0 && (
              <button
                onClick={clearCart}
                title="Vaciar carrito"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(231,76,60,0.2)',
                  color: '#E74C3C', borderRadius: '6px',
                  padding: '5px 10px', fontSize: '12px',
                  cursor: 'pointer', letterSpacing: '0.5px',
                  fontFamily: 'DM Sans, sans-serif',
                  transition: 'all 0.2s', opacity: 0.7,
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderColor = 'rgba(231,76,60,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.borderColor = 'rgba(231,76,60,0.2)' }}
              >
                Vaciar
              </button>
            )}

            {/* Cerrar */}
            <button onClick={closeCart} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#888', width: 32, height: 32, borderRadius: '50%',
              cursor: 'pointer', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          </div>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🛒</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', letterSpacing: '3px', color: '#2a2a2a' }}>
                CARRITO VACÍO
              </div>
              <p style={{ fontSize: '13px', color: '#333', marginTop: '8px' }}>
                Agrega productos desde el catálogo
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {items.map(({ product, qty }) => (
                <div key={product.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  background: '#141414', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px', padding: '12px',
                }}>
                  <div style={{
                    width: 48, height: 48, flexShrink: 0,
                    background: `${product.color}15`, borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '26px',
                  }}>
                    {product.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#f5f5f0', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#555' }}>
                      {product.weight_kg}kg · x{qty}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: '#4DFFD2', flexShrink: 0 }}>
                    ${(product.price_usd * qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '13px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase' }}>Total</span>
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '32px', color: '#f5f5f0' }}>
                ${total.toFixed(2)} <span style={{ fontSize: '14px', color: '#555' }}>USD</span>
              </span>
            </div>

            <button onClick={handleWhatsApp} style={{
              width: '100%', padding: '16px', background: '#25D366', color: '#fff',
              border: 'none', borderRadius: '10px',
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '2px',
              cursor: 'pointer', transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#1ebe5d')}
              onMouseLeave={e => (e.currentTarget.style.background = '#25D366')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              PEDIR POR WHATSAPP
            </button>

            <p style={{ fontSize: '11px', color: '#333', textAlign: 'center', marginTop: '10px' }}>
              Te abrirá WhatsApp con el resumen listo
            </p>
          </div>
        )}
      </div>
    </>
  )
}