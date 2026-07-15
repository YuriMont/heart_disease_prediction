import { createFileRoute } from '@tanstack/react-router';
import { PatientForm } from '../../components/patients/patient-form';

export const Route = createFileRoute('/patients/new')({
  component: NewPatientPage,
});

function NewPatientPage() {
  return (
    <div className="flex flex-col gap-[1.375rem]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-[0.3125rem]">
          <div className="flex items-center gap-[0.4375rem]">
            <span className="text-muted-foreground text-xs font-medium">
              Pacientes
            </span>
            <span className="text-muted-foreground">/</span>
            <span className="text-primary text-xs font-semibold">
              Novo Paciente
            </span>
          </div>
          <h1 className="font-heading text-foreground text-xl font-bold sm:text-2xl">
            Cadastro de Paciente
          </h1>
        </div>
      </div>
      <PatientForm />
    </div>
  );
}
