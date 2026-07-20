"use client";

import { client, generateSlug } from "@/utils/helper";
import { useEffect, useMemo, useState, use } from "react";
import {
    FiSave,
    FiTag,
} from "react-icons/fi";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchCategoryById } from "@/utils/api";

export default function EditCategoryPage({ params }) {
    const router = useRouter()

    const { param } = use(params);

    const [loading, setLoading] = useState(true);
    const [wait, setWait] = useState(false);

    const [originalData, setOriginalData] = useState(null);

    const [preview, setPreview] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        image: null,
        oldImage: ""
    });

    // =========================
    // Fetch Category
    // =========================
    useEffect(() => {

        async function getCategory() {

            try {

                setLoading(true);

                const response = await fetchCategoryById(param);

                if (response.success) {

                    const data = response.data;

                    setFormData({
                        name: data.name || "",
                        slug: data.slug || "",
                        image: null,
                        oldImage: data.image || ""
                    });

                    setOriginalData({
                        name: data.name || "",
                        slug: data.slug || "",
                        image: data.image || ""
                    });

                    setPreview(data.image || "");
                }
                else {
                    toast.error("Category not found");
                    router.push("/admin/category");
                }

            }
            catch (error) {

                toast.error("Failed to fetch category");

                router.push("/admin/category");
            }
            finally {

                setLoading(false);
            }
        }

        if (param) {
            getCategory();
        }

    }, [param, router]);

    // =========================
    // Handle Name Change
    // =========================
    const handleNameChange = (value) => {

        setFormData((prev) => ({
            ...prev,
            name: value,
            slug: generateSlug(value)
        }));
    };

    // =========================
    // Handle Image
    // =========================
    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        // Validation
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload valid image");
            return;
        }

        // 2MB Validation
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size must be less than 2MB");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            image: file
        }));

        setPreview(URL.createObjectURL(file));
    };

    // =========================
    // Check Data Changed
    // =========================
    const isDataChanged = useMemo(() => {

        if (!originalData) return false;

        return (
            formData.name !== originalData.name ||
            formData.slug !== originalData.slug ||
            formData.image !== null
        );

    }, [formData, originalData]);

    // =========================
    // Handle Submit
    // =========================
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            // Prevent Empty Update
            if (!isDataChanged) {
                return toast.info("No changes detected");
            }

            setWait(true);

            const sendData = new FormData();

            sendData.append("name", formData.name);
            sendData.append("slug", formData.slug);

            // Only send image if changed
            if (formData.image) {
                sendData.append("image", formData.image);
            }

            const response = await client.put(
                `category/update/${param}`,
                sendData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            if (response.data.success) {

                toast.success(response.data.message);

                router.push("/admin/category");
            }

        }
        catch (error) {

            toast.error(
                error.friendlyMessage ||
                error.response?.data?.message ||
                "Internal Server Error"
            );
        }
        finally {

            setWait(false);
        }
    };

    // =========================
    // Loading UI
    // =========================
    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f8fd]">
                <div className="text-[#3b497e] text-lg font-semibold">
                    Loading...
                </div>
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-[#f7f8fd] p-6">

            {/* Header */}
            <div className="mb-6 mx-auto max-w-2xl">

                <h1 className="text-2xl font-semibold text-[#2a3460]">
                    Edit Category
                </h1>

                <p className="text-sm text-[#7a84a6] mt-1">
                    Update ecommerce category information
                </p>
            </div>

            {/* Card */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#eef0f8] shadow-md overflow-hidden">

                {/* Card Header */}
                <div className="bg-[#3b497e] px-5 py-4 flex items-center gap-2 text-white">

                    <FiTag size={18} />

                    <h2 className="text-[15px] font-semibold">
                        Category Information
                    </h2>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="p-5 space-y-5"
                >

                    {/* Name */}
                    <div className="flex flex-col gap-1.5">

                        <label className="text-xs font-semibold text-[#2a3460]">
                            Name *
                        </label>

                        <input
                            type="text"
                            placeholder="e.g. Electronics"
                            value={formData.name}
                            onChange={(e) =>
                                handleNameChange(e.target.value)
                            }
                            className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm text-[#3a3f5c] outline-none focus:border-[#3b497e] focus:ring-2 focus:ring-[#3b497e]/10 transition"
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div className="flex flex-col gap-1.5">

                        <label className="text-xs font-semibold text-[#2a3460]">
                            Slug *
                        </label>

                        <input
                            type="text"
                            value={formData.slug}
                            readOnly
                            className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm text-[#3a3f5c] bg-gray-50 outline-none"
                        />

                        <span className="text-[11px] text-[#7a84a6]">
                            URL friendly category identifier
                        </span>
                    </div>

                    {/* Image */}
                    <div className="flex flex-col gap-1.5">

                        <label className="text-xs font-semibold text-[#2a3460]">
                            Category Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                            className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm text-[#3a3f5c]"
                        />

                        {
                            preview &&
                            <img
                                src={preview}
                                alt="preview"
                                className="w-28 h-28 object-cover rounded-xl border mt-2"
                            />
                        }
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={() =>
                                router.push("/admin/category")
                            }
                            className="px-5 py-2.5 rounded-xl border-[1.5px] border-[#c3c9e3] text-sm font-medium text-[#3a3f5c] hover:bg-[#f4f5fb]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={wait || !isDataChanged}
                            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md text-white transition
                            
                            ${wait || !isDataChanged
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-[#3b497e] hover:bg-[#2a3460]"
                                }`}
                        >
                            <FiSave size={16} />

                            {
                                wait
                                    ? "Updating..."
                                    : "Update Category"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}