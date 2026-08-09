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
  providers.tsx           — QueryClient > AuthProvider > CartProvider + Toaster
                            (Auth is inside Query so logout can clear the cache)
  globals.css             — Tailwind 4 global styles
  _components/            — shared: HeaderHeightSync, PromoBanner, Nav, Footer,
                            Container, Hero, ProductCard, Chip, CartCount,
                            ChatWidget, VoiceSearchDialog
  _data/                  — static data constants
  (storefront)/           — public storefront routes (layout has Header + Footer)
                            each route's own intro block (e.g. ShopIntro,
                            TrackOrderIntro) lives in that route's _components/,
                            not in app/_components/ — it is not shared
  login/                  — admin login page (admin-only, checks role before redirect)
  mist-ops/               — admin panel (/mist-ops, not /admin)
    layout.tsx            — auth guard: redirects non-admin to /login
    _components/          — AdminSidebar, Badge, DataTable, PageHeader, StatCard
components/ui/            — shadcn components ONLY (button, card, dialog, …).
                            App components belong in app/_components/, never here.
lib/
  types.ts                — shared domain types (Product). Never import these
                            from a component module.
  auth-context.tsx        — AuthProvider: in-memory access token, HttpOnly refresh cookie
  cart.tsx                — CartProvider: localStorage cart via useSyncExternalStore
  product-attributes.ts   — roast/process inferred from product name (stopgap)
  api/client.ts           — authFetch() with auto-retry on 401,
                            refreshAccessToken() (deduped), listQuery()
  api/auth.ts             — postLogin(), postLogout(), postRefresh(), fetchMe()
  api/products.ts         — fetchProducts(), fetchProduct() (by slug),
                            updateProduct(), searchProductsByVoice()
  api/orders.ts           — fetchOrders(), updateOrderStatus(), createOrder(),
                            lookupOrders(code) — order ID only, no email
  api/users.ts            — fetchUsers(), updateUser()
  api/chat.ts             — sendChatMessage()
hooks/
  use-products.ts         — useProducts(), useUpdateProduct(), useCreateProduct(),
                            useDeleteProduct()
  use-orders.ts           — useOrders(), useUpdateOrderStatus(), useCreateOrder(),
                            useLookupOrders()
  use-users.ts            — useUsers(), useUpdateUser()
  use-product-types.ts    — useProductTypes()
  use-chat.ts             — useChat()
  use-voice-search.ts     — useVoiceSearch()
  use-temporary-flag.ts   — useTemporaryFlag(): self-clearing "Đã thêm" confirmations
  use-debounced-value.ts  — useDebouncedValue(): one request per typing pause
