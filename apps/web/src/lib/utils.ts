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
    case "baixo":
      return "text-[var(--risk-low)]";
    case "medio":
    case "médio":
      return "text-[var(--risk-med)]";
    case "alto":
      return "text-[var(--risk-high)]";
    default:
      return "text-muted-foreground";
  }
}

export function getRiskBg(risk: string): string {
  switch (risk.toLowerCase()) {
    case "baixo":
      return "bg-[var(--risk-low-soft)]";
    case "medio":
    case "médio":
      return "bg-[var(--risk-med-soft)]";
    case "alto":
      return "bg-[var(--risk-high-soft)]";
    default:
      return "bg-muted";
  }
}

export function getRiskDotColor(risk: string): string {
  switch (risk.toLowerCase()) {
    case "baixo":
      return "bg-[var(--risk-low)]";
    case "medio":
    case "médio":
      return "bg-[var(--risk-med)]";
    case "alto":
      return "bg-[var(--risk-high)]";
    default:
      return "bg-muted-foreground";
  }
}
