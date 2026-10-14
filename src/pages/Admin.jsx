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
import {
  Users,
  Briefcase,
  BookOpen,
  Calendar,
  UserPlus,
  Lock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import EntityManager from "@/components/admin/EntityManager";
import { cn } from "@/lib/utils";

const TABS = [
  {
    id: "committee",
    label: "Committee",
    icon: Users,
    entity: "CommitteeMember",
    titleField: "name",
  },
  {
    id: "jobs",
    label: "Jobs",
    icon: Briefcase,
    entity: "Job",
    titleField: "title",
  },
  {
    id: "articles",
    label: "Articles",
    icon: BookOpen,
    entity: "Article",
    titleField: "title",
  },
  {
    id: "events",
    label: "Events",
    icon: Calendar,
    entity: "CommunityEvent",
    titleField: "title",
  },
  { id: "membership", label: "Membership", icon: UserPlus, entity: null },
];

const FIELD_CONFIGS = {
  CommitteeMember: [
    { name: "name", label: "Full Name", type: "text" },
    { name: "designation", label: "Designation", type: "text" },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: [
        "Executive Committee",
        "Core Committee",
        "Department Heads",
        "Committee Member",
      ],
    },
    { name: "bio", label: "Biography", type: "textarea" },
    { name: "responsibilities", label: "Responsibilities", type: "textarea" },
    { name: "background", label: "Professional Background", type: "textarea" },
    { name: "linkedin_url", label: "LinkedIn URL", type: "text" },
    { name: "github_url", label: "GitHub URL", type: "text" },
    { name: "website_url", label: "Website URL", type: "text" },
    { name: "other_socials", label: "Other Socials", type: "textarea" },
    { name: "display_order", label: "Display Order", type: "number" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["current", "former"],
    },
    { name: "tenure", label: "Tenure", type: "text" },
    { name: "featured", label: "Featured", type: "boolean" },
    { name: "published", label: "Published", type: "boolean" },
  ],
  Job: [
    { name: "title", label: "Job Title", type: "text" },
    { name: "company", label: "Company", type: "text" },
    { name: "company_logo", label: "Company Logo URL", type: "text" },
    { name: "location", label: "Location", type: "text" },
    {
      name: "employment_type",
      label: "Employment Type",
      type: "select",
      options: ["Full-time", "Part-time", "Contract", "Internship"],
    },
    {
      name: "work_arrangement",
      label: "Work Arrangement",
      type: "select",
      options: ["On-site", "Hybrid", "Remote"],
    },
    {
      name: "experience_level",
      label: "Experience Level",
      type: "select",
      options: ["Entry", "Junior", "Mid", "Senior", "Lead", "Manager"],
    },
    { name: "salary", label: "Salary", type: "text" },
    { name: "skills", label: "Skills", type: "array" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "responsibilities", label: "Responsibilities", type: "textarea" },
    { name: "requirements", label: "Requirements", type: "textarea" },
    { name: "application_url", label: "Application URL", type: "text" },
    { name: "deadline", label: "Application Deadline", type: "date" },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: [
        "Software Engineering",
        "AI and Data",
        "Cybersecurity",
        "Cloud and DevOps",
        "IT Support",
        "Product",
        "QA",
        "Design",
        "Technology Consulting",
      ],
    },
    { name: "posted_date", label: "Date Posted", type: "date" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["active", "archived", "expired"],
    },
  ],
  Article: [
    { name: "title", label: "Title", type: "text" },
    { name: "excerpt", label: "Excerpt", type: "textarea" },
    { name: "content", label: "Content", type: "textarea" },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: [
        "Technology",
        "Career Development",
        "Industry Insights",
        "Tutorials",
        "Community News",
      ],
    },
    { name: "tags", label: "Tags", type: "array" },
    { name: "author", label: "Author", type: "text" },
    { name: "published_date", label: "Publication Date", type: "date" },
    { name: "featured", label: "Featured", type: "boolean" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["published", "draft"],
    },
  ],
  CommunityEvent: [
    { name: "title", label: "Event Title", type: "text" },
    { name: "date", label: "Event Date", type: "date" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "location", label: "Location", type: "text" },
    {
      name: "format",
      label: "Format",
      type: "select",
      options: ["In-person", "Online", "Hybrid"],
    },
    { name: "registration_info", label: "Registration Info", type: "textarea" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: ["upcoming", "past"],
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: [
        "Networking Meetup",
        "Knowledge Sharing",
        "Career Development",
        "Technical Workshop",
        "Community Announcement",
      ],
    },
  ],
};

