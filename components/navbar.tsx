"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu } from "lucide-react";

interface NavLink {
  title: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Services", href: "/services" },
  { title: "Portfolio", href: "/portfolio" },
  { title: "Contact", href: "/contact" },
];

const HOVER_SPRING = {
  type: "spring" as const,
  stiffness: 380,
  damping: 30,
  mass: 0.6,
};

const NavLogo = React.memo(function NavLogo() {
  return (
    <Link href="/" className="text-2xl font-bold tracking-tight select-none">
      Intractive
    </Link>
  );
});

NavLogo.displayName = "NavLogo";

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
      className="relative rounded-full px-4 py-1 text-center"
      onMouseEnter={() => onMouseEnter(idx)}
      onMouseLeave={onMouseLeave}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && (
        <motion.div
          layoutId="active"
          className="absolute inset-0 rounded-full bg-black"
          transition={HOVER_SPRING}
        />
      )}

      <AnimatePresence>
        {isHovered && (
          <motion.div
            layoutId="hover"
            className="absolute inset-0 h-full w-full rounded-full bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={HOVER_SPRING}
          />
        )}
      </AnimatePresence>

      <span className="relative z-10 font-normal text-white mix-blend-difference">
        {link.title}
      </span>
    </Link>
  );
});

NavItem.displayName = "NavItem";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  activeIdx: number;
}

const MobileMenu = React.memo(function MobileMenu({
  isOpen,
  onClose,
  navLinks,
  activeIdx,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-2 rounded-lg border border-neutral-200 bg-white md:hidden"
        >
          <div className="flex flex-col">
            {navLinks.map((link, idx) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`px-4 py-2 text-sm font-medium ${
                  activeIdx === idx
                    ? "bg-black text-white"
                    : "text-neutral-800 hover:bg-neutral-100"
                }`}
              >
                {link.title}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 border-t border-neutral-200 p-4 sm:flex-row">
            <button
              type="button"
              className="w-full rounded-full border bg-neutral-50 px-4 py-1.5 text-sm font-medium text-neutral-600 transition-colors duration-150 hover:bg-neutral-100"
            >
              Sign Up
            </button>
            <button
              type="button"
              className="w-full rounded-full border bg-neutral-800 px-4 py-1.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-neutral-700"
            >
              Login
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

MobileMenu.displayName = "MobileMenu";

const MenuToggle = ({
  setIsMobileMenuOpen,
  isMobileMenuOpen,
}: {
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  isMobileMenuOpen: boolean;
}) => {
  return (
    <div className="flex items-center md:hidden">
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="rounded-lg border border-neutral-400/50 p-2 hover:bg-neutral-50"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {/* Hamburger Icon */}
        <Menu size={16} />
      </button>
    </div>
  );
};

MenuToggle.displayName = "MobileToggle";

const Navbar = () => {
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleMouseEnter = useCallback((idx: number) => {
    setHoveredLink(idx);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredLink(null);
  }, []);

  const activeIdx = useMemo(
    () => NAV_LINKS.findIndex((link) => link.href === pathname),
    [pathname]
  );

  return (
    <header className="w-full" role="banner">
      <nav
        className="container mx-auto max-w-7xl px-5 py-4"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between">
          <NavLogo />

          {/* Nav Links Pill */}
          <div
            className="hidden items-center gap-1 rounded-full border-2 border-neutral-600 bg-white p-1 text-sm text-black md:flex"
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
          <div className="hidden gap-2 md:flex">
            <button
              type="button"
              className="rounded-full border bg-neutral-50 px-4 py-1.5 text-sm font-medium text-neutral-600 transition-colors duration-150 hover:bg-neutral-100"
            >
              Sign Up
            </button>
            <button
              type="button"
              className="rounded-full border bg-neutral-800 px-4 py-1.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-neutral-700"
            >
              Login
            </button>
          </div>

          {/* Mobile View: Hamburger Menu */}
          <MenuToggle
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          navLinks={NAV_LINKS}
          activeIdx={activeIdx}
        />
      </nav>
    </header>
  );
};

export default Navbar;
