import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BLOG_POSTS } from "@/data/blogPosts";
import { getBlogSourceBySlug, renderBlogHtml } from "@/lib/blogContent";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((entry) => entry.slug === slug);
  const source = await getBlogSourceBySlug(slug);

  if (!post || !source) {
    notFound();
  }

  const html = await renderBlogHtml(source);

  return (
    <>
      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="mx-auto max-w-6xl">
          <article className="rounded-3xl bg-slate-900/92 backdrop-blur-xl border border-slate-700/80 p-6 sm:p-10 shadow-2xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück zum Blog
            </Link>

            <header className="mt-5 pb-5 border-b border-slate-700/80">
              <p className="text-xs text-slate-400">
                {post.publishedAt} · {post.readTime} · {source.filename}
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-100">{post.title}</h1>
              <p className="mt-3 text-slate-300">{post.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-slate-700/80 px-2.5 py-1 text-xs text-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <div className="blog-content blog-content-dark mt-8" dangerouslySetInnerHTML={{ __html: html }} />
          </article>
        </div>
      </main>
    </>
  );
}
