import { ClipboardList, ShieldCheck, Activity, HeartPulse } from 'lucide-react';
import { StatCard } from '../ui/stat-card';
import { useGetStatsDashboardStatsGet } from '../../generated/api/dashboard/dashboard';
import { formatNumber } from '../../lib/utils';

export function StatCardsRow() {
  const { data: stats } = useGetStatsDashboardStatsGet();

  const total = stats?.total_analyses ?? 0;
  const low = stats?.low_risk ?? 0;
  const med = stats?.medium_risk ?? 0;
  const high = stats?.high_risk ?? 0;

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
        label="Total de Análises"
        trend="+12%"
        trendBg="bg-risk-low-soft"
        trendColor="text-risk-low"
      />
      <StatCard
        icon={ShieldCheck}
        iconBg="bg-risk-low-soft"
        iconColor="text-risk-low"
        value={formatNumber(low)}
        label="Baixo Risco"
        trend={`${lowPct}%`}
        trendBg="bg-risk-low-soft"
        trendColor="text-risk-low"
      />
      <StatCard
        icon={Activity}
        iconBg="bg-risk-med-soft"
        iconColor="text-risk-med"
        value={formatNumber(med)}
        label="Risco Médio"
        trend={`${medPct}%`}
        trendBg="bg-risk-med-soft"
        trendColor="text-risk-med"
      />
      <StatCard
        icon={HeartPulse}
        iconBg="bg-red-500-soft"
        iconColor="text-risk-high"
        value={formatNumber(high)}
        label="Alto Risco"
        trend={`${highPct}%`}
        trendBg="bg-red-500-soft"
        trendColor="text-risk-high"
      />
    </div>
  );
}
