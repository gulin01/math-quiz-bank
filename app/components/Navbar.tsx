"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, PlusCircle, List } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "문제 목록", icon: <List className="w-5 h-5" /> },
    {
      href: "/create",
      label: "문제 만들기",
      icon: <PlusCircle className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-md mb-8">
      <div className="max-w-5xl mx-auto px-6 py-3">
        <ul className="flex gap-6 items-center">
          {navItems.map(({ href, label, icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-2 px-3 py-2 rounded transition-all duration-200 hover:bg-white/10 ${
                    isActive
                      ? "border-b-2 border-white font-semibold"
                      : "opacity-80"
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
