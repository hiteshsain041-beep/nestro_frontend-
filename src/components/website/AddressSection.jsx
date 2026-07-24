"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck, FiMapPin } from "react-icons/fi";

// ─── Empty form state ───────────────────────────────────────────────────────
const EMPTY_FORM = {
    fullName: "",
    mobile: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    address: "",
};

// ─── Simple required-field + format validator ───────────────────────────────
function validate(form) {
    const errors = {};
    if (!form.fullName.trim()) errors.fullName = "Full name is required";
    if (!form.mobile.trim()) errors.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(form.mobile)) errors.mobile = "Enter a valid 10-digit mobile number";
    if (!form.state.trim()) errors.state = "State is required";
    if (!form.district.trim()) errors.district = "District is required";
    if (!form.city.trim()) errors.city = "City is required";
    if (!form.pincode.trim()) errors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(form.pincode)) errors.pincode = "Enter a valid 6-digit pincode";
    if (!form.address.trim()) errors.address = "Address is required";
    return errors;
}

// ─── AddressForm — used for both Add and Edit ───────────────────────────────
function AddressForm({ initial = EMPTY_FORM, onSave, onCancel, saving }) {
    const [form, setForm] = useState(initial);
    const [errors, setErrors] = useState({});

    // Keep form in sync when switching between edit targets
    useEffect(() => { setForm(initial); setErrors({}); }, [initial]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        // Clear field error on change
        if (errors[e.target.name]) {
            setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate(form);
        if (Object.keys(errs).length) { setErrors(errs); return; }
        onSave(form);
    };

    const fields = [
        { name: "fullName", label: "Full Name", type: "text", placeholder: "e.g. Rahul Sharma", col: 2 },
        { name: "mobile", label: "Mobile Number", type: "tel", placeholder: "10-digit mobile", col: 1 },
        { name: "state", label: "State", type: "text", placeholder: "e.g. Maharashtra", col: 1 },
        { name: "district", label: "District", type: "text", placeholder: "e.g. Pune", col: 1 },
        { name: "city", label: "City", type: "text", placeholder: "e.g. Kothrud", col: 1 },
        { name: "pincode", label: "Pincode", type: "text", placeholder: "6-digit pincode", col: 2 },
    ];

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map((f) => (
                    <div
                        key={f.name}
                        className={f.col === 2 ? "sm:col-span-2" : ""}
                    >
                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                            {f.label} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type={f.type}
                            name={f.name}
                            value={form[f.name]}
                            onChange={handleChange}
                            placeholder={f.placeholder}
                            className={`
                                w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition
                                focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900
                                ${errors[f.name] ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}
                            `}
                        />
                        {errors[f.name] && (
                            <p className="mt-1 text-xs text-red-500">{errors[f.name]}</p>
                        )}
                    </div>
                ))}

                {/* Full Address textarea — spans both columns */}
                <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Full Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        rows={3}
                        placeholder="House/Flat No., Street, Landmark..."
                        className={`
                            w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition resize-none
                            focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900
                            ${errors.address ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"}
                        `}
                    />
                    {errors.address && (
                        <p className="mt-1 text-xs text-red-500">{errors.address}</p>
                    )}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-1">
                <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:bg-gray-400 transition"
                >
                    <FiCheck size={14} />
                    {saving ? "Saving…" : "Save Address"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                    <FiX size={14} />
                    Cancel
                </button>
            </div>
        </form>
    );
}

