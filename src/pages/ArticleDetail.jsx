const db = globalThis.__B44_DB__ || {
  auth: { isAuthenticated: async () => false, me: async () => null },
  entities: new Proxy(
    {},
    {
      get: () => ({
        filter: async () => [],
        get: async () => null,
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
      }),
    },
  ),
  integrations: { Core: { UploadFile: async () => ({ file_url: "" }) } },
};

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

import Pill from "@/components/Pill";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await db.entities.Article.get(id);
        setArticle(res);
      } catch {
        setArticle(null);
      }
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <div className="h-96 rounded-3xl border border-border bg-card animate-pulse" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Article not found
        </h1>
        <Link
          to="/rantgpt"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to RantGPT
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-card/30 border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <Link
            to="/rantgpt"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to RantGPT
          </Link>

          <div className="mt-8">
            <Pill variant="primary">{article.category}</Pill>
            <h1 className="mt-4 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {article.excerpt}
              </p>
            )}

            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              {article.author && (
                <span className="font-medium text-foreground/80">
                  {article.author}
                </span>
              )}
              {article.published_date && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />{" "}
                  {formatDate(article.published_date)}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="prose-content">
            <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-line">
              {article.content}
            </p>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70">
                  Tags
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, i) => (
                  <Pill key={i}>{tag}</Pill>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
