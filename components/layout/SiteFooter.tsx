import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Globe2,
  ShieldCheck,
  Package,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { footerNavigation } from "@/data/navigation";
import { company } from "@/data/company";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { BackToTopButton } from "@/components/ui/BackToTopButton";
import Link from "next/link";
import Image from "next/image";

const trustPillars = [
  {
    icon: Globe2,
    title: "Global Export Reach",
    description: "Containerized shipping to 60+ countries worldwide",
  },
  {
    icon: ShieldCheck,
    title: "Certified Standards",
    description: "ISO 9001, HACCP, ISO 22000, Halal & FDA registered",
  },
  {
    icon: Package,
    title: "Private Label & Bulk",
    description: "Custom branding, packaging, and grain sizes tailored to you",
  },
  {
    icon: Sparkles,
    title: "100% Authentic Salt",
    description: "Direct mine-to-port processing from the Khewra belt",
  },
];

export function SiteFooter() {
  return (
    <footer className="relative bg-charcoal text-cream selection:bg-salt-pink selection:text-charcoal">
      {/* 1. Value Proposition / Trust Strip */}
      <div className="border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustPillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:border-salt-pink/30 hover:bg-white/[0.05]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-salt-pink/10 text-salt-pink transition-colors duration-300 group-hover:bg-salt-pink group-hover:text-charcoal">
                  <pillar.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-semibold text-cream">
                    {pillar.title}
                  </h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-cream/60">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Grid */}
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-12 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand & Direct Contact (Col 1-4) */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative h-10 w-36">
                <Image
                  src="/premiersalt-logo.png"
                  alt="Premier Salt Logo"
                  fill
                  className="object-contain object-left"
                  sizes="150px"
                />
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-cream/70">
              {company.positioning}
            </p>

            {/* Direct Contact Details */}
            <div className="flex flex-col gap-3 text-xs text-cream/80 sm:text-sm">
              <span className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-salt-pink" />
                <span className="leading-snug">{company.office}</span>
              </span>

              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
                <a
                  href={`tel:${company.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 transition-colors hover:text-salt-pink"
                >
                  <Phone className="h-3.5 w-3.5 text-salt-pink" />
                  <span>{company.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${company.phone.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-400 transition-colors hover:text-emerald-300"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <a
                  href={`mailto:${company.emails.sales}`}
                  className="flex items-center gap-2 transition-colors hover:text-salt-pink"
                >
                  <Mail className="h-3.5 w-3.5 text-salt-pink" />
                  <span>{company.emails.sales}</span>
                </a>
                <a
                  href={`mailto:${company.emails.info}`}
                  className="flex items-center gap-2 transition-colors hover:text-salt-pink"
                >
                  <Mail className="h-3.5 w-3.5 text-salt-pink" />
                  <span>{company.emails.info}</span>
                </a>
              </div>
            </div>

            {/* Quick Export Quote Button */}
            <div className="pt-2">
              <Link
                href="/request-a-quote"
                className="group inline-flex items-center gap-2 rounded-lg border border-salt-pink/40 bg-salt-pink/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-salt-pink transition-all duration-300 hover:border-salt-pink hover:bg-salt-pink hover:text-charcoal"
              >
                <span>Request B2B / Export Quote</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Navigation Columns (Col 5-12) */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {footerNavigation.map((group) => (
              <div key={group.label} className="flex flex-col gap-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cream/90">
                  {group.label}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        href={link.to}
                        className="group flex items-center text-xs text-cream/65 transition-all duration-200 hover:translate-x-1 hover:text-salt-pink sm:text-sm"
                      >
                        <ChevronRight className="mr-1 h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-100" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Newsletter & Certificate Showcase Strip */}
        <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* Newsletter Subscription */}
            <div className="flex flex-col gap-3 lg:col-span-7">
              <h3 className="font-serif text-xl text-cream md:text-2xl">
                Stay Updated with Industry & Export Insights
              </h3>
              <p className="max-w-xl text-xs leading-relaxed text-cream/60 sm:text-sm">
                Subscribe for seasonal wholesale updates, product catalogs, and global Himalayan salt trade news.
              </p>
              <div className="mt-2 max-w-lg">
                <NewsletterForm />
              </div>
            </div>

            {/* Certifications preview */}
            <div className="flex flex-col gap-3 lg:col-span-5 lg:border-l lg:border-white/10 lg:pl-8">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-cream/80">
                  Certified Standards
                </span>
                <Link
                  href="/quality-certifications"
                  className="inline-flex items-center gap-1 text-xs text-salt-pink transition-colors hover:underline"
                >
                  <span>View All</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {company.certifications.map((cert) => (
                  <Link
                    key={cert.name}
                    href="/quality-certifications"
                    title={cert.name}
                    className="group relative flex aspect-square items-center justify-center rounded-lg border border-white/10 bg-white p-1.5 transition-all duration-300 hover:scale-105 hover:border-salt-pink"
                  >
                    <Image
                      src={cert.image}
                      alt={cert.name}
                      fill
                      className="object-contain p-1"
                      sizes="60px"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Legal, Copyright & Back to Top */}
        <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 text-xs text-cream/50">
            <span>
              &copy; {new Date().getFullYear()} {company.name}. All rights reserved.
            </span>
            <span className="text-[11px] text-cream/40">
              Authorized Manufacturer &amp; Exporter &bull; NTN / Registration compliant
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-cream/60">
              <Link
                href="/privacy-policy"
                className="transition-colors hover:text-salt-pink"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-conditions"
                className="transition-colors hover:text-salt-pink"
              >
                Terms &amp; Conditions
              </Link>
              <Link
                href="/payment-policy"
                className="transition-colors hover:text-salt-pink"
              >
                Payment Policy
              </Link>
              <Link
                href="/cookie-policy"
                className="transition-colors hover:text-salt-pink"
              >
                Cookie Policy
              </Link>
            </div>

            <BackToTopButton />
          </div>
        </div>
      </div>
    </footer>
  );
}


