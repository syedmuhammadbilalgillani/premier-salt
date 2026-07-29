"use client";

import { useState, type FormEvent } from "react";
import { readStorage, writeStorage } from "@/lib/storage";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (honeypot) return; // silently drop bot submissions

    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email address.");
      setStatus("error");
      return;
    }

    const list = readStorage<string[]>("premierSalt.newsletter", []);
    if (list.includes(email.toLowerCase())) {
      setError("This email is already subscribed.");
      setStatus("error");
      return;
    }

    writeStorage("premierSalt.newsletter", [...list, email.toLowerCase()]);
    setStatus("success");
    setError(null);
    setEmail("");
  }

  if (status === "success") {
    return (
      <p className="text-sm text-salt-pink">
        You're subscribed. Thank you for following Premier Salt.
      </p>
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
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full rounded-sm border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-cream placeholder:text-cream/40 focus-visible:outline-terracotta"
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
        className="rounded-sm bg-terracotta px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-cream hover:bg-salt-pink"
      >
        Subscribe
      </button>
    </form>
  );
}
