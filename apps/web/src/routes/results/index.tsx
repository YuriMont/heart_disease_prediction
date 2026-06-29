import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Eye, ClipboardList } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { useListEvaluationsEvaluationsGet } from "../../generated/api/patients/patients";

export const Route = createFileRoute("/results/")({
  component: ResultsPage,
});

function ResultsPage() {
  const { data: evaluations = [], isLoading } = useListEvaluationsEvaluationsGet();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-[26px] font-bold text-foreground">Resultados</h1>
          <p className="text-sm text-muted-foreground">
            Histórico de avaliação e predição
          </p>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
            <Search className="h-[17px] w-[17px] text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Pesquisar resultado...</span>
          </div>
          <Link to="/evaluation">
            <Button className="gap-2">
              <ClipboardList className="h-4 w-4" />
              Nova Avaliação
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle>Avaliações Concluídas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : evaluations.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma avaliação encontrada</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
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
                    <TableCell className="font-medium">#{ev.id}</TableCell>
                    <TableCell>#{ev.paciente_id}</TableCell>
                    <TableCell>
                      <Badge variant={ev.has_disease ? "danger" : "success"}>
                        {ev.has_disease ? "Doença" : "Saudável"}
                      </Badge>
                    </TableCell>
                    <TableCell>{Math.round(ev.disease_probability * 100)}%</TableCell>
                    <TableCell className="text-muted-foreground">{ev.model_used}</TableCell>
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
