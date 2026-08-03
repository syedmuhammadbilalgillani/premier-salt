import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { cn } from "@/lib/utils";
import { getCachedPublishedBlogPosts, estimateReadingTime } from "@/lib/blog";

// Blog content is admin-managed and cache-tagged (revalidateTag on every
// blog-post mutation) — no need to force-dynamic a public page.

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: activeCategorySlug } = await searchParams;

  const allPosts = await getCachedPublishedBlogPosts();

  // Category pills are derived from posts that are actually published,
  // rather than the full blog_categories table, so a category with only
  // draft posts never shows an empty, dead-end filter.
  const categories = Array.from(
    new Map(allPosts.map((p) => [p.categorySlug, { slug: p.categorySlug, title: p.categoryTitle }])).values(),
  );

  const posts = activeCategorySlug
    ? allPosts.filter((p) => p.categorySlug === activeCategorySlug)
    : allPosts;

  const activeCategory = categories.find((c) => c.slug === activeCategorySlug);

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Blog"
        description="Practical guidance on Himalayan salt products, private labeling, and export sourcing."
        crumbs={
          activeCategory
            ? [{ label: "Blog", to: "/blog" }, { label: activeCategory.title }]
            : [{ label: "Blog" }]
        }
      />
      <div className="mx-auto max-w-7xl w-full px-6 py-16 md:px-8">
        {categories.length > 0 && (
          <div
            className="mb-10 flex flex-wrap gap-2"
            aria-label="Filter articles by category"
          >
            <Link
              href="/blog"
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                !activeCategorySlug
                  ? "border-primary bg-primary text-cream"
                  : "border-border text-charcoal hover:border-primary hover:text-primary",
              )}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/blog?category=${c.slug}`}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                  activeCategorySlug === c.slug
                    ? "border-primary bg-primary text-cream"
                    : "border-border text-charcoal hover:border-primary hover:text-primary",
                )}
              >
                {c.title}
              </Link>
            ))}
          </div>
        )}

        {posts.length ? (
          <Reveal
            key={activeCategorySlug ?? "all"}
            stagger
            className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {posts.map(
              (post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-3"
                >
                  {post.coverImage ? (
                    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 340px, 100vw"
                      />
                    </div>
                  ) : (
                    <ImagePlaceholder
                      label={post.title}
                      width={600}
                      height={400}
                    />
                  )}
                  <span className="text-xs uppercase tracking-wide text-primary">
                    {post.categoryTitle}
                  </span>
                  <h2 className="font-serif text-lg text-primary group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString()} ·{" "}
                    {estimateReadingTime(post.content)}
                  </span>
                </Link>
              ),
            )}
          </Reveal>
        ) : (
          <p className="text-sm text-muted-foreground">
            {activeCategory
              ? `No articles published in ${activeCategory.title} yet — check back soon.`
              : "No articles published yet — check back soon."}
          </p>
        )}
      </div>
    </>
  );
}
