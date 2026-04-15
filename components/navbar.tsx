"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavLink {
  title: string;
  href: string;
}

// ─── Constants (defined outside component to avoid re-creation on re-renders) ──

const NAV_LINKS: NavLink[] = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Services", href: "/services" },
  { title: "Contact", href: "/contact" },
];

const HOVER_SPRING = {
  type: "spring" as const,
  stiffness: 380,
  damping: 30,
  mass: 0.6,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const NavLogo = React.memo(function NavLogo() {
  return (
    <Link href="/" className="font-bold text-2xl tracking-tight select-none">
      Logo
    </Link>
  );
});

NavLogo.displayName = "NavLogo";

// ─── NavItem ──────────────────────────────────────────────────────────────────

interface NavItemProps {
  link: NavLink;
  idx: number;
  isHovered: boolean;
  isActive: boolean;
  onMouseEnter: (idx: number) => void;
  onMouseLeave: () => void;
}

const NavItem = React.memo(function NavItem({
  link,
  idx,
  isHovered,
  isActive,
  onMouseEnter,
  onMouseLeave,
}: NavItemProps) {
  return (
    <Link
      href={link.href}
      className="relative text-center px-4 py-1 rounded-full"
      onMouseEnter={() => onMouseEnter(idx)}
      onMouseLeave={onMouseLeave}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Active indicator (always mounted, lower z-index) */}
      {isActive && (
        <motion.div
          layoutId="active"
          className="absolute inset-0 bg-black/10 rounded-full"
          transition={HOVER_SPRING}
        />
      )}

      {/* Hover indicator */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            layoutId="hover"
            className="absolute inset-0 bg-black w-full h-full rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={HOVER_SPRING}
          />
        )}
      </AnimatePresence>

      <span className="relative z-10 mix-blend-difference text-white font-normal">
        {link.title}
      </span>
    </Link>
  );
});

NavItem.displayName = "NavItem";

// ─── Main Navbar ──────────────────────────────────────────────────────────────

const Navbar = () => {
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const pathname = usePathname();

  // Stable callbacks — won't cause child re-renders
  const handleMouseEnter = useCallback((idx: number) => {
    setHoveredLink(idx);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredLink(null);
  }, []);

  // Derive active index from current pathname
  const activeIdx = useMemo(
    () => NAV_LINKS.findIndex((link) => link.href === pathname),
    [pathname]
  );

  return (
    <header className="w-full max-w-5xl mx-auto" role="banner">
      <nav
        className="container px-5 py-4"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavLogo />

          {/* Nav Links Pill */}
          <div
            className="flex items-center border-2 border-neutral-600 text-sm rounded-full bg-white p-1 text-black gap-1"
            role="menubar"
          >
            {NAV_LINKS.map((link, idx) => (
              <NavItem
                key={link.href + idx}
                link={link}
                idx={idx}
                isHovered={hoveredLink === idx}
                isActive={activeIdx === idx}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              className="border text-xs font-medium rounded-full px-4 py-1.5 text-neutral-600 bg-neutral-50 hover:bg-neutral-100 transition-colors duration-150"
            >
              Sign Up
            </button>
            <button
              type="button"
              className="border text-xs font-medium rounded-full bg-neutral-800 px-4 py-1.5 text-white hover:bg-neutral-700 transition-colors duration-150"
            >
              Login
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
