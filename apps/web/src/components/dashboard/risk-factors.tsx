import { Activity } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/card';
import { useGetRiskFactorsDashboardFactorsGet } from '../../generated/api/dashboard/dashboard';

export function RiskFactors() {
  const { data: factors } = useGetRiskFactorsDashboardFactorsGet();

  const sortedFactors = [...(factors ?? [])].sort(
    (a, b) => b.prevalence - a.prevalence,
  );
  const isEmpty = sortedFactors.length === 0;

  return (
    <Card className="flex flex-col gap-[18px] p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <div className="flex flex-col gap-[3px]">
          <CardTitle>Fatores de Risco mais Frequentes</CardTitle>
          <CardDescription>
            Prevalência entre pacientes avaliados
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-3.5 p-0">
        {isEmpty ? (
          <div className="flex flex-col items-center gap-2 py-8 my-auto">
            <Activity className="h-6 w-6 text-muted-foreground/50" />
            <span className="text-sm text-muted-foreground">
              Nenhum dado de avaliação disponível
            </span>
          </div>
        ) : (
          sortedFactors.map((factor) => (
            <div key={factor.name} className="flex items-center gap-3.5">
              <div className="w-[150px] shrink-0">
                <span className="text-[13px] font-medium text-foreground">
                  {factor.name}
                </span>
              </div>
              <div className="flex-1 rounded-full bg-muted">
                <div
                  className="h-2.5 rounded-full bg-primary/70"
                  style={{ width: `${factor.prevalence}%` }}
                />
              </div>
              <span className="w-[42px] text-right font-mono text-[13px] font-bold text-foreground">
                {factor.prevalence}%
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
