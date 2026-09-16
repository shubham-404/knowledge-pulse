"use server";

import crypto from "crypto";
import { redirect } from "next/navigation";
import { clearSession, createSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  LoginFormValues,
  RegisterFormValues,
  loginSchema,
  registerSchema,
} from "@/lib/validations/auth";
import { User } from "@/models/user";

export interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
  redirectUrl?: string;
}

export async function registerUser(
  rawValues: RegisterFormValues,
): Promise<ActionResult> {
  try {
    const validated = registerSchema.safeParse(rawValues);
    if (!validated.success) {
      const firstIssue = validated.error.issues[0]?.message;
      return {
        success: false,
        error: firstIssue || "Invalid registration data.",
      };
    }

    const { name, email, organization_name, password } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    await connectToDatabase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }

    const hashedPassword = await hashPassword(password);
    const verifyCode = crypto.randomInt(100000, 999999).toString();
    const verifyCodeExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const organization_id = `org_${crypto.randomUUID()}`;

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      organization_name,
      organization_id,
      password: hashedPassword,
      services: [],
      subscription: "inactive",
      verifyCode,
      verifyCodeExpiry,
      isVerified: false,
      documents: [],
      resources: [],
    });

    await createSession(newUser._id.toString(), newUser.email);

    return {
      success: true,
      redirectUrl: "/services",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during registration. Please try again.",
    };
  }
}

export async function loginUser(
  rawValues: LoginFormValues,
): Promise<ActionResult> {
  try {
    const validated = loginSchema.safeParse(rawValues);
    if (!validated.success) {
      const firstIssue = validated.error.issues[0]?.message;
      return {
        success: false,
        error: firstIssue || "Invalid credentials.",
      };
    }

    const { email, password } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    await connectToDatabase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    await createSession(user._id.toString(), user.email);

    const redirectUrl =
      user.services && user.services.length > 0 ? "/profile" : "/services";

    return {
      success: true,
      redirectUrl,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during login. Please try again.",
    };
  }
}

export async function logoutUser(): Promise<void> {
  await clearSession();
  redirect("/login");
}
