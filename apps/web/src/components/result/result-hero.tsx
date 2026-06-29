import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TriangleAlert } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface ResultHeroProps {
  probability: number;
  riskLevel: string;
  confidence: number;
  modelName: string;
  temDoenca: boolean;
}

export function ResultHero({ probability, riskLevel, confidence, modelName, temDoenca }: ResultHeroProps) {
  const riskColor = riskLevel === "alto" ? "#DC3848" : riskLevel === "medio" ? "#E8930C" : "#16A45F";
  const riskLabel = temDoenca ? "Possível Doença Cardíaca" : "Baixo Risco";
  const riskBadge = riskLevel === "alto" ? "ALTO RISCO" : riskLevel === "medio" ? "MÉDIO RISCO" : "BAIXO RISCO";

  const gaugeData = [
    { name: "risk", value: probability * 100 },
    { name: "safe", value: 100 - probability * 100 },
  ];

  return (
    <Card className="flex flex-col items-center gap-6 p-8">
      {/* Gauge */}
      <div className="relative h-[200px] w-[200px]">
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
              <Cell fill="#E2E9F3" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-[46px] font-bold" style={{ color: riskColor }}>
            {(probability * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Badge */}
      <Badge variant={temDoenca ? "danger" : "success"} className="gap-1.5 px-3 py-1">
        {temDoenca && <TriangleAlert className="h-3.5 w-3.5" />}
        {riskBadge}
      </Badge>

      {/* Title */}
      <div className="text-center">
        <h2 className="font-heading text-[28px] font-bold text-foreground">{riskLabel}</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {temDoenca
            ? `O modelo ${modelName} identificou uma probabilidade de ${(probability * 100).toFixed(1)}% de doença cardíaca.`
            : "O modelo identificou um baixo risco de doença cardíaca."}
        </p>
      </div>

      {/* Info Chips */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
          <span className="text-xs text-muted-foreground">Resultado:</span>
          <span className="text-xs font-semibold text-foreground">
            {temDoenca ? "Possível doença" : "Sem doença"}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
          <span className="text-xs text-muted-foreground">Confiança:</span>
          <span className="text-xs font-semibold text-foreground">Alta ({confidence}%)</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
          <span className="text-xs text-muted-foreground">Modelo:</span>
          <span className="text-xs font-semibold text-foreground">{modelName}</span>
        </div>
      </div>
    </Card>
  );
}
