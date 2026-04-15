# motion-nav

A lightweight, animated navigation bar built with **Next.js 16**, **Motion (Framer Motion)**, and **Tailwind CSS v4**. Features a fluid pill-shaped hover indicator with spring physics, active route detection, and a fully optimized React component architecture.
---

## ✨ Features

- **Animated pill indicator** — smooth spring-physics hover effect using `motion/react`
- **Active route highlighting** — automatically detects the current page via `usePathname`
- **Semantic border radius** — inner pill radius nests perfectly inside the outer capsule border
- **Optimized rendering** — `React.memo`, `useCallback`, and `useMemo` prevent unnecessary re-renders
- **`AnimatePresence`** — clean enter/exit transitions when hovering between links
- **Accessible** — `aria-current="page"`, `role="navigation"`, `role="menubar"` built in
- **TypeScript** — fully typed props and interfaces
- **Manrope font** — loaded via `next/font/google` with zero layout shift

---

## 🛠 Tech Stack

| Technology | Version |
|---|---|
| [Next.js](https://nextjs.org) | `16.2.3` |
| [React](https://react.dev) | `19.2.4` |
| [Motion](https://motion.dev) | `^12.38.0` |
| [Tailwind CSS](https://tailwindcss.com) | `^4` |
| TypeScript | `^5` |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `18+`
- npm / yarn / pnpm / bun

### Install dependencies

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
motion-nav/
├── app/
│   ├── layout.tsx        # Root layout — fonts, metadata
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles & Tailwind import
├── components/
│   └── navbar.tsx        # Animated navbar component
├── public/
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🧩 Navbar Component

Located at `components/navbar.tsx`.

### Usage

```tsx
import Navbar from "@/components/navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
```

### Customizing Nav Links

Edit the `NAV_LINKS` constant at the top of `navbar.tsx`:

```ts
const NAV_LINKS: NavLink[] = [
  { title: "Home",     href: "/"         },
  { title: "About",    href: "/about"    },
  { title: "Services", href: "/services" },
  { title: "Contact",  href: "/contact"  },
];
```

### Tuning the Animation

Adjust the spring config in the `HOVER_SPRING` constant:

```ts
const HOVER_SPRING = {
  type: "spring",
  stiffness: 380,  // higher = snappier
  damping: 30,     // higher = less bounce
  mass: 0.6,       // lower = faster
};
```

---

## ⚡ Performance Optimizations

| Optimization | Detail |
|---|---|
| `React.memo` | `NavLogo` and `NavItem` skip re-renders when props are unchanged |
| `useCallback` | `onMouseEnter` / `onMouseLeave` handlers have stable references |
| `useMemo` | Active index derived from `pathname` only when the route changes |
| Module-level constants | `NAV_LINKS` and `HOVER_SPRING` are created once, not on every render |

---

## 🏗 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
```

---

## 📄 License

MIT
