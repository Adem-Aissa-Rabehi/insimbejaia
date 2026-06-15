---
name: Academic Prestige
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#424750'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#737781'
  outline-variant: '#c3c6d2'
  surface-tint: '#305f9d'
  primary: '#002a56'
  on-primary: '#ffffff'
  primary-container: '#00407d'
  on-primary-container: '#83adf1'
  inverse-primary: '#a7c8ff'
  secondary: '#a04100'
  on-secondary: '#ffffff'
  secondary-container: '#ff7a2d'
  on-secondary-container: '#612500'
  tertiary: '#002b54'
  on-tertiary: '#ffffff'
  tertiary-container: '#1d416d'
  on-tertiary-container: '#8daee0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#0f4784'
  secondary-fixed: '#ffdbcb'
  secondary-fixed-dim: '#ffb693'
  on-secondary-fixed: '#341000'
  on-secondary-fixed-variant: '#7a3000'
  tertiary-fixed: '#d4e3ff'
  tertiary-fixed-dim: '#a7c8fc'
  on-tertiary-fixed: '#001c3a'
  on-tertiary-fixed-variant: '#254874'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  section-padding-desktop: 100px
  section-padding-mobile: 60px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is built for a high-end business school, emphasizing **trust, heritage, and academic excellence**. It utilizes a **Modern Corporate** aesthetic that leans heavily into structured layouts, refined whitespace, and a sophisticated interplay between deep institutional colors and vibrant call-to-actions.

The personality is professional and authoritative yet forward-thinking. To achieve the "Variant 2" improvement requested, we utilize:
- **Enhanced Whitespace:** Generous breathing room between sections to allow content to feel premium.
- **Micro-Depth:** Subtle, multi-layered shadows that make cards and inputs feel tactile without being heavy.
- **Sectional Pacing:** Alternating between pure white surfaces and very light cool-grey backgrounds (`#F8FAFC`) to define content blocks clearly.

## Colors

The palette is anchored by a deep **Institutional Blue** to convey stability and history, paired with a vibrant **Academic Orange** specifically reserved for action-oriented elements (CTAs, primary buttons, and critical highlights).

- **Primary (Blue):** Use for headers, footer backgrounds, and secondary accents.
- **Secondary (Orange):** Exclusively for Call-to-Actions and "Apply Now" triggers.
- **Neutrals:** A range of Slate-based greys are used for text and borders to maintain a cool, professional tone. 
- **Surface Tiers:** Pure white (`#FFFFFF`) is the base, with `#F8FAFC` used for subtle section separation.

## Typography

The system uses a pairing of **Montserrat** for headlines to provide a confident, geometric structure, and **Inter** for body text to ensure maximum readability and a technical, modern feel.

- **Headlines:** Use Montserrat Bold/SemiBold. Headlines should have tighter letter spacing at larger sizes.
- **Body:** Use Inter. Body text should maintain a generous line height (1.5 - 1.6) to improve the reading experience for academic content.
- **Labels:** Small caps or uppercase labels with increased tracking should be used for category markers or small navigation elements.

## Layout & Spacing

This design system uses a **12-column fixed-width grid** for desktop, centered within the viewport. 

- **Section Breaks:** Use a consistent `100px` vertical padding for desktop sections to create a sense of luxury and focus.
- **Hierarchy:** Group related elements using `stack-sm` (8px) or `stack-md` (16px), while distinct content blocks should be separated by `stack-lg` (32px).
- **Responsive Behavior:** On mobile, margins reduce to `20px` and sections stack vertically in a single column.

## Elevation & Depth

To improve upon "Variant 2," the system moves away from flat borders toward **Ambient Shadows**.

- **Level 1 (Cards/Inputs):** A soft, blurred shadow using `rgba(0, 64, 125, 0.08)` with a 10px blur and 4px Y-offset. This creates a lift without looking "heavy."
- **Level 2 (Hover states/Modals):** An increased blur of 20px with a 10px Y-offset to simulate the element moving closer to the user.
- **Tonal Layering:** Use a `1px` stroke in `#E2E8F0` on cards in addition to the shadow to maintain crisp edges on high-resolution displays.

## Shapes

The design system utilizes **Rounded** geometry (`0.5rem` or `8px`). This strikes a balance between the rigid tradition of academia and the approachable, modern nature of a business school.

- **Standard Elements:** Buttons, input fields, and small cards use the base `8px` radius.
- **Large Components:** Hero images or major containers may use `rounded-lg` (`16px`) to soften the visual impact of large blocks of color.

## Components

### Buttons
- **Primary (CTA):** Solid Orange (`#F27022`) with White text. Use `Montserrat SemiBold` for the label.
- **Secondary:** Solid Blue (`#00407D`) with White text.
- **Outline:** Transparent background with Blue or White stroke (depending on section color), used for secondary actions like "View Details."

### Cards
- White background, `8px` radius, subtle 1px stroke, and Level 1 elevation. 
- Program cards should feature a top-aligned icon or image, followed by a headline and a clear "View Details" outline button.

### Navigation
- **Header:** Sticky, white background. Use Blue for the active link state. The "Apply Now" button should be the only orange element in the header.
- **Footer:** Deep Blue background (`#00407D`) with White or light-grey text for high contrast.

### Forms
- **Inputs:** White background, light grey border. On focus, the border should change to Blue with a soft blue outer glow.
- **Labels:** Positioned above the field in `Inter SemiBold` at `14px`.

### Chips / Badges
- Used for program categories (e.g., "Full-time," "Masters"). Use light blue backgrounds with deep blue text for a professional, "tag" appearance.