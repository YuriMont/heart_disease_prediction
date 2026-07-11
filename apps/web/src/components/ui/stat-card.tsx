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
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-[22px] shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-[2px]">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl',
            iconBg,
          )}
        >
          <Icon className={cn('h-[22px] w-[22px]', iconColor)} />
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
        <div className="font-mono text-[34px] font-bold leading-tight tracking-tight text-foreground">
          {value}
        </div>
        <div className="mt-1 text-[13px] font-medium text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  );
}
