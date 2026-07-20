"use client";

import { client, generateSlug } from "@/utils/helper";
import { useEffect, useMemo, useRef, useState, use } from "react";
import { FiSave, FiTag, FiImage, FiPlus, FiX, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchProductById } from "@/utils/api";
import Image from "next/image";

const MAX_GALLERY = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function EditProductPage({ params }) {
    const router = useRouter();
    const { param } = use(params);
    const galleryInputRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [wait, setWait] = useState(false);
    const [deletingId, setDeletingId] = useState(null); // imageId being deleted

    const [originalData, setOriginalData] = useState(null);
    const [preview, setPreview] = useState("");

    // Existing gallery from DB
    const [existingGallery, setExistingGallery] = useState([]);
    // New files selected for upload
    const [newGalleryFiles, setNewGalleryFiles] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        image: null,
        oldImage: "",
    });

    // ── Fetch product ───────────────────────────────────────────────────────────
    useEffect(() => {
        if (!param) return;
        async function load() {
            try {
                setLoading(true);
                const res = await fetchProductById(param);
                if (res.success) {
                    const d = res.product;
                    setFormData({ name: d.name || "", slug: d.slug || "", image: null, oldImage: d.thumbnail || "" });
                    setOriginalData({ name: d.name || "", slug: d.slug || "", image: d.thumbnail || "" });
                    setPreview(d.thumbnail || "");
                    setExistingGallery(d.gallery || []);
                } else {
                    toast.error("Product not found");
                    router.push("/admin/product");
                }
            } catch {
                toast.error("Failed to fetch product");
                router.push("/admin/product");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [param, router]);

    // ── Change detection ────────────────────────────────────────────────────────
    const isDataChanged = useMemo(() => {
        if (!originalData) return false;
        return (
            formData.name !== originalData.name ||
            formData.slug !== originalData.slug ||
            formData.image !== null ||
            newGalleryFiles.length > 0
        );
    }, [formData, originalData, newGalleryFiles]);

    // ── Thumbnail ───────────────────────────────────────────────────────────────
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!ALLOWED_TYPES.includes(file.type)) { toast.error("Only JPG, PNG, WEBP allowed."); return; }
        if (file.size > MAX_FILE_SIZE) { toast.error("Image must be < 5 MB."); return; }
        setFormData((p) => ({ ...p, image: file }));
        setPreview(URL.createObjectURL(file));
    };

    // ── New gallery picker ───────────────────────────────────────────────────────
    const handleGalleryPick = (e) => {
        const picked = Array.from(e.target.files);
        e.target.value = "";

        const totalUsed = existingGallery.length + newGalleryFiles.length;
        const remaining = MAX_GALLERY - totalUsed;
        if (remaining <= 0) { toast.error(`Maximum ${MAX_GALLERY} gallery images allowed.`); return; }

        const valid = picked.filter((f) => {
            if (!ALLOWED_TYPES.includes(f.type)) { toast.error(`${f.name}: invalid type.`); return false; }
            if (f.size > MAX_FILE_SIZE) { toast.error(`${f.name}: must be < 5 MB.`); return false; }
            return true;
        }).slice(0, remaining);

        setNewGalleryFiles((p) => [
            ...p,
            ...valid.map((file) => ({ file, preview: URL.createObjectURL(file) })),
        ]);
        if (valid.length < picked.length) toast.warning(`Only ${remaining} more image(s) allowed.`);
    };

    const removeNewFile = (idx) => {
        setNewGalleryFiles((p) => {
            URL.revokeObjectURL(p[idx].preview);
            return p.filter((_, i) => i !== idx);
        });
    };

    // ── Delete existing gallery image (Cloudinary + MongoDB) ────────────────────
    const deleteExistingImage = async (imageId) => {
        if (!window.confirm("Remove this image from Cloudinary and MongoDB?")) return;
        try {
            setDeletingId(imageId);
            const res = await client.delete(`product/gallery/${param}/${imageId}`);
            if (res.data.success) {
                setExistingGallery(res.data.gallery);
                toast.success("Image removed");
            }
        } catch (err) {
            toast.error(err.friendlyMessage || err.response?.data?.message || "Failed to remove image");
        } finally {
            setDeletingId(null);
        }
    };

    // ── Submit ───────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isDataChanged) { toast.info("No changes detected"); return; }
        try {
            setWait(true);
            const fd = new FormData();
            fd.append("name", formData.name);
            fd.append("slug", formData.slug);
            if (formData.image) fd.append("image", formData.image);
            newGalleryFiles.forEach(({ file }) => fd.append("gallery", file));

            const res = await client.put(`product/update/${param}`, fd);
            if (res.data.success) {
                toast.success(res.data.message);
                router.push("/admin/product");
            }
        } catch (err) {
            toast.error(err.friendlyMessage || err.response?.data?.message || "Internal Server Error");
        } finally {
            setWait(false);
        }
    };

    // ── Loading state ────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f8fd]">
                <div className="text-[#3b497e] font-semibold animate-pulse">Loading product…</div>
            </div>
        );
    }

    const inp = "border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm text-[#3a3f5c] outline-none focus:border-[#3b497e] focus:ring-2 focus:ring-[#3b497e]/10 transition";
    const totalGallery = existingGallery.length + newGalleryFiles.length;

    return (
        <div className="min-h-screen bg-[#f7f8fd] p-4 sm:p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-[#eef0f8] shadow-md overflow-hidden">

                {/* Header */}
                <div className="bg-[#3b497e] px-5 py-4 flex items-center gap-2 text-white">
                    <FiTag size={18} />
                    <h2 className="text-[15px] font-semibold">Edit Product</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-6">

                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#2a3460]">Product Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value, slug: generateSlug(e.target.value) }))}
                            className={inp}
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#2a3460]">Slug</label>
                        <input type="text" value={formData.slug} readOnly className={`${inp} bg-gray-50`} />
                        <span className="text-[11px] text-[#7a84a6]">Auto-generated from name</span>
                    </div>

                    {/* ── Thumbnail ───────────────────────────────────────────────────── */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-[#2a3460]">Main Thumbnail</label>
                        <input type="file" accept="image/*" onChange={handleImage} className={`${inp} cursor-pointer`} />
                        {preview && (
                            <div className="relative w-28 h-28 mt-2">
                                <img src={preview} alt="thumbnail" className="w-28 h-28 object-cover rounded-xl border" />
                                <button
                                    type="button"
                                    onClick={() => { setFormData((p) => ({ ...p, image: null })); setPreview(formData.oldImage); }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition"
                                >
                                    <FiX size={11} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Product Gallery ──────────────────────────────────────────────── */}
                    <div className="border border-[#eef0f8] rounded-2xl p-5 space-y-4 bg-[#fafbff]">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <FiImage size={18} className="text-[#3b497e]" />
                                <h3 className="text-sm font-bold text-[#2a3460]">
                                    Product Gallery
                                    <span className="ml-2 text-xs font-normal text-[#7a84a6]">
                                        ({totalGallery}/{MAX_GALLERY})
                                    </span>
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => galleryInputRef.current?.click()}
                                disabled={totalGallery >= MAX_GALLERY}
                                className="inline-flex items-center gap-1.5 rounded-xl border-[1.5px] border-[#3b497e] text-[#3b497e] px-4 py-2 text-xs font-semibold hover:bg-[#3b497e] hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <FiPlus size={13} /> Add Images
                            </button>
                            <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryPick} />
                        </div>

                        {totalGallery === 0 ? (
                            <div
                                onClick={() => galleryInputRef.current?.click()}
                                className="flex flex-col items-center justify-center border-2 border-dashed border-[#c3c9e3] rounded-xl py-10 cursor-pointer hover:border-[#3b497e] hover:bg-[#f4f5fb] transition"
                            >
                                <FiImage size={32} className="text-[#c3c9e3] mb-2" />
                                <p className="text-sm text-[#9a8a7a]">No gallery images yet</p>
                                <p className="text-xs text-[#c3c9e3] mt-1">Click to add up to {MAX_GALLERY} images</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">

                                {/* Existing gallery images (from DB) */}
                                {existingGallery.map((img) => (
                                    <div key={img._id} className="group relative aspect-square rounded-xl overflow-hidden border border-[#eef0f8] bg-gray-50">
                                        <Image
                                            src={img.url}
                                            alt="gallery"
                                            fill
                                            sizes="150px"
                                            className="object-cover transition duration-300 group-hover:brightness-75"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                            <button
                                                type="button"
                                                onClick={() => deleteExistingImage(img._id)}
                                                disabled={deletingId === img._id}
                                                className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition"
                                                aria-label="Delete from Cloudinary"
                                            >
                                                {deletingId === img._id ? (
                                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                    </svg>
                                                ) : (
                                                    <FiTrash2 size={13} />
                                                )}
                                            </button>
                                        </div>
                                        {/* Saved badge */}
                                        <span className="absolute top-1.5 left-1.5 bg-green-500/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                            SAVED
                                        </span>
                                    </div>
                                ))}

                                {/* New files not yet uploaded */}
                                {newGalleryFiles.map(({ preview: p }, idx) => (
                                    <div key={`new-${idx}`} className="group relative aspect-square rounded-xl overflow-hidden border border-[#eef0f8] border-dashed bg-gray-50">
                                        <img src={p} alt={`new-${idx}`} className="w-full h-full object-cover transition group-hover:brightness-75" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                            <button
                                                type="button"
                                                onClick={() => removeNewFile(idx)}
                                                className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                                                aria-label="Remove"
                                            >
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                        <span className="absolute top-1.5 left-1.5 bg-amber-500/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                            NEW
                                        </span>
                                    </div>
                                ))}

                                {/* Add-more tile */}
                                {totalGallery < MAX_GALLERY && (
                                    <button
                                        type="button"
                                        onClick={() => galleryInputRef.current?.click()}
                                        className="aspect-square rounded-xl border-2 border-dashed border-[#c3c9e3] flex flex-col items-center justify-center text-[#9a8a7a] hover:border-[#3b497e] hover:text-[#3b497e] hover:bg-[#f4f5fb] transition"
                                    >
                                        <FiPlus size={20} className="mb-1" />
                                        <span className="text-[10px] font-medium">Add More</span>
                                    </button>
                                )}
                            </div>
                        )}

                        {newGalleryFiles.length > 0 && (
                            <p className="text-[11px] text-amber-600 font-medium">
                                {newGalleryFiles.length} new image(s) will be uploaded when you save.
                            </p>
                        )}
                    </div>

                    {/* Footer buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => router.push("/admin/product")}
                            className="px-5 py-2.5 rounded-xl border-[1.5px] border-[#c3c9e3] text-sm font-medium text-[#3a3f5c] hover:bg-[#f4f5fb] transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={wait || !isDataChanged}
                            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md text-white transition ${wait || !isDataChanged ? "bg-gray-400 cursor-not-allowed" : "bg-[#3b497e] hover:bg-[#2a3460]"
                                }`}
                        >
                            <FiSave size={16} />
                            {wait ? "Saving…" : "Update Product"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
