import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Users, Plus, Stethoscope } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "../../components/ui/empty";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { useListPatientsPatientsGet } from "../../generated/api/patients/patients";
import { useSetAtom } from "jotai";
import { selectedPatientAtom } from "../../atoms/patient";

export const Route = createFileRoute("/patients/")({
  component: PatientsPage,
});

function PatientsPage() {
  const { data: patients = [], isLoading } = useListPatientsPatientsGet();

  const setSelectedPatient = useSetAtom(selectedPatientAtom);
  const navigate = useNavigate();

  const handleEvaluate = (patient: typeof patients[0]) => {
    setSelectedPatient(patient);
    navigate({ to: "/evaluation" });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">Pacientes</h1>
          <p className="text-sm text-muted-foreground">
            Gerenciamento de pacientes cadastrados
          </p>
        </div>
        <div className="flex items-center gap-3.5">
          <Link to="/patients/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Paciente
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Users className="h-[22px] w-[22px] text-primary" />
          </div>
          <div>
            <div className="font-mono text-[34px] font-bold tracking-tight text-foreground">
              {patients.length}
            </div>
            <span className="text-sm text-muted-foreground">Total de pacientes</span>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-risk-low-soft">
            <Users className="h-[22px] w-[22px] text-risk-low" />
          </div>
          <div>
            <div className="font-mono text-[34px] font-bold tracking-tight text-foreground">
              {patients.filter((p) => p.sex === 1).length}
            </div>
            <span className="text-sm text-muted-foreground">Masculino</span>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-risk-high-soft">
            <Users className="h-[22px] w-[22px] text-risk-high" />
          </div>
          <div>
            <div className="font-mono text-[34px] font-bold tracking-tight text-foreground">
              {patients.filter((p) => p.sex === 0).length}
            </div>
            <span className="text-sm text-muted-foreground">Feminino</span>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle>Lista de Pacientes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
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
          ) : patients.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Users className="h-5 w-5" />
                </EmptyMedia>
                <EmptyTitle>Nenhum paciente cadastrado</EmptyTitle>
                <EmptyDescription>
                  Cadastre o primeiro paciente para iniciar as avaliações de risco cardiovascular.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead>Cadastrado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.name ?? "Sem nome"}</TableCell>
                    <TableCell>{patient.age} anos</TableCell>
                    <TableCell>
                      <Badge variant={patient.sex === 1 ? "default" : "secondary"}>
                        {patient.sex === 1 ? "M" : "F"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(patient.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEvaluate(patient)}
                          className="gap-1.5 rounded-lg"
                        >
                          <Stethoscope className="h-3.5 w-3.5" />
                          Avaliar
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
