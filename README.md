# Morning Mist Coffee

Specialty coffee, slowly served. An editorial storefront and admin panel built with Next.js.

## Tech Stack

- **Framework** — Next.js 16.2.4 (App Router)
- **UI** — React 19, shadcn/ui, Tailwind CSS 4
- **Data fetching** — TanStack Query v5
- **Icons** — lucide-react
- **Font** — Geist
- **Language** — TypeScript 5 (strict)

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

| Variable              | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL for API calls (e.g. `http://localhost:3000`) |

### 3. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
npx tsc --noEmit  # Type-check
```

## Project Structure

```
app/
├── (storefront)/     # Public storefront routes
│   ├── page.tsx      # Landing page
│   ├── shop/         # Product listing + detail
│   ├── journal/      # Blog
│   ├── story/        # Brand story
│   └── checkout/     # Checkout
├── admin/            # Admin panel (/admin)
│   ├── page.tsx      # Overview dashboard
│   ├── analytics/
│   ├── orders/
│   ├── products/
│   └── users/
├── api/
│   └── products/     # GET /api/products
├── _components/      # Shared components (Nav, Footer, ProductCard, Chip, Container)
├── _data/            # Static data (products.ts)
└── providers.tsx     # React Query provider

lib/
└── api/
    └── products.ts   # Typed fetch functions

hooks/
├── use-products.ts   # useProducts(), useProduct(slug)
```

## API

### `GET /api/products`

Returns the full product list.

```ts
// Server component — fetch directly
import { fetchProducts } from '@/lib/api/products';
const products = await fetchProducts();

// Client component — React Query
import { useProducts } from '@/hooks/use-products';
const { data, isLoading, isError } = useProducts();
```

## Docker

Build and run a production image:

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://your-domain.com -t morning-mist .
docker run -p 3000:3000 morning-mist
```

The image uses a 3-stage build (`deps → builder → runner`) with `output: standalone` for a minimal footprint.
