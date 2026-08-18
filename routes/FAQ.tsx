"use client";

import { useMemo, useState } from "react";
import { PageHero } from "@/components/layout/PageHero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqGroups } from "@/data/faqs";

export default function FAQ() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return faqGroups;

    return faqGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.question.toLowerCase().includes(q) ||
            item.answer.toLowerCase().includes(q),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Frequently Asked Questions"
        description="Answers to common questions about our company, products, wholesale, export, and retail orders."
        crumbs={[{ label: "FAQ" }]}
        image="/assets/FAQ-Hero-Pic.webp"
      />

      <div className="mx-auto max-w-3xl w-full px-6 py-16 md:px-8">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search questions…"
          aria-label="Search frequently asked questions"
          className="mb-10 w-full rounded-sm border border-border bg-white px-4 py-3 text-sm focus-visible:outline-primary"
        />

        {filtered.length === 0 ? (
          <p className="text-muted-foreground">
            No questions match your search.
          </p>
        ) : (
          <div className="flex flex-col gap-12">
            {filtered.map((group) => (
              <section key={group.group}>
                <h2 className="mb-5 font-serif text-2xl text-primary">
                  {group.group}
                </h2>

                <Accordion type="multiple" className="w-full">
                  {group.items.map((item, index) => (
                    <AccordionItem
                      key={item.question}
                      value={`${group.group}-${index}`}
                    >
                      <AccordionTrigger className="text-base">
                        {item.question}
                      </AccordionTrigger>

                      <AccordionContent className="leading-6 text-muted-foreground">
                        <p>{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
