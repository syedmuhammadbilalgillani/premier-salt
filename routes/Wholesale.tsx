import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "Do you offer exclusive territory rights?",
    answer:
      "We evaluate partnerships case by case and do not offer standard exclusivity or guaranteed margins.",
  },
  {
    question: "What order volumes qualify for distributor terms?",
    answer:
      "This depends on the product category and market — share your expected volume in the enquiry form and we'll follow up.",
  },
  {
    question: "Can distributors request private-label options?",
    answer:
      "Yes, private-label support is available for most product categories — see our Private Labeling page for details.",
  },
];

export default function Wholesale() {
  return (
    <ContentPage
      eyebrow="Enquiries"
      title="Wholesale & Distributor Partnerships"
      description="We work with wholesalers and distributors across edible, décor, kitchen, spa and industrial salt categories."
      crumbs={[{ label: "Wholesale & Distributor" }]}
      sections={[
        {
          eyebrow: "Who Can Apply",
          title: "Retailers, Wholesalers & Distributors",
          paragraphs: [
            "We welcome enquiries from retail chains, regional wholesalers, and distributors looking to add Himalayan salt products to their range.",
          ],
        },
        {
          eyebrow: "Support",
          title: "Wholesale, Distributor & Private-Label Support",
          paragraphs: [
            "Depending on your business, we can support standard wholesale supply, ongoing distributor arrangements, or private-label development.",
          ],
        },
      ]}
    >
      <Reveal className="border-t border-border pt-10">
        <span className="eyebrow">Process</span>
        <h2 className="mt-3 mb-5 font-serif text-2xl text-primary">
          Application Process
        </h2>
        <ol className="flex flex-col gap-3 text-sm text-charcoal">
          {[
            "Submit an enquiry with your business details",
            "Our sales team reviews your requirement",
            "We share pricing and terms",
            "Sample coordination where relevant",
            "Agreement and first order",
          ].map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span className="font-serif text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>{" "}
              {step}
            </li>
          ))}
        </ol>
        <Link href="/request-a-quote" className="mt-6 inline-block">
          <Button>Submit an Enquiry</Button>
        </Link>
      </Reveal>
      <div className="border-t border-border pt-10">
        <span className="eyebrow">FAQ</span>
        <h2 className="mt-3 mb-6 font-serif text-2xl text-primary">
          Partnership Questions
        </h2>
        <FAQAccordion items={faqs} />
      </div>
    </ContentPage>
  );
}
