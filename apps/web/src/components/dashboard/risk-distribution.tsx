import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { useGetRiskDistributionDashboardRisksGet } from "../../generated/api/dashboard/dashboard";
import { formatNumber } from "../../lib/utils";

const COLORS: Record<string, string> = {
  low: "var(--risk-low)",
  medium: "var(--risk-med)",
  high: "var(--risk-high)",
};

const LABELS: Record<string, string> = {
  low: "Baixo Risco",
  medium: "Risco Médio",
  high: "Alto Risco",
};

export function RiskDistribution() {
  const { data: distribution } = useGetRiskDistributionDashboardRisksGet();

  const chartData = (distribution ?? []).map((d) => ({
    name: LABELS[d.risk] ?? d.risk,
    value: d.quantity,
    percent: d.percentage,
    color: COLORS[d.risk] ?? "#94A3B8",
    risk: d.risk,
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const isEmpty = total === 0;

  return (
    <Card className="flex flex-col gap-5 p-6">
      <CardHeader className="p-0">
          <CardTitle>Distribuição de Risco</CardTitle>
          <CardDescription>Classificação de {formatNumber(total)} pacientes</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-6 p-0">
        <div className="relative h-[180px] w-[180px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={isEmpty ? [{ name: "vazio", value: 1 }] : chartData}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={90}
                paddingAngle={isEmpty ? 0 : 2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {isEmpty ? (
                  <Cell fill="oklch(0.9 0.008 260 / 0.5)" />
                ) : (
                  chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))
                )}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isEmpty ? (
              <>
                <Activity className="h-6 w-6 text-muted-foreground/50 mb-1" />
                <span className="text-xs font-medium text-muted-foreground">Sem dados</span>
              </>
            ) : (
              <>
                <span className="font-mono text-[30px] font-bold tracking-tight text-foreground">
                  {formatNumber(total)}
                </span>
                <span className="text-xs font-medium text-muted-foreground">pacientes</span>
              </>
            )}
          </div>
        </div>
        {isEmpty ? (
          <div className="flex flex-1 items-center justify-center">
            <span className="text-sm text-muted-foreground">
              Nenhuma avaliação realizada ainda
            </span>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-4">
            {chartData.map((entry) => (
              <div key={entry.risk} className="flex items-center gap-2.5">
                <div
                  className="h-[11px] w-[11px] shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="flex flex-1 flex-col">
                  <span className="text-[13px] font-semibold text-foreground">{entry.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatNumber(entry.value)} pacientes
                  </span>
                </div>
                <span className="font-mono text-base font-bold" style={{ color: entry.color }}>
                  {entry.percent}%
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
