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
    <div className="rounded-2xl bg-primary p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-6 w-6 text-primary-foreground" />
            <h3 className="font-heading text-lg font-bold text-primary-foreground">
              Modelo de IA — {selectedModel?.name}
            </h3>
            <span className="rounded-full bg-primary-foreground/15 px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
              {selectedModel?.name}
            </span>
          </div>
          <p className="text-sm text-primary-foreground/70">
            {selectedModel?.description ?? "-"}
          </p>
        </div>
        <div className="flex gap-8">
          <div className="flex flex-col items-end gap-[2px]">
            <span className="font-mono text-xl font-bold tracking-tight text-primary-foreground">
              {((metrics?.accuracy ?? 0) * 100).toFixed(2)}%
            </span>
            <span className="text-xs text-primary-foreground/60">Acurácia</span>
          </div>
          <div className="flex flex-col items-end gap-[2px]">
            <span className="font-mono text-xl font-bold tracking-tight text-primary-foreground">
              {((metrics?.precision ?? 0) * 100).toFixed(2)}%
            </span>
            <span className="text-xs text-primary-foreground/60">Precisão</span>
          </div>
          <div className="flex flex-col items-end gap-[2px]">
            <span className="font-mono text-xl font-bold tracking-tight text-primary-foreground">
              {((metrics?.f1_score ?? 0) * 100).toFixed(2)}%
            </span>
            <span className="text-xs text-primary-foreground/60">F1 Score</span>
          </div>
          <div className="flex flex-col items-end gap-[2px]">
            <span className="font-mono text-xl font-bold tracking-tight text-primary-foreground">
              {((metrics?.recall ?? 0) * 100).toFixed(2)}%
            </span>
            <span className="text-xs text-primary-foreground/60">Recall</span>
          </div>
          <div className="flex flex-col items-end gap-[2px]">
            <span className="font-mono text-xs font-semibold text-primary-foreground/80">
              {metrics?.updated_at || "00/00/0000"}
            </span>
            <span className="text-xs text-primary-foreground/60">
              Última atualização
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
