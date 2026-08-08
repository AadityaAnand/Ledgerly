interface Stat {
  label: string
  value: number
}

/** Deliberately plain — a single line of numbers, not a grid of KPI cards.
 * Secondary to the actual work queue, by design. */
export function WorkloadSummary({ stats }: { stats: Stat[] }) {
  return (
    <div className="border-border-subtle flex flex-wrap items-center gap-x-6 gap-y-2 border-y py-3 text-sm">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-baseline gap-1.5">
          <span className="text-foreground font-semibold tabular-nums">{stat.value}</span>
          <span className="text-foreground-tertiary">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