// ─── AddressCard — displays a single saved address ──────────────────────────
function AddressCard({ address, selected, onSelect, onEdit, onDelete }) {
    return (
        <div
            onClick={onSelect}
            className={`
                relative cursor-pointer rounded-2xl border p-4 transition-all duration-200
                ${selected
                    ? "border-gray-900 bg-gray-900 text-white shadow-lg"
                    : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm"
                }
            `}
        >
            {/* Radio indicator */}
            <div className={`
                absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border-2 transition
                ${selected ? "border-white bg-white" : "border-gray-300"}
            `}>
                {selected && (
                    <div className="h-2.5 w-2.5 rounded-full bg-gray-900" />
                )}
            </div>

            {/* Content */}
            <div className="pr-8">
                <p className="font-bold text-sm">{address.fullName}</p>
                <p className={`text-xs mt-0.5 ${selected ? "text-gray-300" : "text-gray-500"}`}>
                    📞 {address.mobile}
                </p>
                <p className={`text-xs mt-2 leading-relaxed ${selected ? "text-gray-200" : "text-gray-600"}`}>
                    {address.address}
                </p>
                <p className={`text-xs mt-1 ${selected ? "text-gray-300" : "text-gray-500"}`}>
                    {address.city}, {address.district}, {address.state} — {address.pincode}
                </p>
            </div>

            {/* Action buttons — stop propagation so clicking them doesn't select */}
            <div className="mt-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onEdit}
                    className={`
                        flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition
                        ${selected
                            ? "bg-white/20 text-white hover:bg-white/30"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }
                    `}
                >
                    <FiEdit2 size={11} /> Edit
                </button>
                <button
                    onClick={onDelete}
                    className={`
                        flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition
                        ${selected
                            ? "bg-red-500/80 text-white hover:bg-red-500"
                            : "bg-red-50 text-red-500 hover:bg-red-100"
                        }
                    `}
                >
                    <FiTrash2 size={11} /> Delete
                </button>
            </div>
        </div>
    );
}

