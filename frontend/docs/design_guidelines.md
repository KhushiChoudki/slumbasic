# Design Guidelines for PATH Platform Website

## Design Approach
Modern, tactile 3D aesthetic with high contrast and lively visual elements. The design emphasizes depth through layered shadows, glass morphism effects, and subtle parallax. Reference the provided design mockup for overall visual direction while enhancing polish and refinement.

## Typography System
- **Headlines**: Anton (or similar condensed heavy font) - for large "PATH" logo and major headings
- **Body Copy**: Inter, 16px base size
- **Hierarchy**: Bold, tactile headings with tight tracking; clean, readable body text
- **Scale**: Large logo text, medium section headers, comfortable body copy

## Color Palette (CSS Variables)
```
--bg: #f3f6f7 (pale desaturated blue-grey)
--muted: #9aa0a6 (medium grey)
--accent: #ff6b9a (vibrant pink)
--dark: #111213 (near black)
--glass: rgba(255,255,255,0.7) (frosted white)
```
Use accent color for CTAs and subtle gradients on interactive elements.

## Layout System
- **Spacing**: Tailwind utilities with larger vertical rhythm between sections
- **Container**: Max-width centered content with comfortable gutters
- **Grid Patterns**:
  - Two-column for "What are we doing?" section (image left, text right)
  - Three-column grid for prototype cards
  - Two-column for About section (text left, diagram right)
- **Mobile**: Stack all columns vertically

## Component Specifications

### Hero Section
- Large vertically-staggered "PATH" headline with multi-layered shadows (soft offset blur + dark inner shadow) for 3D texture
- Small rotated "NEXT" tag overlapping the P character
- Subtle background gradient (pale blue → off-white) with faint noise overlay
- Slow parallax background effect for depth
- **Background**: Gradient with noise texture, no hero image required

### Navbar
- Slim bar above hero
- Left-aligned links: Home / About / Prototype / Contact
- Right-aligned dark-mode toggle
- Mobile: Hamburger menu

### Prototype Cards
- Rounded-2xl image cards with organic feel via clip-path
- Frosted glass overlay at bottom containing title and "find out more" pill CTA
- Hover effects: translateY(-6px), soft drop shadow, subtle scale
- Three placeholders needed in assets/ folder

### About Section
- Rounded square diagram/network visualization image on right
- Subtle card with inner shadow around diagram
- Descriptive team text on left

### Footer
- Minimalist contact info (phone, email)
- Social media icon links
- High-contrast, accessible text

### Interactive Elements
- "Download prototype" or "Try prototype" pill CTA in prototype section
- Floating help button in bottom-right corner
- All buttons use accent color with subtle gradients

## Animations & Microinteractions
- Fade-in on scroll using IntersectionObserver
- Hover transitions for buttons and cards (smooth, 300ms)
- Soft parallax on hero background
- Mobile nav toggle animation
- Keep animations tasteful and subtle

## Accessibility Requirements
- All images must have descriptive alt attributes
- Ensure strong contrast for body copy (WCAG AA minimum)
- Keyboard-focus styles for all interactive elements
- ARIA labels where appropriate
- loading="lazy" on below-fold images

## Images
- **Prototype Cards**: 3 placeholder images showcasing different prototype views
- **About Section**: 1 network/diagram visualization image (rounded square format)
- No large hero image - use gradient background with texture instead