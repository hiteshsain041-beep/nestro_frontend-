'use client'

import { client } from '@/utils/helper';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { HiOutlineTrash } from "react-icons/hi";
import { toast } from 'sonner';
import Swal from 'sweetalert2';

export default function DeleteBtn({ path }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function deleteHandler() {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (!result.isConfirmed) return;

        try {
            setLoading(true);
            const response = await client.delete(path);
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
        <button
            onClick={deleteHandler}
            disabled={loading}
            className="flex w-full items-center gap-3 px-4 py-3 text-xs font-medium text-red-500 transition-all hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                <HiOutlineTrash className="text-sm" />
            </div>
            {loading ? "Deleting..." : "Delete"}
        </button>
    );
}
