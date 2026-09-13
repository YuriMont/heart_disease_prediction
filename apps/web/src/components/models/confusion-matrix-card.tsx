import type { ConfusionMatrixData } from '@/generated/models/confusionMatrixData';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ConfusionMatrixCardProps {
  data?: ConfusionMatrixData | null;
  isLoading?: boolean;
}

export function ConfusionMatrixCard({
  data,
  isLoading = false,
}: ConfusionMatrixCardProps) {
  const tn = data?.tn ?? 0;
  const fp = data?.fp ?? 0;
  const fn = data?.fn ?? 0;
  const tp = data?.tp ?? 0;

  const total = tn + fp + fn + tp;

  const calcPercent = (val: number) => {
    if (total === 0) return '0.0%';
    return `${((val / total) * 100).toFixed(1)}%`;
  };

  return (
    <Card className="flex flex-col gap-4 p-6">
      <CardHeader className="p-0">
        <CardTitle>Matriz de Confusão</CardTitle>
        <CardDescription>
          {isLoading ? (
            <Skeleton className="h-4 w-56" />
          ) : (
            `Desempenho de classificação para ${total.toLocaleString('pt-BR')} amostras de teste`
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* TN */}
            <div className="flex flex-col justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 dark:bg-emerald-500/15">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Verdadeiros Negativos (TN)
                </span>
                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  {calcPercent(tn)}
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <span className="font-mono text-2xl font-extrabold text-emerald-900 dark:text-emerald-100">
                  {tn}
                </span>
                <span className="text-[0.6875rem] text-emerald-700/80 dark:text-emerald-400">
                  Sem risco real & predito
                </span>
              </div>
            </div>

            {/* FP */}
            <div className="flex flex-col justify-between rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 dark:bg-amber-500/15">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                  Falsos Positivos (FP)
                </span>
                <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-300">
                  {calcPercent(fp)}
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <span className="font-mono text-2xl font-extrabold text-amber-900 dark:text-amber-100">
                  {fp}
                </span>
                <span className="text-[0.6875rem] text-amber-700/80 dark:text-amber-400">
                  Falso alarme de risco
                </span>
              </div>
            </div>

            {/* FN */}
            <div className="flex flex-col justify-between rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 dark:bg-rose-500/15">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                  Falsos Negativos (FN)
                </span>
                <span className="font-mono text-xs font-bold text-rose-700 dark:text-rose-300">
                  {calcPercent(fn)}
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <span className="font-mono text-2xl font-extrabold text-rose-900 dark:text-rose-100">
                  {fn}
                </span>
                <span className="text-[0.6875rem] text-rose-700/80 dark:text-rose-400">
                  Risco não detectado
                </span>
              </div>
            </div>

            {/* TP */}
            <div className="flex flex-col justify-between rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 dark:bg-blue-500/15">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                  Verdadeiros Positivos (TP)
                </span>
                <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
                  {calcPercent(tp)}
                </span>
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <span className="font-mono text-2xl font-extrabold text-blue-900 dark:text-blue-100">
                  {tp}
                </span>
                <span className="text-[0.6875rem] text-blue-700/80 dark:text-blue-400">
                  Com risco real & predito
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
