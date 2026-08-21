import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import {
  estimateReadingTime,
  getCachedPublishedBlogPostBySlug,
  getCachedPublishedBlogPosts,
  getCachedRelatedBlogPosts,
} from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getArticleSchema, getBreadcrumbSchema } from "@/lib/schema";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getCachedPublishedBlogPosts();
  return posts.map((p) => ({
    categorySlug: p.categorySlug,
    postSlug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; postSlug: string }>;
}): Promise<Metadata> {
  const { categorySlug, postSlug } = await params;
  const post = await getCachedPublishedBlogPostBySlug(postSlug);
  if (!post) {
    return buildMetadata({
      title: "Blog Post",
      description: "",
      path: `/blog/${categorySlug}/${postSlug}`,
      noindex: true,
    });
  }

  return buildMetadata({
    title: `${post.title} | Premier Salt Blog`,
    description: post.excerpt,
    path: `/blog/${post.categorySlug}/${post.slug}`,
    image: post.coverImage ?? undefined,
    type: "article",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ categorySlug: string; postSlug: string }>;
}) {
  const { categorySlug, postSlug } = await params;

  const post = await getCachedPublishedBlogPostBySlug(postSlug);
  if (!post) notFound();

  // Post slugs are globally unique — the category segment is just the
  // canonical URL prefix, so a stale/wrong one redirects instead of 404ing.
  if (post.categorySlug !== categorySlug) {
    redirect(`/blog/${post.categorySlug}/${post.slug}`);
  }

  const related = await getCachedRelatedBlogPosts(post.id, post.categoryId, 3);

  const articleSchema = getArticleSchema({
    title: post.title,
    description: post.excerpt,
    url: `/blog/${post.categorySlug}/${post.slug}`,
    image: post.coverImage ?? undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    authorName: post.author,
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Blog", url: "/blog" },
    { name: post.categoryTitle, url: `/blog/${post.categorySlug}` },
    { name: post.title, url: `/blog/${post.categorySlug}/${post.slug}` },
  ]);

  return (
    <>
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      <PageHero
        eyebrow={post.categoryTitle}
        title={post.title}
        description={post.excerpt}
        crumbs={[
          { label: "Blog", to: "/blog" },
          { label: post.categoryTitle, to: `/blog/${post.categorySlug}` },
          { label: post.title },
        ]}
      />
      <article className="mx-auto w-full max-w-2xl px-6 py-16 md:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <Link
            href={`/blog/${post.categorySlug}`}
            className="font-semibold uppercase tracking-wide text-primary hover:text-primary/80"
          >
            {post.categoryTitle}
          </Link>
          <span>By {post.author}</span> ·{" "}
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span> ·{" "}
          <span>{estimateReadingTime(post.content)}</span>
        </div>
        <Reveal>
          {post.coverImage ? (
            <div className="relative aspect-[12/7] w-full overflow-hidden rounded-md">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 700px, 100vw"
                priority
              />
            </div>
          ) : (
            <ImagePlaceholder
              label={`${post.title} — Cover Image`}
              width={1200}
              height={700}
            />
          )}
        </Reveal>
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          className={[
            "mt-8 text-base leading-relaxed text-charcoal",
            "[&_p]:my-4 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
            "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5",
            "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5",
            "[&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic",
            "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-primary",
            "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:text-primary",
            "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
          ].join(" ")}
        />
      </article>
      {related.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 pb-20 md:px-8">
          <h2 className="mb-6 font-serif text-2xl text-primary">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.categorySlug}/${r.slug}`}
                className="group flex flex-col gap-2"
              >
                {r.coverImage ? (
                  <div className="relative aspect-[5/3.4] w-full overflow-hidden rounded-md">
                    <Image
                      src={r.coverImage}
                      alt={r.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(min-width: 640px) 320px, 90vw"
                    />
                  </div>
                ) : (
                  <ImagePlaceholder label={r.title} width={500} height={340} />
                )}
                <span className="text-sm font-medium text-charcoal group-hover:text-primary">
                  {r.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
