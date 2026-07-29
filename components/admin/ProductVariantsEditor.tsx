"use client";

import { useState } from "react";
import { Plus, RefreshCw, Trash2, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface OptionValueDraft {
  id: string;
  value: string;
  priceModifier: string;
}

export interface OptionDraft {
  id: string;
  name: string;
  values: OptionValueDraft[];
}

export interface VariantDraft {
  id: string;
  combination: Record<string, string>;
  sku: string;
  price: string;
  compareAtPrice: string;
  stockQuantity: number;
  isActive: boolean;
  /** One of the product's own uploaded images — Shopify's model: variants
   *  pick from the product gallery, they don't get a separate upload. */
  imageUrl: string;
}

export interface VariantImageOption {
  url: string;
  isPrimary: boolean;
}

function makeId() {
  return crypto.randomUUID();
}

function fingerprint(combination: Record<string, string>) {
  return JSON.stringify(Object.entries(combination).sort());
}

interface ProductVariantsEditorProps {
  options: OptionDraft[];
  onOptionsChange: (next: OptionDraft[]) => void;
  variants: VariantDraft[];
  onVariantsChange: (next: VariantDraft[]) => void;
  defaultPrice: string;
  /** Images already uploaded to the product, offered as the variant image picker. */
  availableImages: VariantImageOption[];
}

export function ProductVariantsEditor({
  options,
  onOptionsChange,
  variants,
  onVariantsChange,
  defaultPrice,
  availableImages,
}: ProductVariantsEditorProps) {
  const [valueDrafts, setValueDrafts] = useState<Record<string, string>>({});

  const addOption = () =>
    onOptionsChange([...options, { id: makeId(), name: "", values: [] }]);

  const removeOption = (id: string) =>
    onOptionsChange(options.filter((o) => o.id !== id));

  const updateOptionName = (id: string, name: string) =>
    onOptionsChange(options.map((o) => (o.id === id ? { ...o, name } : o)));

  const addValue = (optionId: string) => {
    const raw = (valueDrafts[optionId] ?? "").trim();
    if (!raw) return;
    onOptionsChange(
      options.map((o) =>
        o.id === optionId
          ? {
              ...o,
              values: [...o.values, { id: makeId(), value: raw, priceModifier: "0" }],
            }
          : o,
      ),
    );
    setValueDrafts((d) => ({ ...d, [optionId]: "" }));
  };

  const removeValue = (optionId: string, valueId: string) =>
    onOptionsChange(
      options.map((o) =>
        o.id === optionId
          ? { ...o, values: o.values.filter((v) => v.id !== valueId) }
          : o,
      ),
    );

  const updateValueModifier = (
    optionId: string,
    valueId: string,
    priceModifier: string,
  ) =>
    onOptionsChange(
      options.map((o) =>
        o.id === optionId
          ? {
              ...o,
              values: o.values.map((v) =>
                v.id === valueId ? { ...v, priceModifier } : v,
              ),
            }
          : o,
      ),
    );

  const generateVariants = () => {
    const usable = options.filter((o) => o.name.trim() && o.values.length);
    if (!usable.length) return;

    const combos = usable.reduce<Record<string, string>[]>((acc, option) => {
      if (!acc.length) return option.values.map((v) => ({ [option.name]: v.value }));
      const next: Record<string, string>[] = [];
      for (const base of acc) {
        for (const v of option.values) {
          next.push({ ...base, [option.name]: v.value });
        }
      }
      return next;
    }, []);

    const existingByFingerprint = new Map(
      variants.map((v) => [fingerprint(v.combination), v]),
    );

    const next = combos.map((combination) => {
      const existing = existingByFingerprint.get(fingerprint(combination));
      if (existing) return existing;
      return {
        id: makeId(),
        combination,
        sku: "",
        price: defaultPrice || "0",
        compareAtPrice: "",
        stockQuantity: 0,
        isActive: true,
        imageUrl: "",
      };
    });

    onVariantsChange(next);
  };

  const updateVariant = (id: string, patch: Partial<VariantDraft>) =>
    onVariantsChange(variants.map((v) => (v.id === id ? { ...v, ...patch } : v)));

  return (
    <div className="space-y-6 rounded-lg border p-4">
      <div>
        <h3 className="text-sm font-semibold">Options</h3>
        <p className="text-xs text-muted-foreground">
          Define the option types (e.g. Color, Size) and their values. The
          number in each value chip is a price modifier added to the base
          price for that value.
        </p>
        <div className="mt-3 space-y-3">
          {options.map((option) => (
            <div key={option.id} className="rounded-md border p-3">
              <div className="flex items-center gap-2">
                <Input
                  value={option.name}
                  onChange={(e) => updateOptionName(option.id, e.target.value)}
                  placeholder="Option name, e.g. Color"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeOption(option.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              {option.values.length ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {option.values.map((v) => (
                    <span
                      key={v.id}
                      className="inline-flex items-center gap-1 rounded-full border bg-muted px-2 py-1 text-xs"
                    >
                      {v.value}
                      <input
                        type="number"
                        step="0.01"
                        value={v.priceModifier}
                        onChange={(e) =>
                          updateValueModifier(option.id, v.id, e.target.value)
                        }
                        title="Price modifier"
                        className="w-14 border-0 bg-transparent text-right text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeValue(option.id, v.id)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${v.value}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="mt-2 flex gap-2">
                <Input
                  value={valueDrafts[option.id] ?? ""}
                  onChange={(e) =>
                    setValueDrafts((d) => ({ ...d, [option.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addValue(option.id);
                    }
                  }}
                  placeholder="Add a value and press Enter"
                  className="h-8 flex-1 text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addValue(option.id)}
                >
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={addOption}>
          <Plus className="h-3.5 w-3.5" />
          Add option
        </Button>
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold">Variants</h3>
            <p className="text-xs text-muted-foreground">
              Generate one row per combination, then set price and stock.
            </p>
          </div>
          <Button type="button" size="sm" onClick={generateVariants}>
            <RefreshCw className="h-3.5 w-3.5" />
            Generate variants
          </Button>
        </div>

        {variants.length ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-2">Image</th>
                  <th className="py-2 pr-2">Combination</th>
                  <th className="py-2 pr-2">SKU</th>
                  <th className="py-2 pr-2">Price</th>
                  <th className="py-2 pr-2">Compare at</th>
                  <th className="py-2 pr-2">Stock</th>
                  <th className="py-2 pr-2">Active</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant) => (
                  <tr key={variant.id} className="border-b last:border-0">
                    <td className="py-2 pr-2">
                      <div className="flex items-center gap-1.5">
                        {variant.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={variant.imageUrl}
                            alt=""
                            className="h-8 w-8 shrink-0 rounded border object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 shrink-0 rounded border bg-muted" />
                        )}
                        <select
                          value={variant.imageUrl}
                          onChange={(e) =>
                            updateVariant(variant.id, { imageUrl: e.target.value })
                          }
                          disabled={!availableImages.length}
                          className="h-8 w-24 rounded-md border bg-background px-1 text-xs disabled:opacity-50"
                        >
                          <option value="">No image</option>
                          {availableImages.map((img, i) => (
                            <option key={img.url} value={img.url}>
                              Image {i + 1}
                              {img.isPrimary ? " (primary)" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="py-2 pr-2 font-medium whitespace-nowrap">
                      {Object.values(variant.combination).join(" / ")}
                    </td>
                    <td className="py-2 pr-2">
                      <Input
                        value={variant.sku}
                        onChange={(e) => updateVariant(variant.id, { sku: e.target.value })}
                        className="h-8 w-28 text-xs"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <Input
                        value={variant.price}
                        onChange={(e) => updateVariant(variant.id, { price: e.target.value })}
                        className="h-8 w-24 text-xs"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <Input
                        value={variant.compareAtPrice}
                        onChange={(e) =>
                          updateVariant(variant.id, { compareAtPrice: e.target.value })
                        }
                        className="h-8 w-24 text-xs"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <Input
                        type="number"
                        value={variant.stockQuantity}
                        onChange={(e) =>
                          updateVariant(variant.id, {
                            stockQuantity: Number(e.target.value) || 0,
                          })
                        }
                        className="h-8 w-20 text-xs"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="checkbox"
                        checked={variant.isActive}
                        onChange={(e) =>
                          updateVariant(variant.id, { isActive: e.target.checked })
                        }
                        className="h-4 w-4 accent-primary"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">
            No variants yet — add option values above, then click Generate
            variants.
          </p>
        )}
      </div>
    </div>
  );
}
