"use client";
import { useState, type FormEvent } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { downloadTextFile } from "@/lib/download";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

const process = [
  "Share Your Requirement",
  "Select Products",
  "Choose Packaging",
  "Review Design & Sample",
  "Approve Production",
  "Receive Shipment Support",
];

const packagingOptions = [
  "Stand-up pouches",
  "Flat pouches",
  "Jars",
  "Grinders",
  "Cartons",
  "Gift boxes",
  "Bulk bags",
  "Buyer-specified",
];

interface PrivateLabelRequest {
  reference: string;
  fullName: string;
  email: string;
}

export default function PrivateLabeling() {
  const [submitted, setSubmitted] = useState<PrivateLabelRequest | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypot) return;

    const form = new FormData(e.currentTarget);
    const get = (k: string) => (form.get(k) as string)?.trim() ?? "";

    const nextErrors: Record<string, string> = {};
    if (!get("fullName")) nextErrors.fullName = "Full name is required.";
    if (!get("companyName"))
      nextErrors.companyName = "Company name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email")))
      nextErrors.email = "Enter a valid work email.";
    if (!get("phone")) nextErrors.phone = "Phone/WhatsApp is required.";
    if (!get("country")) nextErrors.country = "Country is required.";
    if (!get("productCategory"))
      nextErrors.productCategory = "Select a product category.";
    if (!get("quantity"))
      nextErrors.quantity = "Required quantity is required.";
    if (!form.get("consent"))
      nextErrors.consent = "Please confirm consent to be contacted.";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSubmitError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "private_label",
          fullName: get("fullName"),
          companyName: get("companyName"),
          email: get("email"),
          phone: get("phone"),
          country: get("country"),
          message: get("notes"),
          details: Object.fromEntries(
            [
              ["website", get("website")],
              ["productCategory", get("productCategory")],
              ["quantity", get("quantity")],
              ["packaging", get("packaging")],
              ["targetMarket", get("targetMarket")],
              ["timeline", get("timeline")],
            ].filter(([, value]) => value),
          ),
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setSubmitError(data.error || "Could not submit your enquiry. Please try again.");
        return;
      }

      setErrors({});
      setSubmitted({
        reference: data.data.reference,
        fullName: get("fullName"),
        email: get("email"),
      });
    } catch {
      setSubmitError("Could not submit your enquiry. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 px-6 py-32 text-center">
        <span className="eyebrow">Request Received</span>
        <h1 className="font-serif text-3xl text-maroon">
          Thank you, {submitted.fullName}
        </h1>
        <p className="text-base text-muted">
          Your private-label enquiry has been recorded. Reference number:
        </p>
        <p className="font-serif text-2xl text-terracotta">
          {submitted.reference}
        </p>
        <p className="text-sm text-muted">
          Our team will reach out at {submitted.email}.
        </p>
        <div className="mt-2 flex gap-4">
          <Button
            onClick={() =>
              downloadTextFile(
                `${submitted.reference}-private-label-enquiry.txt`,
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
      {/* <PageHero
        eyebrow="Private Label"
        title="Private Label Himalayan Salt Products"
        description="Develop customized Himalayan salt products and packaging under your own brand."
        crumbs={[{ label: "Private Labeling" }]}
      /> */}
      <div
        className="relative isolate h-[87dvh] bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/privatelabelbanner.jpeg')",
          backgroundSize: "contain",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Background overlay */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-linear-to-br from-transparent to-black/80" />

        {/* Page content */}
        <div className="relative z-20 mx-auto w-full max-w-8xl flex flex-col justify-center h-full px-4 py-12 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ label: "Private Labeling" }]}
            className="text-white"
          />

          <h1 className="mt-6 font-serif text-4xl leading-[1.1] text-white sm:text-5xl">
            Private Label Himalayan Salt Products
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white sm:text-lg">
            Develop customized Himalayan salt products and packaging under your
            own brand.
          </p>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-20 md:grid-cols-2 md:px-8">
        <Reveal className="flex flex-col gap-10">
          <div>
            <span className="eyebrow">Process</span>
            <h2 className="mt-3 mb-5 font-serif text-2xl text-maroon">
              How It Works
            </h2>
            <ol className="flex flex-col gap-3">
              {process.map((step, i) => (
                <li
                  key={step}
                  className="flex items-center gap-3 text-sm text-charcoal"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-terracotta text-xs font-semibold text-cream">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <span className="eyebrow">Product Areas</span>
            <h2 className="mt-3 mb-3 font-serif text-2xl text-maroon">
              What You Can Private Label
            </h2>
            <p className="text-sm text-muted">
              Edible Salt · Salt Crafts &amp; Lamps · Bath Salt · Animal Salt
              Licks
            </p>
          </div>
          <div>
            <span className="eyebrow">Packaging Options</span>
            <h2 className="mt-3 mb-3 font-serif text-2xl text-maroon">
              Formats We Support
            </h2>
            <div className="flex flex-wrap gap-2">
              {packagingOptions.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-charcoal"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5 rounded-sm border border-border bg-cream p-8"
          >
            <h2 className="font-serif text-xl text-maroon">
              Private Label Enquiry
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Full Name"
                htmlFor="fullName"
                required
                error={errors.fullName}
              >
                <input id="fullName" name="fullName" className={inputClasses} />
              </FormField>
              <FormField
                label="Company Name"
                htmlFor="companyName"
                required
                error={errors.companyName}
              >
                <input
                  id="companyName"
                  name="companyName"
                  className={inputClasses}
                />
              </FormField>
              <FormField
                label="Work Email"
                htmlFor="email"
                required
                error={errors.email}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={inputClasses}
                />
              </FormField>
              <FormField
                label="Phone / WhatsApp"
                htmlFor="phone"
                required
                error={errors.phone}
              >
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={inputClasses}
                />
              </FormField>
              <FormField
                label="Country"
                htmlFor="country"
                required
                error={errors.country}
              >
                <input id="country" name="country" className={inputClasses} />
              </FormField>
              <FormField label="Website" htmlFor="website">
                <input id="website" name="website" className={inputClasses} />
              </FormField>
            </div>
            <FormField
              label="Product Category"
              htmlFor="productCategory"
              required
              error={errors.productCategory}
            >
              <select
                id="productCategory"
                name="productCategory"
                className={inputClasses}
                defaultValue=""
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option>Edible Salt</option>
                <option>Salt Crafts & Lamps</option>
                <option>Bath Salt</option>
                <option>Animal Salt Licks</option>
              </select>
            </FormField>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Required Quantity"
                htmlFor="quantity"
                required
                error={errors.quantity}
              >
                <input
                  id="quantity"
                  name="quantity"
                  className={inputClasses}
                  placeholder="e.g. 500 units"
                />
              </FormField>
              <FormField label="Preferred Packaging" htmlFor="packaging">
                <input
                  id="packaging"
                  name="packaging"
                  className={inputClasses}
                />
              </FormField>
              <FormField label="Target Market" htmlFor="targetMarket">
                <input
                  id="targetMarket"
                  name="targetMarket"
                  className={inputClasses}
                />
              </FormField>
              <FormField label="Desired Timeline" htmlFor="timeline">
                <input id="timeline" name="timeline" className={inputClasses} />
              </FormField>
            </div>
            <FormField label="Additional Notes" htmlFor="notes">
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className={inputClasses}
              />
            </FormField>
            <input
              type="text"
              name="companyRole"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />
            <label className="flex items-start gap-2 text-xs text-muted">
              <input type="checkbox" name="consent" className="mt-0.5" />I
              consent to being contacted by Premier Salt Industries regarding
              this enquiry.
            </label>
            {errors.consent && (
              <p className="text-xs text-error">{errors.consent}</p>
            )}
            {submitError && <p className="text-sm text-error">{submitError}</p>}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Enquiry"}
            </Button>
          </form>
        </Reveal>
      </div>
    </>
  );
}
