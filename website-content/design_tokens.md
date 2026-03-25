# Design Tokens
**Project:** Cleaning Services Website  
**Stack:** Astro + Tailwind CSS  
**Design Direction:** Local Service Editorial  
**Goal:** Professional, polished, conversion-focused, and distinctly non-generic

---

## 1. Design Direction

This website should feel like a premium local service brand, not a startup template and not a cheap directory-style cleaning site.

### Core qualities
- Clean and minimal
- Bright and fresh
- Professional and trustworthy
- Local and human
- Calm, structured, and polished
- Conversion-focused without looking aggressive

### Creative principle
Design for **clarity first**.  
Every section should feel easy to scan, visually balanced, and credible.

### Visual benchmark
The site should sit between:
- a modern local service business
- a polished editorial brand
- a restrained corporate marketing site

It should **not** feel like:
- a flashy SaaS startup
- a generic AI landing page
- a crowded “coupon-style” cleaning website
- a dark, high-tech interface

---

## 2. Brand Personality

### Brand attributes
- Reliable
- Professional
- Fresh
- Detail-oriented
- Approachable
- Efficient
- Reassuring

### Tone translated into UI
- Simple layouts
- Strong spacing
- Minimal decoration
- Clear typography
- Real photography
- Soft but professional color usage

---

## 3. Color Tokens

## Core Palette

### Primary
- `--color-primary-700: #1E3A8A`
- `--color-primary-600: #2563EB`
- `--color-primary-500: #3B82F6`

Use for:
- primary buttons
- links
- section accents
- headings in key areas
- trust-focused highlights

### Surface / Clean Base
- `--color-white: #FFFFFF`
- `--color-off-white: #FAFBFC`
- `--color-surface-soft: #F8FAFC`

Use for:
- page background
- cards
- section alternation
- clean visual breathing room

### Accent
- `--color-accent-600: #22C55E`
- `--color-accent-500: #4ADE80`
- `--color-accent-soft: #DCFCE7`

Use sparingly for:
- eco-friendly messaging
- positive badges
- completion states
- trust indicators
- subtle highlight chips

### Neutral
- `--color-gray-50: #F9FAFB`
- `--color-gray-100: #F3F4F6`
- `--color-gray-200: #E5E7EB`
- `--color-gray-300: #D1D5DB`
- `--color-gray-500: #6B7280`
- `--color-gray-700: #374151`
- `--color-gray-900: #111827`

Use for:
- text
- borders
- dividers
- muted UI
- form fields
- supporting content

### Optional warm local accent
- `--color-local-sand: #E8DCCB`

Use only in:
- subtle section backgrounds
- image overlays
- location-related accents

This adds a Darwin-friendly warmth without weakening the clean brand.

---

## 4. Semantic Color Usage

### Text
- `--text-primary: var(--color-gray-900)`
- `--text-secondary: var(--color-gray-700)`
- `--text-muted: var(--color-gray-500)`
- `--text-inverse: #FFFFFF`

### Backgrounds
- `--bg-page: var(--color-white)`
- `--bg-section-alt: var(--color-gray-50)`
- `--bg-card: #FFFFFF`
- `--bg-card-muted: var(--color-off-white)`

### Borders
- `--border-default: var(--color-gray-200)`
- `--border-strong: var(--color-gray-300)`
- `--border-focus: var(--color-primary-600)`

### Actions
- `--button-primary-bg: var(--color-primary-700)`
- `--button-primary-text: #FFFFFF`
- `--button-primary-hover: var(--color-primary-600)`

- `--button-secondary-bg: #FFFFFF`
- `--button-secondary-text: var(--color-primary-700)`
- `--button-secondary-border: var(--color-primary-700)`

- `--button-accent-bg: var(--color-accent-600)`
- `--button-accent-text: #FFFFFF`

### Status
- `--success-bg: var(--color-accent-soft)`
- `--success-text: #166534`
- `--info-bg: #DBEAFE`
- `--info-text: #1D4ED8`
- `--warning-bg: #FEF3C7`
- `--warning-text: #92400E`

---

## 5. Typography Tokens

## Font Families

### Headings
Use a clean, confident sans-serif.

Recommended:
- `Montserrat`
- `Lato`

Token:
- `--font-heading: "Montserrat", "Lato", sans-serif`

### Body
Use a neutral, highly readable sans-serif.

Recommended:
- `Inter`
- `Open Sans`
- `Roboto`

Token:
- `--font-body: "Inter", "Open Sans", "Roboto", sans-serif`

### Usage rule
Do not mix too many fonts.  
Use **one heading font** and **one body font** only.

---

## 6. Type Scale

### Headings
- `--text-display: 3.5rem`
- `--text-h1: 3rem`
- `--text-h2: 2.25rem`
- `--text-h3: 1.5rem`
- `--text-h4: 1.25rem`

