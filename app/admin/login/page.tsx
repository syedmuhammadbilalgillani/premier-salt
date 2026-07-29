"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

import { DynamicForm, type DynamicField } from "@/components/form-builder";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type LoginValues = {
  email: string;
  password: string;
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);

  const fields: DynamicField<LoginValues>[] = [
    {
      type: "input",
      name: "email",
      label: "Email",
      inputType: "email",
      placeholder: "you@premiersalt.com",
      colSpan: 12,
      required: true,
      rules: { required: "Email is required" },
    },
    {
      type: "input",
      name: "password",
      label: "Password",
      inputType: "password",
      placeholder: "••••••••",
      colSpan: 12,
      required: true,
      rules: { required: "Password is required" },
    },
  ];

  async function handleSubmit(values: LoginValues) {
    setSubmitting(true);
    try {
      const result = await signIn("credentials", {
        email: values.email.trim().toLowerCase(),
        password: values.password,
        redirect: false,
      });

      if (!result || result.error) {
        toast.error("Invalid email or password.");
        return;
      }

      toast.success("Welcome back.");
      router.push(searchParams.get("callbackUrl") || "/admin/file-manager");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin sign in</CardTitle>
          <CardDescription>Sign in to manage Premier Salt.</CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicForm<LoginValues>
            fields={fields}
            onSubmit={handleSubmit}
            isSubmitting={submitting}
            submitLabel="Sign in"
            submitButtonClassName="w-full"
          />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/admin/register"
              className="font-medium text-foreground hover:underline"
            >
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
