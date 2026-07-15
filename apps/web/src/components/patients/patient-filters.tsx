import { Search, X } from 'lucide-react';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';

interface PatientFiltersProps {
  searchName: string;
  onSearchNameChange: (v: string) => void;
  filterSex: string;
  onFilterSexChange: (v: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

export function PatientFilters({
  searchName,
  onSearchNameChange,
  filterSex,
  onFilterSexChange,
  onSearch,
  onClear,
}: PatientFiltersProps) {
  return (
    <div className="border-border bg-card flex flex-col items-end gap-3 rounded-xl border p-3 sm:flex-row">
      <div className="flex w-full flex-col gap-1">
        <label className="text-muted-foreground ml-1 text-xs">Paciente</label>
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nome do paciente..."
            value={searchName}
            onChange={(e) => onSearchNameChange(e.target.value)}
            className="rounded-xl pl-9"
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-1 sm:w-auto">
        <label className="text-muted-foreground ml-1 text-xs">Sexo</label>
        <Select value={filterSex} onValueChange={onFilterSexChange}>
          <SelectTrigger className="w-full rounded-xl sm:w-36">
            <SelectValue placeholder="Sexo" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem className="rounded-xl" value="all">
              Todos
            </SelectItem>
            <SelectItem className="rounded-xl" value="1">
              Masculino
            </SelectItem>
            <SelectItem className="rounded-xl" value="0">
              Feminino
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex w-full gap-3 sm:w-auto">
        <Button
          onClick={onSearch}
          className="flex-1 gap-2 rounded-xl sm:flex-none"
        >
          <Search className="h-4 w-4" />
          Buscar
        </Button>
        <Button
          variant="outline"
          onClick={onClear}
          className="flex-1 gap-2 rounded-xl sm:flex-none"
        >
          <X className="h-4 w-4" />
          Limpar
        </Button>
      </div>
    </div>
  );
}
