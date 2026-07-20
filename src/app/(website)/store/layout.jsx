// ─── Store Layout — Server Component ─────────────────────────────────────────
// No "use client" here. This is a Server Component.
//
// Why the split exists:
//   • Filter is async (fetches rooms + categories server-side) — must be a
//     Server Component.
//   • The mobile drawer toggle needs useState — must be a Client Component.
//
// Solution: render <Filter /> here (server-side), then pass the already-
// rendered JSX tree as a prop ("filterSlot") into <StoreShell>, which is
// the Client Component that owns the drawer state.
// React allows passing Server Component output as props to Client Components.

import { Suspense } from "react";
import Hero from "@/components/website/Hero";
import Filter from "@/components/website/Filter";
import StoreShell from "@/components/website/StoreShell";

export default function Layout({ children }) {
    // Build the filter tree on the server. This JSX is serialisable and can
    // be passed as a prop into the Client Component without breaking the
    // "no async client component" rule.
    const filterSlot = (
        <Suspense fallback={<div className="animate-pulse h-64 rounded-xl bg-gray-100" />}>
            <Filter />
        </Suspense>
    );

    return (
        <>
            <Hero />
            <StoreShell filterSlot={filterSlot}>
                {children}
            </StoreShell>
        </>
    );
}
