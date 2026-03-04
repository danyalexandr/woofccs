'use client'

import { useEffect, useState } from 'react'
import { supabase, Order, OrderStatus } from '@/lib/supabase'

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Pendiente',  color: '#F39C12', bg: 'rgba(243,156,18,0.1)'  },
  confirmed: { label: 'Confirmado', color: '#4DFFD2', bg: 'rgba(77,255,210,0.1)'  },
  delivered: { label: 'Entregado',  color: '#27AE60', bg: 'rgba(39,174,96,0.1)'   },
  cancelled: { label: 'Cancelado',  color: '#E74C3C', bg: 'rgba(231,76,60,0.1)'   },
}

const STATUS_ORDER: OrderStatus[] = ['pending', 'confirmed', 'delivered', 'cancelled']

export const dynamic = 'force-dynamic'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data ?? [])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id)
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    setUpdating(null)
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const counts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length
    return acc
  }, {} as Record<OrderStatus, number>)

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('es-VE', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '42px', letterSpacing: '2px', color: '#f5f5f0', lineHeight: 1 }}>
            PEDIDOS
          </h1>
          <p style={{ color: '#555', fontSize: '13px', marginTop: '4px' }}>{orders.length} pedidos en total</p>
        </div>
        <button onClick={fetchOrders} style={{
          padding: '8px 18px', background: 'transparent',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
          color: '#888', fontSize: '12px', cursor: 'pointer', letterSpacing: '1px',
          textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif',
        }}>↻ Actualizar</button>
      </div>

      {/* Status summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {STATUS_ORDER.map(s => {
          const cfg = STATUS_CONFIG[s]
          return (
            <button key={s} onClick={() => setFilter(filter === s ? 'all' : s)} style={{
              background: filter === s ? cfg.bg : '#111',
              border: `1px solid ${filter === s ? cfg.color + '50' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: '12px', padding: '1rem', cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.2s',
            }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '36px', color: cfg.color, lineHeight: 1 }}>
                {counts[s]}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px', letterSpacing: '0.5px' }}>{cfg.label}</div>
            </button>
          )
        })}
      </div>

      {/* Orders list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#444', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '3px' }}>
          CARGANDO...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#333' }}>
          No hay pedidos {filter !== 'all' ? `con estado "${STATUS_CONFIG[filter as OrderStatus].label}"` : ''}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(order => {
            const cfg = STATUS_CONFIG[order.status]
            const isExpanded = expanded === order.id
            return (
              <div key={order.id} style={{
                background: '#111', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s',
              }}>
                {/* Row */}
                <div
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, color: '#f5f5f0', fontSize: '15px' }}>{order.name}</span>
                      <span style={{ fontSize: '12px', color: '#555' }}>{order.phone}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#444', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {order.products}
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: '#444', whiteSpace: 'nowrap' }}>
                    {formatDate(order.created_at)}
                  </div>

                  <div style={{
                    padding: '4px 12px', borderRadius: '100px',
                    background: cfg.bg, border: `1px solid ${cfg.color}40`,
                    color: cfg.color, fontSize: '11px', fontWeight: 600,
                    letterSpacing: '0.5px', whiteSpace: 'nowrap',
                  }}>
                    {cfg.label}
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    padding: '1.25rem',
                    display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem',
                    alignItems: 'start',
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {[
                        { label: 'Email', value: order.email || '—' },
                        { label: 'Dirección', value: order.address || '—' },
                        { label: 'Productos', value: order.products },
                        { label: 'Notas', value: order.notes || '—' },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div style={{ fontSize: '10px', color: '#444', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '3px' }}>{label}</div>
                          <div style={{ fontSize: '13px', color: '#aaa', lineHeight: 1.5 }}>{value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Status changer */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '140px' }}>
                      <div style={{ fontSize: '10px', color: '#444', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Cambiar estado
                      </div>
                      {STATUS_ORDER.map(s => {
                        const c = STATUS_CONFIG[s]
                        const isActive = order.status === s
                        return (
                          <button key={s} onClick={() => updateStatus(order.id, s)}
                            disabled={isActive || updating === order.id}
                            style={{
                              padding: '7px 14px', borderRadius: '6px', fontSize: '12px',
                              background: isActive ? c.bg : 'transparent',
                              border: `1px solid ${isActive ? c.color + '50' : 'rgba(255,255,255,0.07)'}`,
                              color: isActive ? c.color : '#555',
                              cursor: isActive ? 'default' : 'pointer',
                              fontFamily: 'DM Sans, sans-serif',
                              transition: 'all 0.2s',
                              opacity: updating === order.id && !isActive ? 0.5 : 1,
                            }}
                            onMouseEnter={e => { if (!isActive) { (e.currentTarget.style.borderColor = c.color + '50'); (e.currentTarget.style.color = c.color) } }}
                            onMouseLeave={e => { if (!isActive) { (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'); (e.currentTarget.style.color = '#555') } }}
                          >
                            {c.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
