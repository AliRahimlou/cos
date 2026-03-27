import { cn } from "@/lib/utils";

type MetricRingProps = {
  value: number;
  label: string;
  helper?: string;
  className?: string;
};

export function MetricRing({ value, label, helper, className }: MetricRingProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (clamped / 100) * circumference;

  return (
    <div className={cn("glass-surface rounded-[2rem] p-4", className)}>
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="fill-none stroke-foreground/10"
              strokeWidth="9"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="fill-none stroke-foreground transition-all duration-700 ease-out"
              strokeLinecap="round"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-foreground">
            {clamped}%
          </div>
        </div>
        <div>
          <p className="text-sm text-foreground/70">{label}</p>
          {helper ? <p className="mt-1 text-sm text-foreground/55">{helper}</p> : null}
        </div>
      </div>
    </div>
  );
}
