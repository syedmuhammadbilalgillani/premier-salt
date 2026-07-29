import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { count, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { firstName, lastName, email, password } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (typeof firstName !== "string" || !firstName.trim()) {
    return NextResponse.json(
      { error: "First name is required." },
      { status: 400 },
    );
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }
  if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.` },
      { status: 400 },
    );
  }

  // Bootstrap rule: registration is open only until the first admin account
  // exists. After that, only an already signed-in admin can create more.
  const [{ value: userCount }] = await db
    .select({ value: count() })
    .from(users);

  if (userCount > 0) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          error:
            "Registration is closed. Ask an existing admin to create your account.",
        },
        { status: 403 },
      );
    }
  }

  const normalizedEmail = email.trim().toLowerCase();

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [created] = await db
    .insert(users)
    .values({
      firstName: firstName.trim(),
      lastName:
        typeof lastName === "string" && lastName.trim()
          ? lastName.trim()
          : null,
      email: normalizedEmail,
      password: passwordHash,
    })
    .returning({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
    });

  return NextResponse.json({ user: created }, { status: 201 });
}
