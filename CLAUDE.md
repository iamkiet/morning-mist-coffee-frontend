# CLAUDE.md

## Commands

```bash
pnpm dev             # dev server on :8196
pnpm build && pnpm start
pnpm lint            # ESLint, no --fix
npx tsc --noEmit     # type-check
```

## Tech Stack

Next.js 16.2.4 · React 19 · TypeScript 5 (strict) · Tailwind CSS 4 · shadcn/ui (radix-nova) · TanStack Query v5 · react-hook-form + zod · framer-motion · lucide-react · pnpm

## Project Structure

```
app/
  layout.tsx              — root layout, Geist font (no Inter, no Material Symbols)
  globals.css             — Tailwind 4 global styles
  _components/            — shared: Nav, Footer, Container, ProductCard, Chip
  _data/                  — static data constants
  (storefront)/           — public storefront routes
  mist-ops/               — admin panel (/mist-ops, not /admin)
    _components/          — AdminSidebar, Badge, DataTable, PageHeader, StatCard
components/ui/            — shadcn components (button, card, dialog, form, input, …)
lib/
  auth-context.tsx        — cookie-based auth (HttpOnly cookies, no localStorage)
  api/client.ts           — authFetch() with credentials: "include"
  api/products.ts         — fetchProducts(), fetchProduct()
  api/orders.ts           — fetchOrders(), updateOrderStatus()
hooks/
  use-products.ts         — useProducts(), useProduct(slug)
  use-orders.ts           — useOrders(), useUpdateOrderStatus()
```

**Data fetching pattern:** server components call `fetchProducts()` directly; client components use TanStack Query hooks.

## Components

**Do not recreate** any of these — grep before adding:
- Shared: `app/_components/` — Nav, Footer, Container, ProductCard, Chip
- Admin: `app/mist-ops/_components/` — AdminSidebar, Badge, DataTable, PageHeader, StatCard
- shadcn: `@/components/ui/*` — add with `pnpm dlx shadcn add <name>`

**Deleted (do not recreate):** Button.tsx · SectionHeading.tsx · AdminTopbar.tsx

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
