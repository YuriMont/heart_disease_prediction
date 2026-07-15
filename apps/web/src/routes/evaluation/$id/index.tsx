import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Download } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetEvaluationEvaluationsEvaluationIdGet,
  useGetFactorsEvaluationsEvaluationIdFactorsGet,
  useGetImportanceEvaluationsEvaluationIdImportanceGet,
  useGetRecommendationsEvaluationsEvaluationIdRecommendationsGet,
  useExportReportPdfEvaluationsEvaluationIdReportPdfPost,
} from '../../../generated/api/evaluations/evaluations';
import { Button } from '../../../components/ui/button';
import { Skeleton } from '../../../components/ui/skeleton';
import { ResultHero } from '../../../components/result/result-hero';
import { ContributingFactors } from '../../../components/result/contributing-factors';
import { FeatureImportance } from '../../../components/result/feature-importance';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Recommendations } from '../../../components/result/recommendations';

export const Route = createFileRoute('/evaluation/$id/')({
  component: ResultadoPage,
});

function ResultadoPage() {
  const { id: evaluationId } = Route.useParams();

  const { data: evaluation, isLoading: isLoadingEvaluation } =
    useGetEvaluationEvaluationsEvaluationIdGet(evaluationId, {
      query: {
        gcTime: 50 * 60 * 1000, // 5 minutos
        staleTime: 1 * 60 * 1000, // 1 minuto
      },
    });

  const { data: factors = [], isLoading: isLoadingFactors } =
    useGetFactorsEvaluationsEvaluationIdFactorsGet(evaluationId, {
      query: {
        gcTime: 50 * 60 * 1000, // 5 minutos
        staleTime: 1 * 60 * 1000, // 1 minuto
      },
    });

  const { data: importance = [], isLoading: isLoadingImportance } =
    useGetImportanceEvaluationsEvaluationIdImportanceGet(evaluationId, {
      query: {
        gcTime: 50 * 60 * 1000, // 5 minutos
        staleTime: 1 * 60 * 1000, // 1 minuto
      },
    });

  const { data: recommendations = [], isLoading: isLoadingRecs } =
    useGetRecommendationsEvaluationsEvaluationIdRecommendationsGet(
      evaluationId,
      {
        query: {
          gcTime: 50 * 60 * 1000,
          staleTime: 1 * 60 * 1000,
        },
      },
    );

  const { mutateAsync: exportPdf, isPending: isExporting } =
    useExportReportPdfEvaluationsEvaluationIdReportPdfPost();

  const handleExport = async () => {
    toast.loading('Gerando relatório...');

    try {
      const blob = await exportPdf({
        evaluationId,
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `cardiopredict-relatorio-${evaluationId}.pdf`;
      a.click();

      URL.revokeObjectURL(url);

      toast.dismiss();
      toast.success('Relatório baixado!');
    } catch {
      toast.dismiss();
      toast.error('Erro ao gerar relatório');
    }
  };

  if (isLoadingEvaluation) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-36 rounded-xl" />
            <Skeleton className="h-9 w-44 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-6">
            <div className="border-border bg-card flex flex-col items-center gap-6 rounded-2xl border p-8">
              <Skeleton className="h-[200px] w-[200px] rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-8 w-72" />
              <Skeleton className="h-4 w-96" />
              <div className="flex flex-wrap justify-center gap-3">
                <Skeleton className="h-8 w-32 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-6">
                <Skeleton className="h-5 w-52" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-7 w-7 rounded-full" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
              <div className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-6">
                <Skeleton className="h-5 w-48" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 flex-1 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-6">
              <Skeleton className="h-5 w-36" />
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
            <div className="bg-primary rounded-2xl p-6">
              <div className="flex items-center gap-2">
                <Skeleton className="bg-primary-foreground/20 h-5 w-5 rounded-full" />
                <Skeleton className="bg-primary-foreground/20 h-5 w-32" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="mb-3 flex items-start gap-2">
                  <Skeleton className="bg-primary-foreground/20 mt-1 h-1.5 w-1.5 rounded-full" />
                  <Skeleton className="bg-primary-foreground/20 h-4 flex-1" />
                </div>
              ))}
              <Skeleton className="bg-primary-foreground/20 mt-5 h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center">
        <span className="text-muted-foreground">Avaliação não encontrada</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Link
              to="/evaluation"
              className="hover:text-foreground transition-colors"
            >
              Avaliação
            </Link>
            <span>/</span>
            <span className="text-foreground">Resultado da Predição</span>
          </div>
          <h1 className="font-heading text-foreground text-xl font-bold tracking-tight sm:text-2xl">
            Resultado da Predição
          </h1>
        </div>
        <div className="flex gap-3">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Gerando...' : 'Exportar'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        {/* Main Column */}
        <div className="flex flex-col gap-6">
          <ResultHero
            probability={evaluation.disease_probability}
            riskLevel={evaluation.has_disease ? 'high' : 'low'}
            confidence={Number(
              ((1 - evaluation.disease_probability) * 100).toFixed(1),
            )}
            modelName={evaluation.model_used}
            temDoenca={evaluation.has_disease}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ContributingFactors
              factors={factors}
              isLoading={isLoadingFactors}
            />
            <FeatureImportance
              features={importance}
              isLoading={isLoadingImportance}
            />
          </div>
        </div>

        {/* Side Column */}
        <div className="flex h-full flex-col gap-6">
          {/* Data Summary */}
          <Card className="p-6">
            <CardHeader className="p-0">
              <CardTitle>Dados da Avaliação</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 p-0">
              {[
                { label: 'Idade', value: `${evaluation.age} anos` },
                {
                  label: 'Sexo',
                  value: evaluation.sex === 1 ? 'Masculino' : 'Feminino',
                },
                {
                  label: 'Pressão arterial',
                  value: `${evaluation.trestbps} mmHg`,
                },
                { label: 'Colesterol', value: `${evaluation.chol} mg/dL` },
                {
                  label: 'Frequência cardíaca máx.',
                  value: `${evaluation.thalach} bpm`,
                },
                { label: 'Dor torácica', value: `Tipo ${evaluation.cp}` },
                {
                  label: 'ECG em repouso',
                  value: `Tipo ${evaluation.restecg}`,
                },
                { label: 'Depressão ST', value: `${evaluation.oldpeak} mm` },
                { label: 'Inclinação ST', value: `Tipo ${evaluation.slope}` },
                { label: 'Vasos coloridos', value: `${evaluation.ca}` },
                { label: 'Talassemia', value: `Tipo ${evaluation.thal}` },
                {
                  label: 'Glicemia > 120',
                  value: evaluation.fbs === 1 ? 'Sim' : 'Não',
                },
                {
                  label: 'Angina por exercício',
                  value: evaluation.exang === 1 ? 'Sim' : 'Não',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="border-border flex items-center justify-between border-b py-1 last:border-0"
                >
                  <span className="text-muted-foreground text-sm">
                    {item.label}
                  </span>
                  <span className="text-foreground text-sm font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {isLoadingRecs ? (
            <div className="bg-primary flex-1 rounded-2xl p-6">
              <div className="flex items-center gap-2">
                <Skeleton className="bg-primary-foreground/20 h-5 w-5 rounded-full" />
                <Skeleton className="bg-primary-foreground/20 h-5 w-32" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="mb-3 flex items-start gap-2">
                  <Skeleton className="bg-primary-foreground/20 mt-1 h-1.5 w-1.5 rounded-full" />
                  <Skeleton className="bg-primary-foreground/20 h-4 flex-1" />
                </div>
              ))}
              <Skeleton className="bg-primary-foreground/20 mt-5 h-12 w-full rounded-lg" />
            </div>
          ) : (
            <Recommendations recommendations={recommendations} />
          )}
        </div>
      </div>
    </div>
  );
}
