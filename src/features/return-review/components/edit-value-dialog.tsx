import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { formatCurrency } from '@/utils/format'
import type { TaxFieldTrace } from '@/types'

const editValueSchema = z.object({
  value: z.coerce
    .number()
    .min(0, 'Value must be zero or greater')
    .max(100_000_000, 'That value looks too large'),
  note: z.string().max(280, 'Keep it under 280 characters').optional(),
})

type EditValueFormValues = z.infer<typeof editValueSchema>

interface EditValueDialogProps {
  trace: TaxFieldTrace | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: { value: number; note?: string }) => void
}

export function EditValueDialog({ trace, open, onOpenChange, onSubmit }: EditValueDialogProps) {
  const form = useForm<EditValueFormValues>({
    resolver: zodResolver(editValueSchema),
    defaultValues: { value: trace?.value ?? 0, note: '' },
  })

  useEffect(() => {
    if (trace && open) {
      form.reset({ value: trace.value, note: '' })
    }
  }, [trace, open, form])

  if (!trace) return null

  function handleSubmit(values: EditValueFormValues) {
    onSubmit({ value: values.value, note: values.note?.trim() || undefined })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {trace.label}</DialogTitle>
          <DialogDescription>
            AI extracted {formatCurrency(trace.value)}. Overriding it marks this field as manually reviewed
            and keeps a record of the change.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corrected value</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" inputMode="decimal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for the change (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Found two additional deposits the AI didn't match…"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save correction</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
