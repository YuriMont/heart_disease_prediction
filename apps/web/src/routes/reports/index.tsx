import { createFileRoute } from "@tanstack/react-router";
import { Search, Bell, Download, Eye } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { useListReportsReportsGet } from "../../generated/api/reports/reports";

export const Route = createFileRoute("/reports/")({
  component: ReportsPage,
});

function ReportsPage() {
  const { data: reports = [], isLoading } = useListReportsReportsGet();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-[26px] font-bold text-foreground">Relatórios</h1>
          <p className="text-sm text-muted-foreground">
            Histórico de relatórios gerados pelo sistema
          </p>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
            <Search className="h-[17px] w-[17px] text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Pesquisar relatório...</span>
          </div>
          <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card">
            <Bell className="h-[19px] w-[19px] text-secondary-foreground" />
          </button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="rounded-[18px] border border-border bg-card p-5">
            <span className="text-sm text-muted-foreground">Relatórios gerados</span>
          <div className="mt-2 font-heading text-[34px] font-bold text-foreground">
            {reports.length}
          </div>
        </div>
        <div className="rounded-[18px] border border-border bg-card p-5">
            <span className="text-sm text-muted-foreground">Risco Médio</span>
          <div className="mt-2 font-heading text-[34px] font-bold text-foreground">Médio</div>
          <span className="text-xs text-risk-low">Estável</span>
        </div>
        <div className="rounded-[18px] border border-border bg-card p-5">
            <span className="text-sm text-muted-foreground">Tendência Mensal</span>
          <div className="mt-2 font-heading text-[34px] font-bold text-foreground">+5%</div>
          <span className="text-xs text-risk-low">↑</span>
        </div>
      </div>

      <Card className="p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle>Relatórios Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : reports.length === 0 ? (
            <p className="text-muted-foreground">Nenhum relatório encontrado</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">#{report.id}</TableCell>
                    <TableCell>{report.title}</TableCell>
                    <TableCell className="text-muted-foreground">#{report.avaliacao_id}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(report.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
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
