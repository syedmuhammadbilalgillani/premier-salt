"use client";
import { useState, type FormEvent } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { calculateShipping, calculateDiscount } from "@/lib/shipping";
import { generateOrderId, saveOrder } from "@/hooks/useOrders";
import type { Order } from "@/types/order";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useRouter();
  const [delivery, setDelivery] =
    useState<Order["deliveryMethod"]>("Standard Delivery");
  const [payment, setPayment] =
    useState<Order["paymentMethod"]>("Cash on Delivery");
  const [discountCode, setDiscountCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const discount = calculateDiscount(subtotal, discountCode);
  const shipping =
    delivery === "Store/Office Pickup"
      ? 0
      : calculateShipping(subtotal - discount);
  const total = subtotal - discount + shipping;

  if (items.length === 0) {
    return (
      <>
        <PageHero
          eyebrow="Shop"
          title="Checkout"
          crumbs={[{ label: "Checkout" }]}
        />
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-20 text-center">
          <p className="text-muted">
            Your cart is empty — add products before checking out.
          </p>
          <Link href="/shop">
            <Button>Shop Now</Button>
          </Link>
        </div>
      </>
    );
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const get = (k: string) => (form.get(k) as string)?.trim() ?? "";

    const nextErrors: Record<string, string> = {};
    [
      "firstName",
      "lastName",
      "email",
      "phone",
      "line1",
      "city",
      "province",
      "postalCode",
    ].forEach((field) => {
      if (!get(field)) nextErrors[field] = "This field is required.";
    });
    if (get("email") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email")))
      nextErrors.email = "Enter a valid email.";
    if (!form.get("terms"))
      nextErrors.terms = "You must accept the terms to continue.";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const orderId = generateOrderId();
    const order: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: "Order Received",
      customer: {
        firstName: get("firstName"),
        lastName: get("lastName"),
        email: get("email"),
        phone: get("phone"),
      },
      address: {
        line1: get("line1"),
        line2: get("line2"),
        city: get("city"),
        province: get("province"),
        postalCode: get("postalCode"),
        country: "Pakistan",
      },
      deliveryMethod: delivery,
      paymentMethod: payment,
      notes: get("notes"),
      lines: items.map((i) => ({
        slug: i.productSlug,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        variantId: i.variantId,
        variantLabel: i.variantLabel,
        sku: i.sku,
      })),
      subtotal,
      discount,
      shipping,
      total,
    };

    saveOrder(order);
    clearCart();
    navigate.push(`/order-confirmation/${orderId}`);
  }

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Checkout"
        crumbs={[{ label: "Checkout" }]}
      />
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-16 md:grid-cols-[1fr_360px] md:px-8"
      >
        <div className="flex flex-col gap-12">
          <section>
            <h2 className="mb-5 font-serif text-xl text-maroon">
              Customer Details
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="First Name"
                htmlFor="firstName"
                required
                error={errors.firstName}
              >
                <input
                  id="firstName"
                  name="firstName"
                  className={inputClasses}
                />
              </FormField>
              <FormField
                label="Last Name"
                htmlFor="lastName"
                required
                error={errors.lastName}
              >
                <input id="lastName" name="lastName" className={inputClasses} />
              </FormField>
              <FormField
                label="Email"
                htmlFor="email"
                required
                error={errors.email}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={inputClasses}
                />
              </FormField>
              <FormField
                label="Phone Number"
                htmlFor="phone"
                required
                error={errors.phone}
              >
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={inputClasses}
                />
              </FormField>
            </div>
          </section>

          <section>
            <h2 className="mb-5 font-serif text-xl text-maroon">
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <FormField
                label="Address Line 1"
                htmlFor="line1"
                required
                error={errors.line1}
              >
                <input id="line1" name="line1" className={inputClasses} />
              </FormField>
              <FormField label="Address Line 2" htmlFor="line2">
                <input id="line2" name="line2" className={inputClasses} />
              </FormField>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField
                  label="City"
                  htmlFor="city"
                  required
                  error={errors.city}
                >
                  <input id="city" name="city" className={inputClasses} />
                </FormField>
                <FormField
                  label="Province"
                  htmlFor="province"
                  required
                  error={errors.province}
                >
                  <input
                    id="province"
                    name="province"
                    className={inputClasses}
                  />
                </FormField>
                <FormField
                  label="Postal Code"
                  htmlFor="postalCode"
                  required
                  error={errors.postalCode}
                >
                  <input
                    id="postalCode"
                    name="postalCode"
                    className={inputClasses}
                  />
                </FormField>
              </div>
              <FormField label="Country" htmlFor="country">
                <input
                  id="country"
                  value="Pakistan"
                  disabled
                  className={`${inputClasses} bg-sand/40`}
                />
              </FormField>
            </div>
          </section>

          <section>
            <h2 className="mb-5 font-serif text-xl text-maroon">
              Delivery Method
            </h2>
            <div className="flex flex-col gap-2">
              {(["Standard Delivery", "Store/Office Pickup"] as const).map(
                (option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 rounded-sm border border-border p-3 text-sm"
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={delivery === option}
                      onChange={() => setDelivery(option)}
                    />
                    {option}
                  </label>
                ),
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-5 font-serif text-xl text-maroon">
              Payment Method
            </h2>
            <div className="flex flex-col gap-2">
              {(
                ["Cash on Delivery", "Bank Transfer", "Card Payment"] as const
              ).map((option) => (
                <label
                  key={option}
                  className="flex flex-col gap-1 rounded-sm border border-border p-3 text-sm"
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === option}
                      onChange={() => setPayment(option)}
                    />
                    {option}
                  </span>
                  {option === "Card Payment" && (
                    <span className="pl-6 text-xs text-muted">
                      Card payment integration will be enabled in the production
                      backend.
                    </span>
                  )}
                </label>
              ))}
            </div>
          </section>

          <FormField label="Order Notes" htmlFor="notes">
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className={inputClasses}
            />
          </FormField>

          <div className="flex flex-col gap-2">
            <label className="flex items-start gap-2 text-sm text-charcoal">
              <input type="checkbox" name="terms" className="mt-0.5" /> I accept
              the{" "}
              <Link
                href="/terms-conditions"
                className="text-terracotta hover:underline"
              >
                Terms &amp; Conditions
              </Link>
              .
            </label>
            {errors.terms && (
              <p className="text-xs text-error">{errors.terms}</p>
            )}
            <label className="flex items-start gap-2 text-sm text-charcoal">
              <input type="checkbox" name="newsletter" className="mt-0.5" />{" "}
              Send me offers and updates by email.
            </label>
          </div>
        </div>

        <div className="h-fit rounded-sm border border-border bg-sand/40 p-6">
          <h2 className="font-serif text-xl text-maroon">Order Summary</h2>
          <ul className="mt-4 flex flex-col gap-2 border-b border-border pb-4 text-sm">
            {items.map((i) => (
              <li
                key={`${i.productSlug}::${i.variantId ?? ""}`}
                className="flex justify-between"
              >
                <span className="text-charcoal">
                  {i.name} × {i.quantity}
                </span>
                <span className="text-muted">
                  PKR {(i.price * i.quantity).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
          <div className="my-4 flex gap-2">
            <input
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Discount code"
              className="flex-1 rounded-sm border border-border bg-white px-3 py-2 text-sm"
            />
          </div>
          <dl className="flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>PKR {subtotal.toLocaleString()}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <dt>Discount</dt>
                <dd>− PKR {discount.toLocaleString()}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>
                {shipping === 0 ? "Free" : `PKR ${shipping.toLocaleString()}`}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2.5 font-serif text-lg text-maroon">
              <dt>Total</dt>
              <dd>PKR {total.toLocaleString()}</dd>
            </div>
          </dl>
          <Button type="submit" className="mt-5 w-full">
            Place Order
          </Button>
        </div>
      </form>
    </>
  );
}
