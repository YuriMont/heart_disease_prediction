import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, X, Eye, ClipboardList } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "../../components/ui/empty";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/table";
import { useListEvaluationsEvaluationsGet } from "../../generated/api/patients/patients";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/results/")({
  component: ResultsPage,
});

function ResultsPage() {
  const { data: evaluations = [], isLoading } =
    useListEvaluationsEvaluationsGet();

  const [searchName, setSearchName] = useState("");
  const [filterResult, setFilterResult] = useState("all");
  const [filterModel, setFilterModel] = useState("all");

  const handleSearch = () => {
    // TODO: integrar busca com backend
  };

  const handleClear = () => {
    setSearchName("");
    setFilterResult("all");
    setFilterModel("all");
  };

  return (
    <div className="flex flex-col gap-6">
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

      {/** TODO: Remover código hardcoded */}
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
              <SelectItem className="rounded-xl" value="all">Todos</SelectItem>
              <SelectItem className="rounded-xl" value="disease">Doença</SelectItem>
              <SelectItem className="rounded-xl" value="healthy">Saudável</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground ml-1">Modelo</Label>
          <Select value={filterModel} onValueChange={setFilterModel}>
            <SelectTrigger className="w-36 rounded-xl">
              <SelectValue placeholder="Modelo" />
            </SelectTrigger>
            <SelectContent className="rounded-xl" >
              <SelectItem className="rounded-xl" value="all">Todos</SelectItem>
              <SelectItem className="rounded-xl" value="random_forest">Random Forest</SelectItem>
              <SelectItem className="rounded-xl" value="logistic_regression">
                Regressão Logística
              </SelectItem>
              <SelectItem className="rounded-xl" value="xgboost">XGBoost</SelectItem>
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
        <CardContent className="p-0">
          {isLoading ? (
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Probabilidade</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map((ev) => (
                  <TableRow key={ev.id}>
                    <TableCell>
                      {ev.patient_name ?? `#${ev.paciente_id.slice(0, 8)}`}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={ev.has_disease ? "destructive" : "secondary"}
                      >
                        {ev.has_disease ? "Doença" : "Saudável"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {Math.round(ev.disease_probability * 100)}%
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {ev.model_used}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(ev.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Link to={`/evaluation/${ev.id}/`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
