import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { blogPosts } from "@/data/blogPosts";

export default function Blog() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Blog"
        description="Practical guidance on Himalayan salt products, private labeling, and export sourcing."
        crumbs={[{ label: "Blog" }]}
      />
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <Reveal
          stagger
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-3"
            >
              <ImagePlaceholder label={post.title} width={600} height={400} />
              <span className="text-xs uppercase tracking-wide text-terracotta">
                {post.category}
              </span>
              <h2 className="font-serif text-lg text-maroon group-hover:text-terracotta">
                {post.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted">
                {post.excerpt}
              </p>
              <span className="text-xs text-muted">
                {new Date(post.publishedDate).toLocaleDateString()} ·{" "}
                {post.readingTime}
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </>
  );
}
