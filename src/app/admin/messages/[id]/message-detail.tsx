'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2, Mail, Phone, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SelectField, TextareaField } from '@/components/admin/form-field'
import { updateContactInquirySchema, CONTACT_STATUSES, type UpdateContactInquiryFormValues } from '@/lib/validations/admin'
import { updateContactInquiry } from '@/lib/actions/messages'
import { format } from 'date-fns'
import type { Database } from '@/lib/supabase/types'

type Message = Database['public']['Tables']['contact_inquiries']['Row']

export function MessageDetail({ message }: { message: Message }) {
  const router = useRouter()

  const form = useForm<UpdateContactInquiryFormValues>({
    resolver: zodResolver(updateContactInquirySchema),
    defaultValues: {
      id: message.id,
      status: message.status as UpdateContactInquiryFormValues['status'],
      admin_notes: message.admin_notes ?? '',
    },
  })

  const { handleSubmit, formState: { isSubmitting } } = form

  async function onSubmit(values: UpdateContactInquiryFormValues) {
    const result = await updateContactInquiry(values)
    if (result.success) { toast.success('Message updated.'); router.refresh() }
    else toast.error(result.error)
  }

  return (
    <div className="space-y-6">
      {/* Visitor info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Visitor Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="font-medium">{message.visitor_name}</span>
          </div>
          {message.visitor_email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <a href={`mailto:${message.visitor_email}`} className="text-primary hover:underline">{message.visitor_email}</a>
            </div>
          )}
          {message.visitor_phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <a href={`tel:${message.visitor_phone}`} className="hover:underline">{message.visitor_phone}</a>
            </div>
          )}
          <p className="text-xs text-muted-foreground pt-1">
            Received {format(new Date(message.created_at), "d MMM yyyy 'at' HH:mm")}
          </p>
        </CardContent>
      </Card>

      {/* Message */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Message</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.message}</p>
        </CardContent>
      </Card>

      {/* Status + notes form */}
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <SelectField<UpdateContactInquiryFormValues>
            name="status"
            label="Status"
            options={CONTACT_STATUSES.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
          />
          <TextareaField<UpdateContactInquiryFormValues>
            name="admin_notes"
            label="Internal notes"
            rows={4}
            placeholder="Notes visible only to admins..."
          />
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.push('/admin/messages')}>
              Back to messages
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
