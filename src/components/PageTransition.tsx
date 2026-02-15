"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const isBlogDetail = pathname.startsWith("/blog/") && pathname !== "/blog";

  if (isBlogDetail) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        className="relative z-0"
        key={pathname}
        initial={{ opacity: 0, y: 12, scale: 0.996, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, scale: 0.996, filter: "blur(4px)" }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
