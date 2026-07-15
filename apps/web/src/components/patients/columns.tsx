import type { ColumnDef, HeaderContext } from '@tanstack/react-table';
import { ArrowUp, ArrowDown, ArrowUpDown, Stethoscope } from 'lucide-react';
import type { PatientResponse } from '../../generated/models/patientResponse';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

function SortHeader<T>({
  label,
  column,
}: {
  label: string;
  column: HeaderContext<T, unknown>['column'];
}) {
  const sorted = column.getIsSorted();
  return (
    <button
      onClick={() => column.toggleSorting(sorted === 'asc')}
      className="hover:text-foreground flex cursor-pointer items-center gap-1.5 transition-colors select-none"
    >
      {label}
      {sorted === 'asc' ? (
        <ArrowUp className="h-3.5 w-3.5" />
      ) : sorted === 'desc' ? (
        <ArrowDown className="h-3.5 w-3.5" />
      ) : (
        <ArrowUpDown className="text-muted-foreground/50 h-3.5 w-3.5" />
      )}
    </button>
  );
}

export function usePatientColumns(
  onEvaluate: (patient: PatientResponse) => void,
) {
  const columns: ColumnDef<PatientResponse>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => <SortHeader label="Nome" column={column} />,
      cell: ({ getValue }) => (
        <span className="text-foreground inline-block max-w-[11.25rem] truncate font-medium lg:max-w-[17.5rem]">
          {String(getValue() ?? 'Sem nome')}
        </span>
      ),
    },
    {
      accessorKey: 'age',
      header: ({ column }) => <SortHeader label="Idade" column={column} />,
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{String(getValue())} anos</span>
      ),
    },
    {
      accessorKey: 'sex',
      header: ({ column }) => <SortHeader label="Sexo" column={column} />,
      cell: ({ getValue }) => {
        const sex = Number(getValue());
        return (
          <Badge variant={sex === 1 ? 'default' : 'secondary'}>
            {sex === 1 ? 'M' : 'F'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => <SortHeader label="Cadastrado" column={column} />,
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {new Date(String(getValue())).toLocaleDateString('pt-BR')}
        </span>
      ),
    },
    {
      id: 'actions',
      enableSorting: false,
      header: () => <span className="sr-only">Ações</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEvaluate(row.original)}
            className="gap-1.5 rounded-lg"
          >
            <Stethoscope className="h-3.5 w-3.5" />
            Avaliar
          </Button>
        </div>
      ),
    },
  ];

  return columns;
}
