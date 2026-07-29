"use client";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
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
              className="flex flex-col gap-3 border border-border p-6"
            >
              <h3 className="font-serif text-lg text-maroon">{d.title}</h3>
              <p className="text-sm leading-relaxed text-muted">
                {d.description}
              </p>
              <span className="text-xs uppercase tracking-wide text-muted">
                Preview document
              </span>
              <Button
                size="sm"
                onClick={() => handleDownload(d.title, d.description)}
                className="mt-1 w-fit"
              >
                Download
              </Button>
            </div>
          ))}
        </Reveal>
      </div>
    </>
  );
}
