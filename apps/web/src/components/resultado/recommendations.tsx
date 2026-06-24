import { Sparkles } from "lucide-react";
import { Card } from "../ui/card";

export function Recommendations() {
  const recommendations = [
    "Manter acompanhamento cardiológico regular",
    "Controlar pressão arterial com medicamentos se necessário",
    "Adotar dieta equilibrada com baixo teor de sódio",
    "Praticar exercícios físicos moderados (150 min/semana)",
    "Evitar tabagismo e consumo excessivo de álcool",
  ];

  return (
    <Card className="rounded-[18px]  bg-linear-to-l from-(--sidebar-bg) to-(--primary-dark) p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-white" />
        <h3 className="font-heading text-base font-bold text-white">Recomendações</h3>
      </div>
      <ul className="flex flex-col gap-3">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-[#C2D0E4]">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {rec}
          </li>
        ))}
      </ul>
      <div className="mt-5 rounded-lg bg-white/10 p-3">
        <p className="text-[11px] text-[#9FB6D4]">
          Resultado gerado por IA para apoio à decisão clínica. Não substitui a avaliação médica
          profissional.
        </p>
      </div>
    </Card>
  );
}
