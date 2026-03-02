import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WoofCCS — Comida Premium para tu Mejor Amigo',
  description: 'Tienda de alimentos premium para mascotas en Caracas. Nutrición natural, sabor que aman.',
  openGraph: {
    title: 'WoofCCS',
    description: 'Comida premium para mascotas en Caracas',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
