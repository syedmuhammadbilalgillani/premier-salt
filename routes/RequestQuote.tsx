"use client";
import { useState, type FormEvent } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { downloadTextFile } from "@/lib/download";

const buyerTypes = [
  "Importer",
  "Wholesaler",
  "Distributor",
  "Retail Chain",
  "Institutional Buyer",
  "E-commerce Brand",
  "Private-label Brand",
  "Other",
];

export default function RequestQuote({
  categories,
}: {
  categories: { id: string; title: string }[];
}) {
  const [submitted, setSubmitted] = useState<Record<string, string> | null>(
    null,
  );
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypot) return;
    const form = new FormData(e.currentTarget);
    const record: Record<string, string> = {};
    form.forEach((value, key) => {
      record[key] = String(value);
    });

    setSubmitError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quote_request",
          fullName: record.fullName,
          companyName: record.companyName,
          email: record.email,
          phone: record.phone,
          country: record.country,
          message: record.details,
          details: Object.fromEntries(
            [
              ["website", record.website],
              ["buyerType", record.buyerType],
              ["productCategory", record.productCategory],
              ["specificProduct", record.specificProduct],
              ["quantity", record.quantity],
              ["unit", record.unit],
              ["destination", record.destination],
              ["certification", record.certification],
              ["timeline", record.timeline],
              ["packaging", record.packaging],
              ["privateLabel", form.get("privateLabel") ? "Yes" : "No"],
            ].filter(([, value]) => value),
          ),
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setSubmitError(
          data.error || "Could not submit your request. Please try again.",
        );
        return;
      }

      setSubmitted({
        reference: data.data.reference,
        fullName: record.fullName,
        email: record.email,
      });
    } catch {
      setSubmitError(
        "Could not submit your request. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-6 py-32 text-center">
        <span className="eyebrow">Request Received</span>
        <h1 className="font-serif text-3xl text-primary">
          Thank you, {submitted.fullName}
        </h1>
        <p className="font-serif text-2xl text-primary">
          {submitted.reference}
        </p>
        <p className="text-sm text-muted-foreground">
          Our export sales team will follow up at {submitted.email}.
        </p>
        <div className="flex gap-4">
          <Button
            onClick={() =>
              downloadTextFile(
                `${submitted.reference}-quote-request.txt`,
                Object.entries(submitted)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join("\n"),
              )
            }
          >
            Download Summary
          </Button>
          <Button variant="outline" onClick={() => setSubmitted(null)}>
            Submit Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Enquiries"
        title="Request a Quote"
        description="Share your requirement and our export sales team will follow up with pricing and availability."
        crumbs={[{ label: "Request a Quote" }]}
      />
      <div className="mx-auto w-full max-w-2xl px-6 py-12 sm:py-16 md:px-8">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Full Name" htmlFor="fullName" required>
              <input
                id="fullName"
                name="fullName"
                required
                className={inputClasses}
              />
            </FormField>
            <FormField label="Company" htmlFor="companyName" required>
              <input
                id="companyName"
                name="companyName"
                required
                className={inputClasses}
              />
            </FormField>
            <FormField label="Work Email" htmlFor="email" required>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={inputClasses}
              />
            </FormField>
            <FormField label="Phone/WhatsApp" htmlFor="phone" required>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className={inputClasses}
              />
            </FormField>
            <FormField label="Country" htmlFor="country" required>
              <input
                id="country"
                name="country"
                required
                className={inputClasses}
              />
            </FormField>
            <FormField label="Company Website" htmlFor="website">
              <input id="website" name="website" className={inputClasses} />
            </FormField>
          </div>
          <FormField label="Buyer Type" htmlFor="buyerType" required>
            <select
              id="buyerType"
              name="buyerType"
              required
              className={inputClasses}
              defaultValue=""
            >
              <option value="" disabled>
                Select buyer type
              </option>
              {buyerTypes.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </FormField>
          <FormField
            label="Product Category"
            htmlFor="productCategory"
            required
          >
            <select
              id="productCategory"
              name="productCategory"
              required
              className={inputClasses}
              defaultValue=""
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((c) => (
                <option key={c.id}>{c.title}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Specific Product" htmlFor="specificProduct">
            <input
              id="specificProduct"
              name="specificProduct"
              className={inputClasses}
            />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Required Quantity" htmlFor="quantity" required>
              <input
                id="quantity"
                name="quantity"
                required
                className={inputClasses}
              />
            </FormField>
            <FormField label="Unit" htmlFor="unit">
              <input
                id="unit"
                name="unit"
                placeholder="e.g. tons, units, containers"
                className={inputClasses}
              />
            </FormField>
            <FormField label="Destination Port/City" htmlFor="destination">
              <input
                id="destination"
                name="destination"
                className={inputClasses}
              />
            </FormField>
            <FormField label="Required Certification" htmlFor="certification">
              <input
                id="certification"
                name="certification"
                className={inputClasses}
              />
            </FormField>
            <FormField label="Target Timeline" htmlFor="timeline">
              <input id="timeline" name="timeline" className={inputClasses} />
            </FormField>
            <FormField label="Packaging Requirement" htmlFor="packaging">
              <input id="packaging" name="packaging" className={inputClasses} />
            </FormField>
          </div>
          <label className="flex items-center gap-2 text-sm text-charcoal">
            <input type="checkbox" name="privateLabel" /> Private label required
          </label>
          <FormField label="Additional Details" htmlFor="details">
            <textarea
              id="details"
              name="details"
              rows={4}
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
            <input type="checkbox" required className="mt-0.5" /> I consent to
            being contacted regarding this quote request.
          </label>
          {submitError && <p className="text-sm text-error">{submitError}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Request"}
          </Button>
        </form>
      </div>
    </>
  );
}
