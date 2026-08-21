import { ContentPage } from "@/components/layout/ContentPage";
import { Reveal } from "@/components/motion/Reveal";

const checklist = [
  "Product",
  "Quantity",
  "Packaging",
  "Destination country",
  "Required certification",
  "Private label requirement",
  "Target delivery period",
];

const journey = [
  "Enquiry & Requirement Review",
  "Product & Packaging Selection",
  "Quotation & Documentation Coordination",
  "Production & Quality Inspection",
  "Container Loading",
  "Shipment & Post-Shipment Communication",
];

export default function ExportCapabilities() {
  return (
    <ContentPage
      eyebrow="Company"
      title="Export Capabilities"
      description="We support importers, wholesalers, distributors and private-label buyers with coordinated export from Pakistan, start to finish."
      crumbs={[{ label: "Export Capabilities" }]}
      image="/assets/Export-Capabilities-Hero-Pic.webp"
      sections={[
        {
          eyebrow: "Who We Support",
          title: "Buyer Types We Work With",
          paragraphs: [],
          bullets: [
            "Importers",
            "Wholesalers",
            "Distributors",
            "Retail Chains",
            "Institutional Buyers",
            "Private-label Brands",
          ],
        },
        {
          eyebrow: "Support We Provide",
          title: "Coordination From Selection to Shipment",
          paragraphs: [
            "Our team supports product and packaging selection, private-label requirements, documentation coordination, shipment planning, container loading and post-shipment communication.",
          ],
        },
      ]}
    >
      <Reveal className="grid grid-cols-1 gap-8 border-t border-border pt-8 md:grid-cols-2 md:gap-10 md:pt-10">
        <div>
          <span className="eyebrow">Export Journey</span>
          <h2 className="mt-3 mb-5 font-serif text-xl text-primary sm:text-2xl">
            Six Steps
          </h2>
          <ol className="flex flex-col gap-4">
            {journey.map((step, i) => (
              <li key={step} className="flex items-start gap-3">
                <span className="font-serif text-lg text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-charcoal">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <span className="eyebrow">Typical Enquiry Information</span>
          <h2 className="mt-3 mb-5 font-serif text-xl text-primary sm:text-2xl">
            What to Include
          </h2>
          <ul className="flex flex-col gap-2.5">
            {checklist.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-charcoal"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </ContentPage>
  );
}
