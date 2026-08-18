import { ContentPage } from "@/components/layout/ContentPage";
import { company } from "@/data/company";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Reveal } from "@/components/motion/Reveal";

export default function About() {
  return (
    <ContentPage
      eyebrow="Company"
      title="About Premier Salt Industries"
      description={company.summary}
      crumbs={[{ label: "About Us" }]}
      image="/assets/about-us-hero-pic.webp"
      sections={[
        {
          eyebrow: "Who We Are",
          title: "A Dedicated Himalayan Salt Exporter",
          paragraphs: [
            `${company.name} focuses solely on processing, manufacturing and exporting Himalayan salt products, working with buyers across edible, decorative, kitchen, spa and industrial categories.`,
            "We work with importers, wholesalers, distributors, institutional buyers and private-label brands who need a dependable, professional supplier.",
          ],
        },
        {
          eyebrow: "What We Offer",
          title: "Product Range and Support",
          paragraphs: [
            "Our catalogue spans edible salt, decorative salt lamps, kitchen slabs, architectural tiles and bricks, animal salt licks, spa products and industrial salt — each backed by customization and private-label support.",
          ],
          bullets: [
            "Bulk and wholesale supply",
            "Custom packaging",
            "Private labeling",
            "Export documentation support",
            "Sample coordination",
            "Responsive sales communication",
          ],
        },
        {
          eyebrow: "Vision & Mission",
          title: "Where We're Headed",
          paragraphs: [company.vision, company.mission],
        },
        {
          eyebrow: "Core Values",
          title: "How We Operate",
          paragraphs: [],
          bullets: company.values.map((v) => `${v.name} — ${v.detail}`),
        },
        {
          eyebrow: "Leadership",
          title: "A Message from Our CEO",
          paragraphs: [
            `"At Premier Salt Industries, we approach every enquiry — large or small — with the same commitment to quality and transparency. Our goal is to be a partner our buyers can rely on for the long term." — ${company.ceo.name}, ${company.ceo.title}`,
          ],
        },
      ]}
    >
      <Reveal className="grid grid-cols-1 items-center gap-6 border-t border-border pt-8 sm:gap-8 md:grid-cols-[240px_1fr] md:pt-10">
        <div>
          <span className="eyebrow">Leadership</span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="w-28 shrink-0 sm:w-40">
            <ImagePlaceholder
              label="CEO Portrait — Asad Zahoor"
              width={600}
              height={750}
            />
          </div>
          <div>
            <p className="font-serif text-lg text-primary">
              {company.ceo.name}
            </p>
            <p className="text-sm text-text-muted-foreground">
              {company.ceo.title}
            </p>
          </div>
        </div>
      </Reveal>
    </ContentPage>
  );
}
