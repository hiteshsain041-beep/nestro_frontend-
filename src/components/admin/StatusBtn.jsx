'use client'

import { client } from '@/utils/helper';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function StatusBtn({ path, status }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function statusHandler() {
        try {
            setLoading(true);
            const response = await client.patch(path);
            if (response.data.success) {
                toast.success(response.data.message);
                router.refresh();
            }
        } catch (error) {
            toast.error(error.friendlyMessage || error.response?.data?.message || 'Internal Server Error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            onClick={loading ? undefined : statusHandler}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold cursor-pointer select-none transition-opacity ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${status
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-600"
                }`}
        >
            <div className={`h-2 w-2 rounded-full ${status ? "bg-emerald-500" : "bg-red-500"}`} />
            {loading ? "..." : status ? "Active" : "Inactive"}
        </div>
    );
}
