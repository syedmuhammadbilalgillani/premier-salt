import { ContentPage } from "@/components/layout/ContentPage";
import { Reveal } from "@/components/motion/Reveal";

// Stated commitments, kept deliberately non-quantified — we don't publish
// audited sustainability metrics, so nothing here implies a measured claim.
const commitments = [
  {
    title: "Waste Reduction",
    text: "Offcuts and undersized material are redirected into other product lines rather than discarded.",
  },
  {
    title: "Material Efficiency",
    text: "Packaging specifications are reviewed to reduce material use without weakening product protection.",
  },
  {
    title: "Worker Safety",
    text: "Ongoing attention to safe handling, protective equipment and floor procedure at the plant.",
  },
  {
    title: "Fair Dealing",
    text: "Transparent terms and consistent communication with suppliers, staff and buyers.",
  },
];

export default function Sustainability() {
  return (
    <ContentPage
      eyebrow="Company"
      title="Sustainability"
      description="Responsible practices guide how we source, process and package Himalayan salt products."
      image="/assets/Sustainability-Hero-Pic.webp"
      crumbs={[{ label: "Sustainability" }]}
      sections={[
        {
          eyebrow: "Sourcing & Efficiency",
          title: "Responsible Sourcing and Resource Efficiency",
          paragraphs: [
            "We aim to source responsibly and use resources efficiently across our processing operations, looking for practical ways to reduce waste at each stage.",
          ],
        },
        {
          eyebrow: "Packaging & Safety",
          title: "Packaging Improvement and Worker Safety",
          paragraphs: [
            "We continue to look at packaging improvements that reduce material use without compromising product protection, alongside ongoing attention to worker safety on our processing floor.",
          ],
        },
        {
          eyebrow: "Relationships & Durability",
          title: "Ethical Relationships and Product Durability",
          paragraphs: [
            "We aim to build fair, transparent relationships with our partners, and to offer products that are made to last — reducing the need for frequent replacement. This is an area of continuous improvement for our business.",
          ],
        },
      ]}
    >
      <div className="border-t border-border pt-8 md:pt-10">
        <span className="eyebrow">In Practice</span>
        <h2 className="mt-3 mb-6 font-serif text-xl text-primary sm:text-2xl">
          Where We Focus
        </h2>
        <Reveal stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {commitments.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-2 rounded-sm border-l-2 border-salt-pink bg-cream p-6"
            >
              <h3 className="font-serif text-lg text-primary">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </div>
          ))}
        </Reveal>
        <p className="mt-8 max-w-[65ch] text-xs leading-relaxed text-muted-foreground">
          These are stated operating commitments rather than independently
          audited results. We do not currently publish measured sustainability
          figures.
        </p>
      </div>
    </ContentPage>
  );
}
