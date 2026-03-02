'use client'

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ProductGrid from '@/components/ProductGrid'
import OrderForm from '@/components/OrderForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      <Header />
      <Hero />
      <ProductGrid />
      <OrderForm />
      <Footer />
    </main>
  )
}
