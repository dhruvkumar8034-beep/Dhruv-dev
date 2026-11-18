# Dhruv.dev — Developer Portfolio Web App

A pixel-perfect, high-performance portfolio web app crafted for **Dhruv.dev**, inspired by and faithfully replicating the editorial design language, typography, and micro-interactions of [devaa.me](https://devaa.me).

---

## ✨ Features & Architecture

1. **Interactive Physics Particle Hero**:
   - The hero name **`Dhruv.dev`** is rendered to an HTML5 canvas and sampled into dynamic physical particles.
   - Responds to mouse movements, touches, and clicks with real-time particle scattering and spring physics.

2. **3D Cylindrical Scroll Wheel**:
   - Smooth 3D wheel carousel (`What I build`) that rotates perspective cards in 3D space synchronized with Lenis smooth scroll.
   - Interactive counter and dynamic discipline notes.

3. **Selected Work with FLIP Filtering**:
   - Filter projects smoothly across *All work*, *Full-stack*, *AI & automation*, and *Systems & cloud*.
   - Uses FLIP (First, Last, Invert, Play) transition animations with expandable `<details>` contribution breakdowns.

4. **Working Stack Grid**:
   - Interactive skill cards covering Frameworks, Languages, Cloud & DevOps, AI & Data, Architecture, and Linux CLI.
   - Includes illustrative shell command snippets (`$ docker compose up -d`, `$ git status -s`).

5. **Sticky Wave Color Chapters**:
   - Fluid paper &rarr; rust &rarr; dark color transitions in the closing scene.
   - Smooth backdrop blurs and sticky typography transitions.

6. **In-Browser Customizer Panel**:
   - Click the floating **Customize** button (or press `Ctrl+E` / `Cmd+E`) to edit your name, tagline, bio, contact email, and social profiles live.
   - Real-time updates re-render the particle physics instantly and persist changes to `localStorage`.

---

## 🚀 Quick Start

### Option 1: Node.js (Zero Dependencies)
```bash
# Navigate to project folder
cd C:\Users\Administrator\.gemini\antigravity\scratch\dhruv-dev

# Run local web server
node server.js
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Option 2: Python (Zero Dependencies)
```bash
# Navigate to project folder
cd C:\Users\Administrator\.gemini\antigravity\scratch\dhruv-dev

# Run Python server
python server.py
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
dhruv-dev/
├── index.html                   # Main portfolio application
├── server.js                    # Node.js zero-dependency HTTP server
├── server.py                    # Python HTTP server
├── package.json                 # Project configuration
├── README.md                    # Documentation & setup guide
└── assets/
    ├── styles.css               # Core editorial typography & layout styles
    ├── app.js                   # FLIP filtering and interactive work details
    ├── customizer.css           # Live customization drawer styling
    ├── customizer.js            # Live editing engine & localStorage manager
    ├── favicon.svg              # Brand icon
    ├── fonts/
    │   ├── bricolage-grotesque.woff2  # Display typeface
    │   └── dm-sans.woff2             # Body typeface
    ├── icons/
    │   ├── react.svg, node.svg, python.svg, docker.svg, ...
    ├── motion/
    │   ├── motion.css           # Entrance and micro-interaction styles
    │   └── motion.js            # Tab indicators and navigation motion
    └── scroll-effects.js        # Lenis smooth scroll, particle physics, 3D wheel
```