### Body
- `--text-lg: 1.125rem`
- `--text-base: 1rem`
- `--text-sm: 0.875rem`
- `--text-xs: 0.75rem`

### Line heights
- `--leading-tight: 1.1`
- `--leading-heading: 1.2`
- `--leading-body: 1.6`
- `--leading-loose: 1.75`

### Letter spacing
- Headings: slightly tight
- Body: default
- Buttons and labels: slight positive tracking acceptable

---

## 7. Layout Tokens

## Container Widths
- `--container-max: 1280px`
- `--container-content: 1120px`
- `--container-text: 720px`

### Section Spacing
- `--section-space-y: 6rem`
- `--section-space-y-lg: 8rem`
- `--section-space-y-sm: 4rem`

### Grid Gaps
- `--grid-gap-sm: 1rem`
- `--grid-gap-md: 1.5rem`
- `--grid-gap-lg: 2rem`

### Padding
- `--pad-card: 1.5rem`
- `--pad-card-lg: 2rem`
- `--pad-button-x: 1.25rem`
- `--pad-button-y: 0.875rem`
- `--pad-input-x: 1rem`
- `--pad-input-y: 0.875rem`

### Rule
Prefer larger vertical spacing than horizontal clutter.  
The site should feel open and breathable.

---

## 8. Radius Tokens

- `--radius-sm: 0.5rem`
- `--radius-md: 0.75rem`
- `--radius-lg: 1rem`
- `--radius-xl: 1.25rem`
- `--radius-2xl: 1.5rem`

### Usage
- Buttons: `--radius-lg`
- Cards: `--radius-xl`
- Inputs: `--radius-md`
- Image masks: `--radius-xl`

Avoid overly round “bubble UI” styling.

---

## 9. Shadow Tokens

- `--shadow-sm: 0 1px 2px rgba(0,0,0,0.04)`
- `--shadow-md: 0 8px 24px rgba(15, 23, 42, 0.08)`
- `--shadow-lg: 0 16px 40px rgba(15, 23, 42, 0.10)`

### Usage
- Cards: light shadow only
- Hero image frame: medium shadow
- Sticky nav: subtle shadow on scroll
- Do not overuse large shadows

The site should feel crisp, not floating or glossy.

---

## 10. Border & Divider Tokens

- `--border-width: 1px`
- `--border-color: var(--color-gray-200)`
- `--divider-color: var(--color-gray-100)`

### Rule
Use borders to create structure, not decoration.

---

## 11. Motion Tokens

### Motion style
Subtle, smooth, restrained.

### Timing
- `--ease-standard: cubic-bezier(0.4, 0, 0.2, 1)`
- `--duration-fast: 150ms`
- `--duration-normal: 250ms`
- `--duration-slow: 400ms`

### Allowed motion
- fade in
- slight upward reveal
- image scale on hover
- button color transition
- nav shadow transition

### Avoid
- parallax-heavy scenes
- exaggerated bounce
- spinning icons
- excessive blur/glow
- over-animated counters everywhere

Motion should support polish, not call attention to itself.

---

## 12. Imagery Tokens

## Overall image style
- Bright natural light
- Spotless spaces
- Clean uniforms
- Real environments
- Minimal visual clutter
- Crisp surfaces and clear materials
- Fresh but believable editing

## Image mood
- Calm
- Fresh
- Trustworthy
- Lived-in but tidy
- Human and local

## Subjects to prioritize
- Residential interiors
- Office and commercial spaces
- Staff in action
- Before-and-after moments
- Detail cleaning moments
- Eco-friendly products
- Darwin-relevant outdoor light and greenery

## Composition rules
- Use negative space
- Keep perspective consistent
- Prefer wide-to-medium framing for hero sections
- Use close-up detail images for service cards and supporting blocks
- Avoid fake stock-smiles and unnatural AI perfection

## Color treatment
- Whites should feel clean, not blown out
- Blues should stay rich and controlled
- Greens should be accents, not dominant
- Skin tones and interiors should stay natural

---

## 13. Iconography

### Icon style
- Simple outline icons
- Clean stroke weight
- Minimal detail
- Slightly rounded geometry

### Icon usage
Use icons for:
- service categories
- trust features
- process steps
- contact methods
- guarantees or benefits

Avoid decorative icon overload.

---

## 14. Component Direction

## Buttons

### Primary Button
Purpose:
- quote request
- call to action
- booking/contact actions

Style:
- deep blue background
- white text
- medium-large padding
- rounded-lg
- subtle hover darkening
- slight shadow optional

### Secondary Button
Purpose:
- learn more
- secondary page actions

Style:
- white background
- blue border
- blue text
- hover with very light blue tint

### Accent Button
Use only for:
- eco or special campaign messaging

Do not use green as the main CTA color across the entire site.

---

## 15. Cards

