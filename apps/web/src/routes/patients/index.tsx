import { useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { SortingState } from '@tanstack/react-table';
import { Users, Plus } from 'lucide-react';
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
        <CardHeader className="p-0 mb-4">
          <CardTitle>Lista de Pacientes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-0">
          {isLoading ? (
            <LoadingSkeleton />
          ) : patients.length === 0 ? (
            <EmptyState hasFilters={!!params.name || params.sex !== undefined} />
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
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Pacientes
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerenciamento de pacientes cadastrados
        </p>
      </div>
      <Link to="/patients/new">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Paciente
        </Button>
      </Link>
    </div>
  );
}

function StatCard({ total }: { total: number }) {
  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <Users className="h-[22px] w-[22px] text-primary" />
        </div>
        <div>
          <div className="font-mono text-[34px] font-bold tracking-tight text-foreground">
            {total}
          </div>
          <span className="text-sm text-muted-foreground">
            Total de pacientes
          </span>
        </div>
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
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
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
