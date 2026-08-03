"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DynamicForm, type DynamicField } from "@/components/form-builder";

export interface BlogCategoryFormValues {
  title: string;
  slug: string;
}

interface BlogCategoryFormProps {
  mode: "create" | "edit";
  categoryId?: string;
  defaultValues?: Partial<BlogCategoryFormValues>;
}

export function BlogCategoryForm({ mode, categoryId, defaultValues }: BlogCategoryFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const fields: DynamicField<BlogCategoryFormValues>[] = [
    {
      type: "input",
      name: "title",
      label: "Title",
      placeholder: "e.g. Edible Salt",
      colSpan: 12,
      required: true,
      rules: { required: "Title is required" },
    },
    {
      type: "slug",
      name: "slug",
      label: "Slug",
      placeholder: "e.g. edible-salt",
      helperText: "Lowercase letters, numbers and hyphens only.",
      colSpan: 12,
      required: true,
      rules: { required: "Slug is required" },
    },
  ];

  async function handleSubmit(values: BlogCategoryFormValues) {
    setSubmitting(true);
    try {
      const endpoint =
        mode === "create" ? "/api/blog/categories" : `/api/blog/categories/${categoryId}`;
      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error || "Could not save the blog category.");
        return;
      }

      toast.success(mode === "create" ? "Blog category created." : "Blog category updated.");
      router.push("/admin/blog/categories");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DynamicForm<BlogCategoryFormValues>
      fields={fields}
      defaultValues={{ title: "", slug: "", ...defaultValues }}
      onSubmit={handleSubmit}
      isSubmitting={submitting}
      submitLabel={mode === "create" ? "Create Category" : "Save Changes"}
    />
  );
}
