import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Yusa Özdemir",
  description: "Praktische Beiträge zu Plattform-Engineering, Kubernetes, GitOps und Observability.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | Yusa Özdemir",
    description: "Praktische Beiträge zu Plattform-Engineering, Kubernetes, GitOps und Observability.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}

