# Design System Document

## 1. Overview & Creative North Star
**Creative North Star: The Modern Apothecary**
This design system moves away from the clinical, utilitarian feel of traditional health trackers and embraces an editorial, "Modern Apothecary" aesthetic. It balances the raw, organic warmth of nature with the precision of a curated wellness journal. 

By leveraging intentional asymmetry, high-end typography scales, and a focus on tonal depth rather than structural lines, we create an experience that feels like a supportive companion. This is not just a tool for counting; it is a digital sanctuary for nutritional mindfulness. We break the "template" look by using generous breathing room and layered surfaces that mimic the tactile quality of premium heavy-weight paper and frosted glass.

## 2. Colors
Our palette is rooted in a "Deep Forest" and "Sun-Drenched Earth" ethos. It utilizes Material 3 tonal logic to ensure accessibility while maintaining a sophisticated, muted vibrance.

### The "No-Line" Rule
To achieve a high-end editorial feel, **1px solid borders are strictly prohibited for sectioning.** Physical boundaries must be defined through:
*   **Background Color Shifts:** Use `surface-container-low` sections sitting atop a `surface` background.
*   **Tonal Transitions:** Defining edges through the contrast between different surface tokens.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials.
*   **Base:** `surface` (#fdf9ed)
*   **Secondary Content:** `surface-container-low` (#f7f3e7)
*   **Interactive Cards:** `surface-container-lowest` (#ffffff) to create a subtle "pop" against the warm background.
*   **Active Elements:** Use `primary-container` (#508041) for soft, leafy backgrounds behind active text or icons.

### The "Glass & Gradient" Rule
For elevated floating elements (like bottom navigation or snackbars), use a **Glassmorphism** effect:
*   Apply `surface` color at 80% opacity with a `backdrop-blur` of 12px.
*   **Signature Textures:** For primary CTAs, use a subtle linear gradient from `primary` (#38672a) to `primary-container` (#508041) at a 135-degree angle. This adds "soul" and depth that flat color cannot replicate.

## 3. Typography
We utilize a pairing of **Epilogue** (Display/Headline) and **Inter** (Title/Body) to bridge the gap between organic character and technical clarity.

*   **Display & Headline (Epilogue):** These levels provide the "Natural" character. The slightly wider stance of Epilogue feels intentional and grounded. Use `headline-lg` for daily goals and `headline-sm` for category headers.
*   **Title & Body (Inter):** Inter handles the high-density information. Its neutral, clean rhythm ensures that serving sizes and food descriptions are legible at a glance.
*   **Label (Inter):** Used for micro-copy and metadata. Always set with a slight tracking increase (+2% to +4%) for a premium, airy feel.

## 4. Elevation & Depth
Depth in this system is achieved through **Tonal Layering**, not traditional drop shadows.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural lift. This mimics the way paper rests on a desk.
*   **Ambient Shadows:** If a card must "float" (e.g., a modal or a primary action button), use an extra-diffused shadow:
    *   `box-shadow: 0 12px 32px rgba(28, 28, 21, 0.06);` (Using a tinted version of `on-surface`).
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke, use the `outline-variant` token at **15% opacity**. Never use 100% opaque borders.
*   **Glassmorphism Depth:** Layers using backdrop blurs should be reserved for elements that hover over scrolling content to maintain the "Modern Apothecary" transparency.

## 5. Components

### Buttons
*   **Primary:** Uses the "Signature Texture" (Primary Gradient). Corner radius: `md` (0.75rem).
*   **Secondary:** `surface-container-highest` background with `on-surface` text. No border.
*   **Tertiary:** Ghost style. No background, `primary` text, with a subtle `primary-container` background on hover.

### Servings & Counters (Bespoke)
*   Instead of standard checkboxes, use **Tonal Chips**. 
*   **Unfilled State:** `surface-container-high`.
*   **Filled State:** `secondary` (#7c5724) for a warm, earthy "check."
*   **Shape:** 12px roundedness to match the "approachable" personality.

### Cards
*   Forbid the use of divider lines within cards.
*   Separate the "Category Icon" from "Serving Description" using a `spacing-4` (1rem) gutter.
*   Use `surface-container-lowest` for the card body to make it feel bright and clean against the `surface` background.

### Input Fields
*   **Style:** Minimalist underline or soft-filled. Use `surface-container-highest` for the field background with a `sm` (0.25rem) bottom-only radius.
*   **Focus State:** Transition the background to `primary-fixed-dim` for a soft glow.

### Progress Indicators
*   Avoid thin, clinical lines. Use thick, soft-ended bars with a height of `spacing-3` (0.75rem).
*   **Track:** `surface-container-highest`.
*   **Indicator:** `primary` (#38672a).

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts. For example, left-align category names but right-align the serving counters to create a rhythmic flow.
*   **Do** use the full Spacing Scale. If a section feels crowded, jump two levels up (e.g., move from `16` to `24`).
*   **Do** tint your grays. Every "neutral" should have a hint of yellow/green to stay within the "Wholesome" brand profile.

### Don't
*   **Don't** use 1px solid black or high-contrast borders. It breaks the organic feel.
*   **Don't** use standard "Blue" for links. Use `tertiary` (#71581e) or `primary`.
*   **Don't** crowd the icons. Give each food category icon a "halo" of `primary-container` to let the illustration breathe.
*   **Don't** use pure white (#FFFFFF) for the background. Always use `surface` (#fdf9ed) to reduce eye strain and maintain warmth.