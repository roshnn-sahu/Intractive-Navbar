"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavLink {
  title: string;
  href: string;
}
interface NavbarProps {
  links?: NavLink[];
  logo?: React.ReactNode;
  logoHref?: string;
  className?: string;
  children?: React.ReactNode;
}

const DEFAULT_LINKS: NavLink[] = [
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

const NavLogo = React.memo(function NavLogo({
  logo,
  logoHref,
}: {
  logo: React.ReactNode;
  logoHref: string;
}) {
  return (
    <Link
      href={logoHref}
      className="text-2xl font-bold tracking-tight select-none"
    >
      {logo}
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
      className={`relative inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
      onMouseEnter={() => onMouseEnter(idx)}
      onMouseLeave={onMouseLeave}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && (
        <motion.div
          layoutId="active"
          className="absolute inset-0 rounded-full bg-foreground"
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

      <span
        className={`relative z-10 flex items-center gap-2 ${isHovered ? "text-white" : ""}`}
      >
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
          className="mx-auto mt-3 w-full max-w-7xl overflow-hidden rounded-b-xl border border-border/50 bg-background/95 backdrop-blur-xl md:hidden"
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
          <div className="grid grid-cols-1 gap-2 border-t border-neutral-200 p-4 sm:grid-cols-2 sm:flex-row">
            <Button
              variant="outline"
              type="button"
              className="w-full rounded-full px-3"
            >
              Sign Up
            </Button>
            <Button
              variant="default"
              type="button"
              className="w-full rounded-full px-3"
            >
              Login
            </Button>
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
        <Menu size={16} />
      </button>
    </div>
  );
};

MenuToggle.displayName = "MobileToggle";

const Navbar = ({
  links = DEFAULT_LINKS,
  logo = "Interactive",
  logoHref = "/",
  className,
  children,
}: NavbarProps) => {
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
    () =>
      links.findIndex(
        (link) =>
          link.href === pathname || (link.href === "/" && pathname === "/"),
      ),
    [pathname],
  );

  return (
    <header className="w-full" role="banner">
      <nav
        className={cn(
          "mx-auto w-full max-w-7xl border-border/50 bg-background/80 px-4 py-3 backdrop-blur-xl transition-all duration-300 dark:bg-muted/50",
          className,
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between">
          <NavLogo logo={logo} logoHref={logoHref} />
          {/* Nav Links Pill */}
          <div
            className="hidden items-center gap-1 rounded-full border border-border bg-muted/40 p-1 shadow-sm md:flex"
            role="menubar"
          >
            {links.map((link, idx) => (
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
            {children ?? (
              <>
                <Button
                  variant="outline"
                  type="button"
                  className="rounded-full px-3"
                >
                  Sign Up
                </Button>

                <Button
                  variant="default"
                  type="button"
                  className="rounded-full px-3"
                >
                  Login
                </Button>
              </>
            )}
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
          navLinks={links}
          activeIdx={activeIdx}
        />
      </nav>
    </header>
  );
};

export default Navbar;
