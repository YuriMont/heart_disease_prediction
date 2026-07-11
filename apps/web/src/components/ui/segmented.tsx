import { cn } from '../../lib/utils';

interface SegmentedOption {
  label: string;
  value: string | number;
}

interface SegmentedProps {
  label: string;
  options: SegmentedOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
}

export function Segmented({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedProps) {
  return (
    <div className={cn('flex w-full flex-col gap-1', className)}>
      <label className="text-[13px] font-semibold text-muted-foreground">
        {label}
      </label>
      <div className="flex rounded-lg border border-border bg-muted p-0.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex-1 rounded-sm px-4 py-1.5 text-sm font-medium transition-all',
              value === opt.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface SegmentedMultiProps {
  label: string;
  options: SegmentedOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  className?: string;
}

export function SegmentedMulti({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedMultiProps) {
  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      <label className="text-[13px] font-semibold text-muted-foreground">
        {label}
      </label>
      <div className="flex flex-wrap rounded-xl border border-border bg-muted p-1 gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'flex-1 min-w-[80px] rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
              value === opt.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
