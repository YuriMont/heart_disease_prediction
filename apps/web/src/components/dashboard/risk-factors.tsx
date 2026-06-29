import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { useGetRiskFactorsDashboardFactorsGet } from "../../generated/api/dashboard/dashboard";

export function RiskFactors() {
  const { data: factors } = useGetRiskFactorsDashboardFactorsGet();

  const sortedFactors = [...(factors ?? [])].sort((a, b) => b.prevalence - a.prevalence);

  return (
    <Card className="flex flex-col gap-[18px] p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <div className="flex flex-col gap-[3px]">
          <CardTitle>Fatores de Risco Mais Frequentes</CardTitle>
          <CardDescription>Prevalência entre pacientes avaliados</CardDescription>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5">
          <span className="text-xs font-medium text-secondary-foreground">Últimos 30 dias</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-3.5 p-0">
        {sortedFactors.map((factor) => (
          <div key={factor.name} className="flex items-center gap-3.5">
            <div className="w-[150px] shrink-0">
              <span className="text-[13px] font-medium text-foreground">{factor.name}</span>
            </div>
            <div className="flex-1 rounded-full bg-secondary">
              <div
                className="h-2.5 rounded-full bg-risk-high"
                style={{ width: `${factor.prevalence}%` }}
              />
            </div>
            <span className="w-[42px] text-right font-heading text-[13px] font-bold text-foreground">
              {factor.prevalence}%
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
