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
    <div className="flex items-end gap-3 rounded-xl border border-border bg-card p-3">
      <div className="flex flex-col gap-1 w-full">
        <label className="text-xs text-muted-foreground ml-1">
          Paciente
        </label>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome do paciente..."
            value={searchName}
            onChange={(e) => onSearchNameChange(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground ml-1">Sexo</label>
        <Select value={filterSex} onValueChange={onFilterSexChange}>
          <SelectTrigger className="w-36 rounded-xl">
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

      <Button onClick={onSearch} className="gap-2 shrink-0 rounded-xl">
        <Search className="h-4 w-4" />
        Buscar
      </Button>
      <Button
        variant="outline"
        onClick={onClear}
        className="gap-2 shrink-0 rounded-xl"
      >
        <X className="h-4 w-4" />
        Limpar
      </Button>
    </div>
  );
}
