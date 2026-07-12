import { useMemo, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { ClipboardList, Eye, Search, X, Calendar, Cpu } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '../../components/ui/empty';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/table';
import { useListEvaluationsEvaluationsGet } from '../../generated/api/evaluations/evaluations';
import { useListModelsModelsGet } from '../../generated/api/models/models';
import type { ListEvaluationsEvaluationsGetParams } from '../../generated/models/listEvaluationsEvaluationsGetParams';
import type { EvaluationResponse } from '../../generated/models/evaluationResponse';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/results/')({
  component: ResultsPage,
});

function ResultsPage() {
  const [params, setParams] = useState<ListEvaluationsEvaluationsGetParams>({
    page: 1,
    limit: 20,
  });
  const [searchName, setSearchName] = useState('');
  const [filterResult, setFilterResult] = useState('all');
  const [filterModel, setFilterModel] = useState('all');

  const { data, isLoading } = useListEvaluationsEvaluationsGet(params);
  const { data: models = [] } = useListModelsModelsGet();
  const evaluations = data?.data ?? [];
  const meta = data?.meta;

  const handleSearch = () => {
    setParams({
      page: 1,
      limit: 20,
      patient_name: searchName || undefined,
      has_disease:
        filterResult === 'all'
          ? undefined
          : filterResult === 'disease',
      model_used: filterModel === 'all' ? undefined : filterModel,
    });
  };

  const handleClear = () => {
    setSearchName('');
    setFilterResult('all');
    setFilterModel('all');
    setParams({ page: 1, limit: 20 });
  };

  const columns = useMemo<ColumnDef<EvaluationResponse>[]>(
    () => [
      {
        header: 'Paciente',
        accessorKey: 'patient_name',
        cell: ({ row }) => (
          <span className="inline-block truncate max-w-[160px] lg:max-w-[240px]">
            {row.original.patient_name ??
            `#${row.original.paciente_id.slice(0, 8)}`}
          </span>
        ),
      },
      {
        header: 'Resultado',
        accessorKey: 'has_disease',
        cell: ({ row }) => (
          <Badge
            variant={row.original.has_disease ? 'destructive' : 'secondary'}
          >
            {row.original.has_disease ? 'Doença' : 'Saudável'}
          </Badge>
        ),
      },
      {
        header: 'Probabilidade',
        accessorKey: 'disease_probability',
        cell: ({ row }) =>
          `${Math.round(row.original.disease_probability * 100)}%`,
      },
      {
        header: 'Modelo',
        accessorKey: 'model_used',
        cell: ({ row }) => (
          <span className="inline-block truncate max-w-[120px] text-muted-foreground">
            {row.original.model_used}
          </span>
        ),
      },
      {
        header: 'Data',
        accessorKey: 'created_at',
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {new Date(row.original.created_at).toLocaleDateString('pt-BR')}
          </span>
        ),
      },
      {
        header: 'Ações',
        id: 'actions',
        cell: ({ row }) => (
          <Link to={`/evaluation/${row.original.id}/`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: evaluations,
    columns,
    manualPagination: true,
    pageCount: meta?.total_pages ?? 1,
    state: {
      pagination: {
        pageIndex: (params.page ?? 1) - 1,
        pageSize: params.limit ?? 20,
      },
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater({
              pageIndex: (params.page ?? 1) - 1,
              pageSize: params.limit ?? 20,
            })
          : updater;
      setParams((p) => ({
        ...p,
        page: next.pageIndex + 1,
        limit: next.pageSize,
      }));
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const showStart = meta ? (meta.page - 1) * meta.limit + 1 : 0;
  const showEnd = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;

  return (
    <div className="flex flex-col gap-6">
      <Header />

      <div className="flex flex-col sm:flex-row items-end gap-3 rounded-xl border border-border bg-card p-3">
        <div className="flex flex-col gap-1 w-full">
          <Label className="text-xs text-muted-foreground ml-1">
            Paciente
          </Label>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome do paciente..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <Label className="text-xs text-muted-foreground ml-1">
            Resultado
          </Label>
          <Select value={filterResult} onValueChange={setFilterResult}>
            <SelectTrigger className="w-full sm:w-36 rounded-xl">
              <SelectValue placeholder="Resultado" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem className="rounded-xl" value="all">
                Todos
              </SelectItem>
              <SelectItem className="rounded-xl" value="disease">
                Doença
              </SelectItem>
              <SelectItem className="rounded-xl" value="healthy">
                Saudável
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <Label className="text-xs text-muted-foreground ml-1">Modelo</Label>
          <Select value={filterModel} onValueChange={setFilterModel}>
            <SelectTrigger className="w-full sm:w-36 rounded-xl">
              <SelectValue placeholder="Modelo" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem className="rounded-xl" value="all">
                Todos
              </SelectItem>
              {models.map((model) => (
                <SelectItem
                  key={model.name}
                  className="rounded-xl"
                  value={model.name}
                >
                  {model.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <Button
            variant="outline"
            onClick={handleClear}
            className="gap-2 flex-1 sm:flex-none rounded-xl"
          >
            <X className="h-4 w-4" />
            Limpar
          </Button>
          <Button onClick={handleSearch} className="gap-2 flex-1 sm:flex-none rounded-xl">
            <Search className="h-4 w-4" />
            Buscar
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle>Avaliações Concluídas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-0">
          {isLoading ? (
            <LoadingSkeleton />
          ) : evaluations.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ClipboardList className="h-5 w-5" />
                </EmptyMedia>
                <EmptyTitle>Nenhuma avaliação realizada</EmptyTitle>
                <EmptyDescription>
                  As avaliações de risco cardiovascular aparecerão aqui após
                  serem processadas pelo modelo de IA.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              {/* Desktop: tabela */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((hg) => (
                      <TableRow key={hg.id}>
                        {hg.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile: cards */}
              <div className="flex flex-col gap-3 sm:hidden">
                {evaluations.map((ev) => (
                  <div
                    key={ev.id}
                    className="rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="font-heading text-base font-bold text-foreground break-words">
                          {ev.patient_name ?? `#${ev.paciente_id.slice(0, 8)}`}
                        </span>
                      </div>
                      <Badge
                        variant={ev.has_disease ? 'destructive' : 'secondary'}
                        className="shrink-0"
                      >
                        {ev.has_disease ? 'Doença' : 'Saudável'}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="font-mono text-base font-bold text-foreground">
                          {Math.round(ev.disease_probability * 100)}%
                        </span>
                        <span className="text-xs">probabilidade</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Cpu className="h-3.5 w-3.5" />
                        {ev.model_used}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(ev.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="mt-3">
                      <Link to={`/evaluation/${ev.id}/`} className="block">
                        <Button variant="outline" size="sm" className="gap-1.5 rounded-lg w-full">
                          <Eye className="h-3.5 w-3.5" />
                          Visualizar
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  Mostrando {showStart}–{showEnd} de {meta?.total ?? 0}
                </span>
                {(meta?.total_pages ?? 1) > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="gap-1 rounded-lg"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Anterior</span>
                    </Button>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {table.getState().pagination.pageIndex + 1} /{' '}
                      {meta?.total_pages ?? 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="gap-1 rounded-lg"
                    >
                      <span className="hidden sm:inline">Próximo</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Header() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Resultados
        </h1>
        <p className="text-sm text-muted-foreground">
          Histórico de avaliação e predição
        </p>
      </div>
      <div className="flex items-center gap-3.5">
        <Link to="/evaluation">
          <Button className="gap-2 w-full sm:w-auto">
            <ClipboardList className="h-4 w-4" />
            Nova Avaliação
          </Button>
        </Link>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <>
      {/* Desktop skeleton */}
      <div className="hidden sm:flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        ))}
      </div>
      {/* Mobile skeleton */}
      <div className="flex flex-col gap-3 sm:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-5 flex-1" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="mt-3 h-9 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </>
  );
}
