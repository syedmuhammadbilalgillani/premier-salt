"use client";
import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { company } from "@/data/company";

const departments = [
  "General Enquiry",
  "Export Sales",
  "Private Label",
  "Retail Order",
  "Distributor Enquiry",
  "Product Support",
];

export default function Contact() {
  const [reference, setReference] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypot) return;
    const form = new FormData(e.currentTarget);
    const get = (k: string) => (form.get(k) as string)?.trim() ?? "";

    setSubmitError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          fullName: get("name"),
          email: get("email"),
          phone: get("phone"),
          companyName: get("company"),
          country: get("country"),
          subject: get("subject"),
          message: get("message"),
          details: { department: get("department") },
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setSubmitError(
          data.error || "Could not send your message. Please try again.",
        );
        return;
      }

      setReference(data.data.reference);
    } catch {
      setSubmitError(
        "Could not send your message. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in Touch"
        description="Reach our team for export, wholesale, private-label or retail enquiries."
        crumbs={[{ label: "Contact" }]}
      />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-16 md:grid-cols-2 md:px-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 text-sm">
            <span className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />{" "}
              <span>
                <strong className="text-charcoal">Office:</strong>{" "}
                <span className="text-muted-foreground">{company.office}</span>
              </span>
            </span>
            <span className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />{" "}
              <span>
                <strong className="text-charcoal">Processing Plant:</strong>{" "}
                <span className="text-muted-foreground">{company.plant}</span>
              </span>
            </span>
            <a
              href={`tel:${company.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 hover:text-primary"
            >
              <Phone className="h-4 w-4 text-primary" /> {company.phone}
            </a>
            <a
              href={`https://wa.me/${company.phone.replace(/[^\d]/g, "")}`}
              className="flex items-center gap-3 hover:text-primary"
            >
              <MessageCircle className="h-4 w-4 text-primary" /> WhatsApp Us
            </a>
            <a
              href={`mailto:${company.emails.info}`}
              className="flex items-center gap-3 hover:text-primary"
            >
              <Mail className="h-4 w-4 text-primary" /> {company.emails.info}
            </a>
            <a
              href={`mailto:${company.emails.sales}`}
              className="flex items-center gap-3 hover:text-primary"
            >
              <Mail className="h-4 w-4 text-primary" /> {company.emails.sales}
            </a>
            <p className="text-muted-foreground">
              Business Hours: Monday–Saturday, 9:00 AM – 6:00 PM (PKT)
            </p>
          </div>
          <ImagePlaceholder
            label="Map — Lahore, Pakistan"
            width={800}
            height={500}
          />
        </div>

        <div className="rounded-sm border border-border bg-cream p-8">
          {reference ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="eyebrow">Message Sent</span>
              <p className="font-serif text-2xl text-primary">
                Reference: {reference}
              </p>
              <p className="text-sm text-muted-foreground">
                Our team will respond as soon as possible.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Name" htmlFor="name" required>
                  <input
                    id="name"
                    name="name"
                    required
                    className={inputClasses}
                  />
                </FormField>
                <FormField label="Email" htmlFor="email" required>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={inputClasses}
                  />
                </FormField>
                <FormField label="Phone" htmlFor="phone">
                  <input id="phone" name="phone" className={inputClasses} />
                </FormField>
                <FormField label="Company" htmlFor="company">
                  <input id="company" name="company" className={inputClasses} />
                </FormField>
                <FormField label="Country" htmlFor="country">
                  <input id="country" name="country" className={inputClasses} />
                </FormField>
                <FormField label="Department" htmlFor="department" required>
                  <select
                    id="department"
                    name="department"
                    required
                    className={inputClasses}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select department
                    </option>
                    {departments.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </FormField>
              </div>
              <FormField label="Subject" htmlFor="subject" required>
                <input
                  id="subject"
                  name="subject"
                  required
                  className={inputClasses}
                />
              </FormField>
              <FormField label="Message" htmlFor="message" required>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className={inputClasses}
                />
              </FormField>
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />
              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <input type="checkbox" required className="mt-0.5" /> I consent
                to being contacted regarding this enquiry.
              </label>
              {submitError && (
                <p className="text-sm text-error">{submitError}</p>
              )}
              <Button type="submit" disabled={submitting}>
                {submitting ? "Sending…" : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
