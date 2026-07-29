import { Mail, Phone, MapPin } from "lucide-react";
import { footerNavigation } from "@/data/navigation";
import { company } from "@/data/company";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-cream/80">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_repeat(5,1fr)]">
          <div className="flex flex-col gap-4">
            <span className="font-serif text-2xl text-cream">Premier Salt</span>
            <p className="max-w-xs text-sm leading-relaxed text-cream/60">
              {company.summary}
            </p>
            <div className="flex flex-col gap-2 pt-2 text-sm text-cream/70">
              <span className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {company.office}
              </span>
              <a
                href={`tel:${company.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 hover:text-cream"
              >
                <Phone className="h-4 w-4" /> {company.phone}
              </a>
              <a
                href={`mailto:${company.emails.info}`}
                className="flex items-center gap-2 hover:text-cream"
              >
                <Mail className="h-4 w-4" /> {company.emails.info}
              </a>
            </div>
          </div>

          {footerNavigation.map((group) => (
            <div key={group.label}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-cream">
                {group.label}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      href={link.to}
                      className="text-sm text-cream/60 hover:text-terracotta"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <div className="max-w-md">
            <h3 className="mb-3 font-serif text-lg text-cream">Stay updated</h3>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} Premier Salt Industries (Private)
            Limited. All rights reserved.
          </span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy-policy" className="hover:text-terracotta">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="hover:text-terracotta">
              Terms &amp; Conditions
            </Link>
            <Link href="/cookie-policy" className="hover:text-terracotta">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
