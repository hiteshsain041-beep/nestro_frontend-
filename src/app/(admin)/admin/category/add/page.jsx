
"use client";

import { client, generateSlug } from "@/utils/helper";
import { useEffect, useState } from "react";

import {
    FiSave,
    FiTag,
} from "react-icons/fi";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddCategoryPage() {


    const router = useRouter();

    const [wait, setWait] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        image: null
    });

    // Auto Generate Slug
    const handleNameChange = (value) => {

        const slug_value = generateSlug(value);

        setFormData({
            ...formData,
            name: value,
            slug: slug_value
        });
    };

    // Handle Image
    const handleImage = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        });
    };

    // Submit Form
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setWait(true);

            // FormData Object
            const sendData = new FormData();

            sendData.append("name", formData.name);
            sendData.append("slug", formData.slug);
            sendData.append("image", formData.image);


            const response = await client.post(
                "category/create",
                sendData
            );

            if (response.data.success) {

                toast.success(response.data.message);

                setFormData({
                    name: "",
                    slug: "",
                    image: null
                });

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


    return (
        <div className="min-h-screen mx-auto bg-[#f7f8fd] p-6">

            {/* Header */}
            <div className="mb-6 mx-auto w-2xl">

                <h1 className="text-2xl font-semibold text-[#2a3460]">
                    Add Category
                </h1>

                <p className="text-sm text-[#7a84a6] mt-1">
                    Create and manage ecommerce category
                </p>
            </div>

            {/* Card */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#eef0f8] shadow-md overflow-hidden">

                {/* Card Header */}
                <div className="bg-[#3b497e] px-5 py-4 flex items-center gap-2 text-white">

                    <FiTag size={18} />

                    <h2 className="text-[15px] font-semibold">
                        Information
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
                            placeholder="electronics"
                            value={formData.slug}
                            readOnly
                            className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm text-[#3a3f5c] outline-none bg-gray-50"
                        />

                        <span className="text-[11px] text-[#7a84a6]">
                            URL friendly category identifier
                        </span>
                    </div>


                    {/* Image */}
                    <div className="flex flex-col gap-1.5">

                        <label className="text-xs font-semibold text-[#2a3460]">
                            Image *
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                            className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm text-[#3a3f5c]"

                        />

                        {/* Preview */}
                        {
                            formData.image &&
                            <img
                                src={URL.createObjectURL(formData.image)}
                                alt="preview"
                                className="w-28 h-28 object-cover rounded-xl border mt-2"
                            />
                        }
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">

                        <button
                            type="button"
                            className="px-5 py-2.5 rounded-xl border-[1.5px] border-[#c3c9e3] text-sm font-medium text-[#3a3f5c] hover:bg-[#f4f5fb]"
                        >
                            Cancel
                        </button>

                        {
                            !wait &&
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 bg-[#3b497e] hover:bg-[#2a3460] text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md"
                            >
                                <FiSave size={16} />
                                Save Category
                            </button>
                        }

                        {
                            wait &&
                            <button
                                type="button"
                                className="bg-gray-400 text-white px-5 py-2.5 rounded-xl"
                            >
                                Uploading...
                            </button>
                        }
                    </div>
                </form>
            </div>
        </div>
    );
}