export default function Admin() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState("committee");

  useEffect(() => {
    (async () => {
      try {
        const me = await db.auth.me();
        setUser(me);
      } catch {
        setUser(null);
      }
      setChecking(false);
    })();
  }, []);

  if (checking) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="h-64 rounded-3xl border border-border bg-card animate-pulse" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
        <div className="h-14 w-14 mx-auto grid place-items-center rounded-2xl border border-border bg-card text-muted-foreground">
          <Lock className="h-7 w-7" />
        </div>
        <h1 className="mt-5 font-heading text-2xl font-bold text-foreground">
          Admin Access Required
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto">
          This area is restricted to authorized administrators. You need to be
          signed in with an admin account to manage content.
        </p>
      </div>
    );
  }

  const activeTabConfig = TABS.find((t) => t.id === activeTab);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-card/30 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Content Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage committee members, jobs, articles, events, and membership
            requests.
          </p>
        </div>
      </section>

      {/* Tabs + content */}
      <section className="bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                <tab.icon className="h-4 w-4" /> {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "membership" ? (
            <MembershipReview />
          ) : (
            <EntityManager
              entityName={activeTabConfig.entity}
              fields={FIELD_CONFIGS[activeTabConfig.entity]}
              label={activeTabConfig.label}
              titleField={activeTabConfig.titleField}
            />
          )}
        </div>
      </section>
    </div>
  );
}

function MembershipReview() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await db.entities.MembershipRequest.list({
        sort: "-created_date",
        limit: 100,
      });
      setRequests(res.items || []);
    } catch {
      setRequests([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await db.entities.MembershipRequest.update(id, { review_status: status });
      await load();
    } catch (e) {
      alert("Error updating: " + (e.message || "Unknown error"));
    }
  };

  if (loading)
    return (
      <div className="h-64 rounded-2xl border border-border bg-card animate-pulse" />
    );

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No membership requests yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {requests.map((req) => (
        <div
          key={req.id}
          className="rounded-2xl border border-border bg-card overflow-hidden"
        >
          <div className="flex items-center justify-between gap-4 p-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground truncate">
                  {req.full_name}
                </p>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    req.review_status === "pending"
                      ? "bg-muted text-muted-foreground"
                      : req.review_status === "approved"
                        ? "bg-accent/10 text-accent"
                        : "bg-destructive/10 text-destructive",
                  )}
                >
                  {req.review_status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {req.email} · {req.location} · {req.professional_status}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setExpanded(expanded === req.id ? null : req.id)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                {expanded === req.id ? "Hide" : "Details"}
              </button>
              {req.review_status !== "approved" && (
                <button
                  onClick={() => updateStatus(req.id, "approved")}
                  className="h-8 w-8 grid place-items-center rounded-lg border border-accent/30 text-accent hover:bg-accent/5 transition-colors"
                  title="Approve"
                >
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              )}
              {req.review_status !== "rejected" && (
                <button
                  onClick={() => updateStatus(req.id, "rejected")}
                  className="h-8 w-8 grid place-items-center rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/5 transition-colors"
                  title="Reject"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {expanded === req.id && (
            <div className="border-t border-border bg-muted/20 p-4 space-y-2 text-sm">
              {req.company_or_university && (
                <Detail
                  label="Company/University"
                  value={req.company_or_university}
                />
              )}
              {req.role_or_year && (
                <Detail label="Role/Year" value={req.role_or_year} />
              )}
              {req.specialization && (
                <Detail label="Specialization" value={req.specialization} />
              )}
              {req.linkedin_url && (
                <Detail label="LinkedIn" value={req.linkedin_url} link />
              )}
              {req.reason && <Detail label="Reason" value={req.reason} />}
              <Detail
                label="Privacy Consent"
                value={req.privacy_consent ? "Yes" : "No"}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Detail({ label, value, link }) {
  return (
    <div className="flex gap-3">
      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground/70 w-32 shrink-0 pt-0.5">
        {label}
      </span>
      {link ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline break-all"
        >
          {value}
        </a>
      ) : (
        <span className="text-foreground/90 break-words">{value}</span>
      )}
    </div>
  );
}
