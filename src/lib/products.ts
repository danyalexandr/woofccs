export interface Product {
  id: string
  name: string
  brand: string
  category: string
  price_usd: number
  weight_kg: number
  description: string
  ingredients: string
  benefits: string[]
  emoji: string
  color: string
  in_stock: boolean
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Proteina de res',
    brand: 'Royal Canin',
    category: 'Cachorros',
    price_usd: 3,
    weight_kg: 4,
    description: 'Fórmula específica para cachorros de todas las razas. Apoya el desarrollo cognitivo y del sistema inmune con antioxidantes exclusivos.',
    ingredients: 'Pollo deshidratado, arroz integral, salmón, omega-3, vitaminas A, D, E',
    benefits: ['Desarrollo óseo', 'Sistema inmune fuerte', 'Crecimiento saludable'],
    emoji: '🐄',
    color: '#FF6B35',
    in_stock: true,
  },
  {
    id: '2',
    name: 'Proteina de pollo ',
    brand: 'Hills Science',
    category: 'Adultos',
    price_usd: 3,
    weight_kg: 7.5,
    description: 'Nutrición completa para perros adultos activos. Alto en proteína de pollo real para mantener masa muscular magra.',
    ingredients: 'Pollo, harina de pollo, arroz integral, cebada, grasas animales',
    benefits: ['Masa muscular', 'Energía sostenida', 'Pelaje brillante'],
    emoji: '🐓',
    color: '#4DFFD2',
    in_stock: false,
  },
  {
    id: '3',
    name: 'Proteina de cordero',
    brand: 'Purina Pro Plan',
    category: 'Seniors',
    price_usd: 5,
    weight_kg: 6,
    description: 'Diseñado para perros mayores de 7 años. Calorías controladas con glucosamina para articulaciones saludables.',
    ingredients: 'Salmón, arroz, maíz, glucosamina, condroitina, vitamina E',
    benefits: ['Articulaciones', 'Control de peso', 'Digestión fácil'],
    emoji: '🐑',
    color: '#9B59B6',
    in_stock: false,
  },
  {
    id: '4',
    name: 'Patas de Pollo deshidratadas',
    brand: 'Orijen',
    category: 'Sin Cereales',
    price_usd: 2,
    weight_kg: 5.9,
    description: 'Alimento biológicamente apropiado. 85% ingredientes de origen animal, sin granos, sin rellenos artificiales.',
    ingredients: 'Salmón fresco, arenque, bacalao, hígado de pollo, huevo entero',
    benefits: ['Sin granos', 'Alta proteína', 'Apto sensibles'],
    emoji: '🍗',
    color: '#3498DB',
    in_stock: false,
  },
  {
    id: '5',
    name: 'Mix de res, pollo y cordero',
    brand: 'Taste of the Wild',
    category: 'Húmedo',
    price_usd: 15,
    weight_kg: 1.2,
    description: 'Comida húmeda de res y vegetales. Sin conservantes artificiales, ideal para mezclar con croquetas.',
    ingredients: 'Res, caldo de hueso, zanahoria, guisantes, arándanos',
    benefits: ['Alta hidratación', 'Palatabilidad máxima', 'Sin conservantes'],
    emoji: '🧆',
    color: '#E74C3C',
    in_stock: false,
  },
  {
    id: '6',
    name: 'Caldo de hueso de pollo',
    brand: 'WoofCCS',
    category: 'Premios',
    price_usd: 12,
    weight_kg: 0.5,
    description: 'Premios pequeños y suaves, perfectos para entrenamiento. Sabor a pollo y camote que los vuelve locos.',
    ingredients: 'Pollo, camote, avena, aceite de coco, extracto de arándano',
    benefits: ['Bajo en calorías', 'Perfectos para training', 'Sin azúcar añadida'],
    emoji: '🍲',
    color: '#F39C12',
    in_stock: false,
  },
]