```

**Data fetching pattern:** server components call `fetchProducts()` directly; client components use TanStack Query hooks.

**No `fetch`/`authFetch` in components or hooks.** Every network call goes through a `lib/api/*` module; hooks wrap it in `useQuery`/`useMutation`. Hand-rolled `useState` loading/error state for a network call is a bug, not a style choice.

**Browser-API state stays local.** `useVoiceSearch` keeps the `MediaRecorder` lifecycle (`isRecording`, countdown, stream refs) in `useState`/`useRef` and hands only the resulting `Blob` to `useMutation` — Query owns the request, not the device.

**Global staleTime:** `providers.tsx` sets `staleTime: 60_000` on the `QueryClient`. Do not restate it per hook. Override only when the value genuinely differs from the global, and add a comment saying why (see `use-product-types.ts`).

## Auth flow

`AuthProvider` (in `lib/auth-context.tsx`) holds the in-memory access token and user object. It does **not** restore the session on mount — the routes that need one (`app/mist-ops/layout.tsx`, `app/login/page.tsx`) call `ensureSession()` in an effect, so public pages fire no auth request. `ensureSession()` is idempotent; `isLoading` stays `true` until an attempt settles.

All auth endpoints live in `lib/api/auth.ts` — never call them with a bare `fetch()`. The deduped refresh lives in `lib/api/client.ts` as `refreshAccessToken()`; `authFetch()` and `ensureSession()` share it, so a 401 retry and a session restore never race. `authFetch()` handles 401 → refresh → retry automatically.

`logout()` calls `queryClient.clear()`, so cached admin data cannot leak across accounts.

**Admin guard:** `app/mist-ops/layout.tsx` shows a loading state for any render where `isLoading || !user || user.role !== 'admin'`, then `router.replace('/login')` via `useEffect`. Always use `router.replace` (not `push`) for auth redirects to avoid history stacking.

**Login page redirect rule:** Only redirect to `/mist-ops` when `user.role === 'admin'`. If a non-admin account logs in, call `logout()` and show an error — otherwise an infinite redirect loop occurs between the login page and the admin layout.

## Components

**Do not recreate** any of these — grep before adding:

- Shared: `app/_components/` — HeaderHeightSync, PromoBanner, Nav, Footer, Container, Hero, ErrorNotice, ProductCard, Chip, CartCount, ChatWidget, VoiceSearchDialog
- Admin: `app/mist-ops/_components/` — AdminSidebar, Badge, DataTable, Pagination, PageHeader, StatCard
- shadcn: `@/components/ui/*` — add with `npx shadcn add <name>`

**Deleted (do not recreate):** Button.tsx · SectionHeading.tsx · AdminTopbar.tsx

**Shared product type:** `Product` is defined in `lib/types.ts` — not in a component, so `lib/api` and the hooks do not depend on a `'use client'` module.

**`slug` comes from the API — never derive it.** The backend owns `products.slug` (unique, stable across renames). `fetchProduct(slug)` hits `GET /api/v1/products/slug/:slug` in a single request. Do not reconstruct a slug from `name`: it collides on duplicate names and mangles Vietnamese diacritics.

**`origin` / `tastingNotes` / `description` are three real API fields** — not parsed out of one string any more. `transform()` maps them straight through (`origin` falls back to a placeholder when null). Never re-introduce line-count parsing, and never merge them back into a single textarea: the admin form edits each one separately and sends `tastingNotes` as an array.

## Admin Dashboard Best Practices

- **Search Inputs**: Place search inputs directly inside `<PageHeader actions={...}>` on all admin table pages (`products`, `users`, `orders`). Use unified styling (`pl-10 bg-card w-full`) and wrap with `<div className="relative w-full sm:w-64">` so the search bar spans full-width on mobile and behaves consistently on desktop.
- **Search Filtering is server-side.** Bind the input to `useState`, pass it through `useDebouncedValue(search)`, and hand the debounced value to the query hook as its `q` argument (`useProducts(page, LIMIT, debouncedSearch)`). The API filters across the whole table, not just the loaded page. **Never re-add client-side `filteredItems`** — it silently hides matches on other pages.
- **Reset paging when the query changes**: call `setPage(1)` inside the search input's `onChange`, not in a `useEffect` — the React Compiler lint rule rejects `setState` in an effect body.
- **Pagination**: Use `<Pagination>` from `DataTable.tsx` in the `<DataTable footer={…}>` slot. Do not hand-roll prev/next markup per page.
- **`disabled` never works on `<Button asChild>`**: Slot renders an `<a>`, and anchors do not match the `:disabled` pseudo-class, so `disabled:opacity-50` and `disabled:pointer-events-none` silently do nothing. Render a real `<button>` for the disabled case (see `PageArrow` in `shop-content.tsx`).
- **Action Buttons**: Keep table action buttons (`Thao tác` column) always visible on mobile/tablet viewports. Avoid hover-only visibility modifiers (like `group-hover:opacity-100`) on touch devices since they don't support hover events. In mobile card view, render action buttons on the same row as the primary column (via `flex justify-between items-start gap-4` in `DataTable.tsx`).

## Images — MANDATORY

- **Never `<img>`** — always `import Image from "next/image"` and `<Image>`.
- `fill` mode requires parent `relative` + `className="object-cover"` + `sizes` prop.
- First visible image on a page gets `priority`.
- External hosts must be in `next.config.ts` → `images.remotePatterns`.

## Design Tokens

Use shadcn/ui CSS tokens only. MD3/Material tokens (`bg-surface-*`, `bg-secondary-container`, etc.) will not resolve. Full list + examples: `.claude/skills/design-tokens/SKILL.md`. Pre-edit hook blocks violations automatically — fix them, don't bypass.

## Page structure (storefront)

Every `(storefront)` page follows the same shape:

```
Header (fixed, rendered once in app/(storefront)/layout.tsx)
  ├─ PromoBanner
  └─ Nav
Main
  ├─ Hero          — optional, full-bleed image + title (home, story, journal)
  ├─ PageIntro     — optional, centered/aligned title + description, no image
  │                  (own component per page, e.g. ShopIntro, TrackOrderIntro —
  │                  do NOT create a shared generic PageIntro/Hero-content component)
  └─ PageContent   — the actual page content
Footer
```

A page has Hero **or** PageIntro **or** neither — never build a page missing this shape entirely (a bare `<h1>` inside page content instead of one of the above is what caused the drift this section fixes).

## Navigation

The fixed header (`PromoBanner` + `Nav`) is **not a constant height** — the promo banner and logo can wrap on narrow phones (measured: 104px normally, 116px at ≤360px width). `HeaderHeightSync` (`app/_components/HeaderHeightSync.tsx`) measures the real height via `ResizeObserver` and publishes it as the CSS var `--header-height`.

- **`Container navOffset`** uses `HEADER_HEIGHT_CSS` (`var(--header-height, 104px)`) plus a fixed `2rem` breathing-room gap — this is for text-content pages (`shop`, `shop/[slug]`, `checkout`, `track-order`).
- **`Hero`** (`app/_components/Hero.tsx`) uses `HEADER_HEIGHT_CSS` with **no** extra gap — its image sits flush against the header on purpose.
- Never hard-code a `pt-*` value to clear the header — both mechanisms above already do it correctly at every breakpoint. Never make Nav sticky.

## Consistency rules

These exist because the codebase drifted; a review found each one. Do not reintroduce them.

- **Page wrappers**: always `<Container>`. Never hand-write `max-w-7xl mx-auto px-4 sm:px-6 md:px-gutter`. `size` is `narrow | default | wide`; `as` keeps `<section>` semantics; `navOffset` applies the one true header clearance (see Navigation section above) — never hard-code a `pt-*` to clear the header.
- **Spacing**: numeric Tailwind only (`py-12`, `gap-6`). The `--spacing-md/lg/xl` aliases are gone from components; `px-gutter` stays because the responsive padding rule below uses it.
- **Rounding**: `rounded-lg` for controls (button, input, select), `rounded-xl` for surfaces (card, dialog, image, panel), `rounded-full` for pills and avatars. No `rounded-md`, no `rounded-2xl`.
- **Letter spacing**: buttons use `uppercase tracking-wider`; headings, eyebrows and table labels use `uppercase tracking-widest`.
- **Controls**: always the shadcn component — `Input`, `Textarea`, `Select`, `Button`. Raw `<input>`, `<select>`, `<textarea>` and `<button>` are only acceptable for a checkbox or a genuinely inline text affordance.
- **Forms**: `react-hook-form` + `zod` + the shadcn `Form` primitives, always. Never hand-roll `useState` per field, and never `return` silently on invalid input — that is how the product dialog used to swallow a bad price.
- **Async state**: `Skeleton` for loading, `<ErrorNotice>` for failures, `toast.success(...)` after a successful mutation. All three admin tables and the storefront follow this.
- **Query hooks** destructure `{ data, isLoading, isError }` — not `error`.
- **Stat cards must show real numbers.** If a figure is only true for the loaded page, label it `Trên trang này`. Never ship a placeholder number.

## Responsive

Mobile-first. Base → `sm:` (640px) → `md:` (768px) → `lg:` (1024px). Grids: `grid-cols-1 md:grid-cols-12` (skip sm grid). Padding: `px-4 sm:px-6 md:px-gutter`. Never use `px-margin-safe`.

**One-sided offsets need a matching mobile gutter.** A content block intentionally pinned to one side of a full-bleed section (e.g. `ml-4 sm:ml-6 md:ml-gutter` to hug the left edge on desktop) must carry the same value as `mx-*`, not `ml-*`, below the breakpoint where the offset kicks in — otherwise it has a gutter on one side and touches the viewport edge on the other. Drop the opposite side back out (`md:mr-0`) only once desktop layout has room to spare. This is how the journal hero card looked lopsided on mobile.

## Code Quality

- No dead code, no unused imports — delete them.
- No `eslint-disable` comments — fix the violation.
- No duplicate markup (3+ repeats → extract a component).
- No over-engineering — no abstractions for hypothetical cases.
- Run `npx tsc --noEmit` after non-trivial changes.
- Icons: lucide-react only.
