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
      <label className="text-muted-foreground text-[0.8125rem] font-semibold">
        {label}
      </label>
      <div className="border-border bg-muted flex min-w-0 overflow-hidden rounded-lg border p-0.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'min-w-0 flex-1 overflow-hidden rounded-sm px-2 py-1.5 text-sm font-medium text-ellipsis whitespace-nowrap transition-all sm:px-4',
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
      <label className="text-muted-foreground text-[0.8125rem] font-semibold">
        {label}
      </label>
      <div className="border-border bg-muted flex flex-wrap gap-1 rounded-xl border p-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'min-w-[5rem] flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
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
