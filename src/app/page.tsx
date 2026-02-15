"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Github,
  Mail,
  Linkedin,
  MapPin,
  GitBranch,
  Star,
  Briefcase,
  Send,
  User,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import TerminalEasterEgg from "@/components/TerminalEasterEgg";

type RepoSummary = {
  description?: string;
  language?: string;
  topics?: string[];
};

interface CareerStep {
  year: string;
  role: string;
  company: string;
  description: string;
  website: string;
  logo: string;
}

interface Certification {
  name: string;
  link: string;
}

interface FeaturedProject {
  name: string;
  repo: string;
  url: string;
  description?: string;
  language?: string;
  topics?: string[];
}

const CONFIG = {
  name: "Batur Yusa Özdemir",
  role: "Senior DevOps Engineer - Consulting · DevOps · Architektur · Observability ",
  certificates: "Certified Kubernetes Administrator & Application Developer",
  tagline:
    "Plattformen sichtbar machen, Systeme messbar halten & Prozesse effizient gestalten",
  location: "Köln, Deutschland",
  socials: {
    github: "https://github.com/baturyusaoezdemir",
    linkedin: "https://linkedin.com/in/yusaoezdemir",
    email: "mail@yusaozdemir.de",
  },
  profileImage: "/me.png",
};

const CAREER: CareerStep[] = [
  {
    year: "JUL 2025 – heute",
    role: "Platform Engineer",
    company: "Bank-Verlag GmbH",
    logo: "/icons/bankverlag.png",
    website: "https://www.bank-verlag.de/",
    description:
      "Tätig als Platform Engineer mit Leadfunktion: Unterstützung der Teamführung sowie Übernahme von Koordinations- und anteiligen Führungsaufgaben.\nCoaching des DevOps-Teams und Einführung moderner Technologien und Best Practices.\nProaktive Identifikation und Priorisierung von Themen rund um DevOps und Plattform-Services sowie Konzeption und Umsetzung.",
  },
  {
    year: "OKT 2021 – JUN 2025",
    role: "Software Engineer",
    company: "adesso SE",
    logo: "/icons/adesso.png",
    website: "https://www.adesso.de/",
    description:
      "Beratung und Mitarbeit in zahlreichen Projekten im Bereich Frontend- und Backend-Entwicklung sowie DevOps.\nAufbau und Optimierung von Containerplattformen und CI/CD-Pipelines.\nLeitung und Koordination von Entwicklerteams sowie Durchführung von Schulungen und Mentoring zur Förderung der beruflichen Entwicklung.\nKarriereweg: Werkstudent → Trainee → Software Developer → Software Engineer.",
  },
  {
    year: "OKT 2020 – SEP 2021",
    role: "Werkstudent",
    company: "DocCheck AG",
    logo: "/icons/doccheck.png",
    website: "https://www.doccheck.ag/",
    description:
      "Unterstützung im Support und der Systemadministration. Optimierung und Automatisierung verschiedener Prozesse.",
  },
];

const CERTIFICATIONS: Certification[] = [
  {
    name: "CKAD - Certified Kubernetes Application Developer",
    link: "https://ti-user-certificates.s3.amazonaws.com/e0df7fbf-a057-42af-8a1f-590912be5460/97c30ae7-9170-448b-adfe-67e655866568-batur-yua-zdemir-ab225b81-9402-40d8-a072-0906a57d9741-certificate.pdf",
  },
  {
    name: "CKA - Certified Kubernetes Administrator",
    link: "https://ti-user-certificates.s3.amazonaws.com/e0df7fbf-a057-42af-8a1f-590912be5460/97c30ae7-9170-448b-adfe-67e655866568-batur-yua-zdemir-6e273fcf-ae73-44f8-adff-2bd12af59a54-certificate.pdf",
  },
];

const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    name: "Resource-Action-Operator",
    repo: "zdmr-space/Resource-Action-Operator",
    url: "https://github.com/zdmr-space/Resource-Action-Operator",
  },
  {
    name: "social-imposter",
    repo: "baturyusaoezdemir/social-imposter",
    url: "https://github.com/baturyusaoezdemir/social-imposter",
  },
  {
    name: "jfrog-artifact-check",
    repo: "baturyusaoezdemir/jfrog-artifact-check",
    url: "https://github.com/baturyusaoezdemir/jfrog-artifact-check",
  },
  {
    name: "docker-linter",
    repo: "baturyusaoezdemir/docker-linter",
    url: "https://github.com/baturyusaoezdemir/docker-linter",
  },
];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.32, delay, ease: EASE_OUT },
});

