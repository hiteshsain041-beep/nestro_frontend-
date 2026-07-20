"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { toast } from "sonner";

import ThemeToggle from "./ThemeToggle";
import { client } from "@/utils/helper";
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
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  const [language, setLanguage] = useState("en");
  const [open, setOpen] = useState(false);       // user dropdown
  const [mobileOpen, setMobileOpen] = useState(false);      // mobile nav drawer

  const cartItems = useSelector((state) => state.cart.items);
  const t = TRANSLATIONS[language];

  const menus = useMemo(() => [
    { name: t.home, path: "/" },
    { name: t.store, path: "/store" },
    { name: t.about, path: "/about" },
    { name: t.contact, path: "/contact" },
    { name: t.checkout, path: "/checkout" },
  ], [t]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("lang");
    if (savedLanguage) setLanguage(savedLanguage);
    dispatch(lsToCart());
  }, [dispatch]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLanguageChange = ({ target }) => {
    setLanguage(target.value);
    localStorage.setItem("lang", target.value);
  };

  const handleLogout = async () => {
    try {
      const { data } = await client.post("/user/logout");
      toast.success(data.message);
      setOpen(false);
      setMobileOpen(false);
      router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#faf8f5] border-b border-[#ede9e3]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

          {/* ── Logo ─────────────────────────────────────────── */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-lg sm:text-xl font-bold tracking-[0.3em] text-[#1a1007]">
              NESTRO.
            </span>
          </Link>

          {/* ── Centre Nav — desktop only ─────────────────────── */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {menus.map((menu) => (
              <Link
                key={menu.name}
                href={menu.path}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${pathname === menu.path
                  ? "bg-[#3a2418] text-white shadow-sm"
                  : "text-[#5a4a3a] hover:text-[#1a1007] hover:bg-[#f0ebe4]"
                  }`}
              >
                {menu.name}
              </Link>
            ))}
          </nav>

          {/* ── Right Icons ───────────────────────────────────── */}
          <div className="flex items-center gap-0.5 sm:gap-1">

            {/* Search — hidden on very small screens */}
            <button
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-[#5a4a3a] hover:bg-[#f0ebe4] transition"
              aria-label="Search"
            >
              <FiSearch size={17} />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#5a4a3a] hover:bg-[#f0ebe4] transition"
              aria-label="Shopping cart"
            >
              <FiShoppingCart size={17} />
              {cartItems.length > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c97d4e] text-[9px] font-bold text-white leading-none">
                  {cartItems.length > 9 ? "9+" : cartItems.length}
                </span>
              )}
            </Link>

            {/* Language — lg+ only */}
            <select
              value={language}
              onChange={handleLanguageChange}
              className="hidden lg:block rounded-full border border-[#ede9e3] bg-transparent px-2.5 py-1.5 text-[11px] font-medium text-[#5a4a3a] outline-none cursor-pointer hover:bg-[#f0ebe4] transition"
              aria-label="Select language"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>

            <ThemeToggle />

            {/* User dropdown — desktop */}
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-haspopup="true"
                aria-label="User menu"
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${open
                  ? "border-[#3a2418] bg-[#3a2418] text-white"
                  : "border-[#ede9e3] bg-white text-[#5a4a3a] hover:border-[#c9b9a8]"
                  }`}
              >
                <FiUser size={15} />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-[#ede9e3] bg-white shadow-[0_8px_30px_rgba(58,36,24,0.12)] overflow-hidden z-50">
                  {user ? (
                    <>
                      <div className="border-b border-[#f0ebe4] px-4 py-3 bg-[#faf8f5]">
                        <p className="font-semibold text-sm text-[#1a1007]">{user.name}</p>
                        <p className="text-xs text-[#9a8a7a]">Welcome back 👋</p>
                      </div>
                      <Link href="/forget-Password" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm text-[#3a2418] hover:bg-[#faf8f5] transition">
                        Forgot Password
                      </Link>
                      <div className="h-px bg-[#f0ebe4] mx-3" />
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition">
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm text-[#3a2418] hover:bg-[#faf8f5] transition">
                        Sign In
                      </Link>
                      <Link href="/register" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm text-[#3a2418] hover:bg-[#faf8f5] transition">
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Sign Out — desktop pill */}
            {user && (
              <button
                onClick={handleLogout}
                className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-[#ede9e3] bg-white px-4 py-1.5 text-[13px] font-medium text-[#3a2418] hover:bg-[#3a2418] hover:text-white hover:border-[#3a2418] transition-all duration-200"
              >
                Sign Out
              </button>
            )}

            {/* Sign In link — desktop, guest */}
            {!user && (
              <Link href="/login" className="hidden md:block text-[13px] font-medium text-[#5a4a3a] hover:text-[#1a1007] transition px-2">
                Sign In
              </Link>
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-full text-[#5a4a3a] hover:bg-[#f0ebe4] transition ml-1"
              aria-label="Open menu"
            >
              <FiMenu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ─────────────────────────────────────── */}
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
        className={`fixed top-0 left-0 z-50 h-full w-72 max-w-[85vw] bg-[#faf8f5] shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-[#ede9e3] px-5 py-4">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <span className="text-lg font-bold tracking-[0.3em] text-[#1a1007]">NESTRO.</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#5a4a3a] hover:bg-[#f0ebe4] transition"
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
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === menu.path
                ? "bg-[#3a2418] text-white"
                : "text-[#3a2418] hover:bg-[#f0ebe4]"
                }`}
            >
              {menu.name}
            </Link>
          ))}
        </nav>

        <div className="h-px bg-[#ede9e3] mx-4" />

        {/* Auth links */}
        <div className="flex flex-col px-3 py-4 gap-1">
          {user ? (
            <>
              <div className="px-4 py-3 bg-[#f0ebe4] rounded-xl mb-1">
                <p className="text-sm font-semibold text-[#1a1007]">{user.name}</p>
                <p className="text-xs text-[#9a8a7a]">Logged in</p>
              </div>
              <Link href="/forget-Password" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm text-[#3a2418] hover:bg-[#f0ebe4] transition">
                Forgot Password
              </Link>
              <button onClick={handleLogout} className="text-left px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-[#3a2418] hover:bg-[#f0ebe4] transition">
                Sign In
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium bg-[#3a2418] text-white hover:bg-[#2a1a10] transition text-center">
                Create Account
              </Link>
            </>
          )}
        </div>

        {/* Language */}
        <div className="px-7 pt-2">
          <label className="text-xs font-semibold text-[#9a8a7a] uppercase tracking-wide block mb-1.5">Language</label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-full rounded-xl border border-[#ede9e3] bg-white px-3 py-2.5 text-sm text-[#5a4a3a] outline-none"
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
