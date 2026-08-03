"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { readStorage, writeStorage } from "@/lib/storage";

interface Profile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function MyAccount() {
  const [profile, setProfile] = useState<Profile | null>(() =>
    readStorage<Profile | null>("premierSalt.profile", null),
  );
  const [editing, setEditing] = useState(!profile);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const next: Profile = {
      name: (form.get("name") as string) ?? "",
      email: (form.get("email") as string) ?? "",
      phone: (form.get("phone") as string) ?? "",
      address: (form.get("address") as string) ?? "",
    };
    writeStorage("premierSalt.profile", next);
    setProfile(next);
    setEditing(false);
  }

  function logOut() {
    writeStorage("premierSalt.profile", null);
    setProfile(null);
    setEditing(true);
  }

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="My Account"
        description="Your details are stored only in this browser in this prototype."
        crumbs={[{ label: "My Account" }]}
      />
      <div className="mx-auto max-w-xl px-6 py-16 md:px-8">
        {editing ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField label="Full Name" htmlFor="name" required>
              <input
                id="name"
                name="name"
                defaultValue={profile?.name}
                required
                className={inputClasses}
              />
            </FormField>
            <FormField label="Email" htmlFor="email" required>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={profile?.email}
                required
                className={inputClasses}
              />
            </FormField>
            <FormField label="Phone" htmlFor="phone">
              <input
                id="phone"
                name="phone"
                defaultValue={profile?.phone}
                className={inputClasses}
              />
            </FormField>
            <FormField label="Default Address" htmlFor="address">
              <textarea
                id="address"
                name="address"
                defaultValue={profile?.address}
                rows={3}
                className={inputClasses}
              />
            </FormField>
            <Button type="submit">Save Profile</Button>
          </form>
        ) : (
          profile && (
            <div className="flex flex-col gap-6">
              <div className="rounded-sm border border-border bg-cream p-6">
                <p className="font-serif text-xl text-primary">
                  {profile.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {profile.email}
                </p>
                <p className="text-sm text-muted-foreground">{profile.phone}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {profile.address}
                </p>
                <div className="mt-4 flex gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button variant="ghost" size="sm" onClick={logOut}>
                    Log Out
                  </Button>
                </div>
              </div>
              <div className="flex gap-6 text-sm font-semibold text-primary">
                <Link href="/my-account/orders" className="hover:text-primary">
                  View Orders <ArrowRight />
                </Link>
                <Link href="/wishlist" className="hover:text-primary">
                  View Wishlist <ArrowRight />
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
