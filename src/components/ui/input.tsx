import { useId } from "react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

type InputProps = ComponentProps<"input"> & { label: string; hint?: string; error?: string };

export function Input({ label, hint, error, id, className, "aria-describedby": describedBy, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const message = error ?? hint;
  const description = [describedBy, message ? `${inputId}-description` : undefined].filter(Boolean).join(" ") || undefined;
  return (
    <div className="input-field">
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} className={cn("input", className)} aria-invalid={error ? true : undefined} aria-describedby={description} {...props} />
      {message && <p id={`${inputId}-description`} className={cn("input-hint", error && "input-error")}>{message}</p>}
    </div>
  );
}
