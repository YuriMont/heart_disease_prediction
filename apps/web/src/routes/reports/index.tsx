import { createFileRoute } from '@tanstack/react-router';
import { Download, Eye, FileText } from 'lucide-react';
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
import { useListReportsReportsGet } from '../../generated/api/reports/reports';

export const Route = createFileRoute('/reports/')({
  component: ReportsPage,
});

function ReportsPage() {
  const { data: reports = [], isLoading } = useListReportsReportsGet();

  const reportsEsteMes = reports.filter((r) => {
    const date = new Date(r.created_at);
    const now = new Date();
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Relatórios
          </h1>
          <p className="text-sm text-muted-foreground">
            Histórico de relatórios gerados pelo sistema
          </p>
        </div>
        <div className="flex items-center gap-3.5">
          <Button
            onClick={() => alert('função não implementada')}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="font-mono text-[34px] font-bold tracking-tight text-foreground">
            {reports.length}
          </div>
          <span className="text-sm text-muted-foreground">
            Relatórios gerados
          </span>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="font-mono text-[34px] font-bold tracking-tight text-foreground">
            {reportsEsteMes}
          </div>
          <span className="text-sm text-muted-foreground">
            Relatórios este mês
          </span>
        </div>
      </div>

      <Card className="p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle>Relatórios Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-5 flex-1" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileText className="h-5 w-5" />
                </EmptyMedia>
                <EmptyTitle>Nenhum relatório gerado</EmptyTitle>
                <EmptyDescription>
                  Os relatórios exportados aparecerão aqui. Realize uma
                  avaliação e exporte o relatório para visualizá-lo.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      #{report.avaliacao_id}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(report.created_at).toLocaleDateString('pt-BR')}
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
