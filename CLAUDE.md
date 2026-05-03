# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

**Setup:**

```bash
pnpm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL (e.g. http://localhost:3000)
```

**Development:**

```bash
pnpm dev             # Start dev server on http://localhost:3000
```

**Production:**

```bash
pnpm build           # Build for production
pnpm start           # Start production server
```

**Code Quality:**

```bash
pnpm lint            # Run ESLint (linting only, no --fix by default)
npx tsc --noEmit     # Type-check without emitting files
```

> **Important:** This project uses Next.js 16.2.4, which has breaking changes from earlier versions. Read the relevant guides in `node_modules/next/dist/docs/` before writing code and heed deprecation notices.

## Architecture Overview

### Project Structure

- **`app/`** — App Router (Next.js 13+ structure)
  - **`app/layout.tsx`** — Root layout with global metadata and Geist font (no Material Symbols link, no Inter)
  - **`app/globals.css`** — Global styles (Tailwind CSS 4)
  - **`app/_components/`** — Shared UI components: `Nav`, `Container`, `Footer`, `ProductCard`, `Chip`
  - **`app/_data/`** — Data layer and constants (e.g., products data)
  - **`app/(storefront)/`** — Public storefront routes using route groups
  - **`app/admin/`** — Admin panel
    - Admin-specific layouts and components in `admin/_components/`
    - Admin pages: overview, analytics, orders, products, users

### Key Patterns

**Route Groups:** The app uses `(storefront)` as a route group for the public storefront. Admin lives under `/admin`. Each has its own layout.

**Component Organization:**

- Shared components live in `app/_components/` (prefixed with `_` to indicate internal use)
- Admin-specific components live in `app/admin/_components/`
- Each route segment can have its own `layout.tsx` for segment-specific styling/structure
- Before creating a new component, grep to verify it doesn't already exist

**Styling:**

- Tailwind CSS 4 with PostCSS
- Global styles in `app/globals.css`
- CSS utility classes applied directly to components
- **Icons: lucide-react only** — no Material Symbols, no brand icon fonts

**Data fetching:**

- `lib/api/products.ts` — typed `fetch` wrappers (`fetchProducts`, `fetchProduct`) using `NEXT_PUBLIC_API_URL`
- `hooks/use-products.ts` — TanStack Query hooks (`useProducts()`, `useProduct(slug)`) for client components
- `app/providers.tsx` — `QueryClientProvider` wrapper mounted in the root layout
- `app/_data/products.ts` — static product data (source for `GET /api/products`)
- `app/api/products/route.ts` — the API route serving that static data
- Server components: call `fetchProducts()` directly. Client components: use `useProducts()` / `useProduct()`.

### Tech Stack

- **Framework:** Next.js 16.2.4 with App Router
- **UI:** React 19.2.4, shadcn/ui (`radix-nova` style), lucide-react icons
- **Styling:** Tailwind CSS 4, PostCSS
- **Data fetching:** TanStack Query v5 (`useProducts`, `useProduct`) — client components only; server components call `fetchProducts()` directly
- **Forms:** react-hook-form + zod + `@hookform/resolvers`
- **Tables:** @tanstack/react-table
- **Animation:** framer-motion
- **Language:** TypeScript 5 (strict mode)
- **Package manager:** pnpm
- **Fonts:** Geist (via `next/font/google`) — Inter has been removed

### TypeScript Configuration

- `tsconfig.json` includes Next.js plugin
- Path alias: `@/*` points to the root directory
- All `.ts` and `.tsx` files included
- Strict mode enabled — run `npx tsc --noEmit` to verify after changes

### Development Notes

- No testing framework is currently configured (no Jest, Vitest, etc.)
- ESLint runs without `--fix` by default — review and apply changes manually
- The app uses React 19, which may have different hooks/APIs than React 18
- Next.js 16.2.4 is a recent major version; consult official docs for any unfamiliar patterns

## Images — MANDATORY RULES

### Always use `next/image`, never `<img>`

- **Never** use raw `<img>` tags. ESLint will flag `no-img-element` violations — fix them properly, do not add `eslint-disable` comments.
- Always import `Image from "next/image"` and use the `<Image>` component.
- For images in aspect-ratio containers (using `aspect-*` or fixed-height wrappers), use `fill` mode and add `className="object-cover"`. The parent **must** have `position: relative` (`relative` class).
- Add the `priority` prop to the first visible image on a page (LCP image).
- Always provide a meaningful `alt` attribute — never `alt=""` for content images.
- Provide a `sizes` prop when using `fill` mode to help the browser pick the right source:
  ```tsx
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
  ```

### External image hosts

All external hostnames must be whitelisted in `next.config.ts` under `images.remotePatterns`. Current allowed hosts:

- `lh3.googleusercontent.com`
- `i.pravatar.cc`

When adding images from a new external host, add it to `remotePatterns` first.

## Design Tokens — Allowed vs Forbidden

### Use shadcn/ui CSS tokens only

```
bg-background, bg-card, bg-muted, bg-accent, bg-primary, bg-border
text-foreground, text-muted-foreground, text-primary, text-accent-foreground
border-border, border-accent
```

