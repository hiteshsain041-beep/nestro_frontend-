"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { client } from "@/utils/helper";
import {
  FiPhone, FiMail, FiMapPin, FiClock,
  FiChevronRight, FiSend, FiMessageCircle,
  FiInstagram, FiYoutube, FiLinkedin, FiTwitter, FiFacebook,
  FiPlus, FiMinus,
} from "react-icons/fi";

// ── Data ──────────────────────────────────────────────────────────────────────

const CONTACT_CARDS = [
  {
    id: "phone",
    icon: <FiPhone size={22} />,
    title: "Phone",
    lines: ["+91 80009 07041", "+91 11 2345 6789"],
    note: "Mon–Sat, 9 AM – 7 PM IST",
    href: "tel:+918000907041",
  },
  {
    id: "email",
    icon: <FiMail size={22} />,
    title: "Email",
    lines: ["hello@nestro.com", "support@nestro.com"],
    note: "We reply within 24 hours",
    href: "mailto:hello@nestro.com",
  },
  {
    id: "address",
    icon: <FiMapPin size={22} />,
    title: "Store Address",
    lines: ["12, Furniture District", "Saket, New Delhi – 110 017"],
    note: "Visit our showroom",
    href: "https://maps.google.com",
  },
  {
    id: "hours",
    icon: <FiClock size={22} />,
    title: "Business Hours",
    lines: ["Mon – Sat: 9:00 AM – 8:00 PM", "Sun: 11:00 AM – 6:00 PM"],
    note: "All public holidays open",
    href: null,
  },
];

const SOCIAL_LINKS = [
  { id: "fb", icon: <FiFacebook size={18} />, label: "Facebook", href: "https://facebook.com", color: "hover:bg-blue-600" },
  { id: "ig", icon: <FiInstagram size={18} />, label: "Instagram", href: "https://instagram.com", color: "hover:bg-pink-500" },
  { id: "tw", icon: <FiTwitter size={18} />, label: "Twitter/X", href: "https://twitter.com", color: "hover:bg-sky-500" },
  { id: "li", icon: <FiLinkedin size={18} />, label: "LinkedIn", href: "https://linkedin.com", color: "hover:bg-blue-700" },
  { id: "yt", icon: <FiYoutube size={18} />, label: "YouTube", href: "https://youtube.com", color: "hover:bg-red-600" },
];

const FAQS = [
  { q: "How long does delivery take?", a: "Standard delivery is 5–7 business days across India. White-glove in-home assembly is included at no extra charge for orders above ₹10,000." },
  { q: "What is your return policy?", a: "We offer 30-day hassle-free returns on all products in original condition. Contact our support team and we'll arrange a free pickup." },
  { q: "Which payment methods do you accept?", a: "We accept all major credit/debit cards, UPI (GPay, PhonePe, Paytm), net banking, and 0% EMI options on orders above ₹15,000." },
  { q: "Can I track my order?", a: "Yes. Once your order ships you'll receive an SMS and email with a tracking link. You can also check status in the Orders section of your account." },
  { q: "Do you offer customisation?", a: "Custom dimensions and finish options are available for select collections. Reach out via the contact form with your requirements." },
  { q: "How do I care for my Nestro furniture?", a: "Wipe with a dry or slightly damp cloth. Avoid direct sunlight and harsh chemicals. A detailed care guide is included with every order." },
];

const SUBJECTS = [
  "Order Enquiry",
  "Product Information",
  "Returns & Exchange",
  "Customisation Request",
  "Partnership / B2B",
  "Feedback",
  "Other",
];

const MAX_MSG = 1000;

// ── Input class helper ────────────────────────────────────────────────────────
const inp = (err) =>
  `w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 bg-white
   ${err
    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
    : "border-[#ede9e3] focus:border-[#a46d43] focus:ring-2 focus:ring-[#a46d43]/15"
  } placeholder:text-gray-400 text-[#1a1007]`;

