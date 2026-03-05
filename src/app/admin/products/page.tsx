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

  const openCreate = () => {
    setEditing(EMPTY_PRODUCT)
    setImageFile(null)
    setImagePreview(null)
    setModal('create')
  }

  const openEdit = (p: Product) => {
    setEditing({ ...p })
    setImageFile(null)
    setImagePreview(p.image_url)
    setModal('edit')
  }

  const closeModal = () => {
    setModal(null)
    setEditing(EMPTY_PRODUCT)
    setImageFile(null)
    setImagePreview(null)
  }

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

    const { error } = await supabase.storage
      .from('product-images')
      .upload(filename, file, { upsert: true })

    if (error) { setUploading(false); return null }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filename)

    setUploading(false)
    return data.publicUrl
  }

  const handleSave = async () => {
    if (!editing.name || !editing.brand || !editing.category) return
    setSaving(true)

    let image_url = editing.image_url ?? null

    // Si hay imagen nueva, subirla primero
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
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px', letterSpacing: '2px', color: '#f5f5f0', lineHeight: 1 }}>PRODUCTOS</h1>
          <p style={{ color: '#555', fontSize: '13px', marginTop: '4px' }}>{products.length} productos</p>
        </div>
        <button onClick={openCreate} style={{
          padding: '10px 24px', background: '#4DFFD2', color: '#0d0d0d',
          border: 'none', borderRadius: '8px',
          fontFamily: 'Bebas Neue, sans-serif', fontSize: '16px', letterSpacing: '2px', cursor: 'pointer',
        }}>+ NUEVO PRODUCTO</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#444', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '3px' }}>CARGANDO...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {products.map(p => (
            <div key={p.id} style={{
              background: '#111', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px', overflow: 'hidden',
              opacity: deleting === p.id ? 0.4 : 1, transition: 'opacity 0.2s',
            }}>
              <div style={{ height: '4px', background: p.color }} />

              {/* Product image or emoji */}
              <div style={{
                height: '140px',
                background: p.image_url ? 'none' : `${p.color}10`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', position: 'relative',
              }}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '48px' }}>{p.emoji}</span>
                )}
              </div>

              <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#f5f5f0', fontSize: '15px' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: '#555', letterSpacing: '1px', textTransform: 'uppercase' }}>{p.brand}</div>
                  </div>
                  <button onClick={() => toggleStock(p)} style={{
                    padding: '3px 10px', borderRadius: '100px', fontSize: '11px', cursor: 'pointer',
                    background: p.in_stock ? 'rgba(77,255,210,0.1)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${p.in_stock ? 'rgba(77,255,210,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    color: p.in_stock ? '#4DFFD2' : '#555', fontFamily: 'DM Sans, sans-serif',
                  }}>
                    {p.in_stock ? 'En stock' : 'Agotado'}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#444', letterSpacing: '1px', textTransform: 'uppercase' }}>Precio</div>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#4DFFD2' }}>${p.price_usd}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#444', letterSpacing: '1px', textTransform: 'uppercase' }}>Peso</div>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', color: '#888' }}>{p.weight_kg}kg</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => openEdit(p)} style={{
                    flex: 1, padding: '8px', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px',
                    color: '#888', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                  }}>✏️ Editar</button>
                  <button onClick={() => handleDelete(p.id)} style={{
                    padding: '8px 14px', background: 'transparent',
                    border: '1px solid rgba(231,76,60,0.15)', borderRadius: '6px',
                    color: '#E74C3C', fontSize: '12px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: 0.6,
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
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem', overflowY: 'auto',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#141414', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px', padding: '2rem',
            width: '100%', maxWidth: '560px', margin: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', letterSpacing: '2px', color: '#f5f5f0' }}>
                {modal === 'create' ? 'NUEVO PRODUCTO' : 'EDITAR PRODUCTO'}
              </h2>
              <button onClick={closeModal} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#888', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>

            {/* Image upload */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={mLabel}>Imagen del producto</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '100%', height: '160px',
                  border: `2px dashed ${imagePreview ? 'rgba(77,255,210,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '10px', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', position: 'relative',
                  background: imagePreview ? 'none' : 'rgba(255,255,255,0.02)',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(77,255,210,0.5)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = imagePreview ? 'rgba(77,255,210,0.3)' : 'rgba(255,255,255,0.08)')}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: 0, transition: 'opacity 0.2s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                    >
                      <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>Cambiar imagen</span>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', color: '#444' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
                    <div style={{ fontSize: '13px', color: '#555' }}>Toca para subir una foto</div>
                    <div style={{ fontSize: '11px', color: '#333', marginTop: '4px' }}>JPG, PNG, WEBP — máx. 5MB</div>
                  </div>
                )}
              </div>
              {/* Input oculto — acepta cámara en móvil */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              {imagePreview && (
                <button
                  onClick={() => { setImageFile(null); setImagePreview(null); setEditing(p => ({ ...p, image_url: null })) }}
                  style={{
                    marginTop: '6px', background: 'transparent',
                    border: 'none', color: '#E74C3C', fontSize: '12px',
                    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', padding: 0,
                  }}
                >
                  ✕ Quitar imagen
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <MField label="Nombre *" value={editing.name ?? ''} onChange={field('name')} placeholder="Cachorro Vital" />
              <MField label="Marca *" value={editing.brand ?? ''} onChange={field('brand')} placeholder="Royal Canin" />
              <MField label="Categoría *" value={editing.category ?? ''} onChange={field('category')} placeholder="Cachorros" />
              <MField label="Emoji (fallback)" value={editing.emoji ?? ''} onChange={field('emoji')} placeholder="🐾" />
              <MField label="Precio USD" value={String(editing.price_usd ?? '')} onChange={field('price_usd')} placeholder="0.00" type="number" />
              <MField label="Peso (kg)" value={String(editing.weight_kg ?? '')} onChange={field('weight_kg')} placeholder="0.0" type="number" />
              <MField label="Color" value={editing.color ?? ''} onChange={field('color')} placeholder="#4DFFD2" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '20px' }}>
                <label style={{ fontSize: '13px', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" checked={editing.in_stock ?? true}
                    onChange={e => setEditing(prev => ({ ...prev, in_stock: e.target.checked }))}
                    style={{ accentColor: '#4DFFD2', width: 16, height: 16 }}
                  />
                  En stock
                </label>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={mLabel}>Descripción</label>
              <textarea value={editing.description ?? ''} onChange={field('description')} rows={2}
                placeholder="Descripción del producto..."
                style={{ ...mInput, resize: 'vertical', fontFamily: 'DM Sans, sans-serif' }} />
            </div>
            <div style={{ marginTop: '1rem' }}>
              <label style={mLabel}>Ingredientes</label>
              <textarea value={editing.ingredients ?? ''} onChange={field('ingredients')} rows={2}
                placeholder="Pollo, arroz, ..."
                style={{ ...mInput, resize: 'vertical', fontFamily: 'DM Sans, sans-serif' }} />
            </div>
            <div style={{ marginTop: '1rem' }}>
              <label style={mLabel}>Beneficios (separados por coma)</label>
              <input
                value={(editing.benefits ?? []).join(', ')}
                onChange={e => setEditing(prev => ({ ...prev, benefits: e.target.value.split(',').map(b => b.trim()).filter(Boolean) }))}
                placeholder="Crecimiento, Energía, Pelaje brillante"
                style={mInput}
              />
            </div>

            <button onClick={handleSave} disabled={saving || uploading} style={{
              marginTop: '1.5rem', width: '100%', padding: '14px',
              background: saving || uploading ? '#1e1e1e' : '#4DFFD2',
              color: saving || uploading ? '#555' : '#0d0d0d',
              border: 'none', borderRadius: '8px',
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', letterSpacing: '3px',
              cursor: saving || uploading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
            }}>
              {uploading ? 'SUBIENDO IMAGEN...' : saving ? 'GUARDANDO...' : modal === 'create' ? 'CREAR PRODUCTO' : 'GUARDAR CAMBIOS'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const mLabel: React.CSSProperties = {
  display: 'block', fontSize: '10px', letterSpacing: '1.5px',
  textTransform: 'uppercase', color: '#555', marginBottom: '6px', fontWeight: 500,
}
const mInput: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
  padding: '10px 14px', color: '#f5f5f0', fontSize: '13px',
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