// ─── AddressSection — main export used by Checkout ──────────────────────────
export default function AddressSection({ onAddressSelect }) {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    // true only when backend explicitly returns 401 — NOT on network/other errors
    const [unauthorized, setUnauthorized] = useState(false);

    // "add" | "edit" | null
    const [mode, setMode] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    // ── Load addresses on mount ──────────────────────────────────────────────
    useEffect(() => {
        async function load() {
            setLoading(true);
            setUnauthorized(false);

            try {
                // Call the Next.js BFF proxy (/api/address) — NOT Render directly.
                // This keeps the jwt cookie same-domain (Vercel) so mobile browsers
                // send it correctly. The proxy reads the cookie server-side and adds
                // Authorization: Bearer header to the Render request.
                const res = await fetch("/api/address", {
                    method: "GET",
                    credentials: "include",   // send Vercel-domain jwt cookie
                });
                const data = await res.json();

                if (res.status === 401) {
                    setUnauthorized(true);
                    return;
                }

                if (data.success) {
                    const list = data.data ?? [];
                    setAddresses(list);
                    if (list.length) {
                        setSelectedId(list[0]._id);
                        onAddressSelect?.(list[0]);
                    }
                }
            } catch {
                // Network error — leave form accessible, don't show unauthorized
            } finally {
                setLoading(false);
            }
        }
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Select ───────────────────────────────────────────────────────────────
    const handleSelect = (address) => {
        setSelectedId(address._id);
        onAddressSelect?.(address);
    };

    // ── Add ──────────────────────────────────────────────────────────────────
    const handleAdd = async (form) => {
        setSaving(true);
        try {
            const res = await fetch("/api/address", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });
            const data = await res.json();
            setSaving(false);

            if (res.status === 401) {
                setUnauthorized(true);
                toast.error("Please sign in to save addresses");
                return;
            }
            if (data.success) {
                toast.success(data.message || "Address added successfully");
                const updated = [data.address, ...addresses];
                setAddresses(updated);
                setSelectedId(data.address._id);
                onAddressSelect?.(data.address);
                setMode(null);
            } else {
                toast.error(data.message || "Failed to save address");
            }
        } catch {
            setSaving(false);
            toast.error("Network error. Please try again.");
        }
    };

    // ── Edit ─────────────────────────────────────────────────────────────────
    const handleEdit = async (form) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/address/${editTarget._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });
            const data = await res.json();
            setSaving(false);

            if (res.status === 401) {
                setUnauthorized(true);
                toast.error("Session expired. Please sign in again.");
                return;
            }
            if (data.success) {
                toast.success(data.message || "Address updated");
                const updated = addresses.map((a) =>
                    a._id === editTarget._id ? data.address : a
                );
                setAddresses(updated);
                if (selectedId === editTarget._id) onAddressSelect?.(data.address);
                setMode(null);
                setEditTarget(null);
            } else {
                toast.error(data.message || "Failed to update address");
            }
        } catch {
            setSaving(false);
            toast.error("Network error. Please try again.");
        }
    };

    // ── Delete ───────────────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this address?")) return;
        try {
            const res = await fetch(`/api/address/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            const data = await res.json();

            if (res.status === 401) {
                setUnauthorized(true);
                return;
            }
            if (data.success) {
                toast.success(data.message || "Address deleted");
                const updated = addresses.filter((a) => a._id !== id);
                setAddresses(updated);
                if (selectedId === id) {
                    const next = updated[0] ?? null;
                    setSelectedId(next?._id ?? null);
                    onAddressSelect?.(next);
                }
            } else {
                toast.error(data.message || "Failed to delete address");
            }
        } catch {
            toast.error("Network error. Please try again.");
        }
    };

    // ── Cancel form ──────────────────────────────────────────────────────────
    const handleCancel = () => {
        setMode(null);
        setEditTarget(null);
    };

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="space-y-5">

            {/* Section header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FiMapPin size={18} className="text-gray-700" />
                    <h3 className="text-base font-bold text-gray-800">
                        Delivery Address
                    </h3>
                </div>

                {/* Show "Add New" button only when no form is open and not unauthorized */}
                {mode === null && !unauthorized && (
                    <button
                        onClick={() => { setMode("add"); setEditTarget(null); }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-700 transition"
                    >
                        <FiPlus size={13} />
                        Add New Address
                    </button>
                )}
            </div>

            {/* Unauthorized — show login prompt */}
            {unauthorized && (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50 py-8 px-4 text-center">
                    <p className="text-sm font-semibold text-amber-800 mb-1">Please sign in to manage addresses</p>
                    <p className="text-xs text-amber-600 mb-4">
                        Your session has expired or you are not logged in.
                    </p>
                    <a
                        href="/login"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-5 py-2 text-xs font-semibold text-white hover:bg-gray-700 transition"
                    >
                        Sign In
                    </a>
                </div>
            )}

            {/* Add / Edit form */}
            {mode !== null && (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <p className="mb-4 text-sm font-semibold text-gray-700">
                        {mode === "add" ? "➕ New Address" : "✏️ Edit Address"}
                    </p>
                    <AddressForm
                        initial={mode === "edit" ? editTarget : EMPTY_FORM}
                        onSave={mode === "add" ? handleAdd : handleEdit}
                        onCancel={handleCancel}
                        saving={saving}
                    />
                </div>
            )}

            {/* Address list */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2].map((n) => (
                        <div key={n} className="h-32 animate-pulse rounded-2xl bg-gray-100" />
                    ))}
                </div>
            ) : addresses.length === 0 ? (
                // Empty state — only shown when form is also closed
                mode === null && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-10 text-center">
                        <FiMapPin size={32} className="text-gray-300 mb-2" />
                        <p className="text-sm font-medium text-gray-500">No saved addresses</p>
                        <p className="text-xs text-gray-400 mt-1">Click "Add New Address" to get started</p>
                    </div>
                )
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <AddressCard
                            key={addr._id}
                            address={addr}
                            selected={selectedId === addr._id}
                            onSelect={() => handleSelect(addr)}
                            onEdit={() => {
                                setEditTarget(addr);
                                setMode("edit");
                            }}
                            onDelete={() => handleDelete(addr._id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
