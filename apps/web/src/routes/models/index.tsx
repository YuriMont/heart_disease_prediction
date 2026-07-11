import { createFileRoute } from '@tanstack/react-router';
import { Eye, MoreHorizontal, Rocket } from 'lucide-react';
import {
  useListModelsModelsGet,
  useGetMetricsModelsModelIdMetricsGet,
} from '../../generated/api/models/models';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from '../../components/ui/table';
import { ModelInfo } from '../../components/dashboard/model-info';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { modelAtom } from '../../store/model';
import { useAtom } from 'jotai';
import { useState } from 'react';

export const Route = createFileRoute('/models/')({
  component: ModelsPage,
});

function ModelsPage() {
  const { data: models = [], isLoading } = useListModelsModelsGet();

  const [selectedModel, setSelectedModel] = useAtom(modelAtom);
  const [isVariablesOpen, setIsVariablesOpen] = useState(false);

  const { data: metrics } = useGetMetricsModelsModelIdMetricsGet(
    selectedModel?.id ?? '',
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
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Modelos de Inteligência Artificial
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-6">
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
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-5 flex-1" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {models.map((model) => (
                      <TableRow
                        key={model.name}
                        className={
                          selectedModel?.name == model.name
                            ? 'bg-primary/5 transition-colors'
                            : ''
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
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {selectedModel?.name === model.name
                              ? 'Ativo'
                              : 'Disponível'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              className="bg-card"
                              align="end"
                            >
                              <DropdownMenuItem
                                onClick={() => setIsVariablesOpen(true)}
                              >
                                <Eye className="h-4 w-4" />
                                Variáveis de entrada
                              </DropdownMenuItem>
                              {model.name != selectedModel?.name && (
                                <DropdownMenuItem
                                  onClick={() => setSelectedModel(model)}
                                >
                                  <Rocket className="h-4 w-4" />
                                  Selecionar modelo
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
            <CardContent className="p-0 flex flex-col gap-5 *:border-b *:border-border *:pb-5 [&>*:last-child]:border-b-0 [&>*:last-child]:pb-0">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Acurácia
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    {((metrics?.accuracy ?? 0) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Recall</span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    {((metrics?.recall ?? 0) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Precisão
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    {((metrics?.precision ?? 0) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    F1 Score
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    {((metrics?.f1_score ?? 0) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}

          <Dialog open={isVariablesOpen} onOpenChange={setIsVariablesOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Variáveis de Entrada</DialogTitle>
                <DialogDescription>
                  Variáveis utilizadas pelo modelo para predição de doença
                  cardíaca.
                </DialogDescription>
              </DialogHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valores</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { field: 'age', label: 'Idade', range: '1-120' },
                    { field: 'sex', label: 'Sexo', range: '0/1' },
                    { field: 'cp', label: 'Dor torácica', range: '1-4' },
                    {
                      field: 'trestbps',
                      label: 'Pressão em repouso',
                      range: 'mmHg',
                    },
                    { field: 'chol', label: 'Colesterol', range: 'mg/dL' },
                    {
                      field: 'fbs',
                      label: 'Glicemia em jejum',
                      range: '0/1',
                    },
                    {
                      field: 'restecg',
                      label: 'ECG em repouso',
                      range: '0-2',
                    },
                    {
                      field: 'thalach',
                      label: 'Freq. cardíaca máx.',
                      range: 'bpm',
                    },
                    {
                      field: 'exang',
                      label: 'Angina por exercício',
                      range: '0/1',
                    },
                    {
                      field: 'oldpeak',
                      label: 'Depressão ST',
                      range: 'mm',
                    },
                    {
                      field: 'slope',
                      label: 'Inclinação ST',
                      range: '1-3',
                    },
                    {
                      field: 'ca',
                      label: 'Vasos coloridos',
                      range: '0-3',
                    },
                    { field: 'thal', label: 'Talassemia', range: '3/6/7' },
                  ].map((f) => (
                    <TableRow key={f.field}>
                      <TableCell className="font-mono text-xs font-medium">
                        {f.field}
                      </TableCell>
                      <TableCell>{f.label}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {f.range}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
