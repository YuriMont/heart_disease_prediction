import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import type { ContributingFactor } from '../../generated/models/contributingFactor';
import { ScrollArea } from '../ui/scroll-area';

interface ContributingFactorsProps {
  factors: ContributingFactor[];
  isLoading: boolean;
}

export function ContributingFactors({
  factors,
  isLoading,
}: ContributingFactorsProps) {
  const sorted = [...factors].sort(
    (a, b) => Math.abs(b.impact) - Math.abs(a.impact),
  );

  return (
    <Card className="flex flex-col gap-4 p-6">
      <CardHeader className="p-0">
        <CardTitle>Principais Fatores Contribuintes</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[34rem]">
        <CardContent className="flex flex-1 flex-col gap-3 p-0">
          {isLoading && (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-muted/50 flex items-center justify-between rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          )}
          {!isLoading &&
            sorted.map((factor, index) => {
              const isPositive = factor.impact > 0;
              return (
                <div
                  key={index}
                  className="bg-muted/50 flex items-center justify-between rounded-xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full ${
                        isPositive ? 'bg-risk-high-soft' : 'bg-risk-low-soft'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUp className="text-risk-high h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="text-risk-low h-3.5 w-3.5" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-foreground text-[0.8125rem] font-medium">
                        {factor.variable} {factor.value}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`font-mono text-sm font-bold ${
                      isPositive ? 'text-risk-high' : 'text-risk-low'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {factor.impact.toFixed(2)}
                  </span>
                </div>
              );
            })}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
