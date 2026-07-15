import { type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  value: string | number;
  label: string;
  trend?: string;
  trendBg?: string;
  trendColor?: string;
}

export function StatCard({
  icon: Icon,
  iconBg = 'bg-primary/10',
  iconColor = 'text-primary',
  value,
  label,
  trend,
  trendBg = 'bg-risk-low-soft',
  trendColor = 'text-risk-low',
}: StatCardProps) {
  return (
    <div className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-[1.375rem] shadow-sm transition-all duration-200 hover:-translate-y-[0.125rem] hover:shadow-md">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl',
            iconBg,
          )}
        >
          <Icon className={cn('h-[1.375rem] w-[1.375rem]', iconColor)} />
        </div>
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 rounded-full px-2.5 py-1',
              trendBg,
            )}
          >
            <span className={cn('text-xs font-semibold', trendColor)}>
              {trend}
            </span>
          </div>
        )}
      </div>
      <div>
        <div className="text-foreground font-mono text-[2.125rem] leading-tight font-bold tracking-tight">
          {value}
        </div>
        <div className="text-muted-foreground mt-1 text-[0.8125rem] font-medium">
          {label}
        </div>
      </div>
    </div>
  );
}
