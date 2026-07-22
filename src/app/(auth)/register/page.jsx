"use client";

import { client } from "@/utils/helper.js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
    const router = useRouter();

    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function registerHandler(e) {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            toast.error("All fields are required");
            return;
        }
        try {
            setLoading(true);
            const response = await client.post("user/register", {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            }, { timeout: 60000 });
            if (response.data.success) {
                toast.success(response.data.message);
                setFormData({ name: "", email: "", password: "" });
                router.push(`/verify-otp?email=${encodeURIComponent(response.data.user)}`);
            }
        } catch (error) {
            toast.error(
                error.friendlyMessage ||
                error.response?.data?.message ||
                error.message ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    }

    const fields = [
        { id: "name", label: "Full Name", type: "text", placeholder: "Rahul Sharma" },
        { id: "email", label: "Email Address", type: "email", placeholder: "rahul@email.com" },
        { id: "password", label: "Password", type: "password", placeholder: "At least 8 characters" },
    ];

    return (
        <div className="w-full flex flex-col justify-center">

            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
                <p className="text-gray-500 mt-2 text-sm">
                    Join Nestro and discover curated furniture.
                </p>
            </div>

            <form onSubmit={registerHandler} className="space-y-5">
                {fields.map(({ id, label, type, placeholder }) => (
                    <div key={id}>
                        <label htmlFor={id} className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                            {label}
                        </label>
                        <input
                            id={id}
                            name={id}
                            value={formData[id]}
                            onChange={handleChange}
                            type={type}
                            placeholder={placeholder}
                            className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#93633e] focus:ring-2 focus:ring-[#93633e]/10 transition"
                        />
                    </div>
                ))}

                <button
                    disabled={loading}
                    className="w-full bg-[#93633e] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#7b5030] disabled:opacity-50 transition"
                >
                    {loading ? "Creating…" : "Create Account"}
                </button>
            </form>

            <p className="text-center mt-7 text-sm text-gray-500">
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="text-[#93633e] font-semibold hover:underline"
                >
                    Sign in
                </button>
            </p>
        </div>
    );
}
