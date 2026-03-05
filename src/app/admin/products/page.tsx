'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase, Product } from '@/lib/supabase'

const EMPTY_PRODUCT: Omit<Product, 'id' | 'created_at'> = {
  name: '', brand: '', category: '', price_usd: 0, weight_kg: 0,
  description: '', ingredients: '', benefits: [], emoji: '🐾',
  color: '#4DFFD2', in_stock: true, image_url: null,
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Partial<Product>>(EMPTY_PRODUCT)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data ?? [])
    setLoading(false)
  }

  const openCreate = () => { setEditing(EMPTY_PRODUCT); setImageFile(null); setImagePreview(null); setModal('create') }
  const openEdit = (p: Product) => { setEditing({ ...p }); setImageFile(null); setImagePreview(p.image_url); setModal('edit') }
  const closeModal = () => { setModal(null); setEditing(EMPTY_PRODUCT); setImageFile(null); setImagePreview(null) }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('product-images').upload(filename, file, { upsert: true })
    if (error) { setUploading(false); return null }
    const { data } = supabase.storage.from('product-images').getPublicUrl(filename)
    setUploading(false)
    return data.publicUrl
  }

  const handleSave = async () => {
    if (!editing.name || !editing.brand || !editing.category) return
    setSaving(true)
    let image_url = editing.image_url ?? null
    if (imageFile) {
      const uploaded = await uploadImage(imageFile)
      if (uploaded) image_url = uploaded
    }
    const payload = { ...editing, image_url }
    if (modal === 'create') {
      const { data } = await supabase.from('products').insert([payload]).select().single()
      if (data) setProducts(prev => [data, ...prev])
    } else if (modal === 'edit' && editing.id) {
      const { id, created_at, ...fields } = payload as Product
      await supabase.from('products').update(fields).eq('id', id)
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...fields } : p))
    }
    setSaving(false)
    closeModal()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return
    setDeleting(id)
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
    setDeleting(null)
  }

  const toggleStock = async (p: Product) => {
    await supabase.from('products').update({ in_stock: !p.in_stock }).eq('id', p.id)
    setProducts(prev => prev.map(x => x.id === p.id ? { ...x, in_stock: !x.in_stock } : x))
  }

  const field = (key: keyof typeof editing) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setEditing(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <div>
      <style>{`
        .products-header { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.5rem; }
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
        .modal-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .modal-scroll { max-height: 90vh; overflow-y: auto; }
        @media (max-width: 640px) {
          .products-grid { grid-template-columns: 1fr 1fr !important; gap: 0.75rem; }
          .modal-fields { grid-template-columns: 1fr !important; }
          .new-btn { width: 100%; }
        }
        @media (max-width: 400px) {
          .products-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <div className="products-header">
        <div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(28px, 6vw, 42px)', letterSpacing: '2px', color: '#f5f5f0', lineHeight: 1 }}>PRODUCTOS</h1>
          <p style={{ color: '#555', fontSize: '13px', marginTop: '2px' }}>{products.length} productos</p>
        </div>
        <button className="new-btn" onClick={openCreate} style={{
          padding: '10px 20px', background: '#4DFFD2', color: '#0d0d0d',
          border: 'none', borderRadius: '8px',
          fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', letterSpacing: '2px', cursor: 'pointer',
        }}>+ NUEVO</button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="products-grid">
          {[1,2,3,4].map(i => (
            <div key={i} style={{ background: '#111', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ height: '120px', background: 'rgba(255,255,255,0.03)', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ padding: '0.75rem' }}>
                <div style={{ height: 14, width: '60%', background: 'rgba(255,255,255,0.05)', borderRadius: 4 }} />
              </div>
              <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
            </div>
          ))}
        </div>
      ) : (
        <div className="products-grid">
          {products.map(p => (
            <div key={p.id} style={{
              background: '#111', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '10px', overflow: 'hidden',
              opacity: deleting === p.id ? 0.4 : 1, transition: 'opacity 0.2s',
            }}>
              <div style={{ height: '3px', background: p.color }} />

              {/* Image */}
              <div style={{
                height: '110px', overflow: 'hidden', position: 'relative',
                background: p.image_url ? '#1a1a1a' : `${p.color}10`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '36px' }}>{p.emoji}</span>
                }
              </div>

              <div style={{ padding: '0.75rem' }}>
                <div style={{ fontWeight: 600, color: '#f5f5f0', fontSize: '13px', marginBottom: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.name}
                </div>
                <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  {p.brand}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: '#4DFFD2' }}>${p.price_usd}</span>
                  <button onClick={() => toggleStock(p)} style={{
                    padding: '2px 8px', borderRadius: '100px', fontSize: '10px', cursor: 'pointer',
                    background: p.in_stock ? 'rgba(77,255,210,0.1)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${p.in_stock ? 'rgba(77,255,210,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    color: p.in_stock ? '#4DFFD2' : '#555', fontFamily: 'DM Sans, sans-serif',
                  }}>{p.in_stock ? 'Stock' : 'Agotado'}</button>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => openEdit(p)} style={{
                    flex: 1, padding: '7px', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px',
                    color: '#888', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  }}>✏️</button>
                  <button onClick={() => handleDelete(p.id)} style={{
                    padding: '7px 10px', background: 'transparent',
                    border: '1px solid rgba(231,76,60,0.15)', borderRadius: '6px',
                    color: '#E74C3C', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  }}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div onClick={closeModal} style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          padding: '0',
        }}>
          <div onClick={e => e.stopPropagation()} className="modal-scroll" style={{
            background: '#141414', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px 16px 0 0',
            padding: '1.5rem',
            width: '100%', maxWidth: '600px',
          }}>
            {/* Handle bar */}
            <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, margin: '0 auto 1.25rem' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '24px', letterSpacing: '2px', color: '#f5f5f0' }}>
                {modal === 'create' ? 'NUEVO PRODUCTO' : 'EDITAR'}
              </h2>
              <button onClick={closeModal} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#888', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: '14px' }}>✕</button>
            </div>

            {/* Image upload */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={mLabel}>Imagen</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '100%', height: '130px',
                  border: `2px dashed ${imagePreview ? 'rgba(77,255,210,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '10px', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', position: 'relative',
                  background: imagePreview ? 'none' : 'rgba(255,255,255,0.02)',
                }}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: '#444' }}>
                    <div style={{ fontSize: '28px', marginBottom: '6px' }}>📷</div>
                    <div style={{ fontSize: '12px', color: '#555' }}>Toca para subir foto</div>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageSelect} style={{ display: 'none' }} />
              {imagePreview && (
                <button onClick={() => { setImageFile(null); setImagePreview(null); setEditing(p => ({ ...p, image_url: null })) }}
                  style={{ marginTop: '4px', background: 'transparent', border: 'none', color: '#E74C3C', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', padding: 0 }}>
                  ✕ Quitar imagen
                </button>
              )}
            </div>

            <div className="modal-fields">
              <MField label="Nombre *" value={editing.name ?? ''} onChange={field('name')} placeholder="Cachorro Vital" />
              <MField label="Marca *" value={editing.brand ?? ''} onChange={field('brand')} placeholder="Royal Canin" />
              <MField label="Categoría *" value={editing.category ?? ''} onChange={field('category')} placeholder="Cachorros" />
              <MField label="Emoji (fallback)" value={editing.emoji ?? ''} onChange={field('emoji')} placeholder="🐾" />
              <MField label="Precio USD" value={String(editing.price_usd ?? '')} onChange={field('price_usd')} placeholder="0.00" type="number" />
              <MField label="Peso (kg)" value={String(editing.weight_kg ?? '')} onChange={field('weight_kg')} placeholder="0.0" type="number" />
              <MField label="Color" value={editing.color ?? ''} onChange={field('color')} placeholder="#4DFFD2" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '18px' }}>
                <label style={{ fontSize: '13px', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" checked={editing.in_stock ?? true}
                    onChange={e => setEditing(prev => ({ ...prev, in_stock: e.target.checked }))}
                    style={{ accentColor: '#4DFFD2', width: 16, height: 16 }} />
                  En stock
                </label>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={mLabel}>Descripción</label>
              <textarea value={editing.description ?? ''} onChange={field('description')} rows={2}
                placeholder="Descripción..." style={{ ...mInput, resize: 'vertical', fontFamily: 'DM Sans, sans-serif' }} />
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <label style={mLabel}>Ingredientes</label>
              <textarea value={editing.ingredients ?? ''} onChange={field('ingredients')} rows={2}
                placeholder="Pollo, arroz..." style={{ ...mInput, resize: 'vertical', fontFamily: 'DM Sans, sans-serif' }} />
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <label style={mLabel}>Beneficios (separados por coma)</label>
              <input
                value={(editing.benefits ?? []).join(', ')}
                onChange={e => setEditing(prev => ({ ...prev, benefits: e.target.value.split(',').map(b => b.trim()).filter(Boolean) }))}
                placeholder="Crecimiento, Energía..."
                style={mInput}
              />
            </div>

            <button onClick={handleSave} disabled={saving || uploading} style={{
              marginTop: '1.25rem', width: '100%', padding: '14px',
              background: saving || uploading ? '#1e1e1e' : '#4DFFD2',
              color: saving || uploading ? '#555' : '#0d0d0d',
              border: 'none', borderRadius: '8px',
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '3px',
              cursor: saving || uploading ? 'not-allowed' : 'pointer',
            }}>
              {uploading ? 'SUBIENDO...' : saving ? 'GUARDANDO...' : modal === 'create' ? 'CREAR' : 'GUARDAR'}
            </button>

            {/* Bottom safe area */}
            <div style={{ height: '1rem' }} />
          </div>
        </div>
      )}
    </div>
  )
}

const mLabel: React.CSSProperties = {
  display: 'block', fontSize: '10px', letterSpacing: '1.5px',
  textTransform: 'uppercase', color: '#555', marginBottom: '5px', fontWeight: 500,
}
const mInput: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
  padding: '10px 12px', color: '#f5f5f0', fontSize: '13px',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif',
}

function MField({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string; type?: string
}) {
  return (
    <div>
      <label style={mLabel}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={mInput}
        onFocus={e => (e.target.style.borderColor = 'rgba(77,255,210,0.4)')}
        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
      />
    </div>
  )
}