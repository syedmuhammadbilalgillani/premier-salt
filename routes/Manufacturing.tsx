import { ContentPage } from "@/components/layout/ContentPage";
import { Reveal } from "@/components/motion/Reveal";
import Image from "next/image";

// Captions double as the images' alt text — the previous version passed the
// file path as alt, which read out as "/assets/Packaging_line.webp-image".
const gallery = [
  {
    src: "/assets/Raw_material_intake_area.webp",
    caption: "Raw material intake area",
  },
  {
    src: "/assets/Crushing_and_sizing_line.webp",
    caption: "Crushing and sizing line",
  },
  {
    src: "/assets/Cleaning_and_processing_station.webp",
    caption: "Cleaning and processing station",
  },
  { src: "/assets/Packaging_line.webp", caption: "Packaging line" },
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
      image="/assets/Manufacturing-Facility_Hero_Img.webp"
    >
      <div className="border-t border-border pt-8 md:pt-10">
        <span className="eyebrow">Inside the Plant</span>
        <h2 className="mt-3 mb-6 font-serif text-xl text-primary sm:text-2xl">
          Facility Walkthrough
        </h2>
        <Reveal
          stagger
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {gallery.map((item) => (
            <figure key={item.src} className="flex flex-col gap-2.5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-sand/40">
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
                />
              </div>
              <figcaption className="text-sm text-muted-foreground">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </ContentPage>
  );
}
