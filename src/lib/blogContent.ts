import { access, readFile } from "node:fs/promises";
import path from "node:path";
import Asciidoctor from "asciidoctor";
import { marked } from "marked";

type BlogFormat = "markdown" | "asciidoc";

export type BlogSource = {
  content: string;
  format: BlogFormat;
  filename: string;
};

const BLOG_DIR = path.join(process.cwd(), "public", "blog");
const BLOG_EXTENSIONS = [".md", ".markdown", ".adoc", ".asciidoc", ".asc"] as const;
const asciidoctor = Asciidoctor();

function formatFromExtension(ext: string): BlogFormat {
  return ext === ".md" || ext === ".markdown" ? "markdown" : "asciidoc";
}

export async function getBlogSourceBySlug(slug: string): Promise<BlogSource | null> {
  for (const ext of BLOG_EXTENSIONS) {
    const filename = `${slug}${ext}`;
    const filePath = path.join(BLOG_DIR, filename);
    try {
      await access(filePath);
      const content = await readFile(filePath, "utf-8");
      return {
        content,
        filename,
        format: formatFromExtension(ext),
      };
    } catch {
      // try next extension
    }
  }
  return null;
}

export async function renderBlogHtml(source: BlogSource): Promise<string> {
  if (source.format === "markdown") {
    return marked.parse(source.content, {
      gfm: true,
      breaks: true,
      async: false,
    }) as string;
  }

  return asciidoctor.convert(source.content, {
    safe: "safe",
    standalone: false,
    attributes: {
      showtitle: true,
      icons: "font",
      toc: "left",
      sourceHighlighter: "highlight.js",
    },
  }) as string;
}
