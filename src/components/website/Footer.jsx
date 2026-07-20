"use client";

import Link from "next/link";
import { IoLogoInstagram } from "react-icons/io";
import { FaYoutube } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa6";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const FooterCompany = [
    { name: "4wood", path: "https://4wood.co.uk/" },
    { name: "WoodGroup", path: "https://www.woodgroup.com/" },
    { name: "Justdial", path: "https://www.justdial.com/Jaipur/Wood-Manufacturers/nct-10542302" },
    { name: "Wood & Company", path: "https://wood.com/" },
  ];

  const FooterSupport = [
    { name: "Contact Us", path: "/contact" },
    { name: "Assembly Help", path: "/contact" },
    { name: "Returns & Exchange", path: "/contact" },
    { name: "Track Order", path: "/orders" },
  ];

  const FooterFollowUs = [
    { name: "Houzz", path: "https://www.houzz.com", target: "_blank" },
    { name: "Pinterest", path: "https://www.pinterest.com", target: "_blank" },
    { name: "Instagram", path: "https://www.instagram.com/hitesh_sain_x13", target: "_blank" },
  ];

  const FooterLegal = [
    { name: "Terms", path: "/about" },
    { name: "Privacy", path: "/about" },
    { name: "Sitemap", path: "/store" },
  ];

  return (
    <footer className="bg-[#120700] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-6">

        {/* ── Main grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">

          {/* Brand + newsletter — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <h1 className="text-xl font-semibold tracking-[0.25em] text-[#f2d2b0]">NESTRO.</h1>
            <p className="mt-3 text-sm leading-relaxed">
              Curated furniture for thoughtful homes. Crafted with intention, made to endure.
            </p>
            <div className="mt-6 flex overflow-hidden rounded-xl border border-[#3a2415]">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-[#2a1a10] px-3 py-2.5 text-sm outline-none text-white placeholder:text-gray-500"
              />
              <button className="flex-shrink-0 bg-[#a87447] px-4 sm:px-5 text-white text-sm font-medium hover:bg-[#925f35] transition">
                Subscribe
              </button>
            </div>
          </div>

          {/* Company */}
          <div>
            <h2 className="text-xs tracking-[0.3em] text-[#d9a66f] uppercase mb-4 font-semibold">Company</h2>
            <div className="flex flex-col gap-3 text-sm">
              {FooterCompany.map((item) => (
                <Link key={item.name} href={item.path} className={`hover:text-[#f2d2b0] transition ${pathname === item.path ? "text-[#f2d2b0]" : ""}`}>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h2 className="text-xs tracking-[0.3em] text-[#d9a66f] uppercase mb-4 font-semibold">Support</h2>
            <div className="flex flex-col gap-3 text-sm">
              {FooterSupport.map((item) => (
                <Link key={item.name} href={item.path} className={`hover:text-[#f2d2b0] transition ${pathname === item.path ? "text-[#f2d2b0]" : ""}`}>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h2 className="text-xs tracking-[0.3em] text-[#d9a66f] uppercase mb-4 font-semibold">Follow Us</h2>
            <div className="flex flex-col gap-3 text-sm">
              {FooterFollowUs.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  rel="noopener noreferrer"
                  target={item.target}
                  className={`hover:text-[#f2d2b0] transition ${pathname === item.path ? "text-[#f2d2b0]" : ""}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.instagram.com/hitesh_sain_x13"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#5a3923] hover:bg-[#2a1a10] transition"
              >
                <IoLogoInstagram size={18} />
              </a>
              <a
                href="https://wa.me/918000907041"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#5a3923] hover:bg-[#2a1a10] transition"
              >
                <FaWhatsapp size={18} />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#5a3923] hover:bg-[#2a1a10] transition"
              >
                <FaYoutube size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────── */}
        <div className="border-t border-[#2a1a10] mt-10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2026 Nestro. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {FooterLegal.map((item) => (
              <Link key={item.name} href={item.path} className="hover:text-[#f2d2b0] transition">
                {item.name}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
