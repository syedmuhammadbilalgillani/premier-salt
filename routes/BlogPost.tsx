"use client";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { blogPosts } from "@/data/blogPosts";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";

export default function BlogPost() {
  const { postSlug } = useParams();
  const router = useRouter();
  const post = blogPosts.find((p) => p.slug === postSlug);
  if (!post) return notFound();

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
        crumbs={[{ label: "Blog", to: "/blog" }, { label: post.title }]}
      />
      <article className="mx-auto max-w-2xl px-6 py-16 md:px-8">
        <div className="mb-8 flex items-center gap-3 text-xs text-muted-foreground">
          <span>By Premier Salt Team</span> ·{" "}
          <span>{new Date(post.publishedDate).toLocaleDateString()}</span> ·{" "}
          <span>{post.readingTime}</span>
        </div>
        <Reveal>
          <ImagePlaceholder
            label={`${post.title} — Cover Image`}
            width={1200}
            height={700}
          />
        </Reveal>
        <div className="mt-8 flex flex-col gap-5">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed text-charcoal">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
      <div className="mx-auto max-w-7xl px-6 pb-20 md:px-8">
        <h2 className="mb-6 font-serif text-2xl text-primary">
          Related Articles
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/blog/${r.slug}`}
              className="group flex flex-col gap-2"
            >
              <ImagePlaceholder label={r.title} width={500} height={340} />
              <span className="text-sm font-medium text-charcoal group-hover:text-primary">
                {r.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
