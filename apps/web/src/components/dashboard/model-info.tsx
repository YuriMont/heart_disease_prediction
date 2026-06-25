import { BrainCircuit } from "lucide-react";
import { useListarModelosModelosGet, useObterMetricasModelosNomeModeloMetricasGet } from "../../generated/api/modelos/modelos";
import type { NomeModelo } from "../../generated/models";

export function ModelInfo() {
  const { data: models } = useListarModelosModelosGet();
  const activeModel = models?.find((m) => m.ativo);
  const { data: metrics } = useObterMetricasModelosNomeModeloMetricasGet(
    activeModel?.nome as NomeModelo
  );

  return (
    <div className="rounded-[18px]  bg-linear-to-l from-(--sidebar-bg) to-(--primary-dark) p-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-6 w-6 text-white" />
            <h3 className="font-heading text-lg font-bold text-white">
              Modelo de IA — {activeModel?.nome}
            </h3>
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold text-white">
              {activeModel?.nome}
            </span>
          </div>
          <p className="text-sm text-[#9FB6D4]">
            {activeModel?.descricao ?? "-"}
          </p>
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[22px] font-bold text-white">{((metrics?.acuracia ?? 0) * 100).toFixed(2)}%</span>
            <span className="text-[11px] text-[#9FB6D4]">Accuracy</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[22px] font-bold text-white">{((metrics?.precisao ?? 0)*100).toFixed(2)}%</span>
            <span className="text-[11px] text-[#9FB6D4]">Precision</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[22px] font-bold text-white">{((metrics?.f1_score ?? 0) * 100).toFixed(2)}%</span>
            <span className="text-[11px] text-[#9FB6D4]">F1 Score</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[22px] font-bold text-white">{((metrics?.recall ?? 0) * 100).toFixed(2)}%</span>
            <span className="text-[11px] text-[#9FB6D4]">Recall</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[13px] font-semibold text-white">{metrics?.atualizacao ?? "00/00/0000"}</span>
            <span className="text-[11px] text-[#9FB6D4]">Última atualização</span>
          </div>
        </div>
      </div>
    </div>
  );
}
