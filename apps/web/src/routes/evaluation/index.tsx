import { createFileRoute } from '@tanstack/react-router';
import { EvaluationForm } from '../../components/evaluation/form-wizard';
import { RequirePatientGuard } from '../../components/evaluation/require-patient-guard';

export const Route = createFileRoute('/evaluation/')({
  component: EvaluationPage,
});

function EvaluationPage() {
  return (
    <RequirePatientGuard>
      <EvaluationForm />
    </RequirePatientGuard>
  );
}
