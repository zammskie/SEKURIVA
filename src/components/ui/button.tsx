import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost";
type ButtonProps = ComponentProps<"button"> & { variant?: Variant };
type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn("button", `button-${variant}`, className)} {...props} />;
}

export function ButtonLink({ variant = "primary", className, ...props }: ButtonLinkProps) {
  return <Link className={cn("button", `button-${variant}`, className)} {...props} />;
}
