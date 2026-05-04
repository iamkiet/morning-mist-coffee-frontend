---
name: Sage & Morning Mist
colors:
  surface: '#f9f9f7'
  surface-dim: '#dadad8'
  surface-bright: '#f9f9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f2'
  surface-container: '#eeeeec'
  surface-container-high: '#e8e8e6'
  surface-container-highest: '#e2e3e1'
  on-surface: '#1a1c1b'
  on-surface-variant: '#444842'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#747872'
  outline-variant: '#c4c8c0'
  surface-tint: '#556254'
  primary: '#556254'
  on-primary: '#ffffff'
  primary-container: '#a9b7a6'
  on-primary-container: '#3c483b'
  inverse-primary: '#bccab9'
  secondary: '#586059'
  on-secondary: '#ffffff'
  secondary-container: '#dde5db'
  on-secondary-container: '#5e665f'
  tertiary: '#615e57'
  on-tertiary: '#ffffff'
  tertiary-container: '#b7b2aa'
  on-tertiary-container: '#48453e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e7d4'
  primary-fixed-dim: '#bccab9'
  on-primary-fixed: '#131e13'
  on-primary-fixed-variant: '#3d4a3d'
  secondary-fixed: '#dde5db'
  secondary-fixed-dim: '#c1c9c0'
  on-secondary-fixed: '#161d18'
  on-secondary-fixed-variant: '#414942'
  tertiary-fixed: '#e8e2d9'
  tertiary-fixed-dim: '#cbc6bd'
  on-tertiary-fixed: '#1d1b16'
  on-tertiary-fixed-variant: '#494640'
  background: '#f9f9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e2e3e1'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '300'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '300'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '300'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '300'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-safe: 32px
---

## Brand & Style

This design system is built upon the principles of **Organic Minimalism** and **Ethereal Serenity**. It is designed to evoke the quiet clarity of a high-end coffee roastery at dawn. The target audience values slow living, craftsmanship, and a sensory-first experience.

The visual direction avoids the over-stimulating saturation of modern commerce, opting instead for a "breathable" interface. We utilize heavy whitespace and a restricted contrast ratio to create a sophisticated, calming environment. Design movements influencing this system include soft-minimalism and gentle glassmorphism, ensuring that digital interactions feel as tactile and light as steam rising from a porcelain cup.

## Colors

The palette is anchored by "Silken Sage," a desaturated green that provides a natural, grounded foundation. "Morning Mist" (a warm, off-white) replaces pure white to reduce eye strain and add a premium, paper-like quality.

Accents are strictly ethereal—pale washes of lavender-blue and sun-bleached peach—used only for subtle highlights or interactive states. High-contrast blacks are strictly forbidden; instead, we use a deep, desaturated "Evergreen Charcoal" for typography to maintain a soft, legible hierarchy without breaking the serene atmosphere.

## Typography

This design system utilizes **Inter** exclusively to achieve a modern, systematic clarity. The typographic hierarchy leans heavily into "Light" (300) and "Regular" (400) weights to preserve the airy aesthetic.

Headlines use generous tracking (letter spacing) and light weights to feel like editorial captions. Body text is prioritized for legibility with increased line-heights, ensuring a comfortable reading experience that mirrors the unhurried pace of the brand.

## Layout & Spacing

The layout philosophy follows a **Fixed-Width Centered Grid** with expansive safe areas. We use an 8px rhythmic scale, but favor larger increments (48px+) to create "islands" of content, preventing the UI from feeling cluttered.

Margins are intentionally oversized to frame the content, making each screen feel like a curated menu or a gallery wall. Elements should never feel "packed"; if in doubt, increase the vertical padding to allow the sage and mist tones to flow between components.

## Elevation & Depth

Depth in this design system is achieved through **Tonal Layering** and **Ambient Shadows** rather than traditional dropshadows.

1. **Surface Tiers:** Backgrounds use the neutral "Morning Mist" (#F9F9F7). Elevated cards use pure white (#FFFFFF) with a very low-opacity sage tint.
2. **Shadows:** Use extremely diffused shadows with a large blur radius (30px+) and very low opacity (5-8%). The shadow color should be tinted with the primary sage hex to ensure it feels like a natural reflection of the environment.
3. **Glassmorphism:** For overlays or navigation bars, use a high-density background blur (20px) with a semi-transparent white fill (opacity 70%) to mimic frosted glass.

## Shapes

The shape language is defined by **Softened Geometrics**. We avoid sharp 90-degree angles to maintain the organic tone, but we also avoid overly playful "blob" shapes to keep the look sophisticated.

Standard components like buttons and input fields utilize a 0.5rem (8px) radius. Larger containers, such as product cards or modal windows, scale up to 1rem or 1.5rem to emphasize their physical presence in the "misty" environment.

## Components

### Buttons

Primary buttons use a desaturated sage fill with white text. Secondary buttons are "Ghost" style, utilizing a thin 1px border in a slightly darker mist tone. All transitions must be slow (300ms+) to maintain the serene tempo.

### Cards

Cards are the primary vessel for products. They should feature no borders, instead relying on the ambient sage-tinted shadows for separation. Images within cards should have a slight desaturation filter applied to align with the palette.

### Input Fields

Fields are minimalist: a single bottom border or a very soft, light-grey-filled trough with rounded corners. Focus states should be indicated by a subtle glow in the primary sage color rather than a heavy stroke.

### Chips & Tags

Used for coffee notes (e.g., "Floral", "Citrus"). These should be pill-shaped with ethereal pastel backgrounds (e.g., Mist Blue or Pale Peach) and slightly darker text for accessibility.

### Additional Elements

- **Image Treatment:** Use "soft-focus" or macro photography for coffee beans and steam.
- **Micro-interactions:** Use fading and gentle sliding motions. Avoid "snappy" or "bouncy" spring physics.
