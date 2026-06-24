import { ClipboardList, ShieldCheck, Activity, HeartPulse } from "lucide-react";
import { StatCard } from "../ui/stat-card";
import { useObterStatsDashboardStatsGet } from "../../generated/api/dashboard/dashboard";
import { formatNumber } from "../../lib/utils";

export function StatCardsRow() {
  const { data: stats } = useObterStatsDashboardStatsGet();

  const total = stats?.total_analises ?? 0;
  const low = stats?.baixo_risco ?? 0;
  const med = stats?.medio_risco ?? 0;
  const high = stats?.alto_risco ?? 0;

  const lowPct = total > 0 ? Math.round((low / total) * 100) : 0;
  const medPct = total > 0 ? Math.round((med / total) * 100) : 0;
  const highPct = total > 0 ? Math.round((high / total) * 100) : 0;

  return (
    <div className="grid grid-cols-4 gap-5">
      <StatCard
        icon={ClipboardList}
        iconBg="bg-primary/10"
        iconColor="text-primary"
        value={formatNumber(total)}
        label="Total de análises realizadas"
        trend="+12%"
        trendBg="bg-risk-low-soft"
        trendColor="text-risk-low"
      />
      <StatCard
        icon={ShieldCheck}
        iconBg="bg-risk-low-soft"
        iconColor="text-risk-low"
        value={formatNumber(low)}
        label="Pacientes — baixo risco"
        trend={`${lowPct}%`}
        trendBg="bg-risk-low-soft"
        trendColor="text-risk-low"
      />
      <StatCard
        icon={Activity}
        iconBg="bg-risk-med-soft"
        iconColor="text-risk-med"
        value={formatNumber(med)}
        label="Pacientes — médio risco"
        trend={`${medPct}%`}
        trendBg="bg-risk-med-soft"
        trendColor="text-risk-med"
      />
      <StatCard
        icon={HeartPulse}
        iconBg="bg-risk-high-soft"
        iconColor="text-risk-high"
        value={formatNumber(high)}
        label="Pacientes — alto risco"
        trend={`${highPct}%`}
        trendBg="bg-risk-high-soft"
        trendColor="text-risk-high"
      />
    </div>
  );
}
