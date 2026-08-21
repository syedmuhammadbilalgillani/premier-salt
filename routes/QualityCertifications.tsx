import { ContentPage } from "@/components/layout/ContentPage";
import { Reveal } from "@/components/motion/Reveal";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { company } from "@/data/company";
import Image from "next/image";

const faqs = [
  {
    question: "Can you provide certification documentation to buyers?",
    answer:
      "Yes — contact our sales team with your requirement and we'll share the relevant documentation for your order.",
  },
  {
    question: "Are your certifications updated regularly?",
    answer:
      "Our certifications are maintained on an ongoing basis as part of our standard operating procedure.",
  },
  {
    question: "Do certifications vary by product line?",
    answer:
      "Some certifications apply company-wide, others are specific to certain product categories — our team can confirm which apply to your enquiry.",
  },
];

export default function QualityCertifications() {
  return (
    <ContentPage
      eyebrow="Company"
      title="Quality & Certifications"
      description="Our quality approach runs from incoming material inspection through to pre-shipment checks, supported by recognized certifications."
      crumbs={[{ label: "Quality & Certifications" }]}
      image="/assets/Quality-Certification-Hero-Pic.webp"
      sections={[
        {
          eyebrow: "Our Commitment",
          title: "Quality at Every Stage",
          paragraphs: [
            "Every batch moves through incoming material inspection, in-process controls, and packaging inspection before a pre-shipment check confirms it's ready to leave our facility.",
          ],
          bullets: [
            "Incoming material inspection",
            "Process controls",
            "Product consistency checks",
            "Packaging inspection",
            "Pre-shipment inspection",
            "Traceability from batch to shipment",
          ],
        },
      ]}
    >
      {/* Heading and grid stay in one block — as separate children they were
          pushed apart by the page container's section gap. */}
      <div className="border-t border-border pt-8 md:pt-10">
        <span className="eyebrow">Certifications</span>
        <h2 className="mt-3 mb-6 font-serif text-xl text-primary sm:text-2xl">
          What We Hold
        </h2>
        <Reveal
          stagger
          className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6"
        >
          {company.certifications.map((cert) => (
            <div
              key={cert.name}
              className="group flex flex-col items-center gap-3 text-center"
            >
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-sm transition-all duration-300 group-hover:shadow-md">
                <Image
                  src={cert.image}
                  alt={`${cert.name} — ${cert.subtitle}`}
                  fill
                  className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold leading-snug text-charcoal">
                  {cert.name}
                </span>
                <span className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
                  {cert.subtitle}
                </span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
      <div className="border-t border-border pt-8 md:pt-10">
        <span className="eyebrow">FAQ</span>
        <h2 className="mt-3 mb-6 font-serif text-xl text-primary sm:text-2xl">
          Documentation Questions
        </h2>
        <FAQAccordion items={faqs} />
      </div>
    </ContentPage>
  );
}
