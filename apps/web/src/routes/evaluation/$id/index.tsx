import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Download } from 'lucide-react';
import { useGetEvaluationEvaluationsEvaluationIdGet } from '../../../generated/api/patients/patients';
import {
  useGetFactorsEvaluationsEvaluationIdFactorsGet,
  useGetImportanceEvaluationsEvaluationIdImportanceGet,
} from '../../../generated/api/result/result';
import { useExportReportReportsExportPost } from '../../../generated/api/reports/reports';
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

  const exportarRelatorio = useExportReportReportsExportPost();

  if (isLoadingEvaluation) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-36 rounded-xl" />
            <Skeleton className="h-9 w-44 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-[1fr_360px] gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8">
              <Skeleton className="h-[200px] w-[200px] rounded-full" />
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-8 w-72" />
              <Skeleton className="h-4 w-96" />
              <div className="flex gap-3">
                <Skeleton className="h-8 w-32 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
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
              <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
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
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
              <Skeleton className="h-5 w-36" />
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-primary p-6">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5 rounded-full bg-primary-foreground/20" />
                <Skeleton className="h-5 w-32 bg-primary-foreground/20" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-2 mb-3">
                  <Skeleton className="mt-1 h-1.5 w-1.5 rounded-full bg-primary-foreground/20" />
                  <Skeleton className="h-4 flex-1 bg-primary-foreground/20" />
                </div>
              ))}
              <Skeleton className="mt-5 h-12 w-full rounded-lg bg-primary-foreground/20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-muted-foreground">Avaliação não encontrada</span>
      </div>
    );
  }

  const handleExport = async () => {
    try {
      await exportarRelatorio.mutateAsync({
        data: { avaliacao_id: evaluationId },
      });
      alert('Relatório exportado com sucesso!');
    } catch {
      alert('Erro ao exportar relatório');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              to="/evaluation"
              className="hover:text-foreground transition-colors"
            >
              Nova Avaliação
            </Link>
            <span>/</span>
            <span className="text-foreground">Resultado da Predição</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Resultado da Predição
          </h1>
        </div>
        <div className="flex gap-3">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Painel
            </Button>
          </Link>
          <Button
            onClick={handleExport}
            disabled={exportarRelatorio.isPending}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {exportarRelatorio.isPending
              ? 'Exportando...'
              : 'Exportar Relatório'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-[1fr_360px] gap-6">
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

          <div className="grid grid-cols-2 gap-6 overflow-auto">
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
        <div className="flex flex-col gap-6 h-full">
          {/* Data Summary */}
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
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
                  className="flex items-center justify-between py-1 border-b border-border last:border-0"
                >
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Recommendations />
        </div>
      </div>
    </div>
  );
}
