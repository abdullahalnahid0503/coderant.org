import React from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import Pill from "../Pill";
import { cn } from "@/lib/utils";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ArticleCard({
  article,
  featured = false,
  className = "",
}) {
  if (featured) {
    return (
      <Link
        to={`/rantgpt/${article.id}`}
        className={cn(
          "group flex flex-col rounded-3xl border border-border bg-card p-8 hover:border-primary/40 hover:shadow-xl transition-all duration-300",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <Pill variant="primary">{article.category}</Pill>
          {article.featured && <Pill variant="accent">Featured</Pill>}
        </div>
        <h3 className="mt-5 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground line-clamp-3">
            {article.excerpt}
          </p>
        )}
        <div className="mt-6 pt-6 border-t border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {article.author && (
              <span className="font-medium text-foreground/80">
                {article.author}
              </span>
            )}
            {article.published_date && (
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />{" "}
                {formatDate(article.published_date)}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
            Read Article <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/rantgpt/${article.id}`}
      className={cn(
        "group flex flex-col rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-lg transition-all duration-300",
        className,
      )}
    >
      <Pill variant="primary">{article.category}</Pill>
      <h3 className="mt-4 font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
        {article.title}
      </h3>
      {article.excerpt && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {article.excerpt}
        </p>
      )}
      <div className="mt-4 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium text-foreground/70">
          {article.author || "CodeRant"}
        </span>
        {article.published_date && (
          <span>{formatDate(article.published_date)}</span>
        )}
      </div>
    </Link>
  );
}