// ── Inline FAQ accordion ──────────────────────────────────────────────────────
function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.q}
          className="rounded-2xl border border-[#ede9e3] bg-white overflow-hidden transition-shadow hover:shadow-sm">
          <button
            className="flex w-full items-center justify-between px-5 py-4 text-left"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="text-sm font-semibold text-[#1a1007] pr-4">{item.q}</span>
            <span className="flex-shrink-0 text-[#a46d43] transition-transform duration-200"
              style={{ transform: open === i ? "rotate(0deg)" : "rotate(0deg)" }}>
              {open === i ? <FiMinus size={16} /> : <FiPlus size={16} />}
            </span>
          </button>
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: open === i ? "200px" : "0px" }}
          >
            <p className="px-5 pb-5 text-sm text-[#6b5c4e] leading-relaxed">{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [newsletter, setNewsletter] = useState("");
  const [nlLoading, setNlLoading] = useState(false);
  const [nlDone, setNlDone] = useState(false);

  // ── Form helpers ─────────────────────────────────────────────────────────────
  const set = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }, [errors]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject) e.subject = "Please select a subject";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.length < 10) e.message = "Message must be at least 10 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      // Use the shared axios client — baseURL + withCredentials already configured
      const { data } = await client.post("contact", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        subject: form.subject,
        message: form.message.trim(),
      });

      if (data.success) {
        toast.success(data.message || "Message sent! We'll get back to you within 24 hours.");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        setErrors({});
      } else {
        toast.error(data.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      toast.error(
        err.friendlyMessage ||
        err.response?.data?.message ||
        "Unable to reach the server. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletter.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletter)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setNlLoading(true);
    setTimeout(() => {
      setNlLoading(false);
      setNlDone(true);
      toast.success("You're subscribed! Welcome to the Nestro family.");
    }, 900);
  };

  return (
    <div className="bg-[#faf8f5]">

      {/* ══ 1. HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#2b180f] py-20 sm:py-28">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #a46d43 0%, transparent 60%)" }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#9a8a7a] mb-6"
            aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#d9b48b] transition-colors">Home</Link>
            <FiChevronRight size={12} />
            <span className="text-[#d9b48b]">Contact</span>
          </nav>

          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#a46d43] mb-3">
            Get in Touch
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-tight">
            We&apos;re Here to <span className="text-[#d9b48b] italic">Help</span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-[#9a8a7a] text-base sm:text-lg leading-relaxed">
            Questions, feedback, or just want to say hello? Reach out anytime — our team responds within 24 hours.
          </p>
        </div>
      </section>

      {/* ══ 2. CONTACT CARDS ═════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTACT_CARDS.map((card) => {
            const inner = (
              <div className="group bg-white rounded-2xl border border-[#ede9e3] shadow-sm p-6
                              flex flex-col items-start gap-3 h-full
                              transition-all duration-200
                              hover:shadow-[0_8px_30px_rgba(164,109,67,0.12)]
                              hover:-translate-y-0.5 hover:border-[#c9a882]">
                <div className="w-11 h-11 rounded-xl bg-[#faf0e8] flex items-center justify-center
                                text-[#a46d43] group-hover:bg-[#a46d43] group-hover:text-white
                                transition-colors duration-200">
                  {card.icon}
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#9a8a7a] mb-1">
                    {card.title}
                  </p>
                  {card.lines.map((l) => (
                    <p key={l} className="text-sm font-semibold text-[#1a1007] leading-snug">{l}</p>
                  ))}
                  <p className="text-[11px] text-[#a46d43] mt-1.5 font-medium">{card.note}</p>
                </div>
              </div>
            );
            return card.href
              ? <a key={card.id} href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer" className="block">{inner}</a>
              : <div key={card.id}>{inner}</div>;
          })}
        </div>
      </section>

      {/* ══ 3. FORM + MAP ════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* ── Contact Form ─────────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl border border-[#ede9e3] shadow-sm p-7 sm:p-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#a46d43] mb-1">
              Send a Message
            </p>
            <h2 className="text-2xl font-light text-[#1a1007] mb-7">
              Tell us how we can <span className="text-[#a46d43]">help you</span>
            </h2>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Name + Email */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#3a2418] mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Rahul Sharma"
                    className={inp(errors.name)} />
                  {errors.name && <p className="mt-1 text-[11px] text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3a2418] mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input type="email" value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="rahul@email.com"
                    className={inp(errors.email)} />
                  {errors.email && <p className="mt-1 text-[11px] text-red-500">{errors.email}</p>}
                </div>
              </div>

              {/* Phone + Subject */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#3a2418] mb-1.5">
                    Phone Number
                  </label>
                  <input type="tel" value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className={inp(false)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#3a2418] mb-1.5">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select value={form.subject}
                    onChange={(e) => set("subject", e.target.value)}
                    className={`${inp(errors.subject)} cursor-pointer`}>
                    <option value="">Select a subject…</option>
                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.subject && <p className="mt-1 text-[11px] text-red-500">{errors.subject}</p>}
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#3a2418]">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <span className={`text-[11px] tabular-nums ${form.message.length > MAX_MSG * 0.9 ? "text-red-500" : "text-[#9a8a7a]"}`}>
                    {form.message.length}/{MAX_MSG}
                  </span>
                </div>
                <textarea rows={5} value={form.message} maxLength={MAX_MSG}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="Write your message here…"
                  className={`${inp(errors.message)} resize-none`} />
                {errors.message && <p className="mt-1 text-[11px] text-red-500">{errors.message}</p>}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-xl
                           bg-[#2b180f] hover:bg-[#3d2517] active:scale-[0.98]
                           disabled:opacity-60 disabled:cursor-not-allowed
                           text-white text-sm font-semibold
                           transition-all duration-200 shadow-md">
                {loading
                  ? <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />Sending…</>
                  : <><FiSend size={15} />Send Message</>}
              </button>
            </form>
          </div>

          {/* ── Map + Live Support ────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Google Map — lazy loaded via iframe */}
            <div className="rounded-3xl overflow-hidden border border-[#ede9e3] shadow-sm"
              style={{ height: "340px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.7!2d77.2167!3d28.5244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDMxJzI3LjgiTiA3N8KwMTMnMDAuMSJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Nestro Store Location"
              />
            </div>

            {/* Live Support Card */}
            <div className="bg-[#2b180f] rounded-3xl p-7 text-white">
              <div className="w-12 h-12 rounded-xl bg-[#a46d43]/25 flex items-center justify-center mb-4">
                <FiMessageCircle size={22} className="text-[#d9b48b]" />
              </div>
              <h3 className="text-lg font-semibold mb-1.5">Need Immediate Help?</h3>
              <p className="text-[#9a8a7a] text-sm leading-relaxed mb-5">
                Our support team is available Monday – Saturday, 9 AM to 7 PM IST. Reach us instantly via chat or phone.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://wa.me/918000907041" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#a46d43] hover:bg-[#b87d53]
                             text-white text-sm font-semibold transition-all duration-200 active:scale-95">
                  <FiMessageCircle size={15} /> Chat With Us
                </a>
                <a href="tel:+918000907041"
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-xl border border-[#5a3928]
                             text-[#d9cbbf] text-sm font-medium hover:bg-[#3a2418] hover:border-[#3a2418]
                             transition-all duration-200 active:scale-95">
                  <FiPhone size={15} /> Call Now
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-3xl border border-[#ede9e3] shadow-sm p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#a46d43] mb-1">
                Follow Us
              </p>
              <h3 className="text-base font-semibold text-[#1a1007] mb-4">
                Stay connected on social media
              </h3>
              <div className="flex gap-3 flex-wrap">
                {SOCIAL_LINKS.map((s) => (
                  <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`w-10 h-10 rounded-xl border border-[#ede9e3] flex items-center justify-center
                                text-[#5a4a3a] bg-[#faf8f5]
                                ${s.color} hover:text-white hover:border-transparent
                                transition-all duration-200 hover:scale-110 active:scale-95`}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ 4. FAQ ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#a46d43] mb-2">
              Got Questions?
            </p>
            <h2 className="text-2xl sm:text-3xl font-light text-[#1a1007]">
              Frequently <span className="text-[#a46d43]">Asked</span>
            </h2>
            <p className="text-[#9a8a7a] text-sm mt-3 max-w-md mx-auto">
              Can't find what you're looking for? Send us a message using the form above.
            </p>
          </div>
          <Accordion items={FAQS} />
        </div>
      </section>

      {/* ══ 5. NEWSLETTER ════════════════════════════════════════════════════ */}
      <section className="bg-[#2b180f] py-14 sm:py-20">
        <div className="mx-auto max-w-xl px-4 sm:px-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#a46d43] mb-2">
            Stay Updated
          </p>
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-3">
            Get Exclusive <span className="text-[#d9b48b] italic">Offers</span>
          </h2>
          <p className="text-[#9a8a7a] text-sm mb-7 leading-relaxed">
            Subscribe for early access to new collections, members-only discounts, and interior design inspiration.
          </p>

          {nlDone ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#a46d43]/20 border border-[#a46d43]/40">
              <span className="text-[#d9b48b] text-sm font-semibold">
                🎉 You&apos;re subscribed — welcome to the Nestro family!
              </span>
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={newsletter}
                onChange={(e) => setNewsletter(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 rounded-xl border border-[#5a3928] bg-[#3a2418] px-4 py-3 text-sm
                           text-white placeholder:text-[#9a8a7a] outline-none
                           focus:border-[#d9b48b] focus:ring-2 focus:ring-[#d9b48b]/20 transition"
              />
              <button type="submit" disabled={nlLoading}
                className="flex-shrink-0 rounded-xl bg-[#a46d43] hover:bg-[#b87d53]
                           disabled:opacity-60 text-white px-6 py-3 text-sm font-semibold transition active:scale-95">
                {nlLoading ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}

// ── Metadata (exported separately for SEO) ────────────────────────────────────
// NOTE: Because this is a "use client" component, metadata must be defined
// in a parent server component or a separate layout. Add to layout.jsx if needed.
