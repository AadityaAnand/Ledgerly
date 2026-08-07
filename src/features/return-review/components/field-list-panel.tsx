import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FieldRow } from './field-row'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { traceCategoryLabels } from '@/utils/status'
import { formatCurrency } from '@/utils/format'
import type { TaxFieldTrace, TraceCategory } from '@/types'

const CATEGORY_ORDER: TraceCategory[] = ['income', 'deductions', 'payments_credits', 'tax_summary']

interface FieldListPanelProps {
  traces: TaxFieldTrace[]
  selectedFieldId: string | null
  onSelect: (id: string) => void
  onHoverChange: (id: string | null) => void
}

export function FieldListPanel({ traces, selectedFieldId, onSelect, onHoverChange }: FieldListPanelProps) {
  const grouped = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      items: traces.filter((t) => t.category === category),
    })).filter((group) => group.items.length > 0)
  }, [traces])

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col">
      {grouped.map((group) => (
        <motion.div key={group.category} variants={staggerItem}>
          <div className="bg-surface border-border-subtle sticky top-0 z-10 flex items-center justify-between border-b px-4 py-2">
            <h3 className="text-foreground-secondary text-xs font-semibold tracking-wide uppercase">
              {traceCategoryLabels[group.category]}
            </h3>
            <span className="text-foreground-tertiary text-xs tabular-nums">
              {formatCurrency(group.items.reduce((sum, item) => sum + item.value, 0))}
            </span>
          </div>
          {group.items.map((trace) => (
            <FieldRow
              key={trace.id}
              trace={trace}
              isSelected={trace.id === selectedFieldId}
              onSelect={() => onSelect(trace.id)}
              onHoverChange={(hovering) => onHoverChange(hovering ? trace.id : null)}
            />
          ))}
        </motion.div>
      ))}
    </motion.div>
  )
}
