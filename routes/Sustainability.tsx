import { ContentPage } from "@/components/layout/ContentPage";

export default function Sustainability() {
  return (
    <ContentPage
      eyebrow="Company"
      title="Sustainability"
      description="Responsible practices guide how we source, process and package Himalayan salt products."
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
    />
  );
}
