import { useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { SortingState } from '@tanstack/react-table';
import { Users, Plus, Stethoscope, Calendar, BadgeInfo } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '../../components/ui/empty';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/table';
import { useListPatientsPatientsGet } from '../../generated/api/patients/patients';
import type { ListPatientsPatientsGetParams } from '../../generated/models/listPatientsPatientsGetParams';
import { useSetAtom } from 'jotai';
import { selectedPatientAtom } from '../../atoms/patient';
import { usePatientColumns } from '../../components/patients/columns';
import { PatientFilters } from '../../components/patients/patient-filters';
import { PatientTablePagination } from '../../components/patients/patient-table-pagination';
import { Badge } from '../../components/ui/badge';

export const Route = createFileRoute('/patients/')({
  component: PatientsPage,
});

function PatientsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [params, setParams] = useState<ListPatientsPatientsGetParams>({
    page: 1,
    limit: 20,
  });
  const [searchName, setSearchName] = useState('');
  const [filterSex, setFilterSex] = useState('all');

  const { data, isLoading } = useListPatientsPatientsGet(params);
  const patients = data?.data ?? [];
  const meta = data?.meta;

  const setSelectedPatient = useSetAtom(selectedPatientAtom);
  const navigate = useNavigate();

  const handleSearch = () => {
    setParams({
      page: 1,
      limit: 20,
      name: searchName || undefined,
      sex: filterSex === 'all' ? undefined : Number(filterSex),
    });
  };

  const handleClear = () => {
    setSearchName('');
    setFilterSex('all');
    setParams({ page: 1, limit: 20 });
  };

  const handleEvaluate = (patient: (typeof patients)[0]) => {
    setSelectedPatient(patient);
    navigate({ to: '/evaluation' });
  };

  const columns = usePatientColumns(handleEvaluate);

  const table = useReactTable({
    data: patients,
    columns,
    manualPagination: true,
    pageCount: meta?.total_pages ?? 1,
    state: {
      sorting,
      pagination: {
        pageIndex: (params.page ?? 1) - 1,
        pageSize: params.limit ?? 20,
      },
    },
    onSortingChange: setSorting,
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
    getSortedRowModel: getSortedRowModel(),
  });

  const showStart = meta ? (meta.page - 1) * meta.limit + 1 : 0;
  const showEnd = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;

  return (
    <div className="flex flex-col gap-6">
      <Header />

      <StatCard total={meta?.total ?? patients.length} />

      <PatientFilters
        searchName={searchName}
        onSearchNameChange={setSearchName}
        filterSex={filterSex}
        onFilterSexChange={setFilterSex}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      <Card className="p-6">
        <CardHeader className="p-0">
          <CardTitle>Lista de Pacientes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-0">
          {isLoading ? (
            <LoadingSkeleton />
          ) : patients.length === 0 ? (
            <EmptyState
              hasFilters={!!params.name || params.sex !== undefined}
            />
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
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="border-border bg-card rounded-2xl border p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <span className="font-heading text-foreground text-base font-bold break-words">
                          {patient.name ?? 'Sem nome'}
                        </span>
                      </div>
                      <Badge
                        variant={patient.sex === 1 ? 'default' : 'secondary'}
                        className="shrink-0"
                      >
                        {patient.sex === 1 ? 'M' : 'F'}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span className="inline-flex items-center gap-1.5">
                        <BadgeInfo className="h-3.5 w-3.5" />
                        {patient.age} anos
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(patient.created_at).toLocaleDateString(
                          'pt-BR',
                        )}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEvaluate(patient)}
                        className="w-full gap-1.5 rounded-lg"
                      >
                        <Stethoscope className="h-3.5 w-3.5" />
                        Avaliar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <PatientTablePagination
                table={table}
                start={showStart}
                end={showEnd}
                total={meta?.total ?? 0}
                totalPages={meta?.total_pages ?? 1}
              />
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
        <h1 className="font-heading text-foreground text-xl font-bold tracking-tight sm:text-2xl">
          Pacientes
        </h1>
        <p className="text-muted-foreground text-sm">
          Gerenciamento de pacientes cadastrados
        </p>
      </div>
      <Link to="/patients/new">
        <Button className="w-full gap-2 sm:w-auto">
          <Plus className="h-4 w-4" />
          Novo Paciente
        </Button>
      </Link>
    </div>
  );
}

function StatCard({ total }: { total: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="border-border bg-card flex items-center gap-4 rounded-2xl border p-5 shadow-sm">
        <div className="bg-primary/10 flex h-11 w-11 items-center justify-center rounded-xl">
          <Users className="text-primary h-[1.375rem] w-[1.375rem]" />
        </div>
        <div>
          <div className="text-foreground font-mono text-[2.125rem] font-bold tracking-tight">
            {total}
          </div>
          <span className="text-muted-foreground text-sm">
            Total de pacientes
          </span>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <>
      {/* Desktop skeleton */}
      <div className="hidden flex-col gap-3 sm:flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        ))}
      </div>
      {/* Mobile skeleton */}
      <div className="flex flex-col gap-3 sm:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-border bg-card rounded-2xl border p-4">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-5 flex-1" />
              <Skeleton className="h-5 w-10 rounded-full" />
            </div>
            <div className="mt-3 flex gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="mt-3 h-9 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Users className="h-5 w-5" />
        </EmptyMedia>
        <EmptyTitle>Nenhum paciente encontrado</EmptyTitle>
        <EmptyDescription>
          {hasFilters
            ? 'Nenhum paciente corresponde aos filtros aplicados.'
            : 'Cadastre o primeiro paciente para iniciar as avaliações de risco cardiovascular.'}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
