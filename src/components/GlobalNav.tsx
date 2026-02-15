"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import NavBar from "@/components/NavBar";

export default function GlobalNav() {
  const pathname = usePathname();
  const active = pathname === "/" ? "home" : "blog";

  return (
    <motion.div
      className="relative z-[120]"
      initial={{ opacity: 0, y: -18, scale: 0.99, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <NavBar active={active} onChange={() => {}} />
    </motion.div>
  );
}