### Card style
- white or off-white surface
- light border
- soft shadow
- generous padding
- rounded-xl corners

### Card hierarchy
Cards should rely on:
- typography
- spacing
- icon or image
- border/shadow restraint

Not on:
- loud gradients
- glassmorphism
- oversized badges
- excessive overlays

---

## 16. Forms

### Form design
Forms should feel premium and easy, not cramped.

### Input style
- white background
- gray border
- rounded-md or rounded-lg
- strong focus ring in primary blue
- minimum 44px height
- clear labels above inputs

### Form content
Keep quote forms simple:
- Name
- Phone
- Email
- Service
- Suburb
- Property type
- Message

### Form UX
- always visible labels
- clear validation messages
- obvious submit state
- no dark fields
- no overdesigned floating labels

---

## 17. Navigation

### Header style
- white background
- restrained height
- subtle bottom border or shadow on scroll
- left-aligned logo
- clear CTA on right

### Navigation behavior
- simple, readable menu
- no mega menu unless service volume truly requires it
- mobile menu should feel clean and frictionless

### Header CTA
Use one main action only:
- Get a Free Quote
or
- Call Now

Do not compete with multiple primary actions.

---

## 18. Section Patterns

## Hero Section
Should include:
- strong headline
- concise supporting paragraph
- primary CTA
- secondary CTA
- polished hero image
- trust signals below fold or near CTA

Hero should feel:
- bright
- premium
- uncluttered
- local-service credible

## Trust Section
Use for:
- insured
- trained staff
- eco-friendly options
- satisfaction focus
- local expertise

Keep this section compact and clean.

## Services Grid
Use category-led presentation:
- Residential Cleaning
- Commercial Cleaning
- End of Lease Cleaning
- Specialist Surface Cleaning
- Add-on Services

Avoid dumping a giant undifferentiated list on the homepage.

## Process Section
Use 3 to 4 clear steps:
1. Request a quote
2. Confirm service
3. We clean
4. Enjoy the result

## Testimonials
Use real-looking testimonial cards with restrained styling.

## Service Area Section
Use suburb coverage in a structured local section, not as a cluttered wall of text.

## FAQ
Use accordions with simple typography and no gimmicky animation.

---

## 19. Tailwind Mapping

Recommended Tailwind theme intent:

### Colors
Map custom colors to:
- `primary`
- `accent`
- `surface`
- `neutral`
- `ink`

### Suggested naming
- `primary: #1E3A8A`
- `primary-light: #2563EB`
- `accent: #22C55E`
- `surface: #FFFFFF`
- `surface-soft: #F8FAFC`
- `neutral-100: #F3F4F6`
- `neutral-200: #E5E7EB`
- `neutral-500: #6B7280`
- `neutral-700: #374151`
- `neutral-900: #111827`

### Fonts
- `font-heading`
- `font-body`

### Radius
- `rounded-card`
- `rounded-button`
- `rounded-input`

### Shadows
- `shadow-soft`
- `shadow-card`
- `shadow-elevated`

---

## 20. Copy + UI Pairing Rules

### Headings
Headlines should be short, direct, and confidence-building.

Good:
- Professional Cleaning Services in Darwin
- Fresh Spaces. Reliable Service.
- Residential and Commercial Cleaning You Can Trust

Avoid:
- vague startup-style slogans
- overly clever wordplay
- corporate jargon

### UI text
Buttons, labels, and supporting text should feel human and clear.

Examples:
- Get a Free Quote
- Call Now
- View Services
- Service Areas
- Request Cleaning

---

## 21. Anti-Template Rules

To avoid the site looking AI-generated, do **not** do the following:

- Do not use giant gradient blobs
- Do not use glassmorphism cards
- Do not overfill pages with icons
- Do not stack too many tiny badges
- Do not use trendy startup illustrations unless they truly fit
- Do not rely on generic smiling-stock-team photos
- Do not over-animate every section
- Do not use dark mode as the primary visual style
- Do not make every section full-width and visually identical
- Do not use five different card styles on one page

### Instead
- Use consistent spacing
- Use custom local imagery
- Use thoughtful section rhythm
- Use restrained accents
- Use strong hierarchy
- Use editorial-style breathing room

---

## 22. Recommended Page Feel

Each page should feel like:
- a real business
- carefully designed
- easy to trust
- easy to contact
- clearly local
- visually calm
- professionally maintained

---

## 23. Default UI Recipe

If a new page or section is created and no special design direction is provided, default to:

- white background
- centered container
- strong heading
- short supporting text
- 2 to 4 card layout
- subtle border and shadow
- blue primary CTA
- clean image block
- ample vertical spacing

This is the default system behavior for consistency.

---

## 24. Final Design Summary

### Chosen Direction
**Local Service Editorial**

### Primary Visual Goal
Look polished, trustworthy