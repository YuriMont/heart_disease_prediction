import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit, Search, Check, Badge, Table } from "lucide-react";
import { useListarModelosModelosGet, useObterMetricasModelosNomeModeloMetricasGet } from "../../generated/api/modelos/modelos";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Progress } from "@radix-ui/react-progress";
import type { NomeModelo } from "../../generated/models";

export const Route = createFileRoute("/modelos/")({
  component: ModelosPage,
});

function ModelosPage() {
  const { data: models = [], isLoading } = useListarModelosModelosGet();
  const activeModel = models.find((m) => m.ativo);
  const { data: metrics } = useObterMetricasModelosNomeModeloMetricasGet(
    activeModel?.nome as NomeModelo
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-foreground">Modelos de IA</span>
          </div>
          <h1 className="font-heading text-[26px] font-bold text-foreground">
            Modelos de Inteligência Artificial
          </h1>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
            <Search className="h-[17px] w-[17px] text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Buscar modelo...</span>
          </div>
          <Button className="gap-2">
            <BrainCircuit className="h-4 w-4" />
            Novo Modelo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-6">
        {/* Main Column */}
        <div className="flex flex-col gap-6">
          {/* Active Model Card */}
          <div className="rounded-[18px]  bg-linear-to-l from-(--sidebar-bg) to-(--primary-dark) p-6">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <BrainCircuit className="h-6 w-6 text-white" />
                  <h3 className="font-heading text-lg font-bold text-white">
                    {activeModel?.nome ?? "Ensemble"}
                  </h3>
                  <Badge variant="success" className="text-[10px]">ATIVO</Badge>
                </div>
                <p className="text-sm text-[#9FB6D4]">
                  {activeModel?.descricao ?? "-"}
                </p>
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[22px] font-bold text-white">{((metrics?.acuracia ?? 0)*100).toFixed(2)}%</span>
                  <span className="text-[11px] text-[#9FB6D4]">Accuracy</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[22px] font-bold text-white">{((metrics?.precisao ?? 0)*100).toFixed(2)}</span>
                  <span className="text-[11px] text-[#9FB6D4]">Precisão</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[22px] font-bold text-white">{((metrics?.recall ?? 0) * 100).toFixed(2)}%</span>
                  <span className="text-[11px] text-[#9FB6D4]">Recall</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[22px] font-bold text-white">{((metrics?.f1_score ?? 0) * 100).toFixed(2)}%</span>
                  <span className="text-[11px] text-[#9FB6D4]">F1 Score</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[13px] font-semibold text-white">{metrics?.atualizacao ?? "00/00/0000"}</span>
                  <span className="text-[11px] text-[#9FB6D4]">Atualizado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Models Table */}
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle>Modelos Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <p className="text-muted-foreground">Carregando...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Acurácia</TableHead>
                      <TableHead>AUC-ROC</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {models.map((model) => (
                      <TableRow key={model.nome}>
                        <TableCell className="font-medium">{model.nome}</TableCell>
                        <TableCell className="text-muted-foreground">{model.descricao}</TableCell>
                        <TableCell>
                          <Badge variant={model.ativo ? "default" : "secondary"}>
                            {model.ativo ? "Ativo" : "Disponível"}
                          </Badge>
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>
                          {model.ativo && <Check className="h-4 w-4 text-risk-low" />}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side Column */}
        <div className="flex flex-col gap-6">
          {/* Performance */}
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Acurácia</span>
                  <span className="text-sm font-bold text-foreground">{((metrics?.acuracia ?? 0) * 100).toFixed(2)}%</span>
                </div>
                <Progress value={metrics?.acuracia ?? 0} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Recall</span>
                  <span className="text-sm font-bold text-foreground">{((metrics?.recall ?? 0) * 100).toFixed(2)}%</span>
                </div>
                <Progress value={metrics?.recall ?? 0} indicatorClassName="bg-risk-low" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Precisão</span>
                  <span className="text-sm font-bold text-foreground">{((metrics?.precisao ?? 0) * 100).toFixed(2)}%</span>
                </div>
                <Progress value={metrics?.precisao ?? 0} indicatorClassName="bg-accent" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">F1 Score</span>
                  <span className="text-sm font-bold text-foreground">{((metrics?.f1_score ?? 0) * 100).toFixed(2)}%</span>
                </div>
                <Progress value={metrics?.f1_score ?? 0} indicatorClassName="bg-primary" />
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="p-6">
            <CardHeader className="p-0 mb-4">
              <CardTitle>Variáveis de Entrada</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-2">
              {[
                { field: "age", label: "Idade", range: "1-120" },
                { field: "sex", label: "Sexo", range: "0/1" },
                { field: "cp", label: "Dor no peito", range: "1-4" },
                { field: "trestbps", label: "Pressão repouso", range: "mmHg" },
                { field: "chol", label: "Colesterol", range: "mg/dL" },
                { field: "fbs", label: "Glicemia jejum", range: "0/1" },
                { field: "restecg", label: "ECG repouso", range: "0-2" },
                { field: "thalach", label: "Freq. máx.", range: "bpm" },
                { field: "exang", label: "Angina exercício", range: "0/1" },
                { field: "oldpeak", label: "Depressão ST", range: "mm" },
                { field: "slope", label: "Inclinação ST", range: "1-3" },
                { field: "ca", label: "Vasos coloridos", range: "0-3" },
                { field: "thal", label: "Talassemia", range: "3/6/7" },
              ].map((f) => (
                <div key={f.field} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{f.label}</span>
                    <span className="text-[11px] text-muted-foreground font-mono">{f.field}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{f.range}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
