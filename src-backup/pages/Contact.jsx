const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Linkedin, Github, MessageSquare } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      await db.entities.ContactMessage.create(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-background overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-40" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-12 pb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5">
            <span className="text-xs font-mono text-muted-foreground">Contact</span>
          </div>
          <h1 className="mt-6 font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Get in{' '}
            <span className="text-gradient-brand">Touch</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Have a question or want to learn more about CodeRant? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-card/30 border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Info */}
            <div className="lg:col-span-2">
              <h2 className="font-heading text-xl font-bold text-foreground">Connect with us</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Whether you're interested in joining the community, posting a job opportunity, or collaborating on an initiative, reach out and we'll get back to you.
              </p>

              <div className="mt-8 space-y-3">
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4 hover:border-primary/40 transition-colors"
                >
                  <div className="h-10 w-10 grid place-items-center rounded-xl bg-primary/10 text-primary">
                    <Linkedin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">LinkedIn</p>
                    <p className="text-xs text-muted-foreground">Connect with our community</p>
                  </div>
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4 hover:border-primary/40 transition-colors"
                >
                  <div className="h-10 w-10 grid place-items-center rounded-xl bg-primary/10 text-primary">
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">GitHub</p>
                    <p className="text-xs text-muted-foreground">Explore our projects</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
                  <div className="h-10 w-10 grid place-items-center rounded-xl bg-primary/10 text-primary">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Community</p>
                    <p className="text-xs text-muted-foreground">Invite-only - apply via the Join page</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl border border-border bg-background p-6 sm:p-8">
                {status === 'success' ? (
                  <div className="flex flex-col items-center justify-center text-center py-12">
                    <div className="h-14 w-14 grid place-items-center rounded-2xl bg-accent/10 text-accent">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 font-heading text-xl font-bold text-foreground">Message sent!</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-6 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={update('name')}
                          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                          placeholder="Your name"
                        />
                        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={update('email')}
                          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                          placeholder="you@example.com"
                        />
                        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={update('subject')}
                        className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                        placeholder="What's this about?"
                      />
                      {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                      <textarea
                        rows={5}
                        value={form.message}
                        onChange={update('message')}
                        className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
                        placeholder="Your message..."
                      />
                      {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                    </div>

                    {status === 'error' && (
                      <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                        Something went wrong. Please try again later.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {status === 'submitting' ? 'Sending...' : 'Send Message'}
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}