import React from 'react';
import { Link } from 'react-router-dom';
import { Target, ListChecks, UserCheck, ShieldCheck, ArrowRight, BookOpen } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

const OBJECTIVES = [
  'Networking among Bangladeshi IT professionals in Malaysia',
  'Career growth and skill development',
  'Knowledge sharing and professional mentorship',
  'Community meetups and career-focused initiatives',
  'Supporting emerging Bangladeshi technology talent',
];

const ELIGIBILITY = [
  'Bangladeshi nationals.',
  'People living in Malaysia at the time of joining.',
  'IT professionals, including technology professionals, product technology professionals, and technology entrepreneurs.',
  'IT students in the fourth year of a bachelor\'s degree or above.',
];

const TIMELINE = [
  { year: '2017', title: 'The Beginning', desc: 'CodeRant starts as an invite-only WhatsApp group connecting Bangladeshi tech professionals in Malaysia.' },
  { year: '2018–2020', title: 'Growing Roots', desc: 'The community expands through informal meetups and knowledge sharing among early members.' },
  { year: '2021–2023', title: 'Building Structure', desc: 'Formal committee roles are established, and community-driven initiatives gain momentum.' },
  { year: '2024+', title: '300+ Strong', desc: 'CodeRant grows to over 300 members worldwide with diverse technical, leadership, and entrepreneurial backgrounds.' },
];

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-background overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-40" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5">
            <span className="text-xs font-mono text-muted-foreground">About CodeRant</span>
          </div>
          <h1 className="mt-6 font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            A community of Bangladeshi{' '}
            <span className="text-gradient-brand">tech professionals</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Connecting, sharing knowledge, and growing together in Malaysia since 2017.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-card/30 border-y border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
          <div className="space-y-5 text-base sm:text-lg leading-relaxed text-foreground/90">
            <p>
              In Malaysia, CodeRant is a community of Bangladeshi technology professionals. Founded in 2017 as an invite-only WhatsApp group, the community has grown to more than 300 members across Malaysia and beyond.
            </p>
            <p className="text-muted-foreground">
              Our goal is to foster growth among Bangladeshi tech professionals through community-driven initiatives, meetups, and career-focused programs. Our members bring diverse technical, leadership, product, and entrepreneurial experience.
            </p>
            <p className="text-muted-foreground">
              We aim to contribute positively to Malaysia's technology landscape while helping future Bangladeshi technology professionals learn, connect, and grow.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionHeading
                eyebrow="Our Mission"
                title="Connect, support, and share"
              />
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Connect Bangladeshi technology talent, support professional development, and encourage knowledge sharing across our community.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-8">
              <div className="h-12 w-12 grid place-items-center rounded-2xl bg-primary/10 text-primary">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-heading text-xl font-bold text-foreground">What drives us</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                We believe that a strong, connected community amplifies individual growth. By bringing together professionals with shared roots and shared ambitions, we create opportunities for mentorship, collaboration, and collective advancement in Malaysia's technology sector.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="bg-card/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <SectionHeading
            eyebrow="Our Objectives"
            title="What we work toward"
            align="center"
          />
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {OBJECTIVES.map((obj, i) => (
              <div key={i} className="flex items-start gap-4 rounded-2xl border border-border bg-background p-5">
                <div className="h-8 w-8 grid place-items-center rounded-lg bg-primary/10 text-primary font-mono text-sm font-bold shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <p className="text-sm leading-relaxed text-foreground/90 pt-1">{obj}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who can join */}
      <section className="bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionHeading
                eyebrow="Who Can Join"
                title="Eligibility for membership"
              />
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                CodeRant is invite-only and membership is subject to the community's admission process. To be eligible, applicants must meet the following criteria:
              </p>
              <Link
                to="/join"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Learn About Membership <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {ELIGIBILITY.map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
                  <UserCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed text-foreground/90">{item}</p>
                </div>
              ))}
              <div className="flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent/5 p-5">
                <ShieldCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed text-foreground/90">
                  <span className="font-semibold">Invite-only:</span> All applications are reviewed by authorized administrators before membership is granted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-card/30 border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <SectionHeading
            eyebrow="Our Journey"
            title="From a group chat to a community"
            align="center"
          />
          <div className="mt-12 space-y-0">
            {TIMELINE.map((item, i) => (
              <div key={i} className="relative flex gap-6 pb-10 last:pb-0">
                {/* Line */}
                {i < TIMELINE.length - 1 && (
                  <div className="absolute left-[15px] top-10 bottom-0 w-px bg-border" />
                )}
                <div className="relative shrink-0">
                  <div className="h-8 w-8 grid place-items-center rounded-full border-2 border-primary bg-card text-primary">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <span className="text-xs font-mono text-primary">{item.year}</span>
                  <h3 className="mt-1 font-heading text-lg font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community guidelines */}
      <section className="bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 text-center">
            <div className="h-12 w-12 mx-auto grid place-items-center rounded-2xl bg-primary/10 text-primary">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-heading text-2xl font-bold text-foreground">Community Guidelines</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-lg mx-auto">
              CodeRant is committed to maintaining a respectful, professional, and supportive environment. All members are expected to follow our community guidelines.
            </p>
            <Link
              to="/guidelines"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
            >
              Read the full guidelines <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}