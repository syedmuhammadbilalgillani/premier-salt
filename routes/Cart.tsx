"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import {
  calculateShipping,
  calculateDiscount,
  DISCOUNT_CODE,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/shipping";

export default function Cart() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const [code, setCode] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [codeError, setCodeError] = useState("");

  const discount = calculateDiscount(subtotal, appliedCode);
  const shipping = calculateShipping(subtotal - discount);
  const total = subtotal - discount + shipping;

  function applyCode() {
    if (!code.trim()) return;
    if (calculateDiscount(subtotal, code) > 0) {
      setAppliedCode(code);
      setCodeError("");
      toast.success(`Discount code "${code.toUpperCase()}" applied!`);
    } else {
      setCodeError("Invalid discount code.");
      setAppliedCode("");
      toast.error("Invalid discount code.");
    }
  }

  if (items.length === 0) {
    return (
      <>
        <PageHero
          eyebrow="Shop"
          title="Your Cart"
          description="Your cart is currently empty."
          crumbs={[{ label: "Cart" }]}
        />
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sand/50 text-muted-foreground">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="font-serif text-2xl text-charcoal">Your cart is empty</h3>
          <p className="max-w-md text-sm text-muted-foreground">
            Browse our shop to find premium Himalayan edible salts, handcrafted salt lamps, cooking slabs and wellness products.
          </p>
          <Link href="/shop" className="mt-2">
            <Button>Explore Shop</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow="Shop" title="Your Cart" crumbs={[{ label: "Cart" }]} />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 py-16 md:grid-cols-[1fr_360px] md:px-8">
        <div className="flex flex-col gap-6">
          {items.map((item) => (
            <div
              key={`${item.productSlug}::${item.variantId ?? ""}`}
              className="flex gap-4 border-b border-border pb-6"
            >
              <div className="relative aspect-square w-20 sm:w-24 shrink-0 overflow-hidden rounded-md border border-border bg-sand/30">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <ImagePlaceholder label={item.name} width={200} height={200} />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/shop/product/${item.productSlug}`}
                      className="font-medium text-charcoal transition-colors hover:text-primary"
                    >
                      {item.product.title}
                    </Link>
                    {item.variantLabel && (
                      <p className="text-xs text-muted-foreground">
                        {item.variantLabel}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      PKR {item.price.toLocaleString()} each
                    </p>
                  </div>
                  <button
                    aria-label="Remove item"
                    onClick={() => {
                      removeItem(item.productSlug, item.variantId);
                      toast.success(`Removed "${item.name}" from cart`);
                    }}
                    className="p-1 text-muted-foreground transition-colors hover:text-error"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center rounded-sm border border-border bg-white">
                    <button
                      className="px-2.5 py-1 text-charcoal hover:bg-sand/40 transition-colors"
                      onClick={() =>
                        updateQuantity(
                          item.productSlug,
                          item.variantId,
                          item.quantity - 1,
                        )
                      }
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={item.stock}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item.productSlug,
                          item.variantId,
                          Math.max(
                            1,
                            Math.min(item.stock, Number(e.target.value) || 1),
                          ),
                        )
                      }
                      className="w-10 border-x border-border py-1 text-center text-sm font-medium focus:outline-none"
                    />
                    <button
                      className="px-2.5 py-1 text-charcoal hover:bg-sand/40 transition-colors"
                      onClick={() =>
                        updateQuantity(
                          item.productSlug,
                          item.variantId,
                          item.quantity + 1,
                        )
                      }
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-serif text-lg font-medium text-primary">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="h-fit rounded-sm border border-border bg-sand/40 p-6">
          <h2 className="font-serif text-xl text-primary">Order Summary</h2>
          <div className="mt-4 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Discount code"
              className="flex-1 rounded-sm border border-border bg-white px-3 py-2 text-sm"
            />
            <Button variant="outline" size="sm" onClick={applyCode}>
              Apply
            </Button>
          </div>
          {codeError && (
            <p className="mt-1.5 text-xs text-error">{codeError}</p>
          )}
          {appliedCode && (
            <p className="mt-1.5 text-xs text-success">
              Code {DISCOUNT_CODE} applied.
            </p>
          )}

          <dl className="mt-5 flex flex-col gap-2.5 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>PKR {subtotal.toLocaleString()}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <dt>Discount</dt>
                <dd>− PKR {discount.toLocaleString()}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>
                {shipping === 0 ? "Free" : `PKR ${shipping.toLocaleString()}`}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2.5 font-serif text-lg text-primary">
              <dt>Total</dt>
              <dd>PKR {total.toLocaleString()}</dd>
            </div>
          </dl>
          {subtotal < FREE_SHIPPING_THRESHOLD && (
            <p className="mt-2 text-xs text-muted-foreground">
              Add PKR {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString()}{" "}
              more for free shipping.
            </p>
          )}
          <Link href="/checkout" className="mt-5 block">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
