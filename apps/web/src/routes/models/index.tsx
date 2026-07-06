import { createFileRoute } from "@tanstack/react-router";
import { BrainCircuit, Search } from "lucide-react";
import {
  useListModelsModelsGet,
  useGetMetricsModelsModelIdMetricsGet,
} from "../../generated/api/models/models";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "../../components/ui/table";
import { Progress } from "@radix-ui/react-progress";
import { ModelInfo } from "../../components/dashboard/model-info";
import { Badge } from "../../components/ui/badge";
import { modelAtom } from "../../store/model";
import { useAtom } from "jotai";

export const Route = createFileRoute("/models/")({
  component: ModelsPage,
});

function ModelsPage() {
  const { data: models = [], isLoading } = useListModelsModelsGet();

  const [selectedModel, setSelectedModel] = useAtom(modelAtom);

  const { data: metrics } = useGetMetricsModelsModelIdMetricsGet(
    selectedModel?.id ?? "",
    {
      query: {
        enabled: !!selectedModel?.id,
      },
    },
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Painel</span>
            <span>/</span>
            <span className="text-foreground">Modelos de IA</span>
          </div>
          <h1 className="font-heading text-[26px] font-bold text-foreground">
            Modelos de Inteligência Artificial
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-6">
        {/* Main Column */}
        <div className="flex flex-col gap-6">
          {/* Active Model Card */}
          <ModelInfo />

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
                      <TableHead>Descrição</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {models.map((model) => (
                      <TableRow
                        key={model.name}
                        onClick={() => setSelectedModel(model)}
                        className={
                          selectedModel?.name == model.name
                            ? "bg-gray-200 transition-colors"
                            : ""
                        }
                      >
                        <TableCell className="font-medium">
                          {model.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {model.description}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              selectedModel?.name === model.name
                                ? "default"
                                : "secondary"
                            }
                          >
                            {selectedModel?.name === model.name
                              ? "Ativo"
                              : "Disponível"}
                          </Badge>
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
              <CardTitle>Desempenho</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Acurácia
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {((metrics?.accuracy ?? 0) * 100).toFixed(2)}%
                  </span>
                </div>
                <Progress value={metrics?.accuracy ?? 0} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Recall</span>
                  <span className="text-sm font-bold text-foreground">
                    {((metrics?.recall ?? 0) * 100).toFixed(2)}%
                  </span>
                </div>
                <Progress
                  value={metrics?.recall ?? 0}
                  indicatorClassName="bg-risk-low"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Precisão
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {((metrics?.precision ?? 0) * 100).toFixed(2)}%
                  </span>
                </div>
                  <Progress
                    value={metrics?.precision ?? 0}
                    indicatorClassName="bg-accent"
                  />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    F1 Score
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {((metrics?.f1_score ?? 0) * 100).toFixed(2)}%
                  </span>
                </div>
                <Progress
                  value={metrics?.f1_score ?? 0}
                  indicatorClassName="bg-primary"
                />
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
                { field: "cp", label: "Dor torácica", range: "1-4" },
                { field: "trestbps", label: "Pressão em repouso", range: "mmHg" },
                { field: "chol", label: "Colesterol", range: "mg/dL" },
                { field: "fbs", label: "Glicemia em jejum", range: "0/1" },
                { field: "restecg", label: "ECG em repouso", range: "0-2" },
                { field: "thalach", label: "Freq. cardíaca máx.", range: "bpm" },
                { field: "exang", label: "Angina por exercício", range: "0/1" },
                { field: "oldpeak", label: "Depressão ST", range: "mm" },
                { field: "slope", label: "Inclinação ST", range: "1-3" },
                { field: "ca", label: "Vasos coloridos", range: "0-3" },
                { field: "thal", label: "Talassemia", range: "3/6/7" },
              ].map((f) => (
                <div
                  key={f.field}
                  className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {f.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {f.field}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {f.range}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
