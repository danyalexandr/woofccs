'use client'

import { useState } from 'react'
import { CartProvider } from '@/lib/CartContext'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ProductGrid from '@/components/ProductGrid'
import OrderForm from '@/components/OrderForm'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'

export default function Home() {
  const [pendingItem, setPendingItem] = useState(null)

  const handleClear = () => {
    setPendingItem(null)
  }

  return (
    <CartProvider>
      <main className="min-h-screen bg-[#0d0d0d]">
        <Header />
        <Hero />
        <ProductGrid />
        <OrderForm pendingItem={pendingItem} onClear={handleClear} />
        <Footer />
        <CartDrawer />
      </main>
    </CartProvider>
  )
}
