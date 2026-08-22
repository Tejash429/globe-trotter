---
name: Globe-Trotter
description: Interactive travel discovery and AI itinerary planning app
colors:
  primary: "#06b6d4"
  primary-deep: "#4f46e5"
  neutral-bg: "#ffffff"
  neutral-bg-dark: "#0a0a0a"
  neutral-fg: "#171717"
  neutral-fg-dark: "#ededed"
typography:
  display:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "12px"
  lg: "20px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg-dark}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
---

# Design System: Globe-Trotter

## Overview

**Creative North Star: "The Celestial Navigator"**

Globe-Trotter embodies a dark-mode first, high-precision visual atmosphere inspired by digital cartography and night-sky navigation. The interface pairs deep obsidian background layers with vibrant cyan and indigo glowing accents, evoking the feeling of exploring a high-tech illuminated globe under starry skies.

The UI emphasizes high clarity, fluid glassmorphism, subtle micro-interactions, and crisp typographic hierarchy. Components feel light, responsive, and tactile.

**Key Characteristics:**
- **Luminous Geographic Palette**: Deep obsidian neutrals anchored by glowing Electric Ocean Cyan and Indigo accents.
- **Glassmorphic Depth**: Translucent surfaces with soft backdrop blurs and micro-glow highlights on interactive hover.
- **Clean Typographic Hierarchy**: Modern sans-serif structure providing effortless legibility for itineraries and map controls.

## Colors

The color palette balances deep obsidian backgrounds with high-contrast vibrant accents for key interactive elements and geographic waypoints.

### Primary
- **Electric Ocean Cyan** (#06b6d4): Primary interactive accents, active map pins, selected tabs, and main call-to-action elements.

### Secondary
- **Celestial Indigo** (#4f46e5): Secondary accent, active state focus rings, gradient highlights, and hover transitions.

### Neutral
- **Deep Obsidian** (#0a0a0a): Main dark mode background layer.
- **Pure Canvas** (#ffffff): Light mode background layer.
- **Starlight Foreground** (#ededed): Dark mode primary text color.
- **Midnight Slate** (#171717): Light mode primary text color.

### Named Rules
**The Luminescence Rule.** Accent colors (`#06b6d4` & `#4f46e5`) are reserved for focal points, waypoints, and key CTAs. They must cover ≤15% of any screen viewport to maintain high visual impact.

## Typography

**Display Font:** Geist Sans (`var(--font-geist-sans)`, sans-serif)  
**Body Font:** Geist Sans (`var(--font-geist-sans)`, sans-serif)  
**Label/Mono Font:** Geist Mono (`var(--font-geist-mono)`, monospace)  

**Character:** Clean, technical, and highly legible typography tailored for dense travel schedules and map coordinates.

### Hierarchy
- **Display** (700, clamp(2rem, 5vw, 3.5rem), 1.1): Main hero headers and landmark title highlights.
- **Headline** (600, 1.75rem, 1.25): Section headers, itinerary day titles, and card headers.
- **Title** (600, 1.25rem, 1.3): Subsections and list item headers.
- **Body** (400, 1rem, 1.5): Main reading text, itinerary descriptions, and destination details.
- **Label** (500, 0.875rem, 1.4, monospace): Coordinates, tags, badges, and metadata labels.

## Layout

Globe-Trotter uses a flexible fluid grid with responsive breakpoints (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`).
Container max-widths are constrained to `max-w-7xl` for full map dashboard views and `max-w-3xl` for focused itinerary flows. Content density remains comfortable with `16px` to `32px` padding scales.

## Elevation & Depth

Globe-Trotter uses a hybrid glassmorphic depth model. Surfaces rest flat with subtle 1px translucent borders (`rgba(255, 255, 255, 0.1)` in dark mode). Hover and active states trigger ambient cyan glow elevations (`0 0 20px rgba(6, 182, 212, 0.25)`).

### Shadow Vocabulary
- **Resting Surface**: Flat surface with `border: 1px solid rgba(255, 255, 255, 0.1)`.
- **Hover Glow**: `box-shadow: 0 4px 20px rgba(6, 182, 212, 0.25)`.
- **Elevated Modal**: `box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5)` with `backdrop-filter: blur(12px)`.

### Named Rules
**The Glass-Before-Shadow Rule.** Depth is created primarily through backdrop blur (`backdrop-blur-md`) and subtle border contrast rather than heavy opaque drop shadows.

## Shapes

Corners use smooth rounded geometry:
- **Cards & Modals**: `12px` (`rounded-xl`)
- **Buttons & Chips**: `9999px` (`rounded-full`) or `8px` (`rounded-lg`)
- **Input Fields**: `8px` (`rounded-lg`)

## Components

### Buttons
- **Shape:** Pill shape (`9999px` radius) or rounded (`8px` radius).
- **Primary:** Background `Electric Ocean Cyan` (#06b6d4), text `Deep Obsidian` (#0a0a0a), font weight 600, padding `12px 24px`.
- **Hover / Focus:** Shift to `Celestial Indigo` (#4f46e5) with cyan glow shadow.

### Cards / Containers
- **Corner Style:** `12px` radius (`rounded-xl`).
- **Background:** Semi-transparent dark surface (`rgba(18, 18, 18, 0.7)`).
- **Border:** `1px solid rgba(255, 255, 255, 0.1)`.
- **Internal Padding:** `20px` to `24px`.

### Inputs / Fields
- **Style:** Background `rgba(255, 255, 255, 0.05)`, border `1px solid rgba(255, 255, 255, 0.15)`, radius `8px`.
- **Focus:** Border shift to `Electric Ocean Cyan` (#06b6d4) with subtle cyan focus ring.

### Navigation
- **Style:** Glassmorphic fixed bar with `backdrop-blur-md`, subtle bottom border, pill-shaped active tab indicators.

## Do's and Don'ts

### Do:
- **Do** maintain translucent glassmorphism for floating overlays and map controls.
- **Do** use `Geist Mono` for geographic coordinates, dates, prices, and tags.
- **Do** keep accent glow effects subtle and state-driven.

### Don't:
- **Don't** use opaque heavy black drop-shadows on card containers.
- **Don't** saturate screens with cyan/indigo accents—keep them under 15% viewport density.
- **Don't** use sharp un-rounded 0px corners on interactive cards or buttons.
