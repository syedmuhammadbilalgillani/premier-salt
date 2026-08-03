import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";

const entries = [
  {
    title: "Product Catalogue Update",
    date: "2026-03-01",
    category: "Company Update",
    text: "Our product catalogue has been refreshed with updated category descriptions and specification summaries.",
  },
  {
    title: "Private Label Enquiry Process Update",
    date: "2026-02-12",
    category: "Company Update",
    text: "We've streamlined our private-label enquiry process to make it faster for buyers to get an initial response.",
  },
  {
    title: "New Retail Shop Experience",
    date: "2026-01-20",
    category: "Company Update",
    text: "Our online shop has launched with an improved browsing and checkout experience for Pakistani retail customers.",
  },
];

export default function NewsEvents() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="News & Events"
        description="Updates from Premier Salt Industries."
        crumbs={[{ label: "News & Events" }]}
      />
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-8">
        <Reveal
          stagger
          className="flex flex-col divide-y divide-border border-y border-border"
        >
          {entries.map((entry) => (
            <div key={entry.title} className="py-8">
              <span className="text-xs uppercase tracking-wide text-primary">
                {entry.category}
              </span>
              <h2 className="mt-2 font-serif text-xl text-primary">
                {entry.title}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(entry.date).toLocaleDateString()}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {entry.text}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </>
  );
}