### Never use old MD3/Material tokens in JSX

These are **forbidden** — they will not resolve correctly:

```
bg-surface-bright, bg-surface-container, bg-outline-variant
border-primary-container, text-on-surface-variant
bg-secondary-container, bg-tertiary-container
```

If you see these in code, replace them with the shadcn equivalents above.

## Navigation — Fixed Positioning

The `Nav` component uses `position: fixed` (not sticky). This means:

- The nav is always 64px–92px tall and sits above all page content.
- **Storefront pages** must include top padding to clear the nav: use `pt-28` to `pt-40` as appropriate.
- **Full-bleed hero pages** (like the landing page) intentionally have no top padding — the hero image extends behind the transparent nav. This is by design.
- Never change the nav back to `sticky` without understanding the layout implications for every page.

## Layout and Composition

The app uses a composition pattern with:

- Root layout managing document structure and global fonts
- Route group layouts for storefront and admin sections
- Reusable leaf components (Chip, ProductCard, etc.)
- Containers and spacing managed via component props and Tailwind classes

### Active shared components in `app/_components/`

- `Nav.tsx` — top navigation bar (fixed)
- `Footer.tsx` — multi-column editorial footer
- `Container.tsx` — responsive max-width wrapper
- `ProductCard.tsx` — product tile used on shop/landing pages
- `Chip.tsx` — small pill label

**Do not recreate or duplicate these.** If you need a new shared component, add it here.

### Active admin components in `app/admin/_components/`

- `AdminSidebar.tsx` — collapsible sidebar navigation for admin section
- `Badge.tsx` — status/label badge
- `DataTable.tsx` — TanStack Table wrapper for admin data grids
- `PageHeader.tsx` — consistent page title + actions bar
- `StatCard.tsx` — metric card for the overview dashboard

### shadcn/ui components in `components/ui/`

Generated shadcn components live at `@/components/ui/*` (not inside `app/`). Currently available: `badge`, `button`, `card`, `dialog`, `dropdown-menu`, `form`, `input`, `label`, `separator`, `sheet`, `skeleton`, `table`. Use `pnpm dlx shadcn add <component>` to add more.

### Deleted components (do not recreate)

- `Button.tsx` — deleted; use shadcn `Button` from `@/components/ui/button`
- `SectionHeading.tsx` — deleted; write headings inline
- `AdminTopbar.tsx` — deleted; not used anywhere

Before creating any new component, `grep` to confirm it doesn't already exist.

## Responsive Design Best Practices

### Mobile-First Approach

- Always start with mobile base styles, then use `sm:`, `md:`, `lg:` breakpoints
- Use responsive padding: `px-4 sm:px-6 md:px-gutter`
- Use responsive gaps: `gap-4 sm:gap-6 md:gap-md`
- Use responsive text sizes: `text-sm sm:text-base md:text-lg` for scalability

### Responsive Breakpoints

- **Mobile:** Default (no prefix) — xs to 640px
- **Tablet:** `sm:` — 640px to 768px
- **Medium:** `md:` — 768px to 1024px
- **Desktop:** `lg:` — 1024px and up
- **Extra Large:** `xl:` — 1280px and up

### Grid Pattern

Multi-column layouts use `grid-cols-1 md:grid-cols-12` — skip `sm:` grid variants unless there is a clear design reason. This keeps layouts simple and matches the design files.

### Component Guidelines

- All text that scales should use explicit size classes with breakpoints (e.g., `text-2xl sm:text-3xl md:text-4xl`)
- All padding/margins should have responsive variants for mobile, tablet, and desktop
- Interactive elements (buttons, icons) should be sized appropriately for touch targets (min 44px on mobile)
- Images should use `aspect-ratio` utilities to maintain proportions across devices
- Use `min-h-screen` instead of `h-screen` to avoid viewport overflow on mobile

### Navigation Pattern (Nav.tsx)

- Desktop menu: `hidden lg:flex` (visible on lg+ only)
- Mobile hamburger button: `lg:hidden` (hidden on lg+ only)
- Mobile menu overlay: `lg:hidden` with proper z-index layering
- Always test hamburger button click handling on actual mobile browsers, not just desktop dev tools

### Layout Padding Pattern

```css
/* Responsive container padding */
px-4           /* Mobile: 16px */
sm:px-6        /* Tablet: 24px */
md:px-gutter   /* Desktop: use design system gutter token */
```

**Never use `px-margin-safe`** — it is not a valid Tailwind token in this project.

### Typography Scaling Pattern

```css
/* Responsive heading sizes */
text-2xl sm:text-3xl md:text-4xl lg:text-5xl
/* Body text */
text-base sm:text-lg md:text-lg
```

## Code Quality Rules

- **No dead code.** If a component, file, or import is unused, delete it — don't leave it "just in case."
- **No `eslint-disable` comments** to suppress real violations. Fix the underlying issue.
- **No duplicate logic.** If the same markup pattern appears 3+ times, extract a component.
- **No over-engineering.** Don't add abstractions, error handling, or validation for scenarios that can't happen in this codebase.
- **Run `npx tsc --noEmit`** after non-trivial changes to catch type errors before committing.
