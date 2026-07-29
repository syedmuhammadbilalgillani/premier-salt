import { ContentPage } from "@/components/layout/ContentPage";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Reveal } from "@/components/motion/Reveal";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { company } from "@/data/company";

const faqs = [
  { question: "Can you provide certification documentation to buyers?", answer: "Yes — contact our sales team with your requirement and we'll share the relevant documentation for your order." },
  { question: "Are your certifications updated regularly?", answer: "Our certifications are maintained on an ongoing basis as part of our standard operating procedure." },
  { question: "Do certifications vary by product line?", answer: "Some certifications apply company-wide, others are specific to certain product categories — our team can confirm which apply to your enquiry." },
];

export default function QualityCertifications() {
  return (
    <ContentPage
      eyebrow="Company"
      title="Quality & Certifications"
      description="Our quality approach runs from incoming material inspection through to pre-shipment checks, supported by recognized certifications."
      crumbs={[{ label: "Quality & Certifications" }]}
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
      <Reveal className="border-t border-border pt-10">
        <span className="eyebrow">Certifications</span>
        <h2 className="mt-3 font-serif text-2xl text-maroon">What We Hold</h2>
      </Reveal>
      <Reveal stagger className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {company.certifications.map((cert) => (
          <div key={cert} className="flex flex-col gap-3">
            <ImagePlaceholder label={`${cert} — Certificate Preview`} width={300} height={400} />
            <span className="text-xs font-medium leading-snug text-charcoal">{cert}</span>
          </div>
        ))}
      </Reveal>
      <div className="border-t border-border pt-10">
        <span className="eyebrow">FAQ</span>
        <h2 className="mt-3 mb-6 font-serif text-2xl text-maroon">Documentation Questions</h2>
        <FAQAccordion items={faqs} />
      </div>
    </ContentPage>
  );
}
