import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getCachedBlogCategoryOptions, getCachedBlogPost } from "@/lib/blog";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

// Authenticated admin page — never statically prerender at build time.
export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await getCachedBlogPost(id);
  if (!post) {
    notFound();
  }

  const categoryOptions = await getCachedBlogCategoryOptions();

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex flex-col gap-1">
        <Link
          href="/admin/blog"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Blog
        </Link>
        <h1 className="text-xl font-semibold">Edit Blog Post</h1>
      </div>

      <BlogPostForm
        mode="edit"
        postId={post.id}
        categoryOptions={categoryOptions}
        defaultValues={{
          title: post.title,
          slug: post.slug,
          categoryId: post.categoryId,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage ?? "",
          author: post.author,
          status: post.status,
          publishedAt: post.publishedAt,
        }}
      />
    </div>
  );
}
