import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ExampleForm } from "@/components/example-form";

describe("ExampleForm", () => {
  it("renders the form fields", () => {
    render(<ExampleForm />);

    expect(
      screen.getByRole("textbox", { name: /name/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /email/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /submit/i }),
    ).toBeInTheDocument();
  });
});