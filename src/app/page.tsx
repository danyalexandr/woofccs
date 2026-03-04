'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ProductGrid from '@/components/ProductGrid'
import OrderForm from '@/components/OrderForm'
import Footer from '@/components/Footer'
import { Product } from '@/lib/products'

export interface CartItem {
  product: Product
  qty: number
}



export default function Home() {

  const [pendingItem, setPendingItem] = useState<CartItem | null>(null)

  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      <Header />
      <Hero />
      <ProductGrid onAddToOrder={(item) => setPendingItem(item)} />
      <OrderForm pendingItem={pendingItem} onClear={() => setPendingItem(null)} />
      <Footer />
    </main>
  )
}
