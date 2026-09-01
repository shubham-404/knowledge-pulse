"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, UserPlus } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters.")
      .max(50, "Name must be at most 50 characters."),

    email: z
      .string()
      .email("Enter a valid email address."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(72, "Password must be at most 72 characters."),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password."),

    terms: z
      .boolean()
      .refine((value) => value, {
        message: "You must accept the terms to continue.",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.infer<typeof signupSchema>

export interface SignupFormProps {
  onSubmit?: (data: SignupFormValues) => void | Promise<void>
}

export function SignupForm({ onSubmit }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  async function handleSubmit(data: SignupFormValues) {
    if (onSubmit) {
      await onSubmit(data)
      return
    }

    console.log("Signup:", data)
  }

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-md-surface-container p-6 shadow-lg sm:p-8">
      {/* Atmospheric Material You decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-md-primary/15 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-md-tertiary/10 blur-3xl"
      />

      <div className="relative">
        {/* Header */}
        <div className="mb-5 flex justify-evenly items-center">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-md-secondary-container text-md-on-secondary-container">
            <UserPlus
              className="h-5 w-5"
              aria-hidden="true"
            />
          </div>
          <div>

            <h1 className="md-headline-medium text-md-on-surface">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-md-on-surface-variant">
              Join us to explore our services.
            </p>
          </div>
        </div>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          noValidate
          className="space-y-5"
        >
          <FieldGroup className="gap-3">
            {/* Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Full name
                  </FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    type="text"
                    placeholder="Ravi Kisan"
                    autoComplete="name"
                    aria-invalid={fieldState.invalid}
                    className="h-11 rounded-t-xl rounded-b-none border-0 border-b-2 bg-md-surface-container-low px-4 text-md-on-surface shadow-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-md-primary focus-visible:ring-offset-2"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Email address
                  </FieldLabel>

                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    placeholder="ravi@kisan.com"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                    className="h-11 rounded-t-xl rounded-b-none border-0 border-b-2 bg-md-surface-container-low px-4 text-md-on-surface shadow-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-md-primary focus-visible:ring-offset-2"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Password
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                      className="h-11 rounded-t-xl rounded-b-none border-0 border-b-2 bg-md-surface-container-low px-4 pr-12 text-md-on-surface shadow-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-md-primary focus-visible:ring-offset-2"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-md-on-surface-variant transition-all duration-200 hover:bg-md-primary/10 hover:text-md-primary active:scale-95 focus-visible:ring-2 focus-visible:ring-md-primary focus-visible:ring-offset-2"
                    >
                      {showPassword ? (
                        <EyeOff
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      ) : (
                        <Eye
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>

                  <FieldDescription>
                    Use at least 8 characters.
                  </FieldDescription>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Confirm password */}
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Confirm password
                  </FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={
                        showConfirmPassword ? "text" : "password"
                      }
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                      className="h-11 rounded-t-xl rounded-b-none border-0 border-b-2 bg-md-surface-container-low px-4 pr-12 text-md-on-surface shadow-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-md-primary focus-visible:ring-offset-2"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-md-on-surface-variant transition-all duration-200 hover:bg-md-primary/10 hover:text-md-primary active:scale-95 focus-visible:ring-2 focus-visible:ring-md-primary focus-visible:ring-offset-2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      ) : (
                        <Eye
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Terms */}
            <Controller
              name="terms"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                  className="items-start gap-3"
                >
                  <Checkbox
                    id={field.name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    className="mt-0.5"
                  />

                  <div className="space-y-1">
                    <FieldLabel
                      htmlFor={field.name}
                      className="font-normal leading-5"
                    >
                      I agree to the terms and conditions
                    </FieldLabel>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />
          </FieldGroup>

          {/* Submit */}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="h-12 w-full rounded-full bg-md-primary px-6 text-md-on-primary shadow-sm transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:bg-md-primary/90 hover:shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-md-primary focus-visible:ring-offset-2"
          >
            {form.formState.isSubmitting
              ? "Creating account..."
              : "Create account"}
          </Button>

          <p className="text-center text-sm text-md-on-surface-variant">
            Already have an account?{" "}
            <Link
              href="/login"
              className="rounded-full px-1 font-medium text-md-primary underline-offset-4 transition-colors duration-200 hover:bg-md-primary/10 hover:underline focus-visible:ring-2 focus-visible:ring-md-primary focus-visible:ring-offset-2"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
