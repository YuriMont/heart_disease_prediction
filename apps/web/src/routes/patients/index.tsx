import { createFileRoute } from "@tanstack/react-router";
import { Search, Users, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/table";
import { useListPatientsPatientsGet } from "../../generated/api/patients/patients";

export const Route = createFileRoute("/patients/")({
  component: PatientsPage,
});

function PatientsPage() {
  const { data: patients = [], isLoading } = useListPatientsPatientsGet();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-[26px] font-bold text-foreground">Pacientes</h1>
          <p className="text-sm text-muted-foreground">
            Gerenciamento de pacientes cadastrados
          </p>
        </div>
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
            <Search className="h-[17px] w-[17px] text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Pesquisar paciente...</span>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Paciente
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="rounded-[18px] border border-border bg-card p-5 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Users className="h-[22px] w-[22px] text-primary" />
          </div>
          <div>
            <div className="font-heading text-[34px] font-bold text-foreground">
              {patients.length}
            </div>
            <span className="text-sm text-muted-foreground">Total de pacientes</span>
          </div>
        </div>
        <div className="rounded-[18px] border border-border bg-card p-5 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-risk-low-soft">
            <Users className="h-[22px] w-[22px] text-risk-low" />
          </div>
          <div>
            <div className="font-heading text-[34px] font-bold text-foreground">
              {patients.filter((p) => p.sex === 1).length}
            </div>
            <span className="text-sm text-muted-foreground">Masculino</span>
          </div>
        </div>
        <div className="rounded-[18px] border border-border bg-card p-5 flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-risk-high-soft">
            <Users className="h-[22px] w-[22px] text-risk-high" />
          </div>
          <div>
            <div className="font-heading text-[34px] font-bold text-foreground">
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
            <p className="text-muted-foreground">Carregando...</p>
          ) : patients.length === 0 ? (
            <p className="text-muted-foreground">Nenhum paciente encontrado</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead>Cadastrado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">#{patient.id}</TableCell>
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
