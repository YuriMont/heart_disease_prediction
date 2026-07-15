import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TriangleAlert } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface ResultHeroProps {
  probability: number;
  riskLevel: string;
  confidence: number;
  modelName: string;
  temDoenca: boolean;
}

export function ResultHero({
  probability,
  riskLevel,
  confidence,
  modelName,
  temDoenca,
}: ResultHeroProps) {
  const riskColor =
    riskLevel === 'high'
      ? 'var(--risk-high)'
      : riskLevel === 'medium'
        ? 'var(--risk-med)'
        : 'var(--risk-low)';
  const riskLabel = temDoenca ? 'Possível Doença Cardíaca' : 'Baixo Risco';
  const riskBadge =
    riskLevel === 'high'
      ? 'ALTO RISCO'
      : riskLevel === 'medium'
        ? 'RISCO MÉDIO'
        : 'BAIXO RISCO';

  const gaugeData = [
    { name: 'risk', value: probability * 100 },
    { name: 'safe', value: 100 - probability * 100 },
  ];

  return (
    <Card className="flex flex-col items-center gap-6 p-8">
      <div className="relative h-[12.5rem] w-[12.5rem]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill={riskColor} />
              <Cell fill="oklch(0.9 0.008 260)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono text-[2.875rem] font-bold tracking-tight"
            style={{ color: riskColor }}
          >
            {(probability * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      <Badge
        variant={temDoenca ? 'destructive' : 'secondary'}
        className="gap-1.5 px-3 py-1"
      >
        {temDoenca && <TriangleAlert className="h-3.5 w-3.5" />}
        {riskBadge}
      </Badge>

      <div className="text-center">
        <h2 className="font-heading text-foreground text-[1.75rem] font-bold tracking-tight">
          {riskLabel}
        </h2>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          {temDoenca
            ? `O modelo ${modelName} identificou uma probabilidade de ${(probability * 100).toFixed(1)}% de doença cardíaca.`
            : 'O modelo identificou um baixo risco de doença cardíaca com base nos dados fornecidos.'}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <div className="bg-muted flex items-center gap-2 rounded-full px-4 py-2">
          <span className="text-muted-foreground text-xs">Resultado:</span>
          <span className="text-foreground text-xs font-semibold">
            {temDoenca ? 'Possível doença' : 'Sem doença'}
          </span>
        </div>
        <div className="bg-muted flex items-center gap-2 rounded-full px-4 py-2">
          <span className="text-muted-foreground text-xs">Confiança:</span>
          <span className="text-foreground text-xs font-semibold">
            Alta ({confidence}%)
          </span>
        </div>
        <div className="bg-muted flex items-center gap-2 rounded-full px-4 py-2">
          <span className="text-muted-foreground text-xs">Modelo:</span>
          <span className="text-foreground text-xs font-semibold">
            {modelName}
          </span>
        </div>
      </div>
    </Card>
  );
}
