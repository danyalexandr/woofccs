import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  created_at: string
  name: string
  phone: string
  email: string | null
  address: string | null
  products: string
  notes: string | null
  status: OrderStatus
}

export interface Product {
  id: string
  created_at: string
  name: string
  brand: string
  category: string
  price_usd: number
  weight_kg: number
  description: string | null
  ingredients: string | null
  benefits: string[] | null
  emoji: string
  color: string
  in_stock: boolean
  image_url: string | null   // ← nuevo
}
