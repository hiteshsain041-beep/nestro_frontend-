"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineDotsHorizontal,
  HiOutlinePencilAlt,
} from "react-icons/hi";
import DeleteBtn from "./DeleteBtn";

export default function ActionDropdown({ id, module }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleEdit() {
    setOpen(false);
    router.push(`/admin/${module}/edit/${id}`);
  }

  return (
    <div className="relative" ref={dropdownRef}>

      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex h-9  items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-black hover:bg-black hover:text-white ${open ? "bg-black text-white border-black" : ""
          }`}
      >
        Actions
        <HiOutlineDotsHorizontal className="text-base" />
      </button>

      {/* DROPDOWN MENU */}
      {open && (
        <div className="absolute right-15 top-[-60] z-50 w-48 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_15px_50px_rgba(0,0,0,0.10)]">

          {/* EDIT */}
          <button
            onClick={handleEdit}
            className="flex w-full items-center gap-3 px-4 py-3 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
              <HiOutlinePencilAlt className="text-sm" />
            </div>
            Edit
          </button>

          {/* DIVIDER */}
          <div className="mx-4 h-px bg-gray-100" />

          {/* DELETE */}
          <DeleteBtn path={`${module}/delete/${id}`} />

        </div>
      )}
    </div>
  );
}
