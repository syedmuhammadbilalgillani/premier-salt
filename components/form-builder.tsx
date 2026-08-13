"use client";

import * as React from "react";
import {
  Controller,
  type DefaultValues,
  type FieldValues,
  type Path,
  type RegisterOptions,
  type SubmitHandler,
  type UseFormReturn,
  useForm,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Crop,
  Eye,
  EyeOff,
  ImagePlus,
  Link2,
  Loader2,
  Maximize2,
  Minimize2,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { toast } from "sonner";
import Editor from "./editor";
// import {} from "@/lib/api-client";

type FieldDependencyOperator =
  | "equals"
  | "notEquals"
  | "in"
  | "notIn"
  | "truthy"
  | "falsy";

export type DynamicOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type DynamicFieldBase<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  hidden?: boolean;
  className?: string;
  fieldWrapperClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  dependsOn?: {
    field: Path<TFieldValues>;
    operator?: FieldDependencyOperator;
    value?: unknown;
  };
};

type InputField<TFieldValues extends FieldValues> =
  DynamicFieldBase<TFieldValues> & {
    type: "input";
    inputType?: React.InputHTMLAttributes<HTMLInputElement>["type"];
    inputProps?: Omit<
      React.ComponentProps<"input">,
      "name" | "type" | "disabled" | "required"
    >;
  };

type SlugField<TFieldValues extends FieldValues> =
  DynamicFieldBase<TFieldValues> & {
    type: "slug";
    inputProps?: Omit<
      React.ComponentProps<"input">,
      "name" | "type" | "disabled" | "required"
    >;
  };

type TextareaField<TFieldValues extends FieldValues> =
  DynamicFieldBase<TFieldValues> & {
    type: "textarea";
    textareaProps?: Omit<
      React.ComponentProps<"textarea">,
      "name" | "disabled" | "required"
    >;
  };

type SelectField<TFieldValues extends FieldValues> =
  DynamicFieldBase<TFieldValues> & {
    type: "select";
    options: DynamicOption[];
    selectProps?: {
      triggerClassName?: string;
      contentClassName?: string;
    };
  };

type RadioField<TFieldValues extends FieldValues> =
  DynamicFieldBase<TFieldValues> & {
    type: "radio";
    options: DynamicOption[];
    radioGroupClassName?: string;
  };

type SwitchField<TFieldValues extends FieldValues> =
  DynamicFieldBase<TFieldValues> & {
    type: "switch";
  };

type CheckboxField<TFieldValues extends FieldValues> =
  DynamicFieldBase<TFieldValues> & {
    type: "checkbox";
  };

type ImageField<TFieldValues extends FieldValues> =
  DynamicFieldBase<TFieldValues> & {
    type: "image";
    /** Max bytes — defaults to 5 MB. Server enforces this independently. */
    maxBytes?: number;
    /** Accept attribute (overrides default of all images). */
    accept?: string;
    /** Aspect ratio class for the preview box (e.g. "aspect-square"). */
    previewAspect?: string;
    /**
     * Enables the crop / pan / zoom "Adjust" editor and locks its frame to
     * this ratio (width ÷ height). Use the front-site card ratio — e.g. `2`
     * for the 2:1 menu card, `1` for the square category tile. When omitted
     * the field keeps the plain upload-and-store behaviour.
     */
    cropAspect?: number;
    /** Renders a live front-site card preview of the current image. */
    cardPreview?: "menu" | "category";
    /**
     * Folder under the file manager's storage root to upload into (e.g.
     * "categories"). Defaults to "uploads".
     */
    uploadFolder?: string;
  };

export type GalleryImage = {
  url: string;
  altText: string;
  isPrimary: boolean;
};

type ImageGalleryField<TFieldValues extends FieldValues> =
  DynamicFieldBase<TFieldValues> & {
    type: "image-gallery";
    /** Field value is GalleryImage[]. */
    maxBytes?: number;
    accept?: string;
    /** Folder under the file manager's storage root. Defaults to "uploads". */
    uploadFolder?: string;
    /**
     * Enables the crop / pan / zoom "Adjust" editor and locks its frame to
     * this ratio (width ÷ height) — e.g. `1` to match the square storefront
     * product card. When set, images are added one at a time (each goes
     * through the crop editor before upload) instead of in bulk.
     */
    cropAspect?: number;
  };

type CheckboxGroupField<TFieldValues extends FieldValues> =
  DynamicFieldBase<TFieldValues> & {
    type: "checkbox-group";
    options: DynamicOption[];
    direction?: "row" | "column";
  };

type KeyValueField<TFieldValues extends FieldValues> =
  DynamicFieldBase<TFieldValues> & {
    type: "keyvalue";
    /** Field value is a flat Record<string, string>. */
    keyPlaceholder?: string;
    valuePlaceholder?: string;
    addLabel?: string;
  };

type TiptapEditorField<TFieldValues extends FieldValues> =
  DynamicFieldBase<TFieldValues> & {
    type: "tiptapEditor";
  };

export type DynamicField<TFieldValues extends FieldValues> =
  | InputField<TFieldValues>
  | SlugField<TFieldValues>
  | TextareaField<TFieldValues>
  | SelectField<TFieldValues>
  | RadioField<TFieldValues>
  | SwitchField<TFieldValues>
  | CheckboxField<TFieldValues>
  | CheckboxGroupField<TFieldValues>
  | KeyValueField<TFieldValues>
  | ImageGalleryField<TFieldValues>
  | ImageField<TFieldValues>
  | TiptapEditorField<TFieldValues>;

function toStrictSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type DynamicFormSection<TFieldValues extends FieldValues> = {
  id: string;
  title?: string;
  description?: string;
  className?: string;
  fields: DynamicField<TFieldValues>[];
};

export type DynamicFormProps<TFieldValues extends FieldValues> = {
  fields?: DynamicField<TFieldValues>[];
  sections?: DynamicFormSection<TFieldValues>[];
  defaultValues?: DefaultValues<TFieldValues>;
  form?: UseFormReturn<TFieldValues>;
  onSubmit: (values: TFieldValues) => void | Promise<void>;
  transformValues?: (values: TFieldValues) => TFieldValues;
  className?: string;
  formGridClassName?: string;
  submitLabel?: string;
  submitButtonClassName?: string;
  submitButtonVariant?: React.ComponentProps<typeof Button>["variant"];
  submitButtonSize?: React.ComponentProps<typeof Button>["size"];
  hideSubmitButton?: boolean;
  isSubmitting?: boolean;
  footer?: React.ReactNode;
};

