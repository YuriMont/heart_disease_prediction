import { createFileRoute } from "@tanstack/react-router";
import { PatientForm } from "../../components/patients/patient-form";

export const Route = createFileRoute("/patients/new")({
  component: NewPatientPage,
});

function NewPatientPage() {
  return (
    <div className="flex flex-col gap-[22px]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-[5px]">
          <div className="flex items-center gap-[7px]">
            <span className="text-xs font-medium text-muted-foreground">
              Pacientes
            </span>
            <span className="text-muted-foreground">/</span>
            <span className="text-xs font-semibold text-primary">
              Novo Paciente
            </span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Cadastro de Paciente
          </h1>
        </div>
      </div>
      <PatientForm />
    </div>
  );
}
