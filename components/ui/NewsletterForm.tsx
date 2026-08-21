"use client";

import { useState, type FormEvent } from "react";

import { ArrowRight, CheckCircle2 } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) return; // silently drop bot submissions

    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "Could not subscribe. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setError(null);
      setEmail("");
    } catch {
      setError(
        "Could not subscribe. Please check your connection and try again.",
      );
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2.5 rounded-lg border border-salt-pink/30 bg-salt-pink/10 px-4 py-3 text-sm text-cream">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-salt-pink" />
        <span>Thank you for subscribing! We&apos;ll keep you updated.</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-2 sm:flex-row sm:items-start"
    >
      <div className="flex-1">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Enter your email address"
          className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-cream placeholder:text-cream/50 transition-colors focus:border-salt-pink focus:bg-white/15 focus:outline-none focus:ring-1 focus:ring-salt-pink"
          aria-invalid={status === "error"}
          aria-describedby={error ? "newsletter-error" : undefined}
        />
        {/* Honeypot field, hidden from real users */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        {error && (
          <p id="newsletter-error" className="mt-1.5 text-xs text-salt-pink">
            {error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="group inline-flex items-center justify-center gap-2 rounded-md bg-salt-pink px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-charcoal transition-all duration-300 hover:bg-cream hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span>{submitting ? "Subscribing…" : "Subscribe"}</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}