function shouldShowField<TFieldValues extends FieldValues>(
  field: DynamicField<TFieldValues>,
  values: TFieldValues,
) {
  if (field.hidden) {
    return false;
  }

  if (!field.dependsOn) {
    return true;
  }

  const sourceValue = values[field.dependsOn.field];
  const operator = field.dependsOn.operator ?? "equals";
  const compareValue = field.dependsOn.value;

  switch (operator) {
    case "notEquals":
      return sourceValue !== compareValue;
    case "in":
      return Array.isArray(compareValue) && compareValue.includes(sourceValue);
    case "notIn":
      return Array.isArray(compareValue) && !compareValue.includes(sourceValue);
    case "truthy":
      return Boolean(sourceValue);
    case "falsy":
      return !sourceValue;
    case "equals":
    default:
      return sourceValue === compareValue;
  }
}

function getGridSpanClass(span?: DynamicFieldBase<FieldValues>["colSpan"]) {
  switch (span) {
    case 1:
      return "md:col-span-1";
    case 2:
      return "md:col-span-2";
    case 3:
      return "md:col-span-3";
    case 4:
      return "md:col-span-4";
    case 5:
      return "md:col-span-5";
    case 6:
      return "md:col-span-6";
    case 12:
      return "md:col-span-12";
    default:
      return "md:col-span-6";
  }
}

