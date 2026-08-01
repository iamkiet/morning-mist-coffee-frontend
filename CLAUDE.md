# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server on :8196
npm run build && npm start
npm run lint         # ESLint, no --fix
npx tsc --noEmit     # type-check
```

## Tech Stack

Next.js 16.2.4 · React 19 · TypeScript 5 (strict) · Tailwind CSS 4 · shadcn/ui (radix-nova) · TanStack Query v5 · react-hook-form + zod · framer-motion · lucide-react · npm

## Project Structure

```
app/
  layout.tsx              — root layout, Geist font (no Inter, no Material Symbols)
  providers.tsx           — QueryClient + AuthProvider + CartProvider + Toaster
  globals.css             — Tailwind 4 global styles
  _components/            — shared: Nav, Footer, Container, ProductCard, Chip,
                            CartCount, ChatWidget, VoiceSearchDialog
  _data/                  — static data constants
  (storefront)/           — public storefront routes (layout has Nav + Footer)
  login/                  — admin login page (admin-only, checks role before redirect)
  mist-ops/               — admin panel (/mist-ops, not /admin)
    layout.tsx            — auth guard: redirects non-admin to /login
    _components/          — AdminSidebar, Badge, DataTable, PageHeader, StatCard
components/ui/            — shadcn components ONLY (button, card, dialog, …).
                            App components belong in app/_components/, never here.
lib/
  auth-context.tsx        — AuthProvider: in-memory access token, HttpOnly refresh cookie
  cart.tsx                — CartProvider: localStorage-based cart, keyed by slug
  api/client.ts           — authFetch() with auto-retry on 401 (deduped refresh)
  api/products.ts         — fetchProducts(), fetchProduct(), updateProduct(),
                            searchProductsByVoice()
  api/orders.ts           — fetchOrders(), updateOrderStatus()
  api/users.ts            — fetchUsers(), updateUser()
  api/chat.ts             — sendChatMessage()
hooks/
  use-products.ts         — useProducts(), useProduct(slug), useUpdateProduct()
  use-orders.ts           — useOrders(), useUpdateOrderStatus()
  use-users.ts            — useUsers(), useUpdateUser()
  use-chat.ts             — useChat()
  use-voice-search.ts     — useVoiceSearch()
```

**Data fetching pattern:** server components call `fetchProducts()` directly; client components use TanStack Query hooks.

**No `fetch`/`authFetch` in components or hooks.** Every network call goes through a `lib/api/*` module; hooks wrap it in `useQuery`/`useMutation`. Hand-rolled `useState` loading/error state for a network call is a bug, not a style choice.

**Browser-API state stays local.** `useVoiceSearch` keeps the `MediaRecorder` lifecycle (`isRecording`, countdown, stream refs) in `useState`/`useRef` and hands only the resulting `Blob` to `useMutation` — Query owns the request, not the device.

**Global staleTime:** `providers.tsx` sets `staleTime: 60_000` on the `QueryClient`. Do not restate it per hook. Override only when the value genuinely differs from the global, and add a comment saying why (see `use-product-types.ts`).

## Auth flow

`AuthProvider` (in `lib/auth-context.tsx`) holds the in-memory access token and user object. On mount it calls `POST /api/v1/auth/refresh` via HttpOnly cookie to restore the session. `authFetch()` in `lib/api/client.ts` handles 401 → refresh → retry automatically with a shared deduped promise.

**Admin guard:** `app/mist-ops/layout.tsx` shows a loading state for any render where `isLoading || !user || user.role !== 'admin'`, then `router.replace('/login')` via `useEffect`. Always use `router.replace` (not `push`) for auth redirects to avoid history stacking.

**Login page redirect rule:** Only redirect to `/mist-ops` when `user.role === 'admin'`. If a non-admin account logs in, call `logout()` and show an error — otherwise an infinite redirect loop occurs between the login page and the admin layout.

## Components

**Do not recreate** any of these — grep before adding:

- Shared: `app/_components/` — Nav, Footer, Container, ProductCard, Chip, CartCount, ChatWidget, VoiceSearchDialog
- Admin: `app/mist-ops/_components/` — AdminSidebar, Badge, DataTable, PageHeader, StatCard
- shadcn: `@/components/ui/*` — add with `npx shadcn add <name>`

**Deleted (do not recreate):** Button.tsx · SectionHeading.tsx · AdminTopbar.tsx

**Shared product type:** `Product` is defined in `app/_components/ProductCard.tsx` and used across hooks, API, and admin pages. `product.description` from the API is split into `origin` (first line) and `notes` (remaining lines) during `transform()` in `lib/api/products.ts`.

## Admin Dashboard Best Practices

- **Search Inputs**: Place search inputs directly inside `<PageHeader actions={...}>` on all admin table pages (`products`, `users`, `orders`). Use unified styling (`pl-10 bg-card w-full`) and wrap with `<div className="relative w-full sm:w-64">` so the search bar spans full-width on mobile and behaves consistently on desktop.
- **Search Filtering**: Bind search inputs to a local state (`const [search, setSearch] = useState('')`) and perform client-side filtering on the fetched data items (e.g., `filteredItems`) before passing them to the `<DataTable>` component.
- **Action Buttons**: Keep table action buttons (`Thao tác` column) always visible on mobile/tablet viewports. Avoid hover-only visibility modifiers (like `group-hover:opacity-100`) on touch devices since they don't support hover events. In mobile card view, render action buttons on the same row as the primary column (via `flex justify-between items-start gap-4` in `DataTable.tsx`).

## Images — MANDATORY

- **Never `<img>`** — always `import Image from "next/image"` and `<Image>`.
- `fill` mode requires parent `relative` + `className="object-cover"` + `sizes` prop.
- First visible image on a page gets `priority`.
- External hosts must be in `next.config.ts` → `images.remotePatterns`.

## Design Tokens

Use shadcn/ui CSS tokens only. MD3/Material tokens (`bg-surface-*`, `bg-secondary-container`, etc.) will not resolve. Full list + examples: `.claude/skills/design-tokens/SKILL.md`. Pre-edit hook blocks violations automatically — fix them, don't bypass.

## Navigation

`Nav` is `position: fixed`. Storefront pages need `pt-28`–`pt-40` to clear it. Full-bleed hero pages intentionally have no top padding. Never make Nav sticky.

## Responsive

Mobile-first. Base → `sm:` (640px) → `md:` (768px) → `lg:` (1024px). Grids: `grid-cols-1 md:grid-cols-12` (skip sm grid). Padding: `px-4 sm:px-6 md:px-gutter`. Never use `px-margin-safe`.

## Code Quality

- No dead code, no unused imports — delete them.
- No `eslint-disable` comments — fix the violation.
- No duplicate markup (3+ repeats → extract a component).
- No over-engineering — no abstractions for hypothetical cases.
- Run `npx tsc --noEmit` after non-trivial changes.
- Icons: lucide-react only.
