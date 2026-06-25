import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, RotateCcw, Download } from "lucide-react";
import { useObterAvaliacaoAvaliacoesAvaliacaoIdGet } from "../../../generated/api/pacientes/pacientes";
import { useObterFatoresAvaliacoesAvaliacaoIdFatoresGet, useObterImportanciaAvaliacoesAvaliacaoIdImportanciaGet } from "../../../generated/api/resultado/resultado";
import { useExportarRelatorioRelatoriosExportarPost } from "../../../generated/api/relatorios/relatorios";
import { Button } from "../../../components/ui/button";
import { ResultHero } from "../../../components/resultado/result-hero";
import { ContributingFactors } from "../../../components/resultado/contributing-factors";
import { FeatureImportance } from "../../../components/resultado/feature-importance";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Recommendations } from "../../../components/resultado/recommendations";

export const Route = createFileRoute("/avaliacao/$id/")({
  component: ResultadoPage,
});

function ResultadoPage() {
  const { id: avaliacao_id } = Route.useParams();

  const { data: avaliacao, isLoading } = useObterAvaliacaoAvaliacoesAvaliacaoIdGet(avaliacao_id);
  const { data: factors = [] } = useObterFatoresAvaliacoesAvaliacaoIdFatoresGet(avaliacao_id);
  const { data: importance = [] } = useObterImportanciaAvaliacoesAvaliacaoIdImportanciaGet(avaliacao_id);
  const exportarRelatorio = useExportarRelatorioRelatoriosExportarPost();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-muted-foreground">Carregando resultado...</span>
      </div>
    );
  }

  if (!avaliacao) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-muted-foreground">Avaliação não encontrada</span>
      </div>
    );
  }

  const handleExport = async () => {
    try {
      await exportarRelatorio.mutateAsync({ data: { avaliacao_id } });
      alert("Relatório exportado com sucesso!");
    } catch {
      alert("Erro ao exportar relatório");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/avaliacao" className="hover:text-foreground">Nova Avaliação</Link>
            <span>/</span>
            <span className="text-foreground">Resultado da Predição</span>
          </div>
          <h1 className="font-heading text-[26px] font-bold text-foreground">
            Resultado da Predição
          </h1>
        </div>
        <div className="flex gap-3">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Dashboard
            </Button>
          </Link>
          <Link to="/avaliacao">
            <Button variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Nova Avaliação
            </Button>
          </Link>
          <Button onClick={handleExport} disabled={exportarRelatorio.isPending} className="gap-2">
            <Download className="h-4 w-4" />
            {exportarRelatorio.isPending ? "Exportando..." : "Exportar Relatório"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-[1fr_360px] gap-6">
        {/* Main Column */}
        <div className="flex flex-col gap-6">
          <ResultHero
            probability={avaliacao.probabilidade_doenca}
            riskLevel={avaliacao.tem_doenca ? "alto" : "baixo"}
            confidence={Number(((1 - avaliacao.probabilidade_doenca) * 100).toFixed(1))}
            modelName={avaliacao.modelo_usado}
            temDoenca={avaliacao.tem_doenca}
          />

          <div className="grid grid-cols-2 gap-6">
            <ContributingFactors factors={factors} />
            <FeatureImportance features={importance} />
          </div>
        </div>

        {/* Side Column */}
        <div className="flex flex-col gap-6">
          {/* Data Summary */}
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle>Dados da Avaliação</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-3">
              {[
                { label: "Idade", value: `${avaliacao.age} anos` },
                { label: "Sexo", value: avaliacao.sex === 1 ? "Masculino" : "Feminino" },
                { label: "Pressão arterial", value: `${avaliacao.trestbps} mmHg` },
                { label: "Colesterol", value: `${avaliacao.chol} mg/dL` },
                { label: "Freq. cardíaca máx.", value: `${avaliacao.thalach} bpm` },
                { label: "Dor no peito", value: `Tipo ${avaliacao.cp}` },
                { label: "ECG em repouso", value: `Tipo ${avaliacao.restecg}` },
                { label: "Depressão ST", value: `${avaliacao.oldpeak} mm` },
                { label: "Inclinação ST", value: `Tipo ${avaliacao.slope}` },
                { label: "Vasos coloridos", value: `${avaliacao.ca}` },
                { label: "Talassemia", value: `Tipo ${avaliacao.thal}` },
                { label: "Glicemia > 120", value: avaliacao.fbs === 1 ? "Sim" : "Não" },
                { label: "Angina exercício", value: avaliacao.exang === 1 ? "Sim" : "Não" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium text-foreground">{item.value}</span>
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
