"use client";

import { client, generateSlug } from "@/utils/helper";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { Editor } from "primereact/editor";
import { FiSave, FiTag, FiImage, FiPlus, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchCategory, fetchRooms } from "@/utils/api";

const MAX_GALLERY = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function AddProductPage() {
    const [rooms, setRooms] = useState([]);
    const [categories, setCategories] = useState([]);
    const router = useRouter();
    const [wait, setWait] = useState(false);
    const galleryInputRef = useRef(null);

    const [formData, setFormData] = useState({
        roomId: null,      // null = not selected; will be validated before submit
        categoryId: null,
        name: "",
        slug: "",
        originalPrice: "",
        salePrice: "",
        discount: "",
        shortDescription: "",
        description: "",
        material: "",
        color: "",
        width: "",
        height: "",
        depth: "",
        weight: "",
        seoTitle: "",
        seoDescription: "",
        image: null,
    });

    // Gallery: array of { file, preview }
    const [galleryFiles, setGalleryFiles] = useState([]);

    // ── Slug ────────────────────────────────────────────────────────────────────
    const handleNameChange = (value) => {
        setFormData({ ...formData, name: value, slug: generateSlug(value) });
    };

    // ── Thumbnail ────────────────────────────────────────────────────────────────
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error("Only JPG, PNG and WEBP images are allowed.");
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            toast.error("Image must be smaller than 5 MB.");
            return;
        }
        setFormData({ ...formData, image: file });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ── Gallery picker ───────────────────────────────────────────────────────────
    const handleGalleryPick = (e) => {
        const picked = Array.from(e.target.files);
        e.target.value = ""; // reset so the same file can be re-selected

        const remaining = MAX_GALLERY - galleryFiles.length;
        if (remaining <= 0) {
            toast.error(`Maximum ${MAX_GALLERY} gallery images allowed.`);
            return;
        }

        const valid = [];
        for (const file of picked) {
            if (!ALLOWED_TYPES.includes(file.type)) {
                toast.error(`${file.name}: invalid type. Only JPG, PNG, WEBP.`);
                continue;
            }
            if (file.size > MAX_FILE_SIZE) {
                toast.error(`${file.name}: must be < 5 MB.`);
                continue;
            }
            valid.push(file);
        }

        const limited = valid.slice(0, remaining);
        const entries = limited.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        setGalleryFiles((prev) => [...prev, ...entries]);

        if (limited.length < valid.length) {
            toast.warning(`Only ${remaining} more image(s) could be added (limit: ${MAX_GALLERY}).`);
        }
    };

    const removeGalleryFile = (index) => {
        setGalleryFiles((prev) => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    // ── Submit ───────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        // ── Frontend guard: never send empty ObjectId fields ─────────────────
        if (!formData.roomId) {
            toast.error("Please select a Room.");
            return;
        }
        if (!formData.categoryId) {
            toast.error("Please select a Category.");
            return;
        }

        try {
            setWait(true);

            const sendData = new FormData();

            // Append text fields — skip null/undefined/empty to avoid sending ""
            const { image, ...rest } = formData;
            Object.entries(rest).forEach(([k, v]) => {
                if (v !== null && v !== undefined && v !== "") {
                    sendData.append(k, v);
                }
            });

            // Main thumbnail → field name "image"
            if (image) sendData.append("image", image);

            // Gallery images → field name "gallery" (multiple)
            galleryFiles.forEach(({ file }) => sendData.append("gallery", file));

            const response = await client.post("product/create", sendData);

            if (response.data.success) {
                toast.success(response.data.message);
                router.push("/admin/product");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
        } finally {
            setWait(false);
        }
    };

    // ── Data loading ─────────────────────────────────────────────────────────────
    useEffect(() => {
        async function getData() {
            try {
                const [r, c] = await Promise.all([fetchRooms(), fetchCategory()]);
                setRooms(r.data || []);
                setCategories(c.data || []);
            } catch { }
        }
        getData();
    }, []);

    // ── Auto-discount ─────────────────────────────────────────────────────────────
    useEffect(() => {
        const original = Number(formData.originalPrice);
        const sale = Number(formData.salePrice);
        if (original > 0 && sale >= 0 && sale <= original) {
            setFormData((p) => ({
                ...p,
                discount: Math.round(((original - sale) / original) * 100),
            }));
        } else {
            setFormData((p) => ({ ...p, discount: "" }));
        }
    }, [formData.originalPrice, formData.salePrice]);

    // ── Shared input style ────────────────────────────────────────────────────────
    const inp = "border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm text-[#3a3f5c] outline-none focus:border-[#3b497e] focus:ring-2 focus:ring-[#3b497e]/10 transition";

    return (
        <div className="min-h-screen bg-[#f7f8fd] p-4 sm:p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-[#eef0f8] shadow-md overflow-hidden">

                {/* Header */}
                <div className="bg-[#3b497e] px-5 py-4 flex items-center gap-2 text-white">
                    <FiTag size={18} />
                    <h2 className="text-[15px] font-semibold">Add Product</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-6">

                    {/* Name + Slug */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#2a3460]">Product Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} className={inp} required />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#2a3460]">Slug</label>
                            <input type="text" value={formData.slug} readOnly className={`${inp} bg-gray-50`} />
                        </div>
                    </div>

                    {/* Room + Category */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#2a3460]">Room *</label>
                            <Select
                                options={rooms.map((r) => ({ value: r._id, label: r.name }))}
                                onChange={(s) => setFormData({ ...formData, roomId: s.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#2a3460]">Category *</label>
                            <Select
                                options={categories.map((c) => ({ value: c._id, label: c.name }))}
                                onChange={(s) => setFormData({ ...formData, categoryId: s.value })}
                            />
                        </div>
                    </div>

                    {/* Prices */}
                    <div className="grid md:grid-cols-3 gap-5">
                        <input type="number" name="originalPrice" placeholder="Original Price" value={formData.originalPrice} onChange={handleChange} className={inp} />
                        <input type="number" name="salePrice" placeholder="Sale Price" value={formData.salePrice} onChange={handleChange} className={inp} />
                        <input type="number" name="discount" placeholder="Discount %" value={formData.discount} onChange={handleChange} className={inp} />
                    </div>

                    {/* Material / Color / Weight */}
                    <div className="grid md:grid-cols-3 gap-5">
                        <input type="text" name="material" placeholder="Material" value={formData.material} onChange={handleChange} className={inp} />
                        <input type="text" name="color" placeholder="Color" value={formData.color} onChange={handleChange} className={inp} />
                        <input type="number" name="weight" placeholder="Weight (KG)" value={formData.weight} onChange={handleChange} className={inp} />
                    </div>

                    {/* Dimensions */}
                    <div className="grid md:grid-cols-3 gap-5">
                        <input type="number" name="width" placeholder="Width" value={formData.width} onChange={handleChange} className={inp} />
                        <input type="number" name="height" placeholder="Height" value={formData.height} onChange={handleChange} className={inp} />
                        <input type="number" name="depth" placeholder="Depth" value={formData.depth} onChange={handleChange} className={inp} />
                    </div>

                    {/* Descriptions */}
                    <textarea name="shortDescription" placeholder="Short Description" value={formData.shortDescription} onChange={handleChange} rows={4} className={`${inp} w-full resize-none`} />
                    <div className="border rounded-xl px-4 py-3">
                        <Editor value={formData.description} onTextChange={(e) => setFormData((p) => ({ ...p, description: e.htmlValue }))} />
                    </div>

                    {/* SEO */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <input type="text" name="seoTitle" placeholder="SEO Title" value={formData.seoTitle} onChange={handleChange} className={inp} />
                        <textarea name="seoDescription" placeholder="SEO Description" value={formData.seoDescription} onChange={handleChange} rows={3} className={`${inp} resize-none`} />
                    </div>

                    {/* ── Thumbnail ──────────────────────────────────────────────────────── */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-[#2a3460]">Main Thumbnail</label>
                        <input type="file" accept="image/*" onChange={handleImage} className={`${inp} cursor-pointer`} />
                        {formData.image && (
                            <div className="relative w-28 h-28 mt-2">
                                <img src={URL.createObjectURL(formData.image)} alt="thumbnail" className="w-28 h-28 object-cover rounded-xl border" />
                                <button
                                    type="button"
                                    onClick={() => setFormData((p) => ({ ...p, image: null }))}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition"
                                >
                                    <FiX size={11} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Product Gallery ────────────────────────────────────────────────── */}
                    <div className="border border-[#eef0f8] rounded-2xl p-5 space-y-4 bg-[#fafbff]">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <FiImage size={18} className="text-[#3b497e]" />
                                <h3 className="text-sm font-bold text-[#2a3460]">
                                    Product Gallery
                                    <span className="ml-2 text-xs font-normal text-[#7a84a6]">
                                        ({galleryFiles.length}/{MAX_GALLERY})
                                    </span>
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() => galleryInputRef.current?.click()}
                                disabled={galleryFiles.length >= MAX_GALLERY}
                                className="inline-flex items-center gap-1.5 rounded-xl border-[1.5px] border-[#3b497e] text-[#3b497e] px-4 py-2 text-xs font-semibold hover:bg-[#3b497e] hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <FiPlus size={13} /> Add Images
                            </button>

                            {/* Hidden multi-file input */}
                            <input
                                ref={galleryInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleGalleryPick}
                            />
                        </div>

                        {galleryFiles.length === 0 ? (
                            <div
                                onClick={() => galleryInputRef.current?.click()}
                                className="flex flex-col items-center justify-center border-2 border-dashed border-[#c3c9e3] rounded-xl py-10 cursor-pointer hover:border-[#3b497e] hover:bg-[#f4f5fb] transition"
                            >
                                <FiImage size={32} className="text-[#c3c9e3] mb-2" />
                                <p className="text-sm text-[#9a8a7a]">Click to add gallery images</p>
                                <p className="text-xs text-[#c3c9e3] mt-1">JPG, PNG, WEBP · max 5 MB each · up to {MAX_GALLERY} images</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {galleryFiles.map(({ preview }, idx) => (
                                    <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-[#eef0f8] bg-gray-50">
                                        <img src={preview} alt={`gallery-${idx + 1}`} className="w-full h-full object-cover transition duration-300 group-hover:brightness-75" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryFile(idx)}
                                                className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition"
                                                aria-label="Remove image"
                                            >
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                        <span className="absolute top-1.5 left-1.5 bg-black/50 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                            {idx + 1}
                                        </span>
                                    </div>
                                ))}

                                {/* Add more tile */}
                                {galleryFiles.length < MAX_GALLERY && (
                                    <button
                                        type="button"
                                        onClick={() => galleryInputRef.current?.click()}
                                        className="aspect-square rounded-xl border-2 border-dashed border-[#c3c9e3] flex flex-col items-center justify-center text-[#9a8a7a] hover:border-[#3b497e] hover:text-[#3b497e] hover:bg-[#f4f5fb] transition cursor-pointer"
                                    >
                                        <FiPlus size={20} className="mb-1" />
                                        <span className="text-[10px] font-medium">Add More</span>
                                    </button>
                                )}
                            </div>
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
                            disabled={wait}
                            className="inline-flex items-center gap-2 bg-[#3b497e] hover:bg-[#2a3460] disabled:bg-gray-400 text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md transition"
                        >
                            <FiSave size={16} />
                            {wait ? "Uploading…" : "Save Product"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
