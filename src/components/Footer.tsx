import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      background: '#080808',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      padding: '3rem 2rem 2rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: '#4DFFD2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                
              }}>
                <Image 
                              src="/woofccs_logo.png" 
                              alt="EWoofCCS" 
                              width={48} 
                              height={48}
                              className="w-10 h-10 md:w-12 md:h-12"
                            />
                {/* <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '18px', color: '#0d0d0d' }}>W</span> */}
              </div>
              
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '22px', letterSpacing: '4px', color: '#f5f5f0' }}>
                WOOF<span style={{ color: '#4DFFD2' }}>CCS</span>
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>
              Comida Natural para mascotas.<br />
            </p>
          </div>

          {/* Links */}
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#4DFFD2', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Tienda
            </div>
            {['Cachorros', 'Adultos', 'Seniors', 'Sin Cereales', 'Premios'].map(l => (
              <div key={l} style={{ marginBottom: '8px' }}>
                <a href="#productos" style={{ fontSize: '14px', color: '#555', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#f5f5f0')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                >
                  {l}
                </a>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#4DFFD2', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Contacto
            </div>
            {[
              { icon: '📱', text: 'WhatsApp: 0414 278 7453' },
              { icon: '📍', text: 'Caracas, Venezuela' },
              { icon: '🕐', text: 'Lun–Sáb 9am–6pm' },
              { icon: '📦', text: 'Delivery en 24–48h' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', gap: '8px', marginBottom: '10px', fontSize: '13px', color: '#555' }}>
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Social */}
          <div>
            <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#4DFFD2', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Síguenos
            </div>
            {['Instagram', 'TikTok'].map(s => (
              <div key={s} style={{ marginBottom: '8px' }}>
                <a href="#" style={{ fontSize: '14px', color: '#555', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#4DFFD2')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                >
                  @woofccs · {s}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <span style={{ fontSize: '12px', color: '#333' }}>
            © {new Date().getFullYear()} WoofCCS. Todos los derechos reservados.
          </span>
          <span style={{ fontSize: '12px', color: '#333' }}>
              Diseñado por <a href="" style={{ color: '#4DFFD2', textDecoration: 'none' }}>LowPriority</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
