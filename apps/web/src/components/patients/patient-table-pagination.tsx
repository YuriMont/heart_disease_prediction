import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Table } from '@tanstack/react-table';
import type { PatientResponse } from '../../generated/models/patientResponse';
import { Button } from '../ui/button';

interface PatientTablePaginationProps {
  table: Table<PatientResponse>;
  start: number;
  end: number;
  total: number;
  totalPages: number;
}

export function PatientTablePagination({
  table,
  start,
  end,
  total,
  totalPages,
}: PatientTablePaginationProps) {
  return (
    <div className="flex items-center justify-between pt-2">
      <span className="text-xs text-muted-foreground">
        Mostrando {start}–{end} de {total}
      </span>
      {totalPages > 1 && (
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
            {table.getState().pagination.pageIndex + 1} / {totalPages}
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
  );
}
