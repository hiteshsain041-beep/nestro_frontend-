'use client'

import React from 'react';
import { toast } from 'sonner';
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

export default function Header() {

    const handleLogout = async () => {
        try {
            // Use fetch with a relative URL — not the `client` axios instance,
            // which has baseURL pointing to Express (localhost:5000).
            await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
            toast.success("Logged out successfully");
            window.location.href = "/admin-login";
        } catch {
            // Even if the request fails, redirect — cookies expire naturally
            window.location.href = "/admin-login";
        }
    };

    return (
        <div className='
            w-full
            h-[70px]
            bg-white
            shadow-sm
            border-b
            px-6
            flex
            items-center
            justify-between
            sticky
            top-0
            z-40
        '>

            {/* Left Side */}
            <div>
                <h1 className='text-md text-gray-800'>
                    Admin Dashboard
                </h1>
                <p className='text-sm text-gray-500'>
                    Welcome back 👋
                </p>
            </div>

            {/* Right Side */}
            <div className='flex items-center gap-5'>

                {/* Search */}
                <div className='
                    hidden
                    md:flex
                    items-center
                    gap-2
                    bg-gray-100
                    px-4
                    py-2
                    rounded-xl
                    w-[250px]
                '>
                    <FaSearch className='text-gray-500' />
                    <input
                        type="text"
                        placeholder='Search here...'
                        className='
                            bg-transparent
                            outline-none
                            text-sm
                            w-full
                            text-black
                        '
                    />
                </div>

                {/* Notification */}
                <div className='
                    relative
                    w-10
                    h-10
                    rounded-full
                    bg-gray-100
                    flex
                    items-center
                    justify-center
                    cursor-pointer
                    hover:bg-gray-200
                    duration-200
                '>
                    <FaBell className='text-gray-700' />

                    <span className='
                        absolute
                        top-1
                        right-1
                        w-2
                        h-2
                        bg-red-500
                        rounded-full
                    '></span>
                </div>

                {/* Profile */}

                <div className="flex items-center gap-2 cursor-pointer">
                    <FaUserCircle className="text-2xl text-gray-600" />
                    <span className="text-sm text-black font-medium">Admin</span>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 font-bold cursor-pointer text-black hover:text-black text-sm">
                    Logout
                </button>

            </div>
        </div>
    )
}