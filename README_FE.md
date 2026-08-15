# Morning Mist Coffee

Specialty coffee, slowly served. An editorial storefront and admin panel built with Next.js.

Full endpoint reference for the API this app talks to: Swagger UI at [`/documents`](https://morning-mist-coffee-backend.onrender.com/documents) on the backend (auto-generated from its Zod schemas, always in sync).

## Tech Stack

- **Framework** — Next.js 16.2.4 (App Router)
- **UI** — React 19, shadcn/ui, Tailwind CSS 4
- **Data fetching** — TanStack Query v5
- **Forms** — react-hook-form + zod
- **Icons** — lucide-react
- **Font** — Geist
- **Language** — TypeScript 5 (strict)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (e.g. `http://localhost:3000`) |

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:8196](http://localhost:8196) (dev server port is fixed in `package.json`, not the Next.js default).

## Scripts

```bash
npm run dev       # Start dev server on :8196
npm run build     # Production build
npm start         # Start production server
npm run lint      # Run ESLint (no --fix)
npx tsc --noEmit  # Type-check
```

## Project Structure

```
app/
├── (storefront)/     # Public storefront routes — layout adds Nav + Footer
│   ├── page.tsx      # Landing page
│   ├── shop/         # Product listing + detail (by slug)
│   ├── journal/       # Blog
│   ├── story/         # Brand story
│   ├── checkout/      # Checkout
│   └── track-order/   # Guest order lookup (email + receipt code)
├── login/             # Admin login (redirects non-admin accounts back out)
├── mist-ops/          # Admin panel, mounted at /mist-ops (not /admin)
│   ├── page.tsx        # Overview dashboard
│   ├── analytics/
│   ├── orders/
│   ├── products/
│   ├── users/
│   └── _components/    # AdminSidebar, DataTable, PageHeader, StatCard, Badge
├── _components/       # Shared: Nav, Footer, Container, ProductCard, Chip,
│                       # CartCount, ChatWidget, VoiceSearchDialog, ErrorNotice
└── providers.tsx       # QueryClient > AuthProvider > CartProvider + Toaster

components/ui/          # shadcn components only

lib/
├── types.ts               # Shared domain types (Product, ProductVariant, ...)
├── auth-context.tsx        # AuthProvider: access/refresh tokens live in httpOnly
│                             # cookies (backend-set); FE only holds csrfToken + user
├── cart.tsx                 # CartProvider: localStorage cart via useSyncExternalStore
├── product-variants.ts       # getDefaultVariant(), getVariantLabel(), getPropertyValue()
└── api/
    ├── client.ts              # authFetch() (401 → refresh, 403 → CSRF resync, retry once),
    │                          # csrfToken storage (localStorage), listQuery()
    ├── auth.ts                 # postLogin(), postLogout(), postRefresh()
    ├── products.ts              # fetchProducts(), fetchProduct(slug), CRUD, searchProductsByVoice()
    ├── product-categories.ts    # fetchProductCategories(), createProductCategory()
    ├── product-properties.ts    # fetchProductProperties(), createProductProperty()
    ├── orders.ts                 # fetchOrders(), createOrder(), lookupOrders(), updateOrderStatus()
    ├── users.ts                   # fetchUsers(), updateUser()
    └── chat.ts                     # sendChatMessage()

hooks/                    # TanStack Query wrappers around lib/api/* — no fetch here
```

All network calls go through `lib/api/*`; components and hooks never call `fetch`/`authFetch` directly. See [CLAUDE.md](./CLAUDE.md) for the full architecture rules.

## Docker

Build and run a production image:

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://your-domain.com -t morning-mist .
docker run -p 3000:3000 morning-mist
```

The image uses a 3-stage build (`deps → builder → runner`) with `output: standalone` for a minimal footprint. The container listens on `3000` regardless of the dev server's `:8196`.
