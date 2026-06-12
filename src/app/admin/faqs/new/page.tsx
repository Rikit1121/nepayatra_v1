import { AdminHeader } from '@/components/admin/header'
import { FaqForm } from '@/components/admin/faqs/faq-form'

export default function NewFaqPage() {
  return (
    <div className="space-y-6 py-6 max-w-3xl">
      <AdminHeader heading="New FAQ" breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'FAQs', href: '/admin/faqs' }, { label: 'New' }]} />
      <FaqForm />
    </div>
  )
}
