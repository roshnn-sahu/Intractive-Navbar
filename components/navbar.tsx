"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu } from 'lucide-react';

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
    <Link href="/" className="font-bold text-2xl tracking-tight select-none">
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
      className="relative text-center px-4 py-1 rounded-full"
      onMouseEnter={() => onMouseEnter(idx)}
      onMouseLeave={onMouseLeave}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && (
        <motion.div
          layoutId="active"
          className="absolute inset-0 bg-black rounded-full"
          transition={HOVER_SPRING}
        />
      )}

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
          className="md:hidden bg-white border border-neutral-200 rounded-lg mt-2"
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
          <div className="flex  gap-2 p-4 border-t border-neutral-200">
            <button
              type="button"
              className="border text-sm font-medium rounded-full px-4 py-1.5 text-neutral-600 bg-neutral-50 hover:bg-neutral-100 transition-colors duration-150"
            >
              Sign Up
            </button>
            <button
              type="button"
              className="border text-sm font-medium rounded-full bg-neutral-800 px-4 py-1.5 text-white hover:bg-neutral-700 transition-colors duration-150"
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
        className="p-2 rounded-lg border border-neutral-400/50 hover:bg-neutral-50"
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
    [pathname],
  );

  return (
    <header className="w-full " role="banner">
      <nav
        className="container px-5 py-4 max-w-7xl mx-auto "
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex justify-between items-center">
          <NavLogo />

          {/* Nav Links Pill */}
          <div
            className="hidden md:flex items-center border-2 border-neutral-600 text-sm rounded-full bg-white p-1 text-black gap-1"
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
          <div className="hidden md:flex gap-2">
            <button
              type="button"
              className="border text-sm font-medium rounded-full px-4 py-1.5 text-neutral-600 bg-neutral-50 hover:bg-neutral-100 transition-colors duration-150"
            >
              Sign Up
            </button>
            <button
              type="button"
              className="border text-sm font-medium rounded-full bg-neutral-800 px-4 py-1.5 text-white hover:bg-neutral-700 transition-colors duration-150"
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
