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
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const reasonSchema = z.object({
  note: z
    .string()
    .trim()
    .min(5, 'Add a short reason (at least 5 characters)')
    .max(280, 'Keep it under 280 characters'),
})

type ReasonFormValues = z.infer<typeof reasonSchema>

interface ReviewActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  action: 'rejected' | 'flagged'
  fieldLabel: string
  onSubmit: (note: string) => void
}

const copy = {
  rejected: {
    title: 'Reject this value',
    description:
      'Rejecting removes AI confidence in this figure — explain what looks wrong so the next reviewer has context.',
    confirmLabel: 'Reject value',
    placeholder: 'e.g. Amount doesn’t match the source document…',
  },
  flagged: {
    title: 'Flag for review',
    description:
      'Flagging keeps the current value but marks it as needing another look before this return can be filed.',
    confirmLabel: 'Flag for review',
    placeholder: 'e.g. Needs a second opinion on the allocation…',
  },
} as const

export function ReviewActionDialog({
  open,
  onOpenChange,
  action,
  fieldLabel,
  onSubmit,
}: ReviewActionDialogProps) {
  const form = useForm<ReasonFormValues>({ resolver: zodResolver(reasonSchema), defaultValues: { note: '' } })
  const text = copy[action]

  useEffect(() => {
    if (open) form.reset({ note: '' })
  }, [open, form])

  function handleSubmit(values: ReasonFormValues) {
    onSubmit(values.note)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {text.title} — {fieldLabel}
          </DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea placeholder={text.placeholder} rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" variant={action === 'rejected' ? 'destructive' : 'default'}>
                {text.confirmLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
