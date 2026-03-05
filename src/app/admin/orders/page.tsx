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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
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
  const counts = STATUS_ORDER.reduce((acc, s) => { acc[s] = orders.filter(o => o.status === s).length; return acc }, {} as Record<OrderStatus, number>)

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('es-VE', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div>
      <style>{`
        .orders-header { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.5rem; }
        .status-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-bottom: 1.5rem; }
        .order-row { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 0.75rem; padding: 1rem; cursor: pointer; }
        .order-detail { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 640px) {
          .status-cards { grid-template-columns: repeat(2, 1fr) !important; }
          .order-row { grid-template-columns: 1fr auto !important; }
          .order-date { display: none !important; }
          .order-detail { grid-template-columns: 1fr !important; }
          .status-changer { flex-direction: row !important; flex-wrap: wrap !important; }
        }
      `}</style>

      <div className="orders-header">
        <div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(28px, 6vw, 42px)', letterSpacing: '2px', color: '#f5f5f0', lineHeight: 1 }}>PEDIDOS</h1>
          <p style={{ color: '#555', fontSize: '13px', marginTop: '2px' }}>{orders.length} en total</p>
        </div>
        <button onClick={fetchOrders} style={{
          padding: '8px 16px', background: 'transparent',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
          color: '#888', fontSize: '12px', cursor: 'pointer',
          letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif',
        }}>↻ Actualizar</button>
      </div>

      {/* Status cards */}
      <div className="status-cards">
        {STATUS_ORDER.map(s => {
          const cfg = STATUS_CONFIG[s]
          return (
            <button key={s} onClick={() => setFilter(filter === s ? 'all' : s)} style={{
              background: filter === s ? cfg.bg : '#111',
              border: `1px solid ${filter === s ? cfg.color + '50' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: '10px', padding: '0.75rem', cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.2s',
            }}>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '28px', color: cfg.color, lineHeight: 1 }}>{counts[s]}</div>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{cfg.label}</div>
            </button>
          )
        })}
      </div>

      {/* Orders */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#444', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '3px' }}>CARGANDO...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#333', fontSize: '14px' }}>No hay pedidos</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map(order => {
            const cfg = STATUS_CONFIG[order.status]
            const isExpanded = expanded === order.id
            return (
              <div key={order.id} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                <div className="order-row" onClick={() => setExpanded(isExpanded ? null : order.id)}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: '#f5f5f0', fontSize: '14px', marginBottom: '2px' }}>{order.name}</div>
                    <div style={{ fontSize: '12px', color: '#444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {order.products}
                    </div>
                  </div>
                  <div className="order-date" style={{ fontSize: '11px', color: '#444', whiteSpace: 'nowrap' }}>
                    {formatDate(order.created_at)}
                  </div>
                  <div style={{
                    padding: '3px 10px', borderRadius: '100px',
                    background: cfg.bg, border: `1px solid ${cfg.color}40`,
                    color: cfg.color, fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap',
                  }}>{cfg.label}</div>
                </div>

                {isExpanded && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1rem' }}>
                    <div className="order-detail" style={{ marginBottom: '1rem' }}>
                      {[
                        { label: 'Teléfono', value: order.phone },
                        { label: 'Email', value: order.email || '—' },
                        { label: 'Dirección', value: order.address || '—' },
                        { label: 'Fecha', value: formatDate(order.created_at) },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div style={{ fontSize: '10px', color: '#444', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</div>
                          <div style={{ fontSize: '13px', color: '#aaa' }}>{value}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '10px', color: '#444', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Productos</div>
                      <div style={{ fontSize: '13px', color: '#aaa', lineHeight: 1.6, background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '6px' }}>
                        {order.products}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '10px', color: '#444', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Cambiar estado</div>
                      <div className="status-changer" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {STATUS_ORDER.map(s => {
                          const c = STATUS_CONFIG[s]
                          const isActive = order.status === s
                          return (
                            <button key={s} onClick={() => updateStatus(order.id, s)}
                              disabled={isActive || updating === order.id}
                              style={{
                                padding: '8px 14px', borderRadius: '6px', fontSize: '12px',
                                background: isActive ? c.bg : 'transparent',
                                border: `1px solid ${isActive ? c.color + '50' : 'rgba(255,255,255,0.07)'}`,
                                color: isActive ? c.color : '#555',
                                cursor: isActive ? 'default' : 'pointer',
                                fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
                                flex: '1 1 auto',
                              }}
                            >{c.label}</button>
                          )
                        })}
                      </div>
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