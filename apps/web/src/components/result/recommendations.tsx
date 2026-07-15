import { Sparkles } from 'lucide-react';
import { Card } from '../ui/card';

interface RecommendationsProps {
  recommendations: string[];
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  return (
    <Card className="bg-primary flex flex-1 flex-col justify-between p-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary-foreground h-5 w-5" />
          <h3 className="font-heading text-primary-foreground text-base font-bold">
            Recomendações
          </h3>
        </div>
        <ul className="flex flex-col gap-3">
          {recommendations.map((rec, index) => (
            <li
              key={index}
              className="text-primary-foreground/70 flex items-start gap-2 text-sm"
            >
              <span className="bg-primary-foreground/40 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
              {rec}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-primary-foreground/10 mt-5 rounded-lg p-3">
        <p className="text-primary-foreground/60 text-xs">
          Resultado gerado por IA para suporte à decisão clínica. Não substitui
          a avaliação médica profissional.
        </p>
      </div>
    </Card>
  );
}
