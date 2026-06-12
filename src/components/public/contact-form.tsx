'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { submitContactInquiry } from '@/lib/actions/contact'
import { contactInquirySchema, type ContactInquiryFormValues } from '@/lib/validations/contact'

export function ContactForm() {
  const [submitted, setSubmitted] = React.useState(false)

  const form = useForm<ContactInquiryFormValues>({
    resolver: zodResolver(contactInquirySchema),
    defaultValues: { visitor_name: '', visitor_email: '', visitor_phone: '', message: '' },
  })

  async function onSubmit(values: ContactInquiryFormValues) {
    const result = await submitContactInquiry(values)
    if (result.success) {
      setSubmitted(true)
      form.reset()
      toast.success(result.message)
    } else {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof ContactInquiryFormValues, {
            message: messages?.[0],
          })
        }
      }
      toast.error(result.error)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-lg border border-dashed py-12 text-center">
        <CheckCircle2 className="h-12 w-12 text-primary" />
        <h2 className="mt-4 text-xl font-semibold">Message sent</h2>
        <p className="mt-1 max-w-sm text-muted-foreground">
          Thanks for reaching out. A Nepal-based advisor will get back to you soon.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField
          control={form.control}
          name="visitor_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Your full name" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="visitor_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visitor_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (optional)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+91…" autoComplete="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Message <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="Tell us where you're coming from, when you want to travel, and what you'd like help with."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
          {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Send message
        </Button>
      </form>
    </Form>
  )
}
