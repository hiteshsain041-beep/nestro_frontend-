"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
      className="rounded-full p-2 transition hover:bg-gray-700 dark:hover:bg-red-500"
    >
      {theme === "dark" ? (
        <FiSun size={22}/> 
      ) : (
        <FiMoon size={22} />
      )}
    </button>
  );
}