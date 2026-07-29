import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { getPolicy } from "@/data/policies";
import { notFound } from "next/navigation";

export default function PolicyPage() {
  const policy = getPolicy("privacy-policy");

  if (!policy) return notFound();

  return (
    <>
      <PageHero
        eyebrow="Policies"
        title={policy.title}
        description={`Last updated ${new Date(policy.updated).toLocaleDateString()}`}
        crumbs={[{ label: policy.title }]}
      />
      <div className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-16 md:px-8">
        {policy.sections.map((section) => (
          <Reveal key={section.heading}>
            <h2 className="mb-3 font-serif text-xl text-maroon">
              {section.heading}
            </h2>
            <p className="text-base leading-relaxed text-muted">
              {section.body}
            </p>
          </Reveal>
        ))}
      </div>
    </>
  );
}
