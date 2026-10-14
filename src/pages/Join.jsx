const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, UserCheck, Lock } from 'lucide-react';

const PROFESSIONAL_STATUSES = [
  'IT Professional',
  'Technology Entrepreneur',
  'Student (4th year+ Bachelors)',
  'Student (Postgraduate)',
];

const ELIGIBILITY = [
  'Bangladeshi nationals',
  'Living in Malaysia at the time of joining',
  'IT professionals or technology entrepreneurs',
  'IT students in 4th year of bachelor\'s degree or above',
];

export default function Join() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    location: '',
    professional_status: 'IT Professional',
    company_or_university: '',
    role_or_year: '',
    specialization: '',
    linkedin_url: '',
    reason: '',
    privacy_consent: false,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.location.trim()) e.location = 'Current location is required';
    if (!form.privacy_consent) e.privacy_consent = 'You must consent to the privacy policy';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      await db.entities.MembershipRequest.create({
        ...form,
        review_status: 'pending',
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: value });
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col">
        <section className="bg-background">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
            <div className="h-16 w-16 mx-auto grid place-items-center rounded-2xl bg-accent/10 text-accent">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mt-6 font-heading text-3xl font-bold text-foreground">Application submitted!</h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Thank you for your interest in joining CodeRant. Your application has been received and will be reviewed by our administrators. We'll reach out if your profile matches our community.
            </p>
            <div className="mt-8 rounded-2xl border border-border bg-card p-5 text-left">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  CodeRant is invite-only. Submitting this form does not guarantee membership. All applications are reviewed before admission decisions are made.
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Back to Home <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-background overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-40" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5">
            <span className="text-xs font-mono text-muted-foreground">Membership</span>
          </div>
          <h1 className="mt-6 font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Join{' '}
            <span className="text-gradient-brand">CodeRant</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            CodeRant is an invite-only community. Learn about eligibility and submit your interest below.
          </p>
        </div>
      </section>

      {/* Eligibility */}
      <section className="bg-card/30 border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">Who can join?</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                CodeRant is invite-only and membership is subject to the community's admission process. To be eligible, applicants must meet all of the following criteria:
              </p>
            </div>
            <div className="space-y-2.5">
              {ELIGIBILITY.map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-background p-3.5">
                  <UserCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/90">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="font-heading text-xl font-bold text-foreground">Membership Interest Form</h2>
            <p className="mt-2 text-sm text-muted-foreground">Fill in your details below. All fields marked with * are required.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name *" error={errors.full_name}>
                  <input type="text" value={form.full_name} onChange={update('full_name')} className="input-base" placeholder="Your full name" />
                </Field>
                <Field label="Email Address *" error={errors.email}>
                  <input type="email" value={form.email} onChange={update('email')} className="input-base" placeholder="you@example.com" />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Current Malaysian Location *" error={errors.location}>
                  <input type="text" value={form.location} onChange={update('location')} className="input-base" placeholder="e.g. Kuala Lumpur" />
                </Field>
                <Field label="Professional / Student Status">
                  <select value={form.professional_status} onChange={update('professional_status')} className="input-base">
                    {PROFESSIONAL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Company or University">
                  <input type="text" value={form.company_or_university} onChange={update('company_or_university')} className="input-base" placeholder="Where do you work or study?" />
                </Field>
                <Field label="Current Role or Year of Study">
                  <input type="text" value={form.role_or_year} onChange={update('role_or_year')} className="input-base" placeholder="e.g. Senior Engineer, 4th Year" />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Technology Specialization">
                  <input type="text" value={form.specialization} onChange={update('specialization')} className="input-base" placeholder="e.g. Backend, Cloud, Data" />
                </Field>
                <Field label="LinkedIn URL (optional)">
                  <input type="url" value={form.linkedin_url} onChange={update('linkedin_url')} className="input-base" placeholder="https://linkedin.com/in/..." />
                </Field>
              </div>

              <Field label="Reason for Wanting to Join">
                <textarea rows={4} value={form.reason} onChange={update('reason')} className="input-base resize-none" placeholder="Tell us why you'd like to join CodeRant..." />
              </Field>

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.privacy_consent}
                    onChange={update('privacy_consent')}
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <span className="text-sm text-muted-foreground">
                    I consent to CodeRant storing and processing my application data for membership review purposes. *
                  </span>
                </label>
                {errors.privacy_consent && <p className="mt-1 text-xs text-destructive">{errors.privacy_consent}</p>}
              </div>

              {status === 'error' && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  Something went wrong. Please try again later.
                </div>
              )}

              <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Your application will be reviewed by authorized administrators. Submitting does not guarantee membership.
                </p>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}