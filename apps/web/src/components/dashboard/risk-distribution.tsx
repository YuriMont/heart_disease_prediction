import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { useObterDistribuicaoRiscoDashboardRisksGet } from "../../generated/api/dashboard/dashboard";
import { formatNumber } from "../../lib/utils";

const COLORS: Record<string, string> = {
  baixo: "#16A45F",
  medio: "#E8930C",
  alto: "#DC3848",
};

const LABELS: Record<string, string> = {
  baixo: "Baixo risco",
  medio: "Médio risco",
  alto: "Alto risco",
};

export function RiskDistribution() {
  const { data: distribution } = useObterDistribuicaoRiscoDashboardRisksGet();

  const chartData = (distribution ?? []).map((d) => ({
    name: LABELS[d.risco] ?? d.risco,
    value: d.quantidade,
    percent: d.percentual,
    color: COLORS[d.risco] ?? "#95A3B8",
    risk: d.risco,
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="flex flex-col gap-5 p-6">
      <CardHeader className="p-0">
        <CardTitle>Distribuição de Risco</CardTitle>
        <CardDescription>Classificação dos {formatNumber(total)} pacientes</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-6 p-0">
        <div className="relative h-[180px] w-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-[30px] font-bold text-foreground">
              {formatNumber(total)}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">pacientes</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4">
          {chartData.map((entry) => (
            <div key={entry.risk} className="flex items-center gap-2.5">
              <div className="h-[11px] w-[11px] rounded-full" style={{ backgroundColor: entry.color }} />
              <div className="flex flex-1 flex-col">
                <span className="text-[13px] font-semibold text-foreground">{entry.name}</span>
                <span className="text-[11px] text-muted-foreground">
                  {formatNumber(entry.value)} pacientes
                </span>
              </div>
              <span className="font-heading text-base font-bold" style={{ color: entry.color }}>
                {entry.percent}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
