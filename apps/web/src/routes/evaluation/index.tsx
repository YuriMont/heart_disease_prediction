import { createFileRoute } from "@tanstack/react-router";
import { AvaliacaoForm } from "../../components/avaliacao/form-wizard";

export const Route = createFileRoute("/avaliacao/")({
  component: AvaliacaoPage,
});

function AvaliacaoPage() {
  return <AvaliacaoForm />;
}
