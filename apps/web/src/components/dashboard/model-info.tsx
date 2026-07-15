import { BrainCircuit } from 'lucide-react';
import { useGetMetricsModelsModelIdMetricsGet } from '../../generated/api/models/models';
import { useAtom } from 'jotai';
import { modelAtom } from '../../store/model';

export function ModelInfo() {
  const [selectedModel] = useAtom(modelAtom);

  const { data: metrics } = useGetMetricsModelsModelIdMetricsGet(
    selectedModel?.id ?? '',
    {
      query: {
        enabled: !!selectedModel?.id,
      },
    },
  );

  return (
    <div className="bg-primary rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <BrainCircuit className="text-primary-foreground h-6 w-6 shrink-0" />
            <h3 className="font-heading text-primary-foreground text-lg font-bold">
              Modelo de IA — {selectedModel?.name}
            </h3>
            <span className="bg-primary-foreground/15 text-primary-foreground rounded-full px-2.5 py-0.5 text-xs font-semibold">
              {selectedModel?.name}
            </span>
          </div>
          <p className="text-primary-foreground/70 text-sm">
            {selectedModel?.description ?? '-'}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 sm:gap-8">
          <div className="flex flex-col items-start gap-[0.125rem] sm:items-end">
            <span className="text-primary-foreground font-mono text-xl font-bold tracking-tight">
              {((metrics?.accuracy ?? 0) * 100).toFixed(2)}%
            </span>
            <span className="text-primary-foreground/60 text-xs">Acurácia</span>
          </div>
          <div className="flex flex-col items-start gap-[0.125rem] sm:items-end">
            <span className="text-primary-foreground font-mono text-xl font-bold tracking-tight">
              {((metrics?.precision ?? 0) * 100).toFixed(2)}%
            </span>
            <span className="text-primary-foreground/60 text-xs">Precisão</span>
          </div>
          <div className="flex flex-col items-start gap-[0.125rem] sm:items-end">
            <span className="text-primary-foreground font-mono text-xl font-bold tracking-tight">
              {((metrics?.f1_score ?? 0) * 100).toFixed(2)}%
            </span>
            <span className="text-primary-foreground/60 text-xs">F1 Score</span>
          </div>
          <div className="flex flex-col items-start gap-[0.125rem] sm:items-end">
            <span className="text-primary-foreground font-mono text-xl font-bold tracking-tight">
              {((metrics?.recall ?? 0) * 100).toFixed(2)}%
            </span>
            <span className="text-primary-foreground/60 text-xs">Recall</span>
          </div>
          <div className="flex flex-col items-start gap-[0.125rem] sm:items-end">
            <span className="text-primary-foreground/80 font-mono text-xs font-semibold">
              {metrics?.updated_at || '00/00/0000'}
            </span>
            <span className="text-primary-foreground/60 text-xs">
              Última atualização
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
