import { Sparkles } from 'lucide-react';
import { Card } from '../ui/card';

interface RecommendationsProps {
  recommendations: string[];
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  return (
    <Card className="flex flex-col bg-primary justify-between p-6 flex-1">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
          <h3 className="font-heading text-base font-bold text-primary-foreground">
            Recomendações
          </h3>
        </div>
        <ul className="flex flex-col gap-3">
          {recommendations.map((rec, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-primary-foreground/70"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-foreground/40" />
              {rec}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-5 rounded-lg bg-primary-foreground/10 p-3">
        <p className="text-xs text-primary-foreground/60">
          Resultado gerado por IA para suporte à decisão clínica. Não substitui
          a avaliação médica profissional.
        </p>
      </div>
    </Card>
  );
}
