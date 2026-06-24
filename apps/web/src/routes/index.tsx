import { createFileRoute } from "@tanstack/react-router";
import { DashboardHeader } from "../components/dashboard/header";
import { StatCardsRow } from "../components/dashboard/stat-cards-row";
import { RiskDistribution } from "../components/dashboard/risk-distribution";
import { RiskFactors } from "../components/dashboard/risk-factors";
import { ModelInfo } from "../components/dashboard/model-info";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />
      <StatCardsRow />
      <div className="grid grid-cols-[420px_1fr] gap-5">
        <RiskDistribution />
        <RiskFactors />
      </div>
      <ModelInfo />
    </div>
  );
}
