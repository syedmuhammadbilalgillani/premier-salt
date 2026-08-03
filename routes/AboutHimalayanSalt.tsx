import { ContentPage } from "@/components/layout/ContentPage";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { Reveal } from "@/components/motion/Reveal";

const faqs = [
  {
    question: "What gives Himalayan salt its colour?",
    answer:
      "Natural mineral content creates variation from white through to deep pink, depending on the deposit.",
  },
  {
    question: "How should I store a salt lamp?",
    answer:
      "Keep it away from direct water contact and wipe with a dry cloth; a light bulb inside helps in humid conditions.",
  },
  {
    question: "How do I care for a salt cooking plate?",
    answer:
      "Warm it gradually before high heat, let it cool completely before washing, and dry it right away.",
  },
];

export default function AboutHimalayanSalt() {
  return (
    <ContentPage
      eyebrow="Resources"
      title="About Himalayan Salt"
      description="A general introduction to Himalayan salt, its natural variation, and how it's used across food, décor, spa and architectural products."
      crumbs={[{ label: "About Himalayan Salt" }]}
      sections={[
        {
          eyebrow: "Origin",
          title: "What Himalayan Salt Is",
          paragraphs: [
            "Himalayan salt is mined from ancient salt deposits and processed into a range of grain sizes, shapes and finishes for different uses.",
          ],
        },
        {
          eyebrow: "Appearance",
          title: "Natural Colour Variations & Grain Sizes",
          paragraphs: [
            "Natural mineral content gives the salt its range of colours, from white crystal to deep pink, and it's available in multiple grain sizes for different applications.",
          ],
        },
        {
          eyebrow: "Applications",
          title: "Culinary, Decorative, Spa & Architectural Uses",
          paragraphs: [
            "In the kitchen, it's used for seasoning, cooking slabs and serving plates. As décor, it appears in lamps, night lights and candle holders. In spa settings, it's used in bath salts and salt bars. In interiors, it's cut into tiles, bricks and blocks for feature walls.",
          ],
        },
        {
          eyebrow: "Care",
          title: "Product Care",
          paragraphs: [
            "Each product category has its own care guidance — see the relevant product page for specific instructions.",
          ],
        },
      ]}
    >
      <Reveal className="border-t border-border pt-10">
        <span className="eyebrow">FAQ</span>
        <h2 className="mt-3 mb-6 font-serif text-2xl text-primary">
          Common Questions
        </h2>
        <FAQAccordion items={faqs} />
        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Information on this page is provided for general educational purposes.
          Himalayan salt products are not presented as treatments, cures or
          substitutes for professional medical advice.
        </p>
      </Reveal>
    </ContentPage>
  );
}
