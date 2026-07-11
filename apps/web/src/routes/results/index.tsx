import { useMemo, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { ClipboardList, Eye, Search, X } from 'lucide-react';
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
import { useListEvaluationsEvaluationsGet } from '../../generated/api/patients/patients';
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
        cell: ({ row }) =>
          row.original.patient_name ??
          `#${row.original.paciente_id.slice(0, 8)}`,
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
          <span className="text-muted-foreground">
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

      <div className="flex items-end gap-3 rounded-xl border border-border bg-card p-3">
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

        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground ml-1">
            Resultado
          </Label>
          <Select value={filterResult} onValueChange={setFilterResult}>
            <SelectTrigger className="w-36 rounded-xl">
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
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground ml-1">Modelo</Label>
          <Select value={filterModel} onValueChange={setFilterModel}>
            <SelectTrigger className="w-36 rounded-xl">
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
        <Button
          variant="outline"
          onClick={handleClear}
          className="gap-2 shrink-0 rounded-xl"
        >
          <X className="h-4 w-4" />
          Limpar
        </Button>
        <Button onClick={handleSearch} className="gap-2 shrink-0 rounded-xl">
          <Search className="h-4 w-4" />
          Buscar
        </Button>
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

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  Mostrando {showStart}–{showEnd} de {meta?.total ?? 0}
                </span>
                {(meta?.total_pages ?? 1) > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="gap-1 rounded-lg"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      Anterior
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
                      Próximo
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
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Resultados
        </h1>
        <p className="text-sm text-muted-foreground">
          Histórico de avaliação e predição
        </p>
      </div>
      <div className="flex items-center gap-3.5">
        <Link to="/evaluation">
          <Button className="gap-2">
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
    <div className="flex flex-col gap-3">
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
  );
}
