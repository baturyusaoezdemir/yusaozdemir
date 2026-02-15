"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Search } from "lucide-react";
import { BLOG_POSTS } from "@/data/blogPosts";

const card = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, delay: i * 0.04, ease: "easeOut" },
  }),
};

const PAGE_SIZE = 20;

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [showArticles, setShowArticles] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return BLOG_POSTS;
    return BLOG_POSTS.filter((post) => {
      const haystack = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowArticles(true), 140);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query]);

  useEffect(() => {
    if (!showArticles) return;
    const node = loadMoreRef.current;
    if (!node) return;
    const hasMore = visibleCount < filteredPosts.length;
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredPosts.length));
        }
      },
      { rootMargin: "180px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [showArticles, visibleCount, filteredPosts.length]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMorePosts = visibleCount < filteredPosts.length;
  const hasPosts = BLOG_POSTS.length > 0;

  return (
    <>
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-3 sm:px-6">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="mb-8"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-600">Blog</p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold text-gray-900">Tech-Beiträge</h1>
            <p className="mt-3 max-w-3xl text-gray-700">
              Praktische Artikel zu Plattform-Engineering, Kubernetes, GitOps und Observability.
            </p>
            {hasPosts && (
              <div className="mt-5 max-w-md relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Beiträge durchsuchen..."
                  className="w-full rounded-xl border border-gray-200 bg-white/90 py-2.5 pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            )}
            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Zur Startseite
            </Link>
          </motion.section>

          <section className="pt-1">
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-600">Beiträge</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">Alle Artikel</h2>
            {!hasPosts && (
              <div className="mt-6 rounded-2xl border border-gray-200/70 bg-white/80 p-5 text-sm text-gray-600">
                Bald kommen die ersten Beiträge.
              </div>
            )}
            {!showArticles && hasPosts && (
              <div className="mt-6 rounded-2xl border border-gray-200/70 bg-white/80 p-5 text-sm text-gray-600">
                Beiträge werden geladen...
              </div>
            )}

            {showArticles && hasPosts && (
              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visiblePosts.map((post, idx) => (
                  <motion.article
                    key={post.slug}
                    variants={card}
                    initial="hidden"
                    animate="show"
                    custom={idx}
                    className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200/70"
                  >
                    <p className="text-xs text-gray-500">{post.publishedAt} · {post.readTime}</p>
                    <h3 className="mt-2 text-xl font-bold text-gray-900 leading-tight">{post.title}</h3>
                    <p className="mt-3 text-sm text-gray-700">{post.excerpt}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Beitrag lesen
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}

            {showArticles && hasPosts && filteredPosts.length === 0 && (
              <p className="mt-6 text-sm text-gray-600">Keine Beiträge für deine Suche gefunden.</p>
            )}

            {showArticles && hasPosts && hasMorePosts && <div ref={loadMoreRef} className="h-10" />}
          </section>
        </div>
      </main>
    </>
  );
}
