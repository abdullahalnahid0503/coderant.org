import React, { useState } from "react";
import {
  Mail,
  Send,
  CheckCircle2,
  Facebook,
  Instagram,
  Linkedin,
  MessageSquare,
} from "lucide-react";

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/CodeRantMY",
    icon: Facebook,
    description: "Follow us on Facebook",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: Instagram,
    description: "Follow us on Instagram",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/code-rant/posts/?feedView=all",
    icon: Linkedin,
    description: "Connect with us professionally",
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const validate = () => {
    const e = {};

    if (!form.name.trim()) {
      e.name = "Name is required";
    }

    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email";
    }

    if (!form.subject.trim()) {
      e.subject = "Subject is required";
    }

    if (!form.message.trim()) {
      e.message = "Message is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (!validate()) return;

    setStatus("submitting");

    try {
      // Uses the existing Base44 database integration.
      const db = globalThis.__B44_DB__ || {
        entities: new Proxy(
          {},
          {
            get: () => ({
              create: async () => {
                throw new Error("Contact message service is not configured.");
              },
            }),
          },
        ),
      };

      await db.entities.ContactMessage.create(form);

      setStatus("success");
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setStatus("error");
    }
  };

  const update = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-dot-grid opacity-40" />

        <div className="relative mx-auto max-w-4xl px-4 pb-12 pt-12 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5">
            <Mail className="h-3.5 w-3.5 text-primary" />

            <span className="font-mono text-xs text-muted-foreground">
              Contact
            </span>
          </div>

          <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Get in <span className="text-gradient-brand">Touch</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Have a question or want to learn more about CodeRant? We'd love to
            hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-5">
            {/* Social Links and Invitation Box */}
            <div className="lg:col-span-2">
              <h2 className="font-heading text-xl font-bold text-foreground">
                Connect with us
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Whether you're interested in joining the community, posting a
                job opportunity, or collaborating on an initiative, reach out
                and we'll get back to you.
              </p>

              <div className="mt-8 space-y-3">
                {/* Social Media Links */}
                {SOCIAL_LINKS.map(
                  ({ label, href, icon: Icon, description }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} - opens in a new tab`}
                      className="group flex items-center gap-3 rounded-2xl border border-border bg-background p-4 transition-all duration-200 hover:border-primary/40 hover:bg-card"
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {label}
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    </a>
                  ),
                )}

                {/* Existing Community Invitation Box */}
                <div className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <MessageSquare className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      Community
                    </p>

                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Invite-only - apply via the Join page
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl border border-border bg-background p-6 sm:p-8">
                {status === "success" ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>

                    <h3 className="mt-5 font-heading text-xl font-bold text-foreground">
                      Message sent!
                    </h3>

                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                      Thank you for reaching out. We'll get back to you as soon
                      as possible.
                    </p>

                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="mt-6 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-5"
                  >
                    {/* Name and Email */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Name
                        </label>

                        <input
                          id="contact-name"
                          type="text"
                          autoComplete="name"
                          value={form.name}
                          onChange={update("name")}
                          aria-invalid={!!errors.name}
                          aria-describedby={
                            errors.name ? "contact-name-error" : undefined
                          }
                          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="Your name"
                        />

                        {errors.name && (
                          <p
                            id="contact-name-error"
                            className="mt-1 text-xs text-destructive"
                          >
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="mb-1.5 block text-sm font-medium text-foreground"
                        >
                          Email
                        </label>

                        <input
                          id="contact-email"
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={update("email")}
                          aria-invalid={!!errors.email}
                          aria-describedby={
                            errors.email ? "contact-email-error" : undefined
                          }
                          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          placeholder="you@example.com"
                        />

                        {errors.email && (
                          <p
                            id="contact-email-error"
                            className="mt-1 text-xs text-destructive"
                          >
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                      >
                        Subject
                      </label>

                      <input
                        id="contact-subject"
                        type="text"
                        value={form.subject}
                        onChange={update("subject")}
                        aria-invalid={!!errors.subject}
                        aria-describedby={
                          errors.subject ? "contact-subject-error" : undefined
                        }
                        className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="What's this about?"
                      />

                      {errors.subject && (
                        <p
                          id="contact-subject-error"
                          className="mt-1 text-xs text-destructive"
                        >
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="mb-1.5 block text-sm font-medium text-foreground"
                      >
                        Message
                      </label>

                      <textarea
                        id="contact-message"
                        rows={5}
                        value={form.message}
                        onChange={update("message")}
                        aria-invalid={!!errors.message}
                        aria-describedby={
                          errors.message ? "contact-message-error" : undefined
                        }
                        className="w-full resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Your message..."
                      />

                      {errors.message && (
                        <p
                          id="contact-message-error"
                          className="mt-1 text-xs text-destructive"
                        >
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Error Message */}
                    {status === "error" && (
                      <div
                        role="alert"
                        className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                      >
                        Something went wrong. Please try again later.
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {status === "submitting" ? "Sending..." : "Send Message"}

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
