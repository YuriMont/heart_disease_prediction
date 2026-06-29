import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function getRiskColor(risk: string): string {
  switch (risk.toLowerCase()) {
    case "low":
      return "text-[var(--risk-low)]";
    case "medium":
      return "text-[var(--risk-med)]";
    case "high":
      return "text-[var(--risk-high)]";
    default:
      return "text-muted-foreground";
  }
}

export function getRiskBg(risk: string): string {
  switch (risk.toLowerCase()) {
    case "low":
      return "bg-[var(--risk-low-soft)]";
    case "medium":
      return "bg-[var(--risk-med-soft)]";
    case "high":
      return "bg-[var(--risk-high-soft)]";
    default:
      return "bg-muted";
  }
}

export function getRiskDotColor(risk: string): string {
  switch (risk.toLowerCase()) {
    case "low":
      return "bg-[var(--risk-low)]";
    case "medium":
      return "bg-[var(--risk-med)]";
    case "high":
      return "bg-[var(--risk-high)]";
    default:
      return "bg-muted-foreground";
  }
}
