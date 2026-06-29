import { createFileRoute } from "@tanstack/react-router";
import { EvaluationForm } from "../../components/evaluation/form-wizard";

export const Route = createFileRoute("/evaluation/")({
  component: EvaluationPage,
});

function EvaluationPage() {
  return <EvaluationForm />;
}
