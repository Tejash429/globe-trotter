---
name: Globe-Trotter
description: Personalized travel planning app with passport-stamp & vintage cartographer aesthetic
colors:
  ink: "#1B2B34"
  paper: "#FAF9F5"
  surface: "#FFFFFF"
  border: "#E4E0D6"
  teal-primary: "#2F6F5E"
  amber-accent: "#D98E3B"
  brick-danger: "#C1443D"
typography:
  display:
    fontFamily: "var(--font-fraunces), serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.15
  body:
    fontFamily: "var(--font-inter), sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  data:
    fontFamily: "var(--font-ibm-plex-mono), monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  full: "9999px"
---

# Design System: Globe-Trotter

## Creative Direction: "The Passport & Vintage Cartographer"

Globe-Trotter combines the tactility of physical travel artifacts — passport stamps, ticket stubs, and classic map routes — with modern web polish. The visual language feels warm, adventurous, and authentic, avoiding generic blue SaaS design.

### Core Visual Pillars:
1. **Paper & Map Ink Palette**: Warm paper background (`#FAF9F5`), rich ink typography (`#1B2B34`), deep passport teal primary (`#2F6F5E`), stamp amber accents (`#D98E3B`), and brick red alerts (`#C1443D`).
2. **Distinct Typographic Triad**:
   - **Fraunces** for expressive, editorial trip titles and section headings.
   - **Inter** for crisp, effortless form & UI readability.
   - **IBM Plex Mono** for ticket stubs, date ranges, prices, and stop counters.
3. **Map-Route Signature Divider**: Dashed and dotted line connections between travel stops mimicking printed flight paths or expedition maps.

## Color Palette

| Role | Hex | Application |
| --- | --- | --- |
| **Ink** | `#1B2B34` | Body text, headings, strong icon accents |
| **Paper** | `#FAF9F5` | Main page background (warm expedition paper) |
| **Surface** | `#FFFFFF` | Elevation cards, dropdowns, modal containers |
| **Border / Muted** | `#E4E0D6` | Input borders, subtle dividers, inactive states |
| **Teal (Primary)** | `#2F6F5E` | Primary CTAs, active states, key navigation links |
| **Amber (Accent)** | `#D98E3B` | Budget highlights, stamp badges, secondary CTAs |
| **Brick (Danger)** | `#C1443D` | Overbudget warnings, error alerts, destructive actions |

## Typography

- **Display Header (Fraunces)**: Used for `<h1>` & `<h2>` trip names, hero headers, and feature section titles.
- **Body & UI (Inter)**: Used for paragraphs, buttons, navigation items, and form fields.
- **Data / Stub (IBM Plex Mono)**: Used for dates, cost breakdowns, budget numbers, and day counters for a ticket-stub / boarding pass feel.

## Special Signature Elements

- **Route Divider (`.route-divider`)**: Dashed map-route line between itinerary stops with accent dots.
- **Stamp Badge (`.stamp-badge`)**: Boarding pass / passport stamp style badge with dashed/solid borders and subtle rotation.
- **Ticket Stub Container (`.ticket-stub`)**: Card style with perforated edge styling or notch accents for budgets and schedules.
