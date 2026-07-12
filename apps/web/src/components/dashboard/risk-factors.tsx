import { Activity, BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { useGetRiskFactorsDashboardFactorsGet } from '../../generated/api/dashboard/dashboard';

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { name: string; weight: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const { name, weight } = payload[0].payload;
  return (
    <div className="rounded-md border border-border/50 bg-popover px-3 py-1.5 text-xs shadow-md">
      <p className="font-medium text-popover-foreground">{name}</p>
      <p className="text-muted-foreground">
        importância: <span className="font-mono font-semibold text-popover-foreground">{weight.toFixed(4)}</span>
      </p>
    </div>
  );
}

export function RiskFactors() {
  const { data, isLoading } = useGetRiskFactorsDashboardFactorsGet();
  const factors = data?.factors ?? [];

  const sorted = [...factors].sort((a, b) => b.weight - a.weight);
  const isEmpty = sorted.length === 0;
  const modelLabel = data?.model_description ?? data?.model_name ?? '';

  const chartData = sorted.map((f) => ({
    ...f,
    shortName: f.short_name,
  }));

  return (
    <Card className="flex flex-col gap-4 p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <div className="flex flex-col gap-[3px]">
          <CardTitle>Fatores mais Impactantes</CardTitle>
          <CardDescription>
            {isLoading ? (
              <Skeleton className="h-4 w-52" />
            ) : isEmpty ? (
              'Nenhum dado de avaliação disponível'
            ) : (
              `Importância média — modelo: ${modelLabel}`
            )}
          </CardDescription>
        </div>
        <BarChart3 className="h-5 w-5 shrink-0 text-muted-foreground/40" />
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
        {isLoading ? (
          <div className="flex w-full flex-col gap-5 py-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-5 flex-1 rounded-md" />
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 my-auto">
            <Activity className="h-6 w-6 text-muted-foreground/50" />
            <span className="text-sm text-muted-foreground">
              Nenhum dado de avaliação disponível
            </span>
          </div>
        ) : (
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 4, bottom: 0, left: -12 }}
                barCategoryGap="30%"
              >
                <XAxis
                  dataKey="shortName"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar dataKey="weight" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  <LabelList
                    dataKey="weight"
                    position="top"
                    formatter={(v) => (typeof v === 'number' ? v.toFixed(2) : String(v ?? ''))}
                    style={{ fontSize: 10, fontFamily: 'var(--font-mono)' }}
                    fill="var(--color-muted-foreground)"
                  />
                  {chartData.map((_, i) => (
                    <Cell
                      key={i}
                      fill="var(--color-primary)"
                      fillOpacity={1 - i * 0.06}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
