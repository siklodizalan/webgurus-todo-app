import { twMerge } from "tailwind-merge";
import type { ClassNameValue } from "tailwind-merge";

export function cn(baseStyle: ClassNameValue, additionalStyle: ClassNameValue) {
  return twMerge(baseStyle, additionalStyle);
}
