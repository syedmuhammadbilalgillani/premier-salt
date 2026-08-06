"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DynamicForm, type DynamicField } from "@/components/form-builder";

export interface CategoryFormValues {
  title: string;
  slug: string;
  description: string;
  image_url: string;
  parentCategoryId: string;
  spec: Record<string, string>;
}

export interface CategoryOption {
  id: string;
  title: string;
}

interface CategoryFormProps {
  mode: "create" | "edit";
  categoryId?: string;
  defaultValues?: Partial<CategoryFormValues>;
  /** All categories, for the parent-category selector. */
  categoryOptions?: CategoryOption[];
}

const NO_PARENT = "none";

export function CategoryForm({
  mode,
  categoryId,
  defaultValues,
  categoryOptions = [],
}: CategoryFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const fields: DynamicField<CategoryFormValues>[] = [
    {
      type: "input",
      name: "title",
      label: "Title",
      placeholder: "e.g. Edible Salts",
      colSpan: 12,
      required: true,
      rules: { required: "Title is required" },
    },
    {
      type: "slug",
      name: "slug",
      label: "Slug",
      placeholder: "e.g. edible-salts",
      helperText:
        "Used in the category's URL. Lowercase letters, numbers and hyphens only.",
      colSpan: 12,
      required: true,
      rules: { required: "Slug is required" },
    },
    {
      type: "select",
      name: "parentCategoryId",
      label: "Parent Category",
      helperText:
        "Optional — leave as top-level, or nest under another category.",
      colSpan: 12,
      options: [
        { label: "None (top-level)", value: NO_PARENT },
        ...categoryOptions
          .filter((c) => c.id !== categoryId)
          .map((c) => ({ label: c.title, value: c.id })),
      ],
    },
    {
      type: "tiptapEditor",
      name: "description",
      label: "Description",
      placeholder: "Shown on the category page.",
      colSpan: 12,
      fieldWrapperClassName: "col-span-12",
    },
    {
      type: "image",
      name: "image_url",
      label: "Category Image",
      helperText:
        "Cropped to 16:9 — the same ratio as the category's detail page hero, so the full image shows there without unexpected cropping.",
      colSpan: 12,
      // Matches the hero aspect ratio used on both CategoryHubView and
      // CategoryLeafView (app/(frontsite)/[category]/...) so an image
      // cropped here displays in full on the detail page. The homepage's
      // category grid crops to a different (4:3) card ratio and shows the
      // image's center there via object-cover + object-center.
      cropAspect: 16 / 9,
      previewAspect: "aspect-[16/9]",
      cardPreview: "category",
      uploadFolder: "categories",
    },
    {
      type: "keyvalue",
      name: "spec",
      label: "Specifications",
      helperText: "Dynamic key-value details, e.g. Origin, Purity, Grain Size.",
      colSpan: 12,
      keyPlaceholder: "e.g. Purity",
      valuePlaceholder: "e.g. 99.9%",
      addLabel: "Add specification",
    },
  ];

  async function handleSubmit(values: CategoryFormValues) {
    setSubmitting(true);
    try {
      const endpoint =
        mode === "create" ? "/api/category" : `/api/category/${categoryId}`;
      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          parentCategoryId:
            values.parentCategoryId === NO_PARENT
              ? null
              : values.parentCategoryId,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error || "Could not save the category.");
        return;
      }

      toast.success(
        mode === "create" ? "Category created." : "Category updated.",
      );
      router.push("/admin/categories");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DynamicForm<CategoryFormValues>
      fields={fields}
      defaultValues={{
        title: "",
        slug: "",
        description: "",
        image_url: "",
        parentCategoryId: NO_PARENT,
        spec: {},
        ...defaultValues,
      }}
      onSubmit={handleSubmit}
      isSubmitting={submitting}
      submitLabel={mode === "create" ? "Create Category" : "Save Changes"}
    />
  );
}
