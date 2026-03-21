export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "resource-action-operator",
    title: "Resource Action Operator",
    excerpt:
      "Ein Einblick in meinen ersten nutzbaren Kubernetes-Operator, der auf Ressourcenereignisse reagiert und definierte Aktionen ausführt.",
    publishedAt: "21. März 2026",
    readTime: "4 Min.",
    tags: ["Kubernetes", "Operator", "Go", "Automation"],
  },
];
