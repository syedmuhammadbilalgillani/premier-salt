import { ContentPage } from "@/components/layout/ContentPage";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Reveal } from "@/components/motion/Reveal";

const gallery = [
  "Raw material intake area",
  "Crushing and sizing line",
  "Cleaning and processing station",
  "Packaging line",
];

export default function Manufacturing() {
  return (
    <ContentPage
      eyebrow="Company"
      title="Manufacturing Facility"
      description="Our processing plant in Muridke handles every stage of Himalayan salt production, from raw material selection through to export-ready packaging."
      crumbs={[{ label: "Manufacturing" }]}
      sections={[
        {
          eyebrow: "Overview",
          title: "From Raw Rock to Finished Product",
          paragraphs: [
            "Raw Himalayan salt rock is selected, inspected, then moved through crushing and sizing to reach the grain size or shape required for each product line.",
          ],
        },
        {
          eyebrow: "Processing",
          title: "Cleaning, Crafting & Quality Checks",
          paragraphs: [
            "Material is cleaned and processed according to product type, whether that's edible-grade grain, decorative lamp pieces, or slabs for grilling and tiling. Quality checks are carried out at key stages before products move to packaging.",
          ],
        },
        {
          eyebrow: "Packaging & Dispatch",
          title: "Packaging, Warehousing & Export Preparation",
          paragraphs: [
            "Finished products are packed to buyer specifications, stored in our warehousing area, and prepared for container loading and export dispatch, with hygiene and careful handling maintained throughout.",
          ],
        },
      ]}
    >
      <Reveal stagger className="grid grid-cols-1 gap-6 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-4">
        {gallery.map((label) => (
          <ImagePlaceholder key={label} label={label} width={600} height={450} />
        ))}
      </Reveal>
    </ContentPage>
  );
}
