"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import {
  FiSearch, FiShoppingCart, FiUser, FiMenu, FiX,
  FiLogIn, FiLogOut, FiChevronDown,
} from "react-icons/fi";

import { lsToCart } from "@/redux/features/cartSlice";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "ur", name: "اردو" },
  { code: "ar", name: "العربية" },
];

const TRANSLATIONS = {
  en: { home: "Home", store: "Store", about: "About", contact: "Contact", checkout: "Checkout" },
  hi: { home: "होम", store: "स्टोर", about: "हमारे बारे में", contact: "संपर्क", checkout: "चेकआउट" },
  ur: { home: "ہوم", store: "اسٹور", about: "ہمارے بارے میں", contact: "رابطہ", checkout: "چیک آؤٹ" },
  ar: { home: "الرئيسية", store: "المتجر", about: "من نحن", contact: "اتصل بنا", checkout: "الدفع" },
};

export default function Header({ user }) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const dropdownRef = useRef(null);  // wraps BOTH the icon button and dropdown panel

  const [language, setLanguage] = useState("en");
  const [open, setOpen] = useState(false);  // profile dropdown (mobile + desktop)
  const [mobileOpen, setMobileOpen] = useState(false);  // nav drawer (mobile)

  const cartItems = useSelector((state) => state.cart.items);
  const t = TRANSLATIONS[language];

  const menus = useMemo(() => [
    { name: t.home, path: "/" },
    { name: t.store, path: "/store" },
    { name: t.about, path: "/about" },
    { name: t.contact, path: "/contact" },
    { name: t.checkout, path: "/checkout" },
  ], [t]);

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLanguage(saved);
    dispatch(lsToCart());
  }, [dispatch]);

  // ── Close dropdown on outside click ───────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Close dropdown on Escape key ──────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") { setOpen(false); setMobileOpen(false); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // ── Close nav drawer on route change ──────────────────────────────────────
  useEffect(() => { setMobileOpen(false); setOpen(false); }, [pathname]);

  // ── Lock body scroll when nav drawer open ─────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLanguageChange = ({ target }) => {
    setLanguage(target.value);
    localStorage.setItem("lang", target.value);
  };

  // ── Logout — clears cookies on Vercel domain, then hard-reload ────────────
  const handleLogout = useCallback(async () => {
    setOpen(false);
    setMobileOpen(false);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch { /* ignore — hard reload clears UI anyway */ }
    window.location.href = "/";
  }, []);

  // ── Profile dropdown content (shared by mobile + desktop) ─────────────────
  const DropdownContent = (
    <div
      className="absolute right-0 mt-2 w-52 rounded-2xl border border-[#ede9e3]
                 bg-white shadow-[0_8px_30px_rgba(58,36,24,0.14)]
                 overflow-hidden z-[60]"
      role="menu"
      aria-orientation="vertical"
    >
      {user ? (
        <>
          {/* User info header */}
          <div className="border-b border-[#f0ebe4] px-4 py-3 bg-[#faf8f5]">
            <p className="font-semibold text-sm text-[#1a1007] truncate">{user.name}</p>
            <p className="text-xs text-[#9a8a7a]">Welcome back 👋</p>
          </div>

          {/* Profile */}
          <Link
            href="/orders"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#3a2418]
                       hover:bg-[#faf8f5] transition"
          >
            <FiUser size={14} className="opacity-60" /> My Orders
          </Link>

          <div className="h-px bg-[#f0ebe4] mx-3" />

          {/* Sign Out */}
          <button
            role="menuitem"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm
                       text-red-500 hover:bg-red-50 transition"
          >
            <FiLogOut size={14} /> Sign Out
          </button>
        </>
      ) : (
        <>
          {/* Sign In */}
          <Link
            href="/login"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#3a2418]
                       hover:bg-[#faf8f5] transition"
          >
            <FiLogIn size={14} className="opacity-60" /> Sign In
          </Link>

          <div className="h-px bg-[#f0ebe4] mx-3" />

          {/* Create Account */}
          <Link
            href="/register"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#3a2418]
                       hover:bg-[#faf8f5] transition"
          >
            Create Account
          </Link>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          HEADER BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#faf8f5] border-b border-[#ede9e3]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-lg sm:text-xl font-bold tracking-[0.3em] text-[#1a1007]">
              NESTRO.
            </span>
          </Link>

          {/* ── Desktop centre nav ────────────────────────────────────────── */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {menus.map((menu) => (
              <Link
                key={menu.name}
                href={menu.path}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200
                  ${pathname === menu.path
                    ? "bg-[#3a2418] text-white shadow-sm"
                    : "text-[#5a4a3a] hover:text-[#1a1007] hover:bg-[#f0ebe4]"
                  }`}
              >
                {menu.name}
              </Link>
            ))}
          </nav>

          {/* ── Right icons ───────────────────────────────────────────────── */}
          <div className="flex items-center gap-0.5 sm:gap-1">

            {/* Search — sm+ only */}
            <button
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full
                         text-[#5a4a3a] hover:bg-[#f0ebe4] transition"
              aria-label="Search"
            >
              <FiSearch size={17} />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full
                         text-[#5a4a3a] hover:bg-[#f0ebe4] transition"
              aria-label="Shopping cart"
            >
              <FiShoppingCart size={17} />
              {cartItems.length > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center
                                 justify-center rounded-full bg-[#c97d4e] text-[9px]
                                 font-bold text-white leading-none">
                  {cartItems.length > 9 ? "9+" : cartItems.length}
                </span>
              )}
            </Link>

            {/* Language — lg+ only */}
            <select
              value={language}
              onChange={handleLanguageChange}
              className="hidden lg:block rounded-full border border-[#ede9e3] bg-transparent
                         px-2.5 py-1.5 text-[11px] font-medium text-[#5a4a3a] outline-none
                         cursor-pointer hover:bg-[#f0ebe4] transition"
              aria-label="Select language"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>

            {/* ── Profile icon + dropdown (BOTH mobile and desktop) ─────────
                This is the SINGLE auth entry point — no duplicate buttons.
                On mobile this replaces the old Sign In / Sign Out pills.
                On desktop it sits beside the existing Sign In/Sign Out text  */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-haspopup="true"
                aria-label="Profile menu"
                className={`flex h-10 w-10 items-center justify-center rounded-full border
                            transition-all duration-200
                            ${open
                    ? "border-[#3a2418] bg-[#3a2418] text-white"
                    : "border-[#ede9e3] bg-white text-[#5a4a3a] hover:border-[#c9b9a8]"
                  }`}
              >
                {user
                  ? <FiUser size={15} />
                  : <FiLogIn size={15} />
                }
              </button>

              {/* Dropdown panel */}
              {open && DropdownContent}
            </div>

            {/* Desktop Sign In text link (guest only) — kept for discoverability */}
            {!user && (
              <Link
                href="/login"
                className="hidden md:block text-[13px] font-medium text-[#5a4a3a]
                           hover:text-[#1a1007] transition px-2"
              >
                Sign In
              </Link>
            )}

            {/* Desktop Sign Out pill (logged-in only) */}
            {user && (
              <button
                onClick={handleLogout}
                className="hidden md:inline-flex items-center gap-1.5 rounded-full
                           border border-[#ede9e3] bg-white px-4 py-1.5 text-[13px]
                           font-medium text-[#3a2418] hover:bg-[#3a2418] hover:text-white
                           hover:border-[#3a2418] transition-all duration-200"
              >
                Sign Out
              </button>
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-full
                         text-[#5a4a3a] hover:bg-[#f0ebe4] transition ml-0.5"
              aria-label="Open navigation menu"
            >
              <FiMenu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE NAV DRAWER
      ══════════════════════════════════════════════════════════════════════ */}

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-in panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed top-0 left-0 z-50 h-full w-72 max-w-[85vw] bg-[#faf8f5]
                    shadow-2xl transition-transform duration-300 ease-in-out md:hidden
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-[#ede9e3] px-5 py-4">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <span className="text-lg font-bold tracking-[0.3em] text-[#1a1007]">NESTRO.</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full
                       text-[#5a4a3a] hover:bg-[#f0ebe4] transition"
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-3 py-4 gap-1" aria-label="Mobile navigation">
          {menus.map((menu) => (
            <Link
              key={menu.name}
              href={menu.path}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${pathname === menu.path
                  ? "bg-[#3a2418] text-white"
                  : "text-[#3a2418] hover:bg-[#f0ebe4]"
                }`}
            >
              {menu.name}
            </Link>
          ))}
        </nav>

        <div className="h-px bg-[#ede9e3] mx-4" />

        {/* Auth section in drawer — user info only, no duplicate buttons */}
        <div className="flex flex-col px-3 py-4 gap-1">
          {user ? (
            <div className="px-4 py-3 bg-[#f0ebe4] rounded-xl">
              <p className="text-sm font-semibold text-[#1a1007] truncate">{user.name}</p>
              <p className="text-xs text-[#9a8a7a] mt-0.5">
                Use the profile icon ↗ for Sign Out
              </p>
            </div>
          ) : (
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium bg-[#3a2418] text-white
                         hover:bg-[#2a1a10] transition text-center"
            >
              Create Account
            </Link>
          )}
        </div>

        {/* Language */}
        <div className="px-7 pt-2">
          <label className="text-xs font-semibold text-[#9a8a7a] uppercase tracking-wide block mb-1.5">
            Language
          </label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-full rounded-xl border border-[#ede9e3] bg-white px-3 py-2.5
                       text-sm text-[#5a4a3a] outline-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
