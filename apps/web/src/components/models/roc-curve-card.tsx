import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { RocPoint } from '@/generated/models/rocPoint';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface RocCurveCardProps {
  rocCurve?: RocPoint[] | null;
  aucRoc?: number | null;
  isLoading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { fpr: number; tpr: number } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  const fprPct = (data.fpr * 100).toFixed(1);
  const tprPct = (data.tpr * 100).toFixed(1);
  const specPct = ((1 - data.fpr) * 100).toFixed(1);

  return (
    <div className="border-border bg-popover text-popover-foreground rounded-lg border p-3 shadow-md">
      <p className="text-muted-foreground mb-1.5 font-mono text-xs font-semibold">
        Ponto da Curva ROC
      </p>
      <div className="flex flex-col gap-1 text-xs">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Sensibilidade (TPR):</span>
          <span className="text-primary font-mono font-bold">{tprPct}%</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">
            Especificidade (1 - FPR):
          </span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {specPct}%
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Falsos Positivos (FPR):</span>
          <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
            {fprPct}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function RocCurveCard({
  rocCurve,
  aucRoc,
  isLoading = false,
}: RocCurveCardProps) {
  const chartData = React.useMemo(() => {
    if (!rocCurve || rocCurve.length === 0) return [];
    const sorted = [...rocCurve].sort((a, b) => a.fpr - b.fpr);
    return sorted.map((pt) => ({
      fpr: pt.fpr,
      tpr: pt.tpr,
      random: pt.fpr,
    }));
  }, [rocCurve]);

  const formattedAuc =
    aucRoc !== undefined && aucRoc !== null
      ? `${(aucRoc * 100).toFixed(1)}%`
      : null;

  return (
    <Card className="flex flex-col gap-4 p-6">
      <CardHeader className="flex flex-row items-start justify-between gap-4 p-0">
        <div className="flex flex-col gap-1">
          <CardTitle>Curva ROC</CardTitle>
          <CardDescription>
            Trade-off entre Sensibilidade (TPR) e Taxa de Falsos Positivos (FPR)
          </CardDescription>
        </div>
        {isLoading ? (
          <Skeleton className="h-6 w-24 rounded-full" />
        ) : formattedAuc ? (
          <Badge variant="secondary" className="font-mono font-semibold">
            AUC-ROC: {formattedAuc}
          </Badge>
        ) : null}
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <Skeleton className="h-[17.5rem] w-full rounded-xl" />
        ) : chartData.length === 0 ? (
          <div className="border-border text-muted-foreground flex h-[17.5rem] w-full items-center justify-center rounded-xl border border-dashed text-sm">
            Dados de Curva ROC indisponíveis
          </div>
        ) : (
          <div className="h-[17.5rem] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="fpr"
                  type="number"
                  domain={[0, 1]}
                  tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  dataKey="tpr"
                  type="number"
                  domain={[0, 1]}
                  tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="random"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  dot={false}
                  isAnimationActive={false}
                  name="Aleatório"
                />
                <Line
                  type="monotone"
                  dataKey="tpr"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                  name="Modelo"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
