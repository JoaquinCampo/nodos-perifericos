import { z } from "zod";

function calculateCheckDigit(ci: string): number {
  const weights = [2, 9, 8, 7, 6, 3, 4];
  const ciDigits = ci.split("").map(Number);

  const sum = ciDigits
    .slice(0, 7)
    .reduce((acc, digit, index) => acc + digit * weights[index]!, 0);

  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

function isValidCheckDigit(ci: string): boolean {
  // Remove hyphen if present
  const cleanCi = ci.replace("-", "");

  if (cleanCi.length !== 8) {
    return false;
  }

  const numberPart = cleanCi.slice(0, 7);
  const checkDigit = parseInt(cleanCi.slice(7), 10);
  const calculatedCheckDigit = calculateCheckDigit(numberPart);

  return calculatedCheckDigit === checkDigit;
}

export function formatCi(ci: string): string {
  const cleanCi = ci.replace("-", "");
  return `${cleanCi.slice(0, 7)}-${cleanCi.slice(7)}`;
}

export function cleanCi(ci: string): string {
  return ci.replace("-", "");
}

export const ciSchema = z
  .string()
  .min(1, "CI is required")
  .regex(/^\d{7}-?\d$/, "CI must be in the format 1234567-8 or 12345678")
  .refine(isValidCheckDigit, "Invalid CI: check digit does not match");

export const ciOrUndefinedSchema = z
  .string()
  .optional()
  .transform((val) => (val === "" ? undefined : val))
  .pipe(ciSchema.optional());
