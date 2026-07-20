"use client";

import { useEffect, useState, useCallback } from "react";
import { client } from "@/utils/helper";
import { toast } from "sonner";
import Swal from "sweetalert2";
import {
    FiMail, FiRefreshCw, FiSearch, FiEye,
    FiTrash2, FiCheckCircle, FiCircle,
    FiChevronLeft, FiChevronRight, FiX,
    FiUser, FiPhone, FiTag, FiMessageSquare, FiCalendar,
} from "react-icons/fi";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(d) {
    return new Date(d).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function truncate(str, n = 80) {
    if (!str) return "—";
    return str.length > n ? str.slice(0, n) + "…" : str;
}

// ── View Modal ────────────────────────────────────────────────────────────────
function ViewModal({ msg, onClose, onToggleRead }) {
    if (!msg) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#eef0f8]">
                    <div>
                        <h2 className="text-base font-bold text-[#2a3460]">Message Details</h2>
                        <p className="text-xs text-[#7a84a6] mt-0.5">{formatDate(msg.createdAt)}</p>
                    </div>
                    <button onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f4f5fb] transition text-[#7a84a6]">
                        <FiX size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    {[
                        { icon: <FiUser size={14} />, label: "Name", value: msg.name },
                        { icon: <FiMail size={14} />, label: "Email", value: msg.email },
                        { icon: <FiPhone size={14} />, label: "Phone", value: msg.phone || "—" },
                        { icon: <FiTag size={14} />, label: "Subject", value: msg.subject || "—" },
                    ].map((row) => (
                        <div key={row.label} className="flex gap-3">
                            <span className="mt-0.5 text-[#3b497e] flex-shrink-0">{row.icon}</span>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9a8a7a]">{row.label}</p>
                                <p className="text-sm text-[#2a3460] font-medium mt-0.5">{row.value}</p>
                            </div>
                        </div>
                    ))}

                    {/* Message */}
                    <div className="flex gap-3">
                        <span className="mt-0.5 text-[#3b497e] flex-shrink-0"><FiMessageSquare size={14} /></span>
                        <div className="flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#9a8a7a]">Message</p>
                            <p className="text-sm text-[#2a3460] mt-1 leading-relaxed whitespace-pre-wrap bg-[#f7f8fd] rounded-xl p-3 border border-[#eef0f8]">
                                {msg.message}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#eef0f8] bg-[#f7f8fd] rounded-b-3xl">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full
                        ${msg.isRead ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                        {msg.isRead ? <FiCheckCircle size={12} /> : <FiCircle size={12} />}
                        {msg.isRead ? "Read" : "Unread"}
                    </span>
                    <button onClick={() => onToggleRead(msg)}
                        className="text-xs font-semibold text-[#3b497e] border border-[#c3c9e3] px-4 py-2 rounded-xl hover:bg-[#eef0f8] transition">
                        Mark as {msg.isRead ? "Unread" : "Read"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const LIMIT = 15;

export default function AdminContactPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [readFilter, setReadFilter] = useState("all"); // "all" | "true" | "false"
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1, unread: 0 });
    const [selected, setSelected] = useState(null); // message open in modal

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchMessages = useCallback(async (pg = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: pg, limit: LIMIT });
            if (search.trim()) params.set("search", search.trim());
            if (readFilter !== "all") params.set("isRead", readFilter);

            const { data } = await client.get(`contact?${params.toString()}`);
            if (data.success) {
                setMessages(data.messages ?? []);
                setPagination(data.pagination ?? { total: 0, totalPages: 1, unread: 0 });
            }
        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to fetch messages");
        } finally {
            setLoading(false);
        }
    }, [search, readFilter]);

    useEffect(() => { setPage(1); fetchMessages(1); }, [readFilter]);
    useEffect(() => { fetchMessages(page); }, [page]);

    function handleSearch(e) {
        e.preventDefault();
        setPage(1);
        fetchMessages(1);
    }

    // ── Toggle read ───────────────────────────────────────────────────────────
    async function handleToggleRead(msg) {
        try {
            const { data } = await client.patch(`contact/${msg._id}/read`);
            if (data.success) {
                toast.success(data.message);
                // Optimistic update
                setMessages((prev) =>
                    prev.map((m) => m._id === msg._id ? { ...m, isRead: !m.isRead } : m)
                );
                setPagination((prev) => ({
                    ...prev,
                    unread: msg.isRead ? prev.unread + 1 : Math.max(0, prev.unread - 1),
                }));
                if (selected?._id === msg._id) {
                    setSelected((s) => s ? { ...s, isRead: !s.isRead } : s);
                }
            }
        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to update status");
        }
    }

    // ── Delete ────────────────────────────────────────────────────────────────
    async function handleDelete(msg) {
        const result = await Swal.fire({
            title: "Delete Message?",
            text: `From: ${msg.name} — this cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete",
        });
        if (!result.isConfirmed) return;

        try {
            const { data } = await client.delete(`contact/${msg._id}`);
            if (data.success) {
                toast.success("Message deleted");
                setMessages((prev) => prev.filter((m) => m._id !== msg._id));
                setPagination((prev) => ({
                    ...prev,
                    total: prev.total - 1,
                    unread: !msg.isRead ? Math.max(0, prev.unread - 1) : prev.unread,
                }));
                if (selected?._id === msg._id) setSelected(null);
            }
        } catch (err) {
            toast.error(err.friendlyMessage || "Failed to delete message");
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#f7f8fd] p-4 sm:p-6">

            {/* Page header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-[#2a3460]">Contact Messages</h1>
                    <p className="text-sm text-[#7a84a6] mt-0.5 flex items-center gap-2">
                        <span>{pagination.total} total</span>
                        {pagination.unread > 0 && (
                            <span className="bg-orange-100 text-orange-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                                {pagination.unread} unread
                            </span>
                        )}
                    </p>
                </div>
                <button onClick={() => fetchMessages(page)}
                    className="inline-flex items-center gap-2 text-sm text-[#3b497e] border border-[#c3c9e3] px-4 py-2 rounded-xl hover:bg-[#f4f5fb] transition self-start sm:self-auto">
                    <FiRefreshCw size={14} /> Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-[#eef0f8] shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
                <form onSubmit={handleSearch} className="flex gap-2 flex-1">
                    <div className="relative flex-1">
                        <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a8a7a]" />
                        <input type="text" value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email…"
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#c3c9e3] rounded-xl outline-none focus:border-[#3b497e] transition" />
                    </div>
                    <button type="submit"
                        className="px-4 py-2.5 bg-[#3b497e] text-white text-sm rounded-xl hover:bg-[#2a3460] transition">
                        Search
                    </button>
                </form>

                <select value={readFilter} onChange={(e) => setReadFilter(e.target.value)}
                    className="text-sm border border-[#c3c9e3] rounded-xl px-3 py-2.5 outline-none focus:border-[#3b497e] text-[#3a3f5c] bg-white">
                    <option value="all">All Messages</option>
                    <option value="false">Unread</option>
                    <option value="true">Read</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-[#eef0f8] shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#3b497e] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-[#9a8a7a]">
                        <FiMail size={40} className="mb-3 text-[#c3c9e3]" />
                        <p className="text-sm font-medium">No messages found</p>
                        <p className="text-xs text-[#c3c9e3] mt-1">When visitors submit the contact form, messages will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[#f7f8fd] border-b border-[#eef0f8] text-[#7a84a6] text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="text-left px-5 py-3">Status</th>
                                    <th className="text-left px-5 py-3">Name</th>
                                    <th className="text-left px-5 py-3">Email</th>
                                    <th className="text-left px-5 py-3 hidden md:table-cell">Phone</th>
                                    <th className="text-left px-5 py-3 hidden lg:table-cell">Subject</th>
                                    <th className="text-left px-5 py-3 hidden xl:table-cell">Message</th>
                                    <th className="text-left px-5 py-3 hidden sm:table-cell">Date</th>
                                    <th className="text-right px-5 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f0f0f8]">
                                {messages.map((msg) => (
                                    <tr key={msg._id}
                                        className={`hover:bg-[#fafbff] transition ${!msg.isRead ? "bg-[#fffbf7]" : ""}`}>

                                        {/* Read badge */}
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full
                                                ${msg.isRead ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                                                {msg.isRead ? <FiCheckCircle size={10} /> : <FiCircle size={10} />}
                                                {msg.isRead ? "Read" : "Unread"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 font-semibold text-[#2a3460] whitespace-nowrap">
                                            {msg.name}
                                        </td>
                                        <td className="px-5 py-4 text-[#7a84a6] whitespace-nowrap">
                                            {msg.email}
                                        </td>
                                        <td className="px-5 py-4 text-[#7a84a6] hidden md:table-cell whitespace-nowrap">
                                            {msg.phone || "—"}
                                        </td>
                                        <td className="px-5 py-4 text-[#7a84a6] hidden lg:table-cell">
                                            <span className="bg-[#f7f8fd] border border-[#eef0f8] text-xs px-2.5 py-1 rounded-lg">
                                                {msg.subject || "—"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-[#7a84a6] hidden xl:table-cell max-w-[240px]">
                                            <span className="line-clamp-1">{truncate(msg.message)}</span>
                                        </td>
                                        <td className="px-5 py-4 text-[#7a84a6] text-xs hidden sm:table-cell whitespace-nowrap">
                                            {formatDate(msg.createdAt)}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* View */}
                                                <button onClick={() => setSelected(msg)}
                                                    title="View message"
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#c3c9e3] text-[#3b497e] hover:bg-[#3b497e] hover:text-white hover:border-[#3b497e] transition">
                                                    <FiEye size={13} />
                                                </button>
                                                {/* Toggle read */}
                                                <button onClick={() => handleToggleRead(msg)}
                                                    title={msg.isRead ? "Mark unread" : "Mark read"}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#c3c9e3] text-[#3b497e] hover:bg-[#3b497e] hover:text-white hover:border-[#3b497e] transition">
                                                    {msg.isRead ? <FiCircle size={13} /> : <FiCheckCircle size={13} />}
                                                </button>
                                                {/* Delete */}
                                                <button onClick={() => handleDelete(msg)}
                                                    title="Delete message"
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition">
                                                    <FiTrash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-4 border-t border-[#eef0f8] text-sm text-[#7a84a6]">
                        <span>Page {page} of {pagination.totalPages} · {pagination.total} messages</span>
                        <div className="flex gap-2">
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#c3c9e3] disabled:opacity-40 hover:bg-[#f4f5fb] transition">
                                <FiChevronLeft size={14} /> Prev
                            </button>
                            <button onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#c3c9e3] disabled:opacity-40 hover:bg-[#f4f5fb] transition">
                                Next <FiChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* View Modal */}
            <ViewModal msg={selected} onClose={() => setSelected(null)} onToggleRead={handleToggleRead} />
        </div>
    );
}
