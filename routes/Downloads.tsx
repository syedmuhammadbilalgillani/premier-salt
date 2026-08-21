"use client";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { downloadTextFile } from "@/lib/download";
import { company } from "@/data/company";

const downloads = [
  {
    title: "Company Profile",
    description:
      "An overview of Premier Salt Industries, our capabilities and approach.",
  },
  {
    title: "Product Catalogue",
    description: "A summary of our full product range across all categories.",
  },
  {
    title: "Edible Salt Catalogue",
    description: "Detailed information on our edible and gourmet salt range.",
  },
  {
    title: "Salt Lamp Catalogue",
    description: "An overview of our decorative salt lamp and lighting range.",
  },
  {
    title: "Private Label Overview",
    description:
      "How our private-label process works, from enquiry to shipment.",
  },
  {
    title: "Certification Overview",
    description: "A summary of the certifications we hold.",
  },
  {
    title: "Export Enquiry Checklist",
    description:
      "The information to prepare before submitting an export enquiry.",
  },
];

export default function Downloads() {
  function handleDownload(title: string, description: string) {
    const content = [
      `PREMIER SALT INDUSTRIES (PRIVATE) LIMITED`,
      `${title} — Preview Document`,
      "",
      description,
      "",
      "This is a preview placeholder document generated for prototype purposes.",
      "It does not represent a final, official company document.",
      "",
      `Contact: ${company.emails.sales} · ${company.phone}`,
      `Office: ${company.office}`,
    ].join("\n");
    downloadTextFile(
      `${title.toLowerCase().replace(/\s+/g, "-")}-preview.txt`,
      content,
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Downloads"
        image="/assets/Downloads-Hero-Pic.webp"
        description="Company and product documents for buyers, distributors and partners."
        crumbs={[{ label: "Downloads" }]}
      />
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <Reveal
          stagger
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {downloads.map((d) => (
            <div
              key={d.title}
              className="flex flex-col gap-3 rounded-lg border border-border bg-cream/30 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xs"
            >
              <div className="flex items-center gap-2 text-primary">
                <FileText className="h-5 w-5" />
                <h3 className="font-serif text-lg text-primary">{d.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {d.description}
              </p>
              <span className="text-xs uppercase tracking-wide text-muted-foreground/80">
                Preview document
              </span>
              <Button
                size="sm"
                onClick={() => handleDownload(d.title, d.description)}
                className="mt-1 inline-flex w-fit items-center gap-2"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </Button>
            </div>
          ))}
        </Reveal>
      </div>
    </>
  );
}

