"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./icon";

const links = [
  { label: "Beranda", href: "/" },
  { label: "Cari Properti", href: "/properties" },
  { label: "Peta Properti", href: "/map" },
  { label: "Tentang Kami", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className={`site-header${menuOpen ? " menu-open" : ""}`}>
      <div className="container nav-inner">
        <Link
          className="brand"
          href="/"
          aria-label="RumaMap, kembali ke beranda"
          onClick={closeMenu}
        >
          <span className="brand-mark">
            <Icon name="map-pin" size={20} />
          </span>
          <span className="brand-name">
            Ruma<span>Map</span>
          </span>
        </Link>

        <nav
          className="nav-links"
          id="mobile-nav"
          aria-label="Navigasi utama"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              className={`nav-link${pathname === link.href ? " nav-link-active" : ""}`}
              href={link.href}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <Link
            className="button nav-login"
            href="/login"
            onClick={closeMenu}
          >
            Masuk
          </Link>
          <Link
            className="button button-primary nav-register"
            href="/register"
            onClick={closeMenu}
          >
            Daftar
          </Link>
        </div>

        <button
          className="nav-toggle"
          type="button"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? "close" : "menu"} />
        </button>
      </div>
    </header>
  );
}
