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

## API reference

Backend endpoint/schema reference lives in Swagger UI at [`https://morning-mist-coffee-backend.onrender.com/documents`](https://morning-mist-coffee-backend.onrender.com/documents) — auto-generated from the backend's Zod schemas, always in sync. There is no `API.md` anymore; don't recreate one.

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
  product-variants.ts     — getDefaultVariant()/getTotalStock()/getPriceRange()/
                            getVariantLabel()/getPropertyValue()/getBrewingGuide()
                            helpers over Product.variants
  api/client.ts           — authFetch() with auto-retry on 401,
                            refreshSession() (deduped), fetchMe(), listQuery()
  api/auth.ts             — postLogin(), postLogout(), postRefresh()
  api/products.ts         — fetchProducts(), fetchProduct() (by slug),
                            updateProduct(), searchProductsByVoice(),
                            createProductVariant()/updateProductVariant()/
                            deleteProductVariant(), setProductCategories()
  api/product-categories.ts — fetchProductCategories(), createProductCategory()
  api/orders.ts           — fetchOrders(), updateOrderStatus(), createOrder(),
                            lookupOrders(code) — order ID only, no email
  api/users.ts            — fetchUsers(), updateUser()
  api/chat.ts             — sendChatMessage()
hooks/
  use-products.ts         — useProducts(), useUpdateProduct(), useCreateProduct(),
                            useDeleteProduct(), useCreateProductVariant(),
                            useUpdateProductVariant(), useDeleteProductVariant(),
                            useSetProductCategories()
  use-orders.ts           — useOrders(), useUpdateOrderStatus(), useCreateOrder(),
                            useLookupOrders()
  use-users.ts            — useUsers(), useUpdateUser()
  use-product-categories.ts — useProductCategories()
  use-chat.ts             — useChat()
  use-voice-search.ts     — useVoiceSearch()
  use-temporary-flag.ts   — useTemporaryFlag(): self-clearing "Đã thêm" confirmations
  use-debounced-value.ts  — useDebouncedValue(): one request per typing pause
```

**Data fetching pattern:** server components call `fetchProducts()` directly; client components use TanStack Query hooks.

**No `fetch`/`authFetch` in components or hooks.** Every network call goes through a `lib/api/*` module; hooks wrap it in `useQuery`/`useMutation`. Hand-rolled `useState` loading/error state for a network call is a bug, not a style choice.

**Browser-API state stays local.** `useVoiceSearch` keeps the `MediaRecorder` lifecycle (`isRecording`, countdown, stream refs) in `useState`/`useRef` and hands only the resulting `Blob` to `useMutation` — Query owns the request, not the device.

**Global staleTime:** `providers.tsx` sets `staleTime: 60_000` on the `QueryClient`. Do not restate it per hook. Override only when the value genuinely differs from the global, and add a comment saying why (see `use-product-categories.ts`).

## Auth flow

Access and refresh tokens live entirely in httpOnly cookies set by the backend — `AuthProvider` (in `lib/auth-context.tsx`) never sees the token values, only `csrfToken` and the `user` object. It does **not** eagerly restore the session on mount — the routes that need one (`app/mist-ops/layout.tsx`, `app/login/page.tsx`) call `ensureSession()` in an effect, so public pages fire no auth request. `ensureSession()` calls `fetchMe()` once; since the access-token cookie survives a reload, this is usually a single request — if it's expired, `authFetch`'s built-in 401→refresh→retry handles it transparently. `ensureSession()` is idempotent; `isLoading` stays `true` until an attempt settles.

All auth endpoints live in `lib/api/auth.ts` — never call them with a bare `fetch()`. FE never manually attaches an `Authorization` header or reads `csrf_token`/`access_token` cookies via `document.cookie` — the backend is on a different origin, so those cookies are never readable by FE JS at all (same-origin cookie rule, unrelated to CORS/SameSite); the CSRF token is instead returned in the JSON body of `login`/`register`/`refresh`/`me` and read from there. `csrfToken` is stored in `localStorage` (`setCsrfToken()`/`getCsrfToken()` in `lib/api/client.ts`), not JS memory or a cookie — it needs to survive a hard reload without an extra round trip and stay in sync across tabs (a refresh rotating it in one tab must be picked up by another), and it isn't a secret that needs XSS protection the way access/refresh tokens are. The deduped refresh lives in `lib/api/client.ts` as `refreshSession()`; `authFetch()` and `ensureSession()` (via `fetchMe()`) share it, so a 401 retry and a session restore never race. `authFetch()` retries once on 401 (refresh session) and once on 403 (re-fetch `/me` to resync a stale `csrfToken`, e.g. rotated in another tab) — both transparent to the caller. `/api/v1/auth/*` itself is exempt from CSRF checking (login/register can't be forged without the victim's password; refresh/logout are cookie-only and CORS blocks an attacker from reading their responses).

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

**Products are variant-based, not flat.** `Product` only carries identity/copy (`slug`, `name`, `description`, `image`); price, SKU, stock and expiry live on `Product.variants: ProductVariant[]`. There is no more `origin`/`tastingNotes`/`price`/`stockQuantity`/`productTypeId` on `Product` — the backend dropped them along with the `product_type` concept in favor of `product_categories` (hierarchical) and an EAV `product_properties` model. Use `lib/product-variants.ts` helpers (`getDefaultVariant`, `getPriceRange`, `getTotalStock`) instead of reading a single price/stock field. The API does not return a product's assigned `categoryIds` on `GET` (only accepts them on create/`PUT .../categories`), so the admin edit dialog cannot safely re-display or preserve existing category assignments — category selection only happens at product creation until the backend adds that field to the read response.

**Variant `propertyValues` are real EAV data, not inferred.** `ProductVariant.propertyValues: VariantPropertyValue[]` (`{ propertyId, propertyName, value }`) comes from `GET /products`, `/products/slug/:slug`, `/products/:id`, and voice search — sourced from `product_variant_property_values` in the DB. Use `getPropertyValue(variant, propertyName)` to read one (e.g. `getPropertyValue(variant, 'Mức rang')`). It's absent (empty array) on the admin variant-mutation endpoints (create/update variant, stock adjust), which don't attach it. There used to be a `lib/product-attributes.ts` stopgap that guessed roast level/process method from the product name — it's gone; that data lives in the DB now.

**A variant's customer-facing weight label is parsed from its SKU, not a DB field.** `getVariantLabel(variant)` / `getVariantLabelFromSku(sku)` in `lib/product-variants.ts` strip the trailing weight token off the SKU (`CF-0001-500G` → `500g`) — this is a stopgap, same spirit as the old `product-attributes.ts` one, because there's no weight column on `ProductVariant` (weight is only present as a `Trọng lượng` EAV property, which isn't wired into these helpers). Never show `variant.sku` raw to a customer (storefront cart, checkout, product page) — always go through one of these two functions. Admin surfaces (the products table, `VariantsEditor`) are the one place raw SKU is intentionally shown, since staff need it for inventory.

**Variant/weight selector is a `Button` row, not a `Select`.** `AddToBag.tsx` renders one toggle `Button` per variant (`variant={selected ? 'default' : 'outline'}`) when a product has more than one variant, and a plain `Trọng lượng: {label}` line when it has exactly one — never a dropdown for this, and never the raw SKU (see the two rules above).

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

Control heights, rounding, typography scale, tracking and spacing — everything color doesn't cover — have their own full reference table: `.claude/skills/component-sizing/SKILL.md`. This is where the `Input`/`Select`/`Button` row-height rule (see Consistency rules below) is spelled out with every component's actual height.

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
- **Controls**: always the shadcn component — `Input`, `Textarea`, `Select`, `Button`. Raw `<input>`, `<select>`, `<textarea>` and `<button>` are only acceptable for a checkbox or a genuinely inline text affordance. A selectable chip/pill (e.g. a variant/weight picker) is still a `Button` — toggle `variant={selected ? 'default' : 'outline'}`, never a hand-rolled `<button>` with manual selected/unselected classes (see `AddToBag.tsx`).
- **Forms**: `react-hook-form` + `zod` + the shadcn `Form` primitives, always. Never hand-roll `useState` per field, and never `return` silently on invalid input — that is how the product dialog used to swallow a bad price.
- **Row height alignment**: when `Input`/`SelectTrigger` (both default to `h-8`) sit inline next to a `Button` in the same row (e.g. an inline "add new row" form), the `Button` must be `size="default"` (`h-8`) too — `size="sm"` is `h-7` and visibly misaligns by 4px. `size="icon"` is `size-8` and already matches. Never add a manual height override (`className="h-9"` etc.) to force alignment instead — that drifts from every other Input/Select/Button in the app, which all use their unmodified defaults (see `mist-ops/products/page.tsx`'s inline category/property/variant forms).
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