const TECH_ICONS = [
  "/icons/docker.png",
  "/icons/kubernetes.png",
  "/icons/rancher.png",
  "/icons/helm.png",
  "/icons/flux.png",
  "/icons/argocd.png",
  "/icons/prometheus.png",
  "/icons/grafana.png",
  "/icons/elastic.svg",
  "/icons/python.png",
  "/icons/java.png",
  "/icons/springboot.svg",
  "/icons/angular.png",
  "/icons/vue.png",
  "/icons/flask.png",
  "/icons/otel.png",
  "/icons/tempo.png",
  "/icons/alloy.png",
  "/icons/suse.svg",
  "/icons/sysdig.svg",
  "/icons/grype.png",
  "/icons/trivy.svg",
  "/icons/syft.png",
  "/icons/checkmk.png",
  "/icons/terraform.png",
  "/icons/ansible.png",
  "/icons/keycloak.png",
  "/icons/postgresql.png",
  "/icons/mongodb.svg",
  "/icons/gitlab.svg",
  "/icons/github.png",
  "/icons/jenkins.png",
  "/icons/cicd.png",
  "/icons/kube-prom-stack.png",
  "/icons/aws.png",
];

function TechStackMarquee({ enabled }: { enabled: boolean }) {
  const [iconsReady, setIconsReady] = useState(false);

  useEffect(() => {
    let active = true;
    let loaded = 0;

    const markLoaded = () => {
      loaded += 1;
      if (active && loaded >= TECH_ICONS.length) {
        setIconsReady(true);
      }
    };

    if (typeof window === "undefined" || !enabled) return;

    const preloaded: HTMLImageElement[] = [];
    TECH_ICONS.forEach((src) => {
      const img = new window.Image();
      preloaded.push(img);
      img.onload = markLoaded;
      img.onerror = markLoaded;
      img.src = src;
    });

    const fallback = window.setTimeout(() => {
      if (active) setIconsReady(true);
    }, 700);

    return () => {
      active = false;
      window.clearTimeout(fallback);
      preloaded.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [enabled]);

  return (
    <motion.div
      className="w-full overflow-hidden"
      initial={{ opacity: 0, y: 6 }}
      animate={enabled && iconsReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={{ duration: 0.28, ease: EASE_OUT }}
    >
      {enabled && iconsReady && (
        <Marquee
          className="opacity-80"
          speed={50}
          direction="left"
          gradient
          gradientWidth={200}
          gradientColor="#ffffff"
        >
          {TECH_ICONS.map((icon, i) => (
            <div key={i} className="mx-6" style={{ userSelect: "none" }}>
              <Image
                src={icon}
                alt={`Tech Icon ${i}`}
                width={48}
                height={48}
                className="h-12 w-12 object-contain filter grayscale hover:grayscale-0 transition"
              />
            </div>
          ))}
        </Marquee>
      )}
    </motion.div>
  );
}

function HeroCard({
  onShare,
  shareMsg,
}: {
  onShare: () => void;
  shareMsg?: string;
}) {
  const PROJECT_MAIL_SUBJECT = "[Projektanfrage] Portfolio Kontakt";
  const PROJECT_MAIL_BODY = `Hallo Yusa,

ich möchte eine Projektanfrage stellen.

Firma/Name:
Projektname:
Projektziel:
Technologie-Stack:
Startzeitpunkt:
Laufzeit:
Budgetrahmen:

Rückfragen/Details:

Viele Grüße
`;
  const projectMailtoHref = `mailto:${CONFIG.socials.email}?subject=${encodeURIComponent(
    PROJECT_MAIL_SUBJECT
  )}&body=${encodeURIComponent(PROJECT_MAIL_BODY)}`;

  const [showAbout, setShowAbout] = useState(false);
  const [disableDrag, setDisableDrag] = useState(false);
  const [showProjectContact, setShowProjectContact] = useState(false);
  const [contactMsg, setContactMsg] = useState("");
  const projectContactRef = useRef<HTMLDivElement | null>(null);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const tiltXSpring = useSpring(tiltX, { stiffness: 220, damping: 20 });
  const tiltYSpring = useSpring(tiltY, { stiffness: 220, damping: 20 });

  const clamp = (v: number, min: number, max: number) =>
    Math.min(Math.max(v, min), max);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setDisableDrag(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!showProjectContact) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (projectContactRef.current && target && !projectContactRef.current.contains(target)) {
        setShowProjectContact(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowProjectContact(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showProjectContact]);

  const copyContactMail = async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.socials.email);
      setContactMsg("E-Mail kopiert");
    } catch {
      const input = document.createElement("input");
      input.value = CONFIG.socials.email;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setContactMsg("E-Mail kopiert");
    }
    window.setTimeout(() => setContactMsg(""), 2000);
  };

  return (
    <div className="w-full" style={{ perspective: 1000 }}>
      <motion.div
        className="w-full h-full"
        animate={{
          rotateY: showAbout ? 180 : 0,
          rotateX: showAbout ? 3 : 0,
          scale: showAbout ? 0.98 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 70,
          damping: 10,
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="w-full h-full cursor-grab active:cursor-grabbing select-none"
          style={{
            rotateX: tiltXSpring,
            rotateY: tiltYSpring,
            transformStyle: "preserve-3d",
            touchAction: disableDrag ? "auto" : "none",
          }}
          drag={!disableDrag}
          onPointerDown={() => {
            if (typeof window !== "undefined") {
              window.getSelection?.()?.removeAllRanges();
            }
          }}
          onDragStart={(e) => e.preventDefault()}
          dragElastic={0.06}
          dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
          onDrag={(_, info) => {
            const max = 8;
            tiltY.set(clamp(info.offset.x / 18, -max, max));
            tiltX.set(clamp(-info.offset.y / 18, -max, max));
          }}
          onDragEnd={() => {
            tiltX.set(0);
            tiltY.set(0);
          }}
        >
          <div
            className="relative inset-0 w-full h-full rounded-3xl bg-white p-8 pb-20 shadow-xl border border-gray-200/50 select-none"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6 pt-5 text-center sm:text-left">
              <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-indigo-200 shadow-lg flex-shrink-0">
                <Image
                  src={CONFIG.profileImage}
                  alt={`${CONFIG.name} Profilfoto`}
                  fill
                  sizes="112px"
                  priority
                  className="object-cover select-none"
                  draggable={false}
                />
              </div>

              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent leading-tight">
                  {CONFIG.name}
                </h1>

                <p className="mt-1 text-lg sm:text-xl text-gray-700">{CONFIG.role}</p>
                <p className="mt-1 text-lg sm:text-xl text-gray-700">{CONFIG.certificates}</p>
              </div>
            </div>

            <p className="text-lg text-gray-600 mb-4 sm:pl-[136px]">{CONFIG.tagline}</p>
            <span className="flex items-center gap-1 text-sm text-gray-600 sm:pl-[136px]">
              <MapPin className="h-4 w-4" /> {CONFIG.location}
            </span>

            <div className="flex flex-wrap gap-2 mt-6 sm:justify-start items-center sm:pl-[136px]">
              <a
                href={CONFIG.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group h-10 w-10 rounded-xl grid place-items-center border border-gray-200/80 bg-white/90 text-gray-800 shadow-sm transition-all duration-300 ease-out hover:shadow-lg hover:border-gray-300"
                aria-label="GitHub"
                title="GitHub"
              >
                <span className="h-8 w-8 rounded-lg bg-gray-900 text-white grid place-items-center shadow-sm">
                  <Github className="h-4 w-4" />
                </span>
              </a>

              <a
                href={CONFIG.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group h-10 w-10 rounded-xl grid place-items-center border border-gray-200/80 bg-white/90 text-gray-800 shadow-sm transition-all duration-300 ease-out hover:shadow-lg hover:border-gray-300"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <span className="h-8 w-8 rounded-lg bg-sky-600 text-white grid place-items-center shadow-sm">
                  <Linkedin className="h-4 w-4" />
                </span>
              </a>

              <a
                href={`mailto:${CONFIG.socials.email}`}
                className="group h-10 w-10 rounded-xl grid place-items-center border border-gray-200/80 bg-white/90 text-gray-800 shadow-sm transition-all duration-300 ease-out hover:shadow-lg hover:border-gray-300"
                aria-label="E-Mail"
                title="E-Mail"
              >
                <span className="h-8 w-8 rounded-lg bg-emerald-500 text-white grid place-items-center shadow-sm">
                  <Mail className="h-4 w-4" />
                </span>
              </a>
              <button
                onClick={onShare}
                className="group h-10 w-10 rounded-xl grid place-items-center border border-gray-200/80 bg-white/90 text-gray-700 shadow-sm transition-all duration-300 ease-out hover:shadow-lg hover:border-gray-300"
                aria-label="Seite teilen"
                title="Seite teilen"
              >
                <span className="h-8 w-8 rounded-lg bg-indigo-600 text-white grid place-items-center shadow-sm">
                  <Send className="h-4 w-4" />
                </span>
              </button>
              {shareMsg && <span className="text-xs text-emerald-600 ml-1">{shareMsg}</span>}
            </div>

            <button
              onClick={() => setShowAbout(true)}
              className="absolute bottom-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 bg-[length:200%_100%] text-white text-sm font-semibold shadow-lg transition-[background-position,box-shadow] duration-300 ease-out hover:shadow-xl hover:bg-[position:100%_0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
            >
              Über mich
              <span className="text-base">→</span>
            </button>
            <div ref={projectContactRef} className="absolute bottom-6 right-6">
              <button
                onClick={() => setShowProjectContact((v) => !v)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-gray-800 text-sm font-semibold shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 active:scale-[0.98] ${
                  showProjectContact
                    ? "border-indigo-300 bg-indigo-50/90 shadow-lg"
                    : "border-gray-300 bg-white/95 hover:bg-gray-50"
                }`}
              >
                <Briefcase className="h-4 w-4" />
                Projektanfrage
              </button>
              <AnimatePresence>
                {showProjectContact && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.14, ease: EASE_OUT }}
                    className="absolute right-0 bottom-12 w-64 rounded-xl border border-gray-200 bg-white/95 backdrop-blur p-3 shadow-xl"
                  >
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Kontakt
                    </p>
                    <div className="mt-2 grid gap-2">
                      <a
                        href={projectMailtoHref}
                        className="inline-flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                      >
                        Mail
                        <Mail className="h-4 w-4" />
                      </a>
                      <button
                        onClick={copyContactMail}
                        className="inline-flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                      >
                        E-Mail kopieren
                        {contactMsg ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                      <a
                        href={CONFIG.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                      >
                        LinkedIn Nachricht
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div
            className="absolute inset-0 w-full h-full rounded-3xl bg-white p-8 pb-20 shadow-xl border border-gray-200/50 select-none"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <User className="h-6 w-6 text-indigo-500" />
              Über mich
            </h2>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md ring-1 ring-indigo-200">
                <Image
                  src="/me2.jpg"
                  alt="Portrait"
                  fill
                  className="object-cover select-none"
                  draggable={false}
                />
              </div>
              <div className="text-gray-700 leading-relaxed space-y-3 text-sm">
                <p>Hi, ich bin Yusa - Platform- und DevOps-Engineer mit Fokus auf robuste, skalierbare Systeme.</p>
                <p>Ich optimiere Plattformen, automatisiere Prozesse und schaffe klare Strukturen, damit Teams effizient liefern können.</p>
                <p>Mein Anspruch: Lösungen, die nicht nur laufen, sondern messbar verbessern - zuverlässig, wartbar und nachhaltig.</p>
              </div>
            </div>

            <button
              onClick={() => setShowAbout(false)}
              className="absolute bottom-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 bg-[length:200%_100%] text-white text-sm font-semibold shadow-lg transition-[background-position,box-shadow] duration-300 ease-out hover:shadow-xl hover:bg-[position:100%_0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
            >
              <span className="text-base">←</span>
              Zurück
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function PortfolioWithBlog() {
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>(
    FEATURED_PROJECTS
  );
  const [showTerminal, setShowTerminal] = useState(false);
  const [copyMsg, setCopyMsg] = useState("");
  const [revealStage, setRevealStage] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "y") {
        e.preventDefault();
        setShowTerminal((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const step1 = window.setTimeout(() => setRevealStage(1), 300);
    const step2 = window.setTimeout(() => setRevealStage(2), 560);
    const step3 = window.setTimeout(() => setRevealStage(3), 780);
    return () => {
      window.clearTimeout(step1);
      window.clearTimeout(step2);
      window.clearTimeout(step3);
    };
  }, []);

  const sharePage = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${window.location.pathname}`;
    const title = document.title || "Portfolio";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // fallback to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopyMsg("Link kopiert");
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopyMsg("Link kopiert");
    }
    window.setTimeout(() => setCopyMsg(""), 2000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      FEATURED_PROJECTS.map(async (project) => {
        try {
          const res = await fetch(
            `/api/github?repo=${encodeURIComponent(project.repo)}`,
            { cache: "no-store" }
          );
          if (!res.ok) return project;
          const data: RepoSummary = await res.json();
          return {
            ...project,
            description: data.description || "Keine Beschreibung vorhanden.",
            language: data.language || undefined,
            topics: Array.isArray(data.topics) ? data.topics : undefined,
          };
        } catch {
          return project;
        }
      })
    ).then((list) => {
      if (!cancelled) setFeaturedProjects(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <main className="relative min-h-screen">
        <section id="home" className="pb-8 sm:pt-30 pt-20 scroll-mt-24">
          <div className="mx-auto max-w-6xl px-4 py-1 overflow-hidden relative">
            <TechStackMarquee enabled={revealStage >= 1} />
          </div>
          <motion.div
            className="mx-auto max-w-6xl px-4 pt-8"
            initial={{ opacity: 0, y: 14 }}
            animate={revealStage >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.26, ease: EASE_OUT }}
          >
            <HeroCard onShare={sharePage} shareMsg={copyMsg} />
          </motion.div>
        </section>

        <motion.section
          className="py-6 max-w-6xl mx-auto px-4"
          initial={{ opacity: 0, y: 14 }}
          animate={revealStage >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.26, delay: 0.03, ease: EASE_OUT }}
        >
          <motion.div
            {...fadeUp(0.05)}
            className="rounded-3xl bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 p-[1px] shadow-xl"
          >
            <div className="rounded-3xl bg-white/95 p-4 sm:p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-indigo-600">
                Neuigkeiten
              </p>
              <p className="mt-2 text-sm text-gray-700 max-w-4xl">
                Bald werde ich hier regelmäßig Beiträge posten. Schaut gerne wieder rein, dort teile ich meine Gedanken und Erfahrungen.
              </p>
              <div className="mt-3">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold bg-gray-900 text-white transition hover:bg-gray-800"
                >
                  Zum Blog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {revealStage >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
          >
        <section id="career" className="py-8 max-w-6xl mx-auto px-4 scroll-mt-24">
          <button
            onClick={() => scrollToSection("career")}
            className="mb-6 inline-flex items-center gap-2 text-3xl font-bold text-left cursor-pointer"
          >
            <Briefcase className="h-6 w-6 text-indigo-500" />
            Karriere
          </button>
          <div className="space-y-6">
            {CAREER.map((step, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.05)}
                className="rounded-2xl bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl p-5 shadow-xl border border-gray-200/70"
              >
                {step.year.includes("heute") && (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 pb-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Aktuell
                  </span>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {step.role} @{step.company}
                    </h3>
                    <p className="text-sm text-gray-500">{step.year}</p>
                  </div>

                  {step.logo && (
                    <a
                      href={step.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-transform hover:scale-105"
                      style={{ minHeight: "40px" }}
                    >
                      <Image src={step.logo} alt={`${step.company} Logo`} width={80} height={40} />
                    </a>
                  )}
                </div>

                <p className="mt-3 text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="certifications" className="py-8 max-w-6xl mx-auto px-4 scroll-mt-24">
          <button
            onClick={() => scrollToSection("certifications")}
            className="mb-6 inline-flex items-center gap-2 text-3xl font-bold text-left cursor-pointer"
          >
            <Star className="h-6 w-6 text-emerald-500" />
            Zertifizierungen
          </button>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CERTIFICATIONS.map((cert) => (
              <motion.a
                key={cert.name}
                {...fadeUp(0.05)}
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 ease-out hover:shadow-2xl hover:scale-[1.02] border border-gray-200/70"
              >
                <h3 className="font-semibold leading-snug text-lg">{cert.name}</h3>
                <p className="text-sm text-gray-600 mt-2">Zertifikat ansehen →</p>
              </motion.a>
            ))}
          </div>
        </section>

        <section id="projects" className="py-8 max-w-6xl mx-auto px-4 scroll-mt-24">
          <button
            onClick={() => scrollToSection("projects")}
            className="mb-6 inline-flex items-center gap-2 text-3xl font-bold text-left cursor-pointer"
          >
            <GitBranch className="h-6 w-6 text-indigo-500" />
            Projekte
          </button>

          <div className="mb-10">
            <p className="text-sm text-gray-600 mb-4">Ausgewählte Projekte</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <motion.a
                  key={project.url}
                  {...fadeUp(0.05)}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 ease-out hover:shadow-2xl hover:scale-[1.02] border border-gray-200/70"
                >
                  <h3 className="font-semibold line-clamp-1 text-lg">{project.name}</h3>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                    {project.description || "Lade Beschreibung…"}
                  </p>
                  {(project.language || project.topics?.length) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.language && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-white/80 border border-gray-200/70 rounded-full px-2 py-1">
                          <span className="h-2 w-2 rounded-full bg-gray-400" />
                          {project.language}
                        </span>
                      )}
                      {project.topics?.map((topic) => (
                        <span
                          key={topic}
                          className="inline-flex items-center text-xs text-gray-600 bg-white/80 border border-gray-200/70 rounded-full px-2 py-1"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-3">GitHub →</p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
          </motion.div>
        )}

        <TerminalEasterEgg visible={showTerminal} onClose={() => setShowTerminal(false)} />
      </main>
    </>
  );
}
