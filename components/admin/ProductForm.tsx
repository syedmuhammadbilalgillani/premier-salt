"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DynamicForm, type DynamicField, type GalleryImage } from "@/components/form-builder";
import {
  ProductVariantsEditor,
  type OptionDraft,
  type VariantDraft,
} from "@/components/admin/ProductVariantsEditor";

export interface ProductFormValues {
  title: string;
  slug: string;
  description: string;
  categoryId: string;
  basePrice: string;
  compareAtPrice: string;
  stockQuantity: string;
  sku: string;
  status: "draft" | "active" | "archived";
  channel: "catalog" | "shop";
  hasVariants: boolean;
  spec: Record<string, string>;
  images: GalleryImage[];
}

export interface CategoryOption {
  id: string;
  title: string;
}

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: string;
  defaultValues?: Partial<ProductFormValues>;
  categoryOptions: CategoryOption[];
  initialOptions?: OptionDraft[];
  initialVariants?: VariantDraft[];
}

const STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
];

const CHANNEL_OPTIONS = [
  { label: "Catalog (Category Page)", value: "catalog" },
  { label: "Shop (Direct Purchase)", value: "shop" },
];

export function ProductForm({
  mode,
  productId,
  defaultValues,
  categoryOptions,
  initialOptions = [],
  initialVariants = [],
}: ProductFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [options, setOptions] = useState<OptionDraft[]>(initialOptions);
  const [variants, setVariants] = useState<VariantDraft[]>(initialVariants);

  const form = useForm<ProductFormValues>({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      categoryId: "",
      basePrice: "",
      compareAtPrice: "",
      stockQuantity: "0",
      sku: "",
      status: "draft",
      channel: "catalog",
      hasVariants: false,
      spec: {},
      images: [],
      ...defaultValues,
    },
  });

  const hasVariants = form.watch("hasVariants");
  const images = form.watch("images");
  const channel = form.watch("channel");
  const isCatalog = channel === "catalog";
  const priceRequired = channel === "shop";

  // Catalog products are quote-based — no price, stock or variants. Reset
  // those fields when switching into catalog so a stale value from a prior
  // "shop" edit never gets silently saved.
  useEffect(() => {
    if (!isCatalog) return;
    form.setValue("hasVariants", false);
    form.setValue("basePrice", "");
    form.setValue("compareAtPrice", "");
    form.setValue("stockQuantity", "0");
    setOptions([]);
    setVariants([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCatalog]);

  const fields: DynamicField<ProductFormValues>[] = [
    {
      type: "input",
      name: "title",
      label: "Title",
      colSpan: 6,
      required: true,
      rules: { required: "Title is required" },
    },
    {
      type: "slug",
      name: "slug",
      label: "Slug",
      colSpan: 6,
      required: true,
      rules: { required: "Slug is required" },
    },
    {
      type: "select",
      name: "categoryId",
      label: "Category",
      colSpan: 6,
      required: true,
      rules: { required: "Category is required" },
      options: categoryOptions.map((c) => ({ label: c.title, value: c.id })),
    },
    {
      type: "select",
      name: "status",
      label: "Status",
      colSpan: 6,
      options: STATUS_OPTIONS,
    },
    {
      type: "select",
      name: "channel",
      label: "Channel",
      colSpan: 6,
      options: CHANNEL_OPTIONS,
      helperText:
        "Catalog products appear on their category page (size/packing table, quote-based). Shop products are excluded from the category page.",
    },
    {
      type: "input",
      name: "sku",
      label: "SKU",
      colSpan: isCatalog ? 6 : 4,
      helperText: "Only used when the product has no variants.",
    },
    {
      type: "input",
      name: "basePrice",
      label: "Base Price",
      inputType: "number",
      colSpan: 4,
      hidden: isCatalog,
      required: priceRequired,
      rules: priceRequired
        ? { required: "Base price is required for shop products" }
        : undefined,
      helperText: hasVariants ? "Fallback/reference price." : "Selling price.",
    },
    {
      type: "input",
      name: "compareAtPrice",
      label: "Compare-at Price",
      inputType: "number",
      colSpan: 4,
      hidden: isCatalog,
      helperText: "Optional — shown as a strikethrough price.",
    },
    {
      type: "input",
      name: "stockQuantity",
      label: "Stock Quantity",
      inputType: "number",
      colSpan: 4,
      hidden: isCatalog || hasVariants,
      helperText: "Only used when the product has no variants.",
    },
    {
      type: "textarea",
      name: "description",
      label: "Description",
      colSpan: 12,
      textareaProps: { rows: 4 },
    },
    {
      type: "switch",
      name: "hasVariants",
      label: "Has Variants",
      helperText: "Turn on to sell this product in multiple options (e.g. Color, Size).",
      colSpan: 12,
      hidden: isCatalog,
    },
    {
      type: "image-gallery",
      name: "images",
      label: "Product Images",
      colSpan: 12,
      uploadFolder: "products",
    },
    {
      type: "keyvalue",
      name: "spec",
      label: "Specifications",
      helperText: "Dynamic key-value details, e.g. Material, Origin, Weight.",
      colSpan: 12,
      keyPlaceholder: "e.g. Material",
      valuePlaceholder: "e.g. Cotton",
      addLabel: "Add specification",
    },
  ];

  async function handleSubmit(values: ProductFormValues) {
    setSubmitting(true);
    try {
      const endpoint = mode === "create" ? "/api/product" : `/api/product/${productId}`;
      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          compareAtPrice: values.compareAtPrice || null,
          stockQuantity: Math.max(0, Math.trunc(Number(values.stockQuantity) || 0)),
          images: values.images,
          options: hasVariants
            ? options
                .filter((o) => o.name.trim() && o.values.length)
                .map((o) => ({
                  name: o.name.trim(),
                  values: o.values.map((v) => ({
                    value: v.value,
                    priceModifier: v.priceModifier || "0",
                  })),
                }))
            : [],
          variants: hasVariants
            ? variants.map((v) => ({
                combination: v.combination,
                sku: v.sku || null,
                price: v.price,
                compareAtPrice: v.compareAtPrice || null,
                stockQuantity: v.stockQuantity,
                isActive: v.isActive,
                imageUrl: v.imageUrl || null,
              }))
            : [],
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error || "Could not save the product.");
        return;
      }

      toast.success(mode === "create" ? "Product created." : "Product updated.");
      router.push("/admin/products");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DynamicForm<ProductFormValues>
      form={form}
      fields={fields}
      onSubmit={handleSubmit}
      isSubmitting={submitting}
      submitLabel={mode === "create" ? "Create Product" : "Save Changes"}
      footer={
        hasVariants ? (
          <ProductVariantsEditor
            options={options}
            onOptionsChange={setOptions}
            variants={variants}
            onVariantsChange={setVariants}
            defaultPrice={form.getValues("basePrice")}
            availableImages={images.map((img) => ({
              url: img.url,
              isPrimary: img.isPrimary,
            }))}
          />
        ) : null
      }
    />
  );
}
