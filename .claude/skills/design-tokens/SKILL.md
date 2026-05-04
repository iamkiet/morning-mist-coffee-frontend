---
name: design-tokens
description: Use this skill whenever generating, creating, editing, or styling ANY React component, JSX, Tailwind className, or UI element in this project. Triggers on requests like "create a component", "add a button", "style this card", "build a page", "fix the layout", or any time you write className with color, background, border, or text utilities. ALWAYS consult this skill before writing styling code — using the wrong tokens will cause silent visual bugs because forbidden tokens do not resolve in this Tailwind 4 + shadcn setup.
---

# Design Tokens Reference

## Allowed — shadcn/ui CSS tokens only

Use these for all component styling:

**Backgrounds**

- `bg-background` — page/root background
- `bg-card` — card surfaces, panels
- `bg-muted` — subtle/secondary surfaces
- `bg-accent` — accent surfaces (use with `/20`, `/10` for tints)
- `bg-primary` — primary brand surface (use with `/10`, `/5` for tints)
- `bg-border` — border-colored fill

**Text**

- `text-foreground` — primary body text
- `text-muted-foreground` — secondary/helper text
- `text-primary` — primary brand text
- `text-accent-foreground` — text on accent surfaces
- `text-destructive` — error/danger text

**Borders**

- `border-border` — default border
- `border-accent` — accent border

**Opacity variants are fine:** `bg-accent/20`, `bg-primary/10`, `border-accent/40`, etc.

---

## Forbidden — MD3/Material tokens (will NOT resolve)

Never use these — they are not defined in this project's CSS variables:

```
bg-surface-bright      bg-surface-container    bg-outline-variant
border-primary-container                        text-on-surface-variant
bg-secondary-container  bg-tertiary-container
```

Also forbidden: `px-margin-safe` — not a valid Tailwind token here.

---

## Before / After Example

```tsx
// BEFORE (broken — MD3 tokens don't resolve)
<div className="bg-surface-container text-on-surface-variant border-primary-container">
  <span className="bg-secondary-container text-on-surface">Status</span>
</div>

// AFTER (correct — shadcn tokens)
<div className="bg-card text-muted-foreground border-border">
  <span className="bg-muted text-foreground">Status</span>
</div>
```

Status badge mapping:

- success → `bg-accent/20 text-accent-foreground border-accent/40`
- info → `bg-primary/10 text-primary border-primary/20`
- warning → `bg-muted text-foreground border-border`
- error → `bg-card text-destructive border-destructive/30`
- neutral → `bg-muted text-muted-foreground border-border`

---

## Quick Decision Rule

Before writing any `className` with a color/surface utility:

1. Is it in the **Allowed** list above? → Use it.
2. Not sure? → Default to `bg-background`, `bg-card`, `text-foreground`, `border-border`.
3. Tempted to use `bg-emerald-*`, `bg-sky-*`, `bg-amber-*`, etc.? → Use the status badge mapping above instead.

The pre-edit hook will block forbidden tokens automatically. Fix them — don't suppress with comments or bypass flags.
