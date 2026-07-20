"use client";

import { client, generateSlug } from "@/utils/helper";
import { useEffect, useMemo, useState, use } from "react";
import { FiSave, FiTag } from "react-icons/fi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchRoomsById } from "@/utils/api";

export default function EditRoomTypePage({ params }) {
    const router = useRouter();
    const { param } = use(params);

    const [loading, setLoading] = useState(true);
    const [wait, setWait] = useState(false);
    const [originalData, setOriginalData] = useState(null);

    const [formData, setFormData] = useState({ name: "", slug: "" });

    useEffect(() => {
        async function getRoom() {
            try {
                setLoading(true);
                const response = await fetchRoomsById(param);

                if (response.success && response.data) {
                    const data = response.data;
                    setFormData({ name: data.name || "", slug: data.slug || "" });
                    setOriginalData({ name: data.name || "", slug: data.slug || "" });
                } else {
                    toast.error("Room not found");
                    router.push("/admin/room-type");
                }
            } catch (error) {
                toast.error("Failed to fetch room");
                router.push("/admin/room-type");
            } finally {
                setLoading(false);
            }
        }

        if (param) getRoom();
    }, [param, router]);

    const handleNameChange = (value) => {
        setFormData((prev) => ({ ...prev, name: value, slug: generateSlug(value) }));
    };

    const isDataChanged = useMemo(() => {
        if (!originalData) return false;
        return formData.name !== originalData.name || formData.slug !== originalData.slug;
    }, [formData, originalData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isDataChanged) return toast.info("No changes detected");

        try {
            setWait(true);
            const response = await client.put(`room-type/update/${param}`, formData);

            if (response.data.success) {
                toast.success(response.data.message);
                router.push("/admin/room-type");
            }
        } catch (error) {
            toast.error(error.friendlyMessage || error.response?.data?.message || "Internal Server Error");
        } finally {
            setWait(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f8fd]">
                <div className="text-[#3b497e] text-lg font-semibold">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f8fd] p-6">
            <div className="mb-6 mx-auto max-w-2xl">
                <h1 className="text-2xl font-semibold text-[#2a3460]">Edit Room Type</h1>
                <p className="text-sm text-[#7a84a6] mt-1">Update room type information</p>
            </div>

            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#eef0f8] shadow-md overflow-hidden">
                <div className="bg-[#3b497e] px-5 py-4 flex items-center gap-2 text-white">
                    <FiTag size={18} />
                    <h2 className="text-[15px] font-semibold">Room Type Information</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#2a3460]">Name *</label>
                        <input
                            type="text"
                            placeholder="e.g. Living Room"
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm text-[#3a3f5c] outline-none focus:border-[#3b497e] focus:ring-2 focus:ring-[#3b497e]/10 transition"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#2a3460]">Slug *</label>
                        <input
                            type="text"
                            value={formData.slug}
                            readOnly
                            className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm text-[#3a3f5c] bg-gray-50 outline-none"
                        />
                        <span className="text-[11px] text-[#7a84a6]">URL friendly identifier</span>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => router.push("/admin/room-type")}
                            className="px-5 py-2.5 rounded-xl border-[1.5px] border-[#c3c9e3] text-sm font-medium text-[#3a3f5c] hover:bg-[#f4f5fb]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={wait || !isDataChanged}
                            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md text-white transition ${wait || !isDataChanged
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#3b497e] hover:bg-[#2a3460]"
                                }`}
                        >
                            <FiSave size={16} />
                            {wait ? "Updating..." : "Update Room Type"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
