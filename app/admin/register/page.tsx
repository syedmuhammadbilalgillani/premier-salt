"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

type RegisterValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function AdminRegisterPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const fields: DynamicField<RegisterValues>[] = [
    {
      type: "input",
      name: "firstName",
      label: "First name",
      colSpan: 6,
      required: true,
      rules: { required: "First name is required" },
    },
    {
      type: "input",
      name: "lastName",
      label: "Last name",
      colSpan: 6,
    },
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
      helperText: "At least 8 characters.",
      colSpan: 6,
      required: true,
      rules: {
        required: "Password is required",
        minLength: { value: 8, message: "At least 8 characters." },
      },
    },
    {
      type: "input",
      name: "confirmPassword",
      label: "Confirm password",
      inputType: "password",
      placeholder: "••••••••",
      colSpan: 6,
      required: true,
      rules: {
        required: "Please confirm your password",
        validate: (value, formValues) =>
          value === formValues.password || "Passwords do not match",
      },
    },
  ];

  async function handleSubmit(values: RegisterValues) {
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error || "Could not create the account.");
        return;
      }

      const result = await signIn("credentials", {
        email: values.email.trim().toLowerCase(),
        password: values.password,
        redirect: false,
      });

      if (!result || result.error) {
        toast.success("Account created — please sign in.");
        router.push("/admin/login");
        return;
      }

      toast.success("Account created.");
      router.push("/admin/file-manager");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an admin account</CardTitle>
          <CardDescription>
            Set up access to the Premier Salt admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicForm<RegisterValues>
            fields={fields}
            onSubmit={handleSubmit}
            isSubmitting={submitting}
            submitLabel="Create account"
            submitButtonClassName="w-full"
          />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/admin/login"
              className="font-medium text-foreground hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
