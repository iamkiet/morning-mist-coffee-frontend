---
name: component-sizing
description: Use this skill whenever generating, creating, editing, or styling ANY React component, JSX, Tailwind className, or UI element in this project — for control heights, rounding, typography, tracking, and spacing (companion to the design-tokens skill, which covers color only). Triggers on requests like "create a component", "add a button", "build a form row", "style this heading", "fix the layout", or any time you write className with height, rounding, text-size, tracking, or gap/padding utilities. ALWAYS consult this skill before writing sizing/typography classes — mismatched heights and inconsistent type scale are silent visual bugs that don't throw errors.
---

# Component Sizing & Typography Reference

Companion to `design-tokens` (colors). This covers everything else: control heights, rounding, type scale, tracking, spacing. Values below are taken directly from `components/ui/*` and real usage across `app/` — don't invent new ones.

## Control heights

| Component | Variant/size | Height | Notes |
|---|---|---|---|
| `Input` | (only one size) | `h-8` | never override with a manual `h-9`/`h-10` |
| `Textarea` | (only one size) | `min-h-16` | grows with content (`field-sizing-content`) |
| `SelectTrigger` | `size="default"` (default) | `h-8` | matches `Input` |
| `SelectTrigger` | `size="sm"` | `h-7` | only when paired with `Button size="sm"` |
| `Button` | `size="default"` (default) | `h-8` | matches `Input`/`SelectTrigger` default |
| `Button` | `size="sm"` | `h-7` | matches `SelectTrigger size="sm"` — **not** default `Input` |
| `Button` | `size="xs"` | `h-6` | |
| `Button` | `size="lg"` | `h-9` | primary CTAs (e.g. "Thêm Vào Giỏ Hàng") |
| `Button` | `size="icon"` | `size-8` (32×32) | icon-only actions (edit/delete in tables) |
| `Button` | `size="icon-sm"` | `size-7` | |
| `Button` | `size="icon-lg"` | `size-9` | |
| `Badge` | (only one size) | `h-5` | |

**The rule that actually matters:** when an `Input`/`SelectTrigger`/`Button` sit inline in the same row (a form row, a search bar, an inline "add" form), every control in that row must resolve to the same height. Default `Input`/`SelectTrigger` is `h-8` → pair with `Button size="default"` (also `h-8`), not `size="sm"` (`h-7`). Never force alignment with a manual height override (`className="h-9"`) — that drifts from every other control in the app, which all use unmodified defaults.

## Rounding

| Element type | Class |
|---|---|
| Controls (`Button`, `Input`, `Select`, `Textarea`) | `rounded-lg` |
| Surfaces (`Card`, `Dialog`, image, panel) | `rounded-xl` |
| Pills, avatars, circular icon buttons | `rounded-full` |

Never `rounded-md`, never `rounded-2xl`. (`Badge` ships `rounded-4xl` internally — that's the component default, not something you choose per-instance.)

## Typography scale

| Use | Class pattern | Example |
|---|---|---|
| Page `h1` (storefront) | `text-3xl sm:text-4xl md:text-5xl` (+ `lg:text-6xl` on hero pages) `font-light` | `Thanh Toán`, journal/story titles |
| Section `h2` (dialogs, card headers) | `text-sm uppercase tracking-widest font-medium` | `Tóm Tắt Đơn Hàng`, `DialogTitle` |
| Section `h2` (storefront, larger) | `text-2xl sm:text-3xl md:text-4xl font-light` | shop section headers |
| Sub-heading `h3` | `text-xs uppercase tracking-widest text-muted-foreground font-medium` | "Danh mục sản phẩm" style group labels |
| Eyebrow / kicker | `text-xs uppercase tracking-[0.2em] text-primary` | small caption above an `h1` |
| Body text | `text-sm text-muted-foreground` (or `text-base` for longer-form copy) | descriptions, helper text |
| Table/card label | `text-xs uppercase tracking-wider text-muted-foreground` | `StatCard`, `DataTable` column headers — see note below |
| Price / numeric emphasis | `text-3xl` (detail page) / `text-sm font-medium` (list row) | |

## Letter spacing

- **Buttons**: `uppercase tracking-wider`.
- **Headings** (`h1`–`h3`, `DialogTitle`, section headers like "Tóm Tắt Đơn Hàng"/"Thông Tin Giao Nhận") **and eyebrows/kickers**: `uppercase tracking-widest`. This is the dominant pattern site-wide — check for it before writing a new heading.
- **Small inline captions** (`StatCard` label, `DataTable` column headers, the bordered-box labels on the product detail page): `uppercase tracking-wider` in practice, via `StatCard.tsx`/`DataTable.tsx` — even though this is technically the same visual role as a "table label." This is a known, real inconsistency against the stricter binary rule above; it's pre-existing and widespread enough (two shared components) that it isn't something to mass-fix without being asked. Match whichever of the two patterns the immediate surrounding code already uses — don't guess from the rule alone.
- New headings (not captions) should still default to `tracking-widest`; new buttons to `tracking-wider`. The ambiguity is specifically for small standalone caption/label text that isn't clearly one or the other.

## Spacing

Numeric Tailwind only — no `--spacing-md/lg/xl` aliases (removed from components).

| Context | Common values |
|---|---|
| Icon/text gap inside a control | `gap-1`, `gap-1.5`, `gap-2` |
| Form field stack, card content | `gap-3`, `gap-4`, `space-y-4` |
| Section internal spacing | `gap-6`, `space-y-6` |
| Section vertical padding (compact) | `py-4`, `py-8`, `py-12` |
| Section vertical padding (page-level) | `py-16`, `py-20`, `py-24` |

`px-gutter` stays (responsive container padding). Never `px-margin-safe`.
