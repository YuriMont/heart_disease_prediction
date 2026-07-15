import { createFileRoute } from '@tanstack/react-router';
import { Eye, MoreHorizontal, Rocket, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  useListModelsModelsGet,
  useListFeaturesModelsFeaturesGet,
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
import { ScrollArea } from '@/components/ui/scroll-area';

export const Route = createFileRoute('/models/')({
  component: ModelsPage,
});

function ModelsPage() {
  const { data: models = [], isLoading } = useListModelsModelsGet();

  const [selectedModel, setSelectedModel] = useAtom(modelAtom);
  const [isVariablesOpen, setIsVariablesOpen] = useState(false);

  const { data: features, isLoading: isLoadingFeatures } =
    useListFeaturesModelsFeaturesGet();

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
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>Painel</span>
            <span>/</span>
            <span className="text-foreground">Modelos de IA</span>
          </div>
          <h1 className="font-heading text-foreground text-2xl font-bold tracking-tight">
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
            <CardHeader className="p-0">
              <CardTitle>Modelos Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <>
                  {/* Desktop skeleton */}
                  <div className="hidden flex-col gap-3 sm:flex">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-5 flex-1" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                      </div>
                    ))}
                  </div>
                  {/* Mobile skeleton */}
                  <div className="flex flex-col gap-3 sm:hidden">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="border-border bg-card rounded-2xl border p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="mt-1 h-4 w-full" />
                          </div>
                          <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Skeleton className="h-9 flex-1 rounded-lg" />
                          <Skeleton className="h-9 flex-1 rounded-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* Desktop: tabela */}
                  <div className="hidden sm:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Modelo</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[3.125rem]">Ações</TableHead>
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
                            <TableCell className="max-w-[8.75rem] truncate font-medium">
                              {model.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground max-w-[13.75rem] truncate">
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
                  </div>

                  {/* Mobile: cards */}
                  <div className="flex flex-col gap-3 sm:hidden">
                    {models.map((model) => {
                      const isActive = selectedModel?.name === model.name;
                      return (
                        <div
                          key={model.name}
                          className={cn(
                            'rounded-2xl border p-4',
                            isActive
                              ? 'border-primary bg-primary/5'
                              : 'border-border bg-card',
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <span className="font-heading text-foreground text-base font-bold break-words">
                                {model.name}
                              </span>
                              <p className="text-muted-foreground mt-0.5 text-sm break-words">
                                {model.description}
                              </p>
                            </div>
                            <Badge
                              variant={isActive ? 'default' : 'secondary'}
                              className="shrink-0"
                            >
                              {isActive ? 'Ativo' : 'Disponível'}
                            </Badge>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsVariablesOpen(true)}
                              className="flex-1 gap-1.5 rounded-lg"
                            >
                              <Info className="h-3.5 w-3.5" />
                              Variáveis
                            </Button>
                            {!isActive && (
                              <Button
                                size="sm"
                                onClick={() => setSelectedModel(model)}
                                className="flex-1 gap-1.5 rounded-lg"
                              >
                                <Rocket className="h-3.5 w-3.5" />
                                Selecionar
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side Column */}
        <div className="flex flex-col gap-6">
          {/* Performance */}
          <Card className="p-6">
            <CardHeader className="p-0">
              <CardTitle>Desempenho</CardTitle>
            </CardHeader>
            <CardContent className="*:border-border flex flex-col gap-5 p-0 *:border-b *:pb-5 [&>*:last-child]:border-b-0 [&>*:last-child]:pb-0">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Acurácia
                  </span>
                  <span className="text-foreground font-mono text-sm font-bold">
                    {((metrics?.accuracy ?? 0) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Recall</span>
                  <span className="text-foreground font-mono text-sm font-bold">
                    {((metrics?.recall ?? 0) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Precisão
                  </span>
                  <span className="text-foreground font-mono text-sm font-bold">
                    {((metrics?.precision ?? 0) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    F1 Score
                  </span>
                  <span className="text-foreground font-mono text-sm font-bold">
                    {((metrics?.f1_score ?? 0) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}

          <Dialog open={isVariablesOpen} onOpenChange={setIsVariablesOpen}>
            <DialogContent className="max-w-2xl">
              <ScrollArea className="max-h-[85dvh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Variáveis de Entrada</DialogTitle>
                  <DialogDescription>
                    Variáveis utilizadas pelo modelo para predição de doença
                    cardíaca.
                  </DialogDescription>
                </DialogHeader>
                {isLoadingFeatures ? (
                  <div className="flex flex-col gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 flex-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campo</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Descrição
                        </TableHead>
                        <TableHead>Valores</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(features ?? []).map((f) => (
                        <TableRow key={f.field}>
                          <TableCell className="max-w-[7.5rem] truncate font-mono text-xs font-medium">
                            {f.field}
                          </TableCell>
                          <TableCell className="hidden max-w-[11.25rem] truncate sm:table-cell">
                            <span className="inline-block max-w-[11.25rem] truncate">
                              {f.short_name_pt ?? f.display_name}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground max-w-[9.375rem] truncate">
                            {f.categories
                              ? Object.keys(f.categories).join(', ')
                              : (f.unit ?? '-')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
