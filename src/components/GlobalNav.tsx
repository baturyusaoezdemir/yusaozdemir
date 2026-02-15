"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function GlobalNav() {
  const pathname = usePathname();
  const active = pathname === "/" ? "home" : "blog";

  return (
    <div className="relative z-[120]">
      <NavBar active={active} onChange={() => {}} />
    </div>
  );
}
