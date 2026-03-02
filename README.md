# WoofCCS — Pet Food Store

Tienda de comida para mascotas. Stack: **Next.js 14 + Supabase + Vercel**.

## Setup Rápido

### 1. Crear proyecto Next.js

```bash
npx create-next-app@latest woofccs --typescript --tailwind --app
cd woofccs
npm install @supabase/supabase-js
```

### 2. Copiar los archivos

Copia los archivos de este proyecto en tu carpeta:
- `app/` → reemplaza el contenido de `app/`
- `components/` → crea esta carpeta en la raíz
- `lib/` → crea esta carpeta en la raíz

### 3. Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor** y ejecuta el contenido de `supabase/schema.sql`
3. Copia `.env.local.example` → `.env.local` y llena tus keys

```bash
cp .env.local.example .env.local
```

Llena las variables con los valores de **Supabase → Settings → API**:
```
NEXT_PUBLIC_SUPABASE_URL=https://lzhtrvakazmfqljdaqys.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6aHRydmFrYXptZnFsamRhcXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMjc5NTAsImV4cCI6MjA4NzkwMzk1MH0.n2FnVTvl44kzNVLsyuGB6VR91dVIFR4BFd0PHDTz28I
```

### 4. Correr en local

```bash
npm run dev
```

### 5. Deploy en Vercel

```bash
npm install -g vercel
vercel
```

Agrega las variables de entorno en **Vercel → Settings → Environment Variables**.

## Personalización

### Cambiar productos
Edita `lib/products.ts` — cada producto tiene: nombre, precio, descripción, beneficios, emoji e ingredientes.

### Cambiar colores / fuentes
Edita `app/globals.css` — todo usa variables CSS bajo `:root`.

### Agregar imágenes reales
Reemplaza los emojis en `ProductCard` y `ProductModal` con componentes `<Image>` de Next.js apuntando a tus imágenes en `/public` o Supabase Storage.

### Ver pedidos
Los pedidos se guardan en la tabla `orders` de Supabase. Puedes verlos en:
- **Supabase → Table Editor → orders**
- O construir un panel admin con autenticación Supabase Auth

## Estructura del Proyecto

```
woofccs/
├── app/
│   ├── layout.tsx        # Root layout + metadata
│   ├── page.tsx          # Home page
│   └── globals.css       # Brand styles + CSS variables
├── components/
│   ├── Header.tsx        # Navbar sticky + scroll effect
│   ├── Hero.tsx          # Hero section
│   ├── ProductGrid.tsx   # Catálogo con filtros
│   ├── ProductModal.tsx  # Modal detalle + contador cantidad
│   ├── OrderForm.tsx     # Formulario → Supabase
│   └── Footer.tsx        # Footer completo
├── lib/
│   └── products.ts       # Tipos y datos de productos
└── supabase/
    └── schema.sql        # SQL para crear tabla orders
```
# woofccs
