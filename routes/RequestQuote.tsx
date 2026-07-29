"use client";
import { useState, type FormEvent } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { readStorage, writeStorage, generateReference } from "@/lib/storage";
import { downloadTextFile } from "@/lib/download";
import { b2bCategories } from "@/data/b2bCategories";

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

export default function RequestQuote() {
  const [submitted, setSubmitted] = useState<Record<string, string> | null>(
    null,
  );
  const [honeypot, setHoneypot] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypot) return;
    const form = new FormData(e.currentTarget);
    const record: Record<string, string> = {
      reference: generateReference("RFQ"),
    };
    form.forEach((value, key) => {
      record[key] = String(value);
    });
    record.submittedAt = new Date().toISOString();

    const existing = readStorage<Record<string, string>[]>(
      "premierSalt.quoteRequests",
      [],
    );
    writeStorage("premierSalt.quoteRequests", [...existing, record]);
    setSubmitted(record);
  }

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-6 py-32 text-center">
        <span className="eyebrow">Request Received</span>
        <h1 className="font-serif text-3xl text-maroon">
          Thank you, {submitted.fullName}
        </h1>
        <p className="font-serif text-2xl text-terracotta">
          {submitted.reference}
        </p>
        <p className="text-sm text-muted">
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
      <div className="mx-auto max-w-2xl px-6 py-16 md:px-8">
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
              {b2bCategories.map((c) => (
                <option key={c.slug}>{c.name}</option>
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
          <label className="flex items-start gap-2 text-xs text-muted">
            <input type="checkbox" required className="mt-0.5" /> I consent to
            being contacted regarding this quote request.
          </label>
          <Button type="submit">Submit Request</Button>
        </form>
      </div>
    </>
  );
}
