'use client'

import React, { useState } from 'react'
import { FaBars } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { MdOutlineDashboard } from "react-icons/md";
import { FiShoppingBag, FiMail } from "react-icons/fi";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const [toggle, setToggle] = useState(true);

    const items = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: <MdOutlineDashboard size={22} />
        },
        {
            name: "Room Type",
            path: "/admin/room-type",
            icon: <FaHome size={22} />
        },
        {
            name: "Category",
            path: "/admin/category",
            icon: <MdCategory size={22} />
        },

        {
            name: "Product",
            path: "/admin/product",
            icon: <MdOutlineProductionQuantityLimits size={22} />
        },
        {
            name: "Orders",
            path: "/admin/orders",
            icon: <FiShoppingBag size={22} />
        },
        {
            name: "Messages",
            path: "/admin/contact",
            icon: <FiMail size={22} />
        },
    ]

    return (
        <div
            className={`
                ${toggle ? 'w-20' : 'w-64'}
                duration-300
                h-screen
                sticky
                top-0
                bg-[#3b497e]
                shadow-xl
            `}
        >
            {/* Header */}
            <div className='flex justify-between py-5 px-5 border-b border-white/20 items-center'>
                {!toggle && (
                    <h1 className='text-2xl font-bold text-white tracking-wide'>
                        Nestro
                    </h1>
                )}

                <FaBars
                    onClick={() => setToggle(!toggle)}
                    className='text-white cursor-pointer text-xl'
                />
            </div>

            {/* Menu */}
            <div className='mt-6 pe-3 flex flex-col gap-2'>
                {
                    items.map((item, index) => {

                        const active = pathname === item.path

                        return (
                            <div
                                key={item.path}
                                className='relative group'
                            >
                                <Link
                                    href={item.path}
                                    style={{ borderRadius: "0px 20px 20px 0px" }}
                                    className={`
                                        px-4 py-3
                                        text-white
                                        flex items-center
                                        gap-4
                                        transition-all
                                        duration-200
                                        hover:bg-[#ffffff1a]
                                        ${active ? "bg-[#ffffff1a]" : ""}
                                    `}
                                >
                                    <span className='text-xl'>
                                        {item.icon}
                                    </span>

                                    {!toggle && (
                                        <span className='font-medium'>
                                            {item.name}
                                        </span>
                                    )}
                                </Link>

                                {/* Tooltip */}
                                {toggle && (
                                    <div
                                        className='
                                            absolute
                                            left-24
                                            top-1/2
                                            -translate-y-1/2
                                            bg-black
                                            text-white
                                            text-sm
                                            px-3
                                            py-1
                                            rounded-md
                                            opacity-0
                                            invisible
                                            group-hover:opacity-100
                                            group-hover:visible
                                            transition-all
                                            duration-200
                                            whitespace-nowrap
                                            z-50
                                        '
                                    >
                                        {item.name}
                                    </div>
                                )}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}