# Design System: Executive Editorial Framework

## 1. Overview & Creative North Star: "The Digital Registrar"
This design system moves beyond the generic "SaaS dashboard" to create an environment of **Authoritative Calm**. We are designing for school administrators—users who deal with high-stakes data and constant interruptions. Our Creative North Star, **"The Digital Registrar,"** treats digital information with the same prestige as a physical, leather-bound ledger, translated through a lens of high-end, modern minimalism.

To break the "template" look, we leverage **intentional asymmetry**. Instead of a rigid, centered grid, we use expansive white space and varied column widths to lead the eye. We replace traditional structural borders with **Tonal Depth** and **Layered Surfaces**, creating an interface that feels like stacked sheets of premium stationery rather than a flat digital screen.

---

## 2. Color & Surface Architecture
Our palette uses deep, professional blues to establish trust, but the "soul" of the system lies in its neutral transitions.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders (`outline`) to section content. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` data section should sit directly on a `surface` background. The transition of color is the boundary.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack. Each level of "nesting" moves up or down the container scale:
- **Base Layer:** `surface` (#f8f9fb)
- **Primary Content Areas:** `surface-container-low` (#f3f4f6)
- **Floating Cards/Active Modals:** `surface-container-lowest` (#ffffff)
- **Secondary Utilities:** `surface-container-high` (#e7e8ea)

### The Glass & Gradient Rule
To provide a signature "premium" feel, use **Glassmorphism** for the Top Header and floating Navigation elements. Use a semi-transparent `surface-container-lowest` with a `backdrop-blur` of 12px. 
- **Signature Texture:** Primary CTAs should not be flat. Apply a subtle linear gradient from `primary` (#00288e) to `primary_container` (#1e40af) at a 135-degree angle to give buttons a weighted, tactile presence.

---

## 3. Typography: The Editorial Scale
We use a dual-font strategy to balance character with readability.

*   **Display & Headlines (Manrope):** Chosen for its geometric modernism. Large-scale type (`display-lg` to `headline-sm`) should be tracked slightly tighter (-2%) to create a "locked-in" editorial feel.
*   **Body & Labels (Inter):** The workhorse. Inter provides maximum legibility for dense attendance rosters and data tables.

**Hierarchy as Identity:** Use `display-sm` for page titles to establish authority. Combine this with `label-md` in all-caps (tracking +5%) for secondary metadata to create a sophisticated, high-contrast visual rhythm.

---

## 4. Elevation & Depth: The Layering Principle
We move away from the "shadow on everything" approach of 2010-era SaaS. 

*   **Tonal Layering:** 90% of your hierarchy should be achieved by placing a `surface-container-lowest` card on top of a `surface-container-low` background. This creates a "soft lift" that is easier on the eyes during long work sessions.
*   **Ambient Shadows:** For high-priority floating elements (Modals, Dropdowns), use a shadow with a 24px blur and 4% opacity. The color must be a tinted version of `on-surface` (#191c1e), never pure black.
*   **The Ghost Border Fallback:** If a border is required for accessibility in data-heavy tables, use `outline_variant` at **15% opacity**. A 100% opaque border is considered a design failure in this system.

---

## 5. Components

### Navigation: The Fixed Anchor
*   **Sidebar:** Use `surface-container-low`. Icons should be `outline` color, shifting to `primary` only when active.
*   **Header:** Glassmorphic `surface-container-lowest` (80% opacity) with a `backdrop-blur`.

### Buttons
*   **Primary:** Gradient (`primary` to `primary_container`), `md` (0.75rem) roundedness, `on_primary` text.
*   **Secondary:** No background, `outline_variant` Ghost Border (20% opacity), `primary` text.
*   **Tertiary:** Flat `surface-container-highest` with `on_surface_variant` text for low-priority actions.

### Data Tables & Lists
*   **Rule:** Forbid divider lines. 
*   **Execution:** Use `spacing-4` (1rem) vertical padding between rows. Use alternating row colors (`surface` and `surface-container-low`) only if the table exceeds 20 rows.
*   **Header:** `label-md` typography, all-caps, `outline` color.

### Attendance Chips
*   **Present:** `primary_fixed` background with `on_primary_fixed` text.
*   **Absent:** `error_container` background with `on_error_container` text.
*   **Late:** `tertiary_fixed` background with `on_tertiary_fixed` text.
*   *Note: Chips must use `full` (9999px) roundedness for a friendly, approachable feel.*

### Input Fields
*   **Style:** Minimalist. No bottom line or full box. Use a `surface-container-highest` background with `none` border. On focus, transition the background to `surface-container-lowest` and add a 1px `primary` Ghost Border.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use whitespace as a separator. If you feel the need to add a line, try adding `spacing-8` of empty space instead.
*   **DO** use `manrope` for numbers in dashboards; its geometric nature makes data feel more "engineered."
*   **DO** nest containers to show relationship (e.g., a student’s profile card sitting inside a classroom container).

### Don't
*   **DON'T** use pure black (#000000) for text. Always use `on_surface` (#191c1e) to maintain the soft editorial tone.
*   **DON'T** use standard "drop shadows" on cards. Rely on the `surface-container` color shifts first.
*   **DON'T** use high-saturation reds for errors. Use the refined `error` (#ba1a1a) and `error_container` tokens to maintain the professional palette.