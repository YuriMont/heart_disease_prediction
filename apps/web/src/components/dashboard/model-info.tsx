import { BrainCircuit } from "lucide-react";
import {
  useGetMetricsModelsModelIdMetricsGet,
} from "../../generated/api/models/models";
import { useAtom } from "jotai";
import { modelAtom } from "../../store/model";

export function ModelInfo() {
  const [selectedModel] = useAtom(modelAtom);
  
  const { data: metrics } = useGetMetricsModelsModelIdMetricsGet(
    selectedModel?.id ?? "",
    {
      query: {
        enabled: !!selectedModel?.id,
      },
    },
  );

  return (
    <div className="rounded-[18px]  bg-primary p-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-6 w-6 text-white" />
            <h3 className="font-heading text-lg font-bold text-white">
              Modelo de IA — {selectedModel?.name}
            </h3>
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold text-white">
              {selectedModel?.name}
            </span>
          </div>
          <p className="text-sm text-accent">
            {selectedModel?.description ?? "-"}
          </p>
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold text-white">
              {((metrics?.accuracy ?? 0) * 100).toFixed(2)}%
            </span>
            <span className="text-xs text-accent">Acurácia</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold text-white">
              {((metrics?.precision ?? 0) * 100).toFixed(2)}%
            </span>
            <span className="text-xs text-accent">Precisão</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold text-white">
              {((metrics?.f1_score ?? 0) * 100).toFixed(2)}%
            </span>
            <span className="text-xs text-accent">F1 Score</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold text-white">
              {((metrics?.recall ?? 0) * 100).toFixed(2)}%
            </span>
            <span className="text-xs text-accent">Recall</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-white">
              {metrics?.updated_at  || "00/00/0000"}
            </span>
            <span className="text-xs text-accent">
              Última atualização
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