function FieldShell({
  id,
  label,
  helperText,
  error,
  required,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  children,
}: {
  id: string;
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <Label
          htmlFor={id}
          className={cn("text-sm font-medium", labelClassName)}
        >
          {label}
          {required ? <span className="text-destructive">*</span> : null}
        </Label>
      ) : null}
      {children}
      {helperText ? (
        <p
          className={cn("text-xs text-muted-foreground", descriptionClassName)}
        >
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p className={cn("text-xs text-destructive", errorClassName)}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function DynamicFieldRenderer<TFieldValues extends FieldValues>({
  field,
  form,
}: {
  field: DynamicField<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
}) {
  const fieldError = form.formState.errors[field.name];
  const errorText = fieldError?.message as string | undefined;
  const id = `dynamic-form-${String(field.name)}`;
  const isRequired = Boolean(field.required || field.rules?.required);

  switch (field.type) {
    case "slug":
      return (
        <FieldShell
          id={id}
          label={field.label}
          helperText={field.helperText}
          error={errorText}
          required={isRequired}
          className={field.fieldWrapperClassName}
          labelClassName={field.labelClassName}
          descriptionClassName={field.descriptionClassName}
          errorClassName={field.errorClassName}
        >
          <Controller
            control={form.control}
            name={field.name}
            rules={field.rules}
            render={({ field: controllerField }) => (
              <Input
                id={id}
                type="text"
                placeholder={field.placeholder}
                disabled={field.disabled}
                required={field.required}
                className={field.inputClassName}
                {...field.inputProps}
                value={(controllerField.value as string | undefined) ?? ""}
                onChange={(event) =>
                  controllerField.onChange(toStrictSlug(event.target.value))
                }
                onBlur={controllerField.onBlur}
                name={controllerField.name}
                ref={controllerField.ref}
              />
            )}
          />
        </FieldShell>
      );

    case "textarea":
      return (
        <FieldShell
          id={id}
          label={field.label}
          helperText={field.helperText}
          error={errorText}
          required={isRequired}
          className={field.fieldWrapperClassName}
          labelClassName={field.labelClassName}
          descriptionClassName={field.descriptionClassName}
          errorClassName={field.errorClassName}
        >
          <Textarea
            id={id}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
            className={field.inputClassName}
            {...field.textareaProps}
            {...form.register(field.name, field.rules)}
          />
        </FieldShell>
      );

    case "tiptapEditor":
      return (
        <FieldShell
          id={id}
          label={field.label}
          helperText={field.helperText}
          error={errorText}
          required={isRequired}
          className={field.fieldWrapperClassName}
          labelClassName={field.labelClassName}
          descriptionClassName={field.descriptionClassName}
          errorClassName={field.errorClassName}
        >
          <Controller
            control={form.control}
            name={field.name}
            rules={field.rules}
            render={({ field: controllerField }) => (
              <Editor
                content={(controllerField.value as string | undefined) ?? ""}
                onChange={controllerField.onChange}
                placeholder={field.placeholder}
                disabled={field.disabled}
              />
            )}
          />
        </FieldShell>
      );
    case "select":
      return (
        <FieldShell
          id={id}
          label={field.label}
          helperText={field.helperText}
          error={errorText}
          required={isRequired}
          className={field.fieldWrapperClassName}
          labelClassName={field.labelClassName}
          descriptionClassName={field.descriptionClassName}
          errorClassName={field.errorClassName}
        >
          <Controller
            control={form.control}
            name={field.name}
            rules={field.rules}
            render={({ field: controllerField }) => (
              <Select
                value={(controllerField.value as string | undefined) ?? ""}
                onValueChange={controllerField.onChange}
                disabled={field.disabled}
              >
                <SelectTrigger
                  id={id}
                  className={cn("w-full", field.selectProps?.triggerClassName)}
                >
                  <SelectValue
                    placeholder={field.placeholder ?? "Select an option"}
                  />
                </SelectTrigger>
                <SelectContent
                  className={cn(
                    "bg-white",
                    field.selectProps?.contentClassName,
                  )}
                >
                  {field.options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FieldShell>
      );

    case "radio":
      return (
        <FieldShell
          id={id}
          label={field.label}
          helperText={field.helperText}
          error={errorText}
          required={isRequired}
          className={field.fieldWrapperClassName}
          labelClassName={field.labelClassName}
          descriptionClassName={field.descriptionClassName}
          errorClassName={field.errorClassName}
        >
          <Controller
            control={form.control}
            name={field.name}
            rules={field.rules}
            render={({ field: controllerField }) => (
              <RadioGroup
                value={(controllerField.value as string | undefined) ?? ""}
                onValueChange={controllerField.onChange}
                className={cn("gap-3", field.radioGroupClassName)}
              >
                {field.options.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex items-center gap-2 rounded-md border p-2 text-sm",
                      option.disabled
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer",
                    )}
                  >
                    <RadioGroupItem
                      value={option.value}
                      disabled={option.disabled || field.disabled}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </RadioGroup>
            )}
          />
        </FieldShell>
      );

    case "switch":
      return (
        <FieldShell
          id={id}
          label={field.label}
          helperText={field.helperText}
          error={errorText}
          required={isRequired}
          className={field.fieldWrapperClassName}
          labelClassName={field.labelClassName}
          descriptionClassName={field.descriptionClassName}
          errorClassName={field.errorClassName}
        >
          <Controller
            control={form.control}
            name={field.name}
            rules={field.rules}
            render={({ field: controllerField }) => (
              <div className="flex items-center gap-3">
                <Switch
                  checked={Boolean(controllerField.value)}
                  onCheckedChange={controllerField.onChange}
                  disabled={field.disabled}
                />
                <span className="text-sm text-muted-foreground">
                  {Boolean(controllerField.value) ? "Enabled" : "Disabled"}
                </span>
              </div>
            )}
          />
        </FieldShell>
      );

    case "checkbox":
      return (
        <FieldShell
          id={id}
          label={field.label}
          helperText={field.helperText}
          error={errorText}
          required={isRequired}
          className={field.fieldWrapperClassName}
          labelClassName={field.labelClassName}
          descriptionClassName={field.descriptionClassName}
          errorClassName={field.errorClassName}
        >
          <Controller
            control={form.control}
            name={field.name}
            rules={field.rules}
            render={({ field: controllerField }) => (
              <input
                id={id}
                type="checkbox"
                checked={Boolean(controllerField.value)}
                onChange={(event) =>
                  controllerField.onChange(event.target.checked)
                }
                disabled={field.disabled}
                className={cn(
                  "h-4 w-4 rounded border border-input text-primary accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  field.inputClassName,
                )}
              />
            )}
          />
        </FieldShell>
      );

    case "checkbox-group":
      return (
        <FieldShell
          id={id}
          label={field.label}
          helperText={field.helperText}
          error={errorText}
          required={isRequired}
          className={field.fieldWrapperClassName}
          labelClassName={field.labelClassName}
          descriptionClassName={field.descriptionClassName}
          errorClassName={field.errorClassName}
        >
          <Controller
            control={form.control}
            name={field.name}
            rules={field.rules}
            render={({ field: controllerField }) => {
              const selectedValues = Array.isArray(controllerField.value)
                ? (controllerField.value as string[])
                : [];
              return (
                <div
                  className={cn(
                    "gap-2",
                    field.direction === "row"
                      ? "flex flex-wrap items-center"
                      : "grid",
                  )}
                >
                  {field.options.map((option) => {
                    const checked = selectedValues.includes(option.value);
                    return (
                      <label
                        key={option.value}
                        className={cn(
                          "flex items-center gap-2 rounded-md border p-2 text-sm",
                          option.disabled
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer",
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={option.disabled || field.disabled}
                          onChange={(event) => {
                            if (event.target.checked) {
                              controllerField.onChange([
                                ...selectedValues,
                                option.value,
                              ]);
                              return;
                            }
                            controllerField.onChange(
                              selectedValues.filter(
                                (item) => item !== option.value,
                              ),
                            );
                          }}
                          className="h-4 w-4 rounded border border-input accent-primary"
                        />
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
              );
            }}
          />
        </FieldShell>
      );

    case "keyvalue":
      return (
        <FieldShell
          id={id}
          label={field.label}
          helperText={field.helperText}
          error={errorText}
          required={isRequired}
          className={field.fieldWrapperClassName}
          labelClassName={field.labelClassName}
          descriptionClassName={field.descriptionClassName}
          errorClassName={field.errorClassName}
        >
          <Controller
            control={form.control}
            name={field.name}
            rules={field.rules}
            render={({ field: controllerField }) => (
              <KeyValueEditor
                value={
                  (controllerField.value as
                    | Record<string, string>
                    | undefined) ?? {}
                }
                onChange={controllerField.onChange}
                disabled={field.disabled}
                keyPlaceholder={field.keyPlaceholder ?? "Key"}
                valuePlaceholder={field.valuePlaceholder ?? "Value"}
                addLabel={field.addLabel ?? "Add field"}
              />
            )}
          />
        </FieldShell>
      );

    case "image-gallery":
      return (
        <FieldShell
          id={id}
          label={field.label}
          helperText={field.helperText}
          error={errorText}
          required={isRequired}
          className={field.fieldWrapperClassName}
          labelClassName={field.labelClassName}
          descriptionClassName={field.descriptionClassName}
          errorClassName={field.errorClassName}
        >
          <Controller
            control={form.control}
            name={field.name}
            rules={field.rules}
            render={({ field: controllerField }) => (
              <ImageGalleryEditor
                value={
                  (controllerField.value as GalleryImage[] | undefined) ?? []
                }
                onChange={controllerField.onChange}
                disabled={field.disabled}
                accept={
                  field.accept ??
                  "image/png,image/jpeg,image/webp,image/gif,image/avif"
                }
                maxBytes={field.maxBytes ?? 5 * 1024 * 1024}
                uploadFolder={field.uploadFolder ?? "uploads"}
                cropAspect={field.cropAspect}
              />
            )}
          />
        </FieldShell>
      );

    case "image":
      return (
        <FieldShell
          id={id}
          label={field.label}
          helperText={field.helperText}
          error={errorText}
          required={isRequired}
          className={field.fieldWrapperClassName}
          labelClassName={field.labelClassName}
          descriptionClassName={field.descriptionClassName}
          errorClassName={field.errorClassName}
        >
          <Controller
            control={form.control}
            name={field.name}
            rules={field.rules}
            render={({ field: controllerField }) => (
              <ImageUploadField
                id={id}
                value={(controllerField.value as string | undefined) ?? ""}
                onChange={controllerField.onChange}
                disabled={field.disabled}
                accept={
                  field.accept ??
                  "image/png,image/jpeg,image/webp,image/gif,image/avif"
                }
                maxBytes={field.maxBytes ?? 5 * 1024 * 1024}
                previewAspect={field.previewAspect ?? "aspect-square"}
                cropAspect={field.cropAspect}
                cardPreview={field.cardPreview}
                uploadFolder={field.uploadFolder ?? "uploads"}
              />
            )}
          />
        </FieldShell>
      );

    case "input":
    default:
      return (
        <FieldShell
          id={id}
          label={field.label}
          helperText={field.helperText}
          error={errorText}
          required={isRequired}
          className={field.fieldWrapperClassName}
          labelClassName={field.labelClassName}
          descriptionClassName={field.descriptionClassName}
          errorClassName={field.errorClassName}
        >
          {field.inputType === "password" ? (
            <PasswordInputWithToggle
              id={id}
              className={field.inputClassName}
              placeholder={field.placeholder}
              disabled={field.disabled}
              required={field.required}
              {...field.inputProps}
              {...form.register(field.name, field.rules)}
            />
          ) : (
            <Input
              id={id}
              type={field.inputType ?? "text"}
              placeholder={field.placeholder}
              disabled={field.disabled}
              required={field.required}
              className={field.inputClassName}
              {...field.inputProps}
              {...form.register(field.name, field.rules)}
            />
          )}
        </FieldShell>
      );
  }
}

export function DynamicForm<TFieldValues extends FieldValues>({
  fields = [],
  sections = [],
  defaultValues,
  form: providedForm,
  onSubmit,
  transformValues,
  className,
  formGridClassName,
  submitLabel = "Submit",
  submitButtonClassName,
  submitButtonVariant = "default",
  submitButtonSize = "default",
  hideSubmitButton = false,
  isSubmitting,
  footer,
}: DynamicFormProps<TFieldValues>) {
  const internalForm = useForm<TFieldValues>({ defaultValues });
  const form = providedForm ?? internalForm;
  const currentValues = form.watch();
  const allFields = React.useMemo(
    () =>
      sections.length ? sections.flatMap((section) => section.fields) : fields,
    [fields, sections],
  );

  const handleSubmit: SubmitHandler<TFieldValues> = async (values) => {
    const output = transformValues ? transformValues(values) : values;
    await onSubmit(output);
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className={cn("space-y-6", className)}
    >
      {sections.length ? (
        sections.map((section) => (
          <section
            key={section.id}
            className={cn("space-y-4", section.className)}
          >
            {(section.title || section.description) && (
              <div className="space-y-1">
                {section.title ? (
                  <h3 className="text-base font-semibold">{section.title}</h3>
                ) : null}
                {section.description ? (
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                ) : null}
              </div>
            )}
            <div
              className={cn(
                "grid grid-cols-1 gap-4 md:grid-cols-12",
                formGridClassName,
              )}
            >
              {section.fields
                .filter((field) => shouldShowField(field, currentValues))
                .map((field) => (
                  <div
                    key={field.name}
                    className={cn(
                      getGridSpanClass(field.colSpan),
                      field.className,
                    )}
                  >
                    <DynamicFieldRenderer field={field} form={form} />
                  </div>
                ))}
            </div>
          </section>
        ))
      ) : (
        <div
          className={cn(
            "grid grid-cols-1 gap-4 md:grid-cols-12",
            formGridClassName,
          )}
        >
          {allFields
            .filter((field) => shouldShowField(field, currentValues))
            .map((field) => (
              <div
                key={field.name}
                className={cn(getGridSpanClass(field.colSpan), field.className)}
              >
                <DynamicFieldRenderer field={field} form={form} />
              </div>
            ))}
        </div>
      )}

      {footer}

      {!hideSubmitButton ? (
        <Button
          type="submit"
          variant={submitButtonVariant}
          size={submitButtonSize}
          disabled={isSubmitting ?? form.formState.isSubmitting}
          className={submitButtonClassName}
        >
          {submitLabel}
        </Button>
      ) : null}
    </form>
  );
}
// ─────────────────────────────────────────────────────────────────────────────
// KeyValueEditor — dynamic add/remove rows of string key/value pairs,
// e.g. category specifications (Origin, Purity, Grain Size, ...).
// Field value on the form is a flat Record<string, string>; internally rows
// are tracked by a stable id so typing a key doesn't reorder/remount rows.
// ─────────────────────────────────────────────────────────────────────────────

type KeyValueRow = { id: string; key: string; value: string };

function KeyValueEditor({
  value,
  onChange,
  disabled,
  keyPlaceholder,
  valuePlaceholder,
  addLabel,
}: {
  value: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  disabled?: boolean;
  keyPlaceholder: string;
  valuePlaceholder: string;
  addLabel: string;
}) {
  const [rows, setRows] = React.useState<KeyValueRow[]>(() =>
    Object.entries(value).map(([key, val]) => ({
      id: crypto.randomUUID(),
      key,
      value: val,
    })),
  );

  const emit = (nextRows: KeyValueRow[]) => {
    setRows(nextRows);
    const obj: Record<string, string> = {};
    for (const row of nextRows) {
      const key = row.key.trim();
      if (key) obj[key] = row.value;
    }
    onChange(obj);
  };

  const addRow = () =>
    emit([...rows, { id: crypto.randomUUID(), key: "", value: "" }]);
  const removeRow = (id: string) => emit(rows.filter((r) => r.id !== id));
  const updateRow = (
    id: string,
    patch: Partial<Pick<KeyValueRow, "key" | "value">>,
  ) => emit(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="space-y-2">
      {rows.length === 0 ? (
        <p className="text-xs text-muted-foreground">No fields added yet.</p>
      ) : null}
      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-2">
          <Input
            value={row.key}
            onChange={(e) => updateRow(row.id, { key: e.target.value })}
            placeholder={keyPlaceholder}
            disabled={disabled}
            className="flex-1"
          />
          <Input
            value={row.value}
            onChange={(e) => updateRow(row.id, { value: e.target.value })}
            placeholder={valuePlaceholder}
            disabled={disabled}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => removeRow(row.id)}
            disabled={disabled}
            className="shrink-0 rounded-md p-2 text-muted-foreground hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
            aria-label="Remove field"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={addRow}
        disabled={disabled}
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ImageGalleryEditor — multi-image field for a product's gallery. Reuses the
// same file-manager upload/delete helpers as the single "image" field type.
// Field value is GalleryImage[]; exactly one image is flagged isPrimary.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// ImageUrlEntry — small inline "paste a URL" row shared by ImageUploadField
// and ImageGalleryEditor, for images already hosted elsewhere (no upload).
// ─────────────────────────────────────────────────────────────────────────────

function ImageUrlEntry({
  value,
  onChange,
  onSubmit,
  onCancel,
  disabled,
}: {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com/image.jpg"
        disabled={disabled}
        autoFocus
        className="h-8 text-xs"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          } else if (e.key === "Escape") {
            onCancel();
          }
        }}
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-50"
        aria-label="Use this URL"
      >
        <Check className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={disabled}
        className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:text-destructive disabled:opacity-50"
        aria-label="Cancel"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function ImageGalleryEditor({
  value,
  onChange,
  disabled,
  accept,
  maxBytes,
  uploadFolder,
  cropAspect,
}: {
  value: GalleryImage[];
  onChange: (next: GalleryImage[]) => void;
  disabled?: boolean;
  accept: string;
  maxBytes: number;
  uploadFolder: string;
  cropAspect?: number;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [urlMode, setUrlMode] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState("");

  // Crop / adjust editor state
  const [editor, setEditor] = React.useState<{
    src: string;
    fileName: string;
    crossOrigin: boolean;
    index?: number;
  } | null>(null);
  const [adjustQueue, setAdjustQueue] = React.useState<File[]>([]);

  const openAdjust = (index: number) => {
    if (disabled || uploading) return;
    const img = value[index];
    if (!img) return;
    setEditor({
      src: img.url,
      fileName: "image",
      crossOrigin: true,
      index,
    });
  };

  const closeEditor = () => {
    if (editor && editor.src.startsWith("blob:")) {
      URL.revokeObjectURL(editor.src);
    }
    setEditor(null);
    setAdjustQueue([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleEditorConfirm = async (adjustedFile: File) => {
    const isNewUpload = !editor || !editor.src.startsWith("http");
    const editingIndex = editor?.index;

    closeEditor();
    setUploading(true);
    try {
      const { url } = await uploadToFileManager(adjustedFile, uploadFolder);

      if (isNewUpload) {
        const next = [...value, { url, altText: "", isPrimary: false }];
        if (!next.some((img) => img.isPrimary)) next[0].isPrimary = true;
        onChange(next);

        if (adjustQueue.length > 0) {
          const [nextFile, ...restQueue] = adjustQueue;
          setAdjustQueue(restQueue);
          setTimeout(() => {
            setEditor({
              src: URL.createObjectURL(nextFile),
              fileName: nextFile.name,
              crossOrigin: false,
            });
          }, 100);
        }
      } else if (editingIndex !== undefined) {
        const previous = value[editingIndex];
        const next = [...value];
        next[editingIndex] = { ...previous, url };
        onChange(next);

        const previousPath = storageUrlToPath(previous.url);
        if (previousPath) {
          deleteFromFileManager(previousPath).catch((err) =>
            console.warn("Could not delete previous image:", err),
          );
        }
        toast.success("Image updated");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const isValidImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return false;
    }
    if (file.size > maxBytes) {
      toast.error(
        `Image is larger than ${(maxBytes / (1024 * 1024)).toFixed(0)} MB`,
      );
      return false;
    }
    return true;
  };

  const handleFiles = async (files: FileList) => {
    const valid = Array.from(files).filter(isValidImage);
    if (!valid.length) {
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (cropAspect) {
      const [first, ...rest] = valid;
      setAdjustQueue(rest);
      setEditor({
        src: URL.createObjectURL(first),
        fileName: first.name,
        crossOrigin: false,
      });
    } else {
      setUploading(true);
      try {
        const uploaded: GalleryImage[] = [];
        for (const file of valid) {
          try {
            const { url } = await uploadToFileManager(file, uploadFolder);
            uploaded.push({ url, altText: "", isPrimary: false });
          } catch (err) {
            toast.error(
              err instanceof Error
                ? err.message
                : `Could not upload ${file.name}`,
            );
          }
        }
        if (uploaded.length) {
          const next = [...value, ...uploaded];
          if (!next.some((img) => img.isPrimary)) next[0].isPrimary = true;
          onChange(next);
        }
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    }
  };

  const updateImage = (index: number, patch: Partial<GalleryImage>) => {
    onChange(value.map((img, i) => (i === index ? { ...img, ...patch } : img)));
  };

  const setPrimary = (index: number) => {
    onChange(value.map((img, i) => ({ ...img, isPrimary: i === index })));
  };

  const removeImage = (index: number) => {
    const removed = value[index];
    const next = value.filter((_, i) => i !== index);
    if (removed?.isPrimary && next.length)
      next[0] = { ...next[0], isPrimary: true };
    onChange(next);
    const path = removed && storageUrlToPath(removed.url);
    if (path) {
      deleteFromFileManager(path).catch((err) =>
        console.warn("Could not delete gallery image:", err),
      );
    }
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const addImageUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!isValidImageUrl(trimmed)) {
      toast.error("Please enter a valid image URL");
      return;
    }
    const next = [...value, { url: trimmed, altText: "", isPrimary: false }];
    if (!next.some((img) => img.isPrimary)) next[0].isPrimary = true;
    onChange(next);
    setUrlInput("");
    setUrlMode(false);
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="sr-only"
        disabled={disabled || uploading}
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
        }}
      />
      {value.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {value.map((img, index) => (
            <div
              key={img.url + index}
              className="space-y-1.5 rounded-lg border p-2"
            >
              <div className="relative aspect-square overflow-hidden rounded-md border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.altText}
                  className="h-full w-full object-cover"
                />
                {img.isPrimary ? (
                  <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                    Primary
                  </span>
                ) : null}
              </div>
              <Input
                value={img.altText}
                onChange={(e) =>
                  updateImage(index, { altText: e.target.value })
                }
                placeholder="Alt text"
                disabled={disabled}
                className="h-7 text-xs"
              />
              <div className="flex items-center justify-between gap-1">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(index, -1)}
                    disabled={disabled || index === 0}
                    className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    aria-label="Move earlier"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, 1)}
                    disabled={disabled || index === value.length - 1}
                    className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    aria-label="Move later"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex gap-1">
                  {cropAspect ? (
                    <button
                      type="button"
                      onClick={() => openAdjust(index)}
                      disabled={disabled || uploading}
                      className="rounded p-1 text-muted-foreground hover:text-foreground"
                      aria-label="Adjust image"
                      title="Adjust image"
                    >
                      <Crop className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                  {!img.isPrimary ? (
                    <button
                      type="button"
                      onClick={() => setPrimary(index)}
                      disabled={disabled}
                      className="rounded p-1 text-muted-foreground hover:text-foreground"
                      aria-label="Set as primary"
                      title="Set as primary"
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    disabled={disabled}
                    className="rounded p-1 text-muted-foreground hover:text-destructive"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {urlMode ? (
        <ImageUrlEntry
          value={urlInput}
          onChange={setUrlInput}
          onSubmit={addImageUrl}
          onCancel={() => {
            setUrlMode(false);
            setUrlInput("");
          }}
          disabled={disabled}
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || uploading}
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ImagePlus className="h-3.5 w-3.5" />
            )}
            {uploading ? "Uploading…" : "Add images"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setUrlMode(true)}
            disabled={disabled || uploading}
          >
            <Link2 className="h-3.5 w-3.5" />
            Add by URL
          </Button>
        </div>
      )}
      {editor && cropAspect ? (
        <ImageAdjustModal
          src={editor.src}
          aspect={cropAspect}
          fileName={editor.fileName}
          crossOrigin={editor.crossOrigin}
          onCancel={closeEditor}
          onConfirm={handleEditorConfirm}
        />
      ) : null}
    </div>
  );
}

function PasswordInputWithToggle({
  id,
  className,
  placeholder,
  disabled,
  required,
  ...props
}: React.ComponentProps<typeof Input>) {
  const [visible, setVisible] = React.useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        className={cn("pr-10", className)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ImageUploadField — drop-in image uploader for the dynamic form.
//
// Backed by the file manager (app/api/file-manager/upload): the file is
// POSTed there, stored under `uploadFolder` on the server's storage disk,
// and the returned URL is what gets saved on the record (e.g. a category's
// image_url column).
//
//   • Upload  → POST /api/file-manager/upload → { files: [{ url, path }] }
//   • Replace → upload new + best-effort DELETE on the previous file
//   • Remove  → DELETE /api/file-manager/[...path] and clear the field
// ─────────────────────────────────────────────────────────────────────────────

/** "/storage/x/y.webp" or "/api/storage/x/y.webp" -> "x/y.webp" */
function storageUrlToPath(url: string): string | null {
  const match = url.match(/^\/(?:api\/)?storage\/(.+)$/);
  return match ? match[1] : null;
}

function isValidImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function uploadToFileManager(
  file: File,
  folder: string,
): Promise<{ url: string; path: string }> {
  const formData = new FormData();
  formData.append("path", folder);
  formData.append("files", file);

  const response = await fetch("/api/file-manager/upload", {
    method: "POST",
    body: formData,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success || !data.files?.[0]) {
    throw new Error(data.error || "Upload failed");
  }
  return { url: data.files[0].url, path: data.files[0].path };
}

async function deleteFromFileManager(relativePath: string): Promise<void> {
  const encoded = relativePath
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/");
  await fetch(`/api/file-manager/${encoded}`, { method: "DELETE" });
}

function ImageUploadField({
  id,
  value,
  onChange,
  disabled,
  accept,
  maxBytes,
  previewAspect,
  cropAspect,
  cardPreview,
  uploadFolder,
}: {
  id: string;
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  accept: string;
  maxBytes: number;
  previewAspect: string;
  cropAspect?: number;
  cardPreview?: "menu" | "category";
  uploadFolder: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState<"upload" | "delete" | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [urlMode, setUrlMode] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState("");
  // Open crop/adjust editor. `src` is a blob: URL for freshly picked files or
  // the stored URL when re-adjusting an existing image (crossOrigin).
  const [editor, setEditor] = React.useState<{
    src: string;
    fileName: string;
    crossOrigin: boolean;
  } | null>(null);

  const hasImage = Boolean(value);
  const previewSrc = value;

  const pick = () => {
    if (disabled || busy) return;
    inputRef.current?.click();
  };

  const isValidImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return false;
    }
    if (file.size > maxBytes) {
      toast.error(
        `Image is larger than ${(maxBytes / (1024 * 1024)).toFixed(0)} MB`,
      );
      return false;
    }
    return true;
  };

  const uploadFile = async (file: File) => {
    const previous = value;
    setBusy("upload");
    try {
      const { url } = await uploadToFileManager(file, uploadFolder);
      onChange(url);
      toast.success(previous ? "Image replaced" : "Image uploaded");
      // Replace semantics: best-effort cleanup of the old image. Never block.
      if (previous && previous !== url) {
        const previousPath = storageUrlToPath(previous);
        if (previousPath) {
          deleteFromFileManager(previousPath).catch((err) =>
            console.warn("Could not delete previous image:", err),
          );
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const file = (files instanceof FileList ? files[0] : files[0]) as
      | File
      | undefined;
    if (!file) return;
    if (!isValidImage(file)) {
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // With a target ratio, adjust before uploading; otherwise upload as-is.
    if (cropAspect) {
      setEditor({
        src: URL.createObjectURL(file),
        fileName: file.name,
        crossOrigin: false,
      });
      return;
    }
    await uploadFile(file);
  };

  const closeEditor = () => {
    if (editor && editor.src.startsWith("blob:")) {
      URL.revokeObjectURL(editor.src);
    }
    setEditor(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleEditorConfirm = async (file: File) => {
    closeEditor();
    await uploadFile(file);
  };

  const openAdjust = () => {
    if (!value || disabled || busy) return;
    // Re-crop the stored image. crossOrigin lets us read it back off a canvas;
    // if the host blocks CORS the editor surfaces a "re-upload to adjust" hint.
    setEditor({ src: value, fileName: "image", crossOrigin: true });
  };

  const handleRemove = async () => {
    if (!hasImage) return;
    setBusy("delete");
    try {
      // Best-effort: clear the field even if the server delete fails (e.g.
      // legacy/externally-hosted URL). Server endpoint is idempotent.
      const relativePath = storageUrlToPath(value);
      if (relativePath) {
        try {
          await deleteFromFileManager(relativePath);
        } catch (err) {
          console.warn("Image delete failed:", err);
        }
      }
      onChange("");
    } finally {
      setBusy(null);
    }
  };

  const handleUseUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!isValidImageUrl(trimmed)) {
      toast.error("Please enter a valid image URL");
      return;
    }
    const previous = value;
    onChange(trimmed);
    setUrlInput("");
    setUrlMode(false);
    toast.success(previous ? "Image replaced" : "Image added");
    // Best-effort cleanup of the previous storage-hosted image, if any.
    if (previous && previous !== trimmed) {
      const previousPath = storageUrlToPath(previous);
      if (previousPath) {
        deleteFromFileManager(previousPath).catch((err) =>
          console.warn("Could not delete previous image:", err),
        );
      }
    }
  };

  return (
    <div className="w-full space-y-2">
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled || !!busy}
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
        }}
      />

      {hasImage ? (
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "relative overflow-hidden rounded-lg border bg-muted",
              previewAspect,
              "w-32",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt="Uploaded preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            {busy ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              </div>
            ) : null}
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <p className="text-xs text-muted-foreground break-all">{value}</p>
            {urlMode ? (
              <ImageUrlEntry
                value={urlInput}
                onChange={setUrlInput}
                onSubmit={handleUseUrl}
                onCancel={() => {
                  setUrlMode(false);
                  setUrlInput("");
                }}
                disabled={disabled || !!busy}
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {cropAspect ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={openAdjust}
                    disabled={disabled || !!busy}
                  >
                    <Crop className="h-3.5 w-3.5" />
                    Adjust
                  </Button>
                ) : null}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={pick}
                  disabled={disabled || !!busy}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Replace
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setUrlMode(true)}
                  disabled={disabled || !!busy}
                >
                  <Link2 className="h-3.5 w-3.5" />
                  Use URL
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleRemove}
                  disabled={disabled || !!busy}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
              </div>
            )}
            {cardPreview ? (
              <StorefrontCardPreview
                src={previewSrc}
                variant={cardPreview}
                aspect={cropAspect ?? 1}
              />
            ) : null}
          </div>
        </div>
      ) : urlMode ? (
        <div className="rounded-lg border border-dashed border-input p-3">
          <ImageUrlEntry
            value={urlInput}
            onChange={setUrlInput}
            onSubmit={handleUseUrl}
            onCancel={() => {
              setUrlMode(false);
              setUrlInput("");
            }}
            disabled={disabled}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <button
            type="button"
            onClick={pick}
            onDragOver={(e) => {
              e.preventDefault();
              if (!disabled && !busy) setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (disabled || busy) return;
              if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
            }}
            disabled={disabled || !!busy}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors",
              "hover:border-primary/60 hover:bg-muted/50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              dragOver
                ? "border-primary bg-primary/5"
                : "border-input bg-background",
              (disabled || busy) && "cursor-not-allowed opacity-60",
            )}
          >
            {busy === "upload" ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Uploading…</span>
              </>
            ) : (
              <>
                <ImagePlus className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Click to upload or drag &amp; drop
                </span>
                <span className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP, GIF · up to{" "}
                  {(maxBytes / (1024 * 1024)).toFixed(0)} MB
                </span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setUrlMode(true)}
            disabled={disabled || !!busy}
            className="mx-auto flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            <Link2 className="h-3.5 w-3.5" />
            Or add image via URL
          </button>
        </div>
      )}

      {editor ? (
        <ImageAdjustModal
          src={editor.src}
          aspect={cropAspect ?? 1}
          fileName={editor.fileName}
          crossOrigin={editor.crossOrigin}
          onCancel={closeEditor}
          onConfirm={handleEditorConfirm}
        />
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StorefrontCardPreview — shows the current image inside a mock of the
// front-site card so admins see exactly how the crop lands before saving.
// ─────────────────────────────────────────────────────────────────────────────

function StorefrontCardPreview({
  src,
  variant,
  aspect,
}: {
  src: string;
  variant: "menu" | "category";
  aspect: number;
}) {
  if (variant === "category") {
    return (
      <div className="w-40 pt-1">
        <div
          className="relative overflow-hidden rounded-xl border bg-[#FFF0F0]"
          style={{ aspectRatio: String(aspect) }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="h-full w-full object-cover" />
        </div>
        <p className="mt-1 text-center text-[10px] text-muted-foreground">
          Front-site tile preview
        </p>
      </div>
    );
  }

  return (
    <div className="w-52 overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div
        className="relative bg-[#FFF0F0]"
        style={{ aspectRatio: String(aspect) }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="h-2 w-24 rounded bg-neutral-200" />
          <div className="h-2 w-14 rounded bg-neutral-200" />
        </div>
        <span className="shrink-0 rounded-lg bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
          Add
        </span>
      </div>
      <p className="pb-2 text-center text-[10px] text-muted-foreground">
        Front-site card preview
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ImageAdjustModal — client-side crop / pan / zoom editor.
//
// The crop frame is locked to the front-site card ratio so admins place the
// photo exactly as it appears in the storefront. "Instafill" snaps the image
// to fully cover the frame (full height/width, no gaps). Confirm renders the
// visible region to a canvas and returns a cropped WEBP File ready to upload.
//
// Freshly picked files load from a blob: URL (no CORS). Re-adjusting a stored
// image loads it crossOrigin so the canvas stays readable; hosts that block
// CORS trip a graceful "re-upload to adjust" message instead of a hard crash.
// ─────────────────────────────────────────────────────────────────────────────

function ImageAdjustModal({
  src,
  aspect,
  fileName,
  crossOrigin,
  onCancel,
  onConfirm,
}: {
  src: string;
  aspect: number;
  fileName: string;
  crossOrigin?: boolean;
  onCancel: () => void;
  onConfirm: (file: File) => void;
}) {
  const FRAME_W = 360;
  const FRAME_H = Math.round(FRAME_W / aspect);

  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const dragRef = React.useRef<{
    x: number;
    y: number;
    ox: number;
    oy: number;
  } | null>(null);

  const [ready, setReady] = React.useState(false);
  const [nat, setNat] = React.useState({ w: 0, h: 0 });
  const [coverScale, setCoverScale] = React.useState(1); // fills frame (may crop)
  const [fitScale, setFitScale] = React.useState(1); // whole image visible (pads)
  const [scale, setScale] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [bgColor, setBgColor] = React.useState("#ffffff"); // pad colour
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Clamp per axis: if the image covers that axis keep it within the frame; if
  // it's smaller (letterboxed / "fit" mode) lock it centred so the padding is
  // even on both sides.
  const clampOffset = React.useCallback(
    (x: number, y: number, s: number) => {
      const clampAxis = (pos: number, imgSize: number, frameSize: number) =>
        imgSize <= frameSize
          ? (frameSize - imgSize) / 2
          : Math.min(0, Math.max(frameSize - imgSize, pos));
      return {
        x: clampAxis(x, nat.w * s, FRAME_W),
        y: clampAxis(y, nat.h * s, FRAME_H),
      };
    },
    [nat.w, nat.h, FRAME_W, FRAME_H],
  );

  const centerFor = React.useCallback(
    (s: number) => ({
      x: (FRAME_W - nat.w * s) / 2,
      y: (FRAME_H - nat.h * s) / 2,
    }),
    [nat.w, nat.h, FRAME_W, FRAME_H],
  );

  React.useEffect(() => {
    const img = new window.Image();
    if (crossOrigin) img.crossOrigin = "anonymous";
    img.onload = () => {
      const cover = Math.max(
        FRAME_W / img.naturalWidth,
        FRAME_H / img.naturalHeight,
      );
      const fit = Math.min(
        FRAME_W / img.naturalWidth,
        FRAME_H / img.naturalHeight,
      );
      imgRef.current = img;
      setNat({ w: img.naturalWidth, h: img.naturalHeight });
      setCoverScale(cover);
      setFitScale(fit);
      // Default to cover (fills the card); the admin can switch to fit-height.
      setScale(cover);
      setOffset({
        x: (FRAME_W - img.naturalWidth * cover) / 2,
        y: (FRAME_H - img.naturalHeight * cover) / 2,
      });
      setReady(true);
    };
    img.onerror = () => setError("Could not load this image for editing.");
    img.src = src;
  }, [src, crossOrigin, FRAME_W, FRAME_H]);

  // Zoom around the frame centre so the framed subject stays put. Floor is the
  // fit scale (whole image visible), ceiling is 5× the cover scale.
  const applyScale = (next: number) => {
    const s = Math.min(coverScale * 5, Math.max(fitScale, next));
    const cx = FRAME_W / 2;
    const cy = FRAME_H / 2;
    const ratio = s / scale;
    const nx = cx - (cx - offset.x) * ratio;
    const ny = cy - (cy - offset.y) * ratio;
    setScale(s);
    setOffset(clampOffset(nx, ny, s));
  };

  // Fill the frame edge-to-edge (may crop the overflowing side).
  const instafill = () => {
    setScale(coverScale);
    setOffset(centerFor(coverScale));
  };

  // Show the whole image without cropping; empty sides get the pad colour.
  const fitHeight = () => {
    setScale(fitScale);
    setOffset(centerFor(fitScale));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!ready) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    setOffset(
      clampOffset(d.ox + (e.clientX - d.x), d.oy + (e.clientY - d.y), scale),
    );
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const handleConfirm = () => {
    const img = imgRef.current;
    if (!img) return;
    setSaving(true);
    try {
      const OUT_W = aspect >= 1 ? 1200 : Math.round(1200 * aspect);
      const OUT_H = Math.round(OUT_W / aspect);
      const k = OUT_W / FRAME_W; // frame px → output px
      const canvas = document.createElement("canvas");
      canvas.width = OUT_W;
      canvas.height = OUT_H;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no-2d-context");
      ctx.imageSmoothingQuality = "high";
      // Paint the pad colour first so any uncovered area (fit-height mode)
      // ships as part of the image instead of transparent/black.
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, OUT_W, OUT_H);
      ctx.drawImage(
        img,
        offset.x * k,
        offset.y * k,
        nat.w * scale * k,
        nat.h * scale * k,
      );
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setSaving(false);
            setError(
              "This image can't be edited here (blocked by the host). Re-upload it to adjust.",
            );
            return;
          }
          const base = fileName.replace(/\.[^.]+$/, "") || "image";
          onConfirm(new File([blob], `${base}.webp`, { type: "image/webp" }));
        },
        "image/webp",
        0.9,
      );
    } catch {
      setSaving(false);
      setError(
        "This image can't be edited here (blocked by the host). Re-upload it to adjust.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full bg-white max-w-md rounded-lg border bg-background p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Adjust image</h3>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error ? (
          <p className="mb-3 text-xs text-destructive">{error}</p>
        ) : null}

        <div className="flex flex-col items-center gap-3">
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onWheel={(e) => applyScale(scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1))}
            className="relative touch-none cursor-grab overflow-hidden rounded-lg border active:cursor-grabbing"
            style={{
              width: FRAME_W,
              height: FRAME_H,
              backgroundColor: bgColor,
            }}
          >
            {ready ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt=""
                draggable={false}
                crossOrigin={crossOrigin ? "anonymous" : undefined}
                style={{
                  position: "absolute",
                  left: offset.x,
                  top: offset.y,
                  width: nat.w * scale,
                  height: nat.h * scale,
                  maxWidth: "none",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                {error ? null : (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                )}
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/40" />
          </div>

          <div
            className="flex w-full items-center gap-3"
            style={{ maxWidth: FRAME_W }}
          >
            <ZoomOut className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="range"
              min={fitScale}
              max={coverScale * 5}
              step={fitScale / 100}
              value={scale}
              onChange={(e) => applyScale(parseFloat(e.target.value))}
              disabled={!ready}
              className="h-1 w-full cursor-pointer accent-primary"
              aria-label="Zoom"
            />
            <ZoomIn className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>

          {/* Pad colour — fills the empty sides in fit-height mode. */}
          <div
            className="flex w-full items-center gap-2"
            style={{ maxWidth: FRAME_W }}
          >
            <span className="text-[11px] text-muted-foreground">
              Fill colour
            </span>
            <div className="flex items-center gap-1.5">
              {["#ffffff", "#FFF0F0", "#000000", "#F5F5F4"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setBgColor(c)}
                  aria-label={`Fill colour ${c}`}
                  aria-pressed={bgColor.toLowerCase() === c.toLowerCase()}
                  className={cn(
                    "h-5 w-5 rounded-full border transition-transform",
                    bgColor.toLowerCase() === c.toLowerCase()
                      ? "ring-2 ring-primary ring-offset-1"
                      : "hover:scale-110",
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              aria-label="Custom fill colour"
              className="h-6 w-8 cursor-pointer rounded border bg-transparent p-0"
            />
          </div>

          <p className="text-center text-[11px] text-muted-foreground">
            Drag to reposition · scroll or drag the slider to zoom. Use{" "}
            <b>Fit height</b> to show the whole image and fill the sides with
            the colour above.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={instafill}
              disabled={!ready}
              title="Fill the frame edge-to-edge (may crop the taller side)"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              Instafill
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={fitHeight}
              disabled={!ready}
              title="Show the whole image without cropping; fill the sides with the pad colour"
            >
              <Minimize2 className="h-3.5 w-3.5" />
              Fit height
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirm}
              disabled={!ready || saving}
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Use image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
