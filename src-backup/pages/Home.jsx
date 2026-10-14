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
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Users,
  Calendar,
  BookOpen,
  Sparkles,
} from "lucide-react";

import Hero from "@/components/home/Hero";
import SectionHeading from "@/components/SectionHeading";
import JobCard from "@/components/cards/JobCard";
import CommitteeCard from "@/components/cards/CommitteeCard";
import EventCard from "@/components/cards/EventCard";
import ArticleCard from "@/components/cards/ArticleCard";
import EmptyState from "@/components/EmptyState";

export default function Home() {
  const [data, setData] = useState({
    jobs: [],
    members: [],
    events: [],
    articles: [],
    loading: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const [jobsRes, membersRes, eventsRes, articlesRes] = await Promise.all(
          [
            db.entities.Job.filter(
              { status: "active" },
              {
                sort: "-posted_date",
                limit: 4,
                fields: [
                  "title",
                  "company",
                  "location",
                  "employment_type",
                  "work_arrangement",
                  "salary",
                  "skills",
                  "posted_date",
                  "category",
                ],
              },
            ).catch(() => ({ items: [] })),
            db.entities.CommitteeMember.filter(
              { published: true, status: "current", featured: true },
              { sort: "display_order", limit: 4 },
            ).catch(() => ({ items: [] })),
            db.entities.CommunityEvent.filter(
              { status: "upcoming" },
              { sort: "date", limit: 3 },
            ).catch(() => ({ items: [] })),
            db.entities.Article.filter(
              { status: "published" },
              { sort: "-published_date", limit: 3 },
            ).catch(() => ({ items: [] })),
          ],
        );
        setData({
          jobs: jobsRes.items || [],
          members: membersRes.items || [],
          events: eventsRes.items || [],
          articles: articlesRes.items || [],
          loading: false,
        });
      } catch {
        setData({
          jobs: [],
          members: [],
          events: [],
          articles: [],
          loading: false,
        });
      }
    })();
  }, []);

  return (
    <div className="flex flex-col">
      <Hero />

      {/* About preview */}
      <section className="bg-card/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading
                eyebrow="About CodeRant"
                title="A community built on connection, knowledge, and growth"
                description="In Malaysia, CodeRant is a community of Bangladeshi technology professionals. Founded in 2017 as an invite-only WhatsApp group, it has grown to more than 300 members worldwide with diverse backgrounds in software engineering, technology, product development, leadership, and entrepreneurship."
              />
              <Link
                to="/about"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                Learn more about us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: Users,
                  label: "Networking",
                  desc: "Connect with fellow Bangladeshi IT professionals in Malaysia and worldwide.",
                },
                {
                  icon: Briefcase,
                  label: "Career Growth",
                  desc: "Access job opportunities and professional development resources.",
                },
                {
                  icon: BookOpen,
                  label: "Knowledge Sharing",
                  desc: "Learn from peers through mentorship and technical sessions.",
                },
                {
                  icon: Sparkles,
                  label: "Community",
                  desc: "Build meaningful professional and personal connections.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="h-10 w-10 grid place-items-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-sm font-semibold text-foreground">
                    {item.label}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Jobs preview */}
      <section className="bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <SectionHeading
              eyebrow="Career Opportunities"
              title="Discover your next role"
              description="Explore technology roles and career opportunities across Malaysia, shared by and for the community."
            />
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all whitespace-nowrap"
            >
              All jobs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10">
            {data.loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-52 rounded-2xl border border-border bg-card animate-pulse"
                  />
                ))}
              </div>
            ) : data.jobs.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Briefcase}
                title="No active job listings"
                description="There are no approved job openings right now. Check back soon or explore the full job board."
                action={
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                  >
                    Visit Job Board <ArrowRight className="h-4 w-4" />
                  </Link>
                }
              />
            )}
          </div>
        </div>
      </section>

      {/* Community section — dark accent */}
      <section className="relative bg-card border-y border-border overflow-hidden">
        <div className="absolute inset-0 bg-line-grid opacity-30" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Our Community"
                title="More than a network - a professional family"
                description="CodeRant members share knowledge, support each other's career growth, and build meaningful connections that extend beyond the workplace."
              />
            </div>
            <div className="lg:col-span-7">
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    stat: "300+",
                    label: "Active members in Malaysia and beyond",
                  },
                  { stat: "2017", label: "Founded as an invite-only group" },
                  {
                    stat: "Diverse",
                    label: "Software, product, leadership & entrepreneurship",
                  },
                  {
                    stat: "Invite-only",
                    label: "Quality over quantity in membership",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border bg-background p-6"
                  >
                    <p className="font-heading text-3xl font-bold text-gradient-brand">
                      {item.stat}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Committee preview */}
      <section className="bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <SectionHeading
              eyebrow="Leadership"
              title="The people behind CodeRant"
              description="Meet the dedicated individuals who help our community connect, collaborate, and grow."
            />
            <Link
              to="/committee"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all whitespace-nowrap"
            >
              Meet the Committee <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10">
            {data.loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-56 rounded-2xl border border-border bg-card animate-pulse"
                  />
                ))}
              </div>
            ) : data.members.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.members.map((member) => (
                  <CommitteeCard key={member.id} member={member} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="Committee profiles coming soon"
                description="Committee member profiles will appear here once published by administrators."
              />
            )}
          </div>
        </div>
      </section>

      {/* Community activities */}
      <section className="bg-card/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <SectionHeading
              eyebrow="Community Activities"
              title="Meetups, workshops & events"
              description="Stay connected through networking meetups, knowledge sharing sessions, and career development programs."
            />
            <Link
              to="/community"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all whitespace-nowrap"
            >
              All events <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10">
            {data.loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-48 rounded-2xl border border-border bg-card animate-pulse"
                  />
                ))}
              </div>
            ) : data.events.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No upcoming events"
                description="There are no scheduled events at the moment. Check back soon for community meetups and workshops."
              />
            )}
          </div>
        </div>
      </section>

      {/* RantGPT preview */}
      <section className="relative bg-background border-y border-border overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-dot-grid opacity-20" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[40rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-[10%] h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20">
          {/* Section heading */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/80 backdrop-blur px-4 py-2 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
                <span className="relative h-2 w-2 rounded-full bg-accent" />
              </span>

              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                RantGPT · Your AI Assistant
              </span>
            </div>

            <h2 className="mt-7 font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
              Meet <span className="text-gradient-brand">RantGPT</span>
            </h2>

            <div className="mx-auto mt-5 h-px w-40 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              Your AI-powered guide to the CodeRant community and life in
              Malaysia. Get help with career opportunities, community
              membership, work, visas, and everyday questions.
            </p>

            {/* Feature badges */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              {[
                {
                  icon: Sparkles,
                  label: "AI-powered assistance",
                },
                {
                  icon: BookOpen,
                  label: "Community knowledge",
                },
                {
                  icon: Users,
                  label: "Built for our community",
                },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-4 py-2 shadow-sm"
                >
                  <feature.icon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat preview card */}
          <div className="relative max-w-3xl mx-auto mt-12">
            <div className="absolute -inset-1 rounded-[2.2rem] bg-gradient-to-b from-primary/25 via-border to-border blur-[2px]" />
            <div className="absolute -inset-6 rounded-[3rem] bg-primary/5 blur-2xl" />

            <div className="relative rounded-[2rem] p-px bg-gradient-to-b from-primary/40 via-border to-border">
              <div className="rounded-[calc(2rem-1px)] bg-card overflow-hidden shadow-2xl">
                {/* Chat header */}
                <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-elevated/70 backdrop-blur px-4 sm:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-11 w-11 grid place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md shadow-primary/25">
                        <Sparkles className="h-5 w-5" />
                      </div>

                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-accent ring-2 ring-card" />
                    </div>

                    <div>
                      <p className="font-heading text-sm font-semibold text-foreground">
                        RantGPT
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Your CodeRant assistant
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="text-[11px] text-muted-foreground">
                      Ready to help
                    </span>
                  </div>
                </div>

                {/* Welcome message */}
                <div className="px-4 sm:px-6 py-7 sm:py-9">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 shrink-0 grid place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm">
                      <Sparkles className="h-4 w-4" />
                    </div>

                    <div className="max-w-xl rounded-2xl rounded-tl-md border border-border border-l-2 border-l-primary/40 bg-surface-elevated px-4 py-4">
                      <p className="text-sm font-semibold text-foreground">
                        Hello! How can I help you today?
                      </p>

                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Ask me about CodeRant, finding tech jobs in Malaysia,
                        work permits, living costs, or connecting with the
                        community. Let’s find the answers together.
                      </p>
                    </div>
                  </div>

                  {/* Example prompts */}
                  <div className="mt-6 ml-0 sm:ml-12">
                    <p className="mb-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                      Things you can ask
                    </p>

                    <div className="grid sm:grid-cols-2 gap-2">
                      {[
                        "How can I join CodeRant?",
                        "How do I find IT jobs in Malaysia?",
                        "What should I know about work permits?",
                        "What does it cost to live in Malaysia?",
                      ].map((question, index) => (
                        <div
                          key={question}
                          className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-3.5 py-3 text-xs text-muted-foreground"
                        >
                          <span className="font-mono text-[10px] text-primary/70">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="leading-relaxed">{question}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="border-t border-border bg-background px-4 sm:px-6 py-5">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-sm font-semibold text-foreground">
                        Have a question? Start a conversation.
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Your community knowledge assistant is one click away.
                      </p>
                    </div>

                    <Link
                      to="/rantgpt"
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90 hover:shadow-primary/30 transition-all"
                    >
                      Chat with RantGPT
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary link */}
          <div className="mt-8 text-center">
            <Link
              to="/rantgpt"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Explore RantGPT
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Closing CTA — dark accent */}
      <section className="bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5">
            <span className="text-xs font-mono text-muted-foreground">
              Join the community
            </span>
          </div>
          <h2 className="mt-6 font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Your Network. Your Growth.{" "}
            <span className="text-gradient-brand">Our Community.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
            CodeRant is invite-only. Learn about eligibility and the admission
            process to become part of our growing community.
          </p>
          <Link
            to="/join"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity glow-primary"
          >
            Learn About Membership <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
