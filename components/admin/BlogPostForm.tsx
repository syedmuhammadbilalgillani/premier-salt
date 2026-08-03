"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DynamicForm, type DynamicField } from "@/components/form-builder";

export interface BlogPostFormValues {
  title: string;
  slug: string;
  categoryId: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  status: "draft" | "published";
  publishedAt: string;
}

export interface BlogCategoryOption {
  id: string;
  title: string;
}

interface BlogPostFormProps {
  mode: "create" | "edit";
  postId?: string;
  defaultValues?: Partial<BlogPostFormValues>;
  categoryOptions: BlogCategoryOption[];
}

const STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
];

function toDateInputValue(iso: string) {
  return iso ? iso.slice(0, 10) : "";
}

export function BlogPostForm({
  mode,
  postId,
  defaultValues,
  categoryOptions,
}: BlogPostFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const fields: DynamicField<BlogPostFormValues>[] = [
    {
      type: "input",
      name: "title",
      label: "Title",
      placeholder: "e.g. How to Choose the Right Himalayan Salt Grain Size",
      colSpan: 12,
      required: true,
      rules: { required: "Title is required" },
    },
    {
      type: "slug",
      name: "slug",
      label: "Slug",
      helperText: "Used in the post's URL. Lowercase letters, numbers and hyphens only.",
      colSpan: 6,
      required: true,
      rules: { required: "Slug is required" },
    },
    {
      type: "select",
      name: "categoryId",
      label: "Category",
      helperText: "Manage categories from Blog → Categories.",
      colSpan: 4,
      required: true,
      rules: { required: "Category is required" },
      options: categoryOptions.map((c) => ({ label: c.title, value: c.id })),
    },
    {
      type: "textarea",
      name: "excerpt",
      label: "Excerpt",
      placeholder: "A one or two sentence summary shown on the blog listing.",
      helperText: "Shown on the blog listing page and as the post's intro line.",
      colSpan: 12,
      required: true,
      rules: { required: "Excerpt is required" },
    },
    {
      type: "tiptapEditor",
      name: "content",
      label: "Content",
      placeholder: "Write the full post.",
      colSpan: 12,
      required: true,
      rules: { required: "Content is required" },
      fieldWrapperClassName: "col-span-12",
    },
    {
      type: "image",
      name: "coverImage",
      label: "Cover Image",
      colSpan: 12,
      cropAspect: 12 / 7,
      cardPreview: "category",
      uploadFolder: "blog",
    },
    {
      type: "input",
      name: "author",
      label: "Author",
      placeholder: "Premier Salt Team",
      colSpan: 6,
    },
    {
      type: "select",
      name: "status",
      label: "Status",
      colSpan: 3,
      options: STATUS_OPTIONS,
    },
    {
      type: "input",
      name: "publishedAt",
      label: "Publish Date",
      inputType: "date",
      helperText: "A future date keeps the post hidden until then.",
      colSpan: 3,
    },
  ];

  async function handleSubmit(values: BlogPostFormValues) {
    setSubmitting(true);
    try {
      const endpoint = mode === "create" ? "/api/blog" : `/api/blog/${postId}`;
      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          publishedAt: values.publishedAt || undefined,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error || "Could not save the blog post.");
        return;
      }

      toast.success(mode === "create" ? "Blog post created." : "Blog post updated.");
      router.push("/admin/blog");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DynamicForm<BlogPostFormValues>
      fields={fields}
      defaultValues={{
        title: "",
        slug: "",
        categoryId: "",
        excerpt: "",
        content: "",
        coverImage: "",
        author: "Premier Salt Team",
        status: "draft",
        publishedAt: toDateInputValue(new Date().toISOString()),
        ...defaultValues,
        ...(defaultValues?.publishedAt
          ? { publishedAt: toDateInputValue(defaultValues.publishedAt) }
          : {}),
      }}
      onSubmit={handleSubmit}
      isSubmitting={submitting}
      submitLabel={mode === "create" ? "Create Post" : "Save Changes"}
    />
  );
}
