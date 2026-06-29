import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import type { ContributingFactor } from "../../generated/models/contributingFactor";

interface ContributingFactorsProps {
  factors: ContributingFactor[];
}

export function ContributingFactors({ factors }: ContributingFactorsProps) {
  const sorted = [...factors].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  return (
    <Card className="flex flex-col gap-4 p-6">
      <CardHeader className="p-0">
        <CardTitle>Principais Fatores Contribuintes</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-0">
        {sorted.map((factor, index) => {
          const isPositive = factor.impact > 0;
          return (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    isPositive ? "bg-risk-high-soft" : "bg-risk-low-soft"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUp className="h-3.5 w-3.5 text-risk-high" />
                  ) : (
                    <ArrowDown className="h-3.5 w-3.5 text-risk-low" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-foreground">
                    {factor.variable} {factor.value}
                  </span>
                </div>
              </div>
              <span
                className={`font-heading text-sm font-bold ${
                  isPositive ? "text-risk-high" : "text-risk-low"
                }`}
              >
                {isPositive ? "+" : ""}{factor.impact.toFixed(2)}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
