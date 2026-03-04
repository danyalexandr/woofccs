'use client'

import { useState, useEffect } from 'react'
import { supabase, Product } from '@/lib/supabase'
import ProductModal from './ProductModal'

const ALL = 'Todos'

export default function ProductGrid({ onAddToOrder }: {
  onAddToOrder: (item: { product: Product; qty: number }) => void
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(ALL)
  const [selected, setSelected] = useState<Product | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true })
      if (!error) setProducts(data ?? [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  // Categorías únicas extraídas de los productos reales
  const categories = [ALL, ...Array.from(new Set(products.map(p => p.category)))]
  const filtered = active === ALL ? products : products.filter(p => p.category === active)

  return (
    <section id="productos" style={{ padding: '6rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Section Header */}
      <div style={{ marginBottom: '3rem' }}>
        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '12px', letterSpacing: '4px', color: '#4DFFD2', textTransform: 'uppercase' }}>
          — Catálogo
        </span>
        <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(42px, 6vw, 72px)', lineHeight: 1, marginTop: '8px', color: '#f5f5f0' }}>
          NUESTROS<br />PRODUCTOS
        </h2>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActive(cat)} style={{
            padding: '8px 18px', borderRadius: '100px',
            border: active === cat ? '1px solid #4DFFD2' : '1px solid rgba(255,255,255,0.1)',
            background: active === cat ? 'rgba(77,255,210,0.1)' : 'transparent',
            color: active === cat ? '#4DFFD2' : '#888',
            fontSize: '13px', fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
            cursor: 'pointer', letterSpacing: '0.5px', transition: 'all 0.2s',
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{
              background: '#141414', borderRadius: '12px', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ height: '200px', background: 'rgba(255,255,255,0.03)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ padding: '1.5rem' }}>
                <div style={{ height: 12, width: '40%', background: 'rgba(255,255,255,0.04)', borderRadius: 4, marginBottom: 10 }} />
                <div style={{ height: 20, width: '70%', background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 10 }} />
                <div style={{ height: 12, width: '90%', background: 'rgba(255,255,255,0.03)', borderRadius: 4 }} />
              </div>
              <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#444' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🐾</div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', letterSpacing: '3px', color: '#333' }}>
            {active === ALL ? 'NO HAY PRODUCTOS AÚN' : `SIN PRODUCTOS EN "${active.toUpperCase()}"`}
          </div>
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} onClick={() => setSelected(product)} />
          ))}
        </div>
      )}

      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onAddToOrder={(item) => {
            onAddToOrder(item)
            setSelected(null)
          }}
        />
      )}
    </section>
  )
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#141414',
        border: `1px solid ${hovered ? product.color + '40' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? `0 20px 60px ${product.color}20` : 'none',
      }}
    >
      {/* Image Area */}
      <div style={{
        height: '200px',
        background: `linear-gradient(135deg, ${product.color}15 0%, ${product.color}05 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '80px', position: 'relative',
      }}>
        <span style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' }}>{product.emoji}</span>
        {!product.in_stock && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(0,0,0,0.7)', padding: '4px 10px', borderRadius: '4px',
            fontSize: '11px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase',
          }}>Agotado</div>
        )}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          background: `${product.color}20`, border: `1px solid ${product.color}40`,
          padding: '4px 10px', borderRadius: '4px',
          fontSize: '11px', color: product.color, letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600,
        }}>
          {product.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem' }}>
        <div style={{ fontSize: '12px', color: '#555', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
          {product.brand}
        </div>
        <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', letterSpacing: '1px', color: '#f5f5f0', marginBottom: '8px' }}>
          {product.name}
        </h3>
        <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.6, marginBottom: '1.2rem' }}>
          {(product.description ?? '').slice(0, 80)}{(product.description ?? '').length > 80 ? '...' : ''}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: '#4DFFD2' }}>
              ${product.price_usd}
            </span>
            <span style={{ fontSize: '12px', color: '#555', marginLeft: '4px' }}>/ {product.weight_kg}kg</span>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: hovered ? product.color : 'rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.3s', fontSize: '18px',
          }}>→</div>
        </div>
      </div>
    </div>
  )
}
