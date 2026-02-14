"use client";

import { useState, useEffect } from "react";
import { Home, GitBranch, Briefcase, Star, Menu, X } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
  useMotionTemplate,
} from "framer-motion";

export type Tab = "home" | "career" | "certifications" | "projects";

export default function NavBar({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) {
  const [open, setOpen] = useState(false);
  const handleNavigate = (id: Tab) => {
    onChange(id);
    setOpen(false);
    if (typeof window === "undefined") return;
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { damping: 28, stiffness: 260, mass: 0.4 });
  const vel = useVelocity(smoothY);
  const v = useSpring(vel, { damping: 35, stiffness: 320 });

  // Übergänge Floating -> Docked
  const radius = useTransform(smoothY, [0, 80], [20, 0]);
  const mt = useTransform(smoothY, [0, 80], [12, 0]);
  const maxW = useTransform(smoothY, [0, 80], [1125, 9999]);
  const shOp = useTransform(v, [-3000, 0, 3000], [0.28, 0.18, 0.28]);

  const Item = ({
    id,
    label,
    icon: Icon,
  }: {
    id: Tab;
    label: string;
    icon: any;
  }) => (
    <button
      onClick={() => handleNavigate(id)}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer text-gray-700 hover:text-gray-900 hover:bg-black/5 active:scale-[0.98] hover:scale-[1.02]"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Desktop */}
      <div className="hidden sm:block">
        <motion.div
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            marginTop: mt,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden"
          }}
        >
          <motion.nav
            className="flex h-16 items-center justify-between px-6 border backdrop-blur-xl"
            style={{
              maxWidth: maxW as any,
              borderRadius: radius as any,
              backgroundColor: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: useMotionTemplate`0 8px 30px rgba(0,0,0,${shOp})`,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <button
              onClick={() => handleNavigate("home")}
              className="text-lg sm:text-xl font-extrabold tracking-tight cursor-pointer"
              aria-label="Startseite"
            >
              Yusa<span className="text-indigo-500">.dev</span>
            </button>
            <div className="flex items-center gap-2">
              <Item id="home" label="Home" icon={Home} />
              <Item id="career" label="Karriere" icon={Briefcase} />
              <Item id="certifications" label="Zertifizierungen" icon={Star} />
              <Item id="projects" label="Projekte" icon={GitBranch} />
            </div>
          </motion.nav>
        </motion.div>
      </div>

      {/* Mobile */}
      <motion.div
        className="sm:hidden"
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.nav
          className="h-14 flex items-center justify-between px-3 border-b backdrop-blur-xl"
          style={{
            backgroundColor: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.3)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          }}
          transition={{ duration: 0.5, ease: "easeOut" }} 
        >
          <button
            onClick={() => handleNavigate("home")}
            className="text-lg font-extrabold tracking-tight cursor-pointer"
            aria-label="Startseite"
          >
            Yusa<span className="text-indigo-500">.dev</span>
          </button>
          <button
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-black/5"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            onClick={() => setOpen((v) => !v)}
            style={{ cursor: "pointer" }}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </motion.nav>

        {open && (
          <div className="border-b bg-white/90 backdrop-blur-xl">
            <div className="px-3 py-3 grid gap-2">
              <Item id="home" label="Home" icon={Home} />
              <Item id="career" label="Karriere" icon={Briefcase} />
              <Item id="certifications" label="Zertifizierungen" icon={Star} />
              <Item id="projects" label="Projekte" icon={GitBranch} />
            </div>
          </div>
        )}
      </motion.div>
    </header>
  );
}
