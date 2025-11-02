import { useState } from "react";
import { z } from "zod";

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function useZodValidation<T extends Record<string, any>>(
  schema: z.Schema<T>
) {
  const [errors, setErrors] = useState<ValidationErrors<T>>({});

  function validate(data: unknown): boolean {
    const result = schema.safeParse(data);

    if (result.success) {
      setErrors({});
      return true;
    }

    const newErrors: ValidationErrors<T> = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof T;
      if (field) newErrors[field] = issue.message;
    }

    setErrors(newErrors);
    return false;
  }

  const clearError = (field: keyof T) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const setError = (field: keyof T, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  return { errors, validate, clearError, setError };
}
