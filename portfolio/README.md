# Premium Futuristic Personal Portfolio Website

An ultra-modern, fully responsive, and highly accessible multi-page developer portfolio website built using strictly semantic HTML5, custom CSS3 styling tokens, and lightweight Vanilla JavaScript.

## Features & Highlights

- **Modern Glassmorphic 3D Aesthetics**: Beautiful frosted cards, radial glowing meshes, retro cyber-grids, and dynamic hover effects inspired by Awwwards and premium SaaS layouts.
- **Interactive 3D Perspective Card Tilt**: Handcrafted JavaScript logic calculates cursor trajectories on hover and rotates elements on the 3D plane. Supports smooth deceleration and instantly honors accessibility preferences by disabling 3D motion when `prefers-reduced-motion: reduce` is active.
- **Dynamic Projects Showcase**: Seamless client-side categories filtering with visual entry transitions.
- **Accessible Detail Modals**: Modal dialogs populated dynamically with detail specifications. Includes keyboard locking traps (`Tab` trapping inside modal), body scrolls locking, and ESC controls.
- **Responsive Navigation Drawer**: Custom mobile hamburger navigation drawer equipped with accessibility keys mapping, traps, and aria toggling.
- **Client-side Form Validation**: Highly accessible contact form with instant validation blur listeners. Handles submissions by blocking default behavior, validating fields, focusing first invalid errors, and dynamically announcing submissions status using hidden live screen-reader regions.
- **Printable Curriculum Vitae**: Beautiful custom CV page with print media style directives, custom styling rules, and an export button that triggers `window.print()` to automatically download clean, print-friendly PDFs.
- **W3C Validated Semantic Landmarks**: Strict nested structural elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<figure>`, `<footer>`) with structured heading hierarchies.

---

## Accessibility Compliance (WCAG 2.2 AA)

This project has been architected from the ground up to achieve a **100/100 Accessibility Score** on Lighthouse audit systems:
- **Landmarks & Regions**: Comprehensive semantic layout division ensures assistive screen readers easily navigate structural regions.
- **ARIA Integration**: Clear `aria-label`, `aria-expanded`, `aria-describedby`, and `aria-live` polite status regions for real-time announcements.
- **Skip Link Navigation**: Visible skip-to-content links that allow visual and non-visual keyboard users to bypass long header navigation chains.
- **Focus Rings styling**: Clean high-contrast glowing outlines on all active focus visible elements (`outline-offset` offset and cyan values).
- **Keyboard-only Navigation**: Complete website navigability using strictly `Tab`, `Shift+Tab`, `Space`, `Enter`, and `Escape`. ZERO keyboard traps.
- **Contrast Compliance**: Contrast ratios of at least 4.5:1 on text surfaces, using standard HSL/HEX custom definitions.

---

## Technical Stack

- **Structure**: Semantic HTML5 (W3C standard)
- **Styling**: Modern CSS3 (Grid Layouts, Flexbox, Fluid `clamp()`, Keyframes, Custom styling variables)
- **Logic**: Optimized Vanilla JavaScript (Zero third-party library dependencies like jQuery or Bootstrap)

---

## Directory Structure

```text
/portfolio
    ├── index.html       # Homepage & Hero Layout
    ├── about.html       # Bio & Interactive Milestones
    ├── skills.html      # Skills categories progress meters
    ├── projects.html    # Filterable project case studies with detail Modals
    ├── services.html    # Core offerings & Process Maps
    ├── resume.html      # Printable CV with PDF downloads
    ├── contact.html     # Accessible Contact form with error traps
    ├── 404.html         # Error routing with retro Cyber Grids
    ├── css/
    │   └── style.css    # Typography, variables, grids & CSS keyframes
    ├── js/
    │   └── script.js    # 3D Tilt, modal focus trapping, validations
    └── README.md        # Comprehensive documentation
```

---

## Setup & Local Server deployment

Since the project uses raw HTML, CSS, and JS, there are **no installation dependencies** or build compilation routines required!

To preview the portfolio locally, you can open any of the HTML pages in your web browser. To test fully compliant absolute routing paths or print triggers, serve the folder using a local development server:

### Python Dev Server
```bash
# Serve the folder (Python 3+)
cd portfolio
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

### Node Dev Server (using live-server)
```bash
npm install -g live-server
cd portfolio
live-server
```

---

## Lighthouse Auditing targets

This project is optimized to hit the following scores:
- **Performance**: `95+` (Lightweight assets, zero external heavy script imports, CSS keyframe animations, deferred lazy loading)
- **Accessibility**: `100` (Strict WCAG 2.2 compliant focus rings, aria structures, keyboard navigations)
- **Best Practices**: `100` (Secure semantic patterns, console error-free, secure targets attributes)
- **SEO**: `100` (Compelling descriptions, metadata headers, canonical setups, schema mapping structured schemas)
