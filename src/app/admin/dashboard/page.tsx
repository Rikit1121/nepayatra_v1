import { createServerClient } from '@/lib/supabase/server'
import { AdminHeader } from '@/components/admin/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  MapPin,
  Milestone,
  Package,
  BookOpen,
  Users,
  MessageSquare,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

async function getDashboardData() {
  const supabase = await createServerClient()

  const [
    { count: destinations },
    { count: borderCrossings },
    { count: packages },
    { count: knowledgeBase },
    { count: advisors },
    { count: newMessages },
    { count: activeAlerts },
    { count: faqs },
    { data: recentMessages },
    { data: recentAlerts },
  ] = await Promise.all([
    supabase.from('destinations').select('*', { count: 'exact', head: true }),
    supabase.from('border_crossings').select('*', { count: 'exact', head: true }),
    supabase.from('packages').select('*', { count: 'exact', head: true }),
    supabase.from('knowledge_base').select('*', { count: 'exact', head: true }),
    supabase.from('advisors').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('contact_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('travel_alerts').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('faqs').select('*', { count: 'exact', head: true }),
    supabase
      .from('contact_inquiries')
      .select('id, visitor_name, visitor_email, message, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('travel_alerts')
      .select('id, title, severity, active, starts_at')
      .eq('active', true)
      .order('starts_at', { ascending: false })
      .limit(3),
  ])

  return {
    counts: {
      destinations: destinations ?? 0,
      borderCrossings: borderCrossings ?? 0,
      packages: packages ?? 0,
      knowledgeBase: knowledgeBase ?? 0,
      advisors: advisors ?? 0,
      newMessages: newMessages ?? 0,
      activeAlerts: activeAlerts ?? 0,
      faqs: faqs ?? 0,
    },
    recentMessages: recentMessages ?? [],
    recentAlerts: recentAlerts ?? [],
  }
}

const STATUS_BADGE: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  read: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  replied: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  closed: 'bg-gray-100 text-gray-500',
}

const SEVERITY_BADGE: Record<string, string> = {
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export default async function DashboardPage() {
  const { counts, recentMessages, recentAlerts } = await getDashboardData()

  const statCards = [
    { label: 'Destinations', value: counts.destinations, icon: MapPin, href: '/admin/destinations' },
    { label: 'Border Crossings', value: counts.borderCrossings, icon: Milestone, href: '/admin/border-crossings' },
    { label: 'Packages', value: counts.packages, icon: Package, href: '/admin/packages' },
    { label: 'KB Articles', value: counts.knowledgeBase, icon: BookOpen, href: '/admin/knowledge-base' },
    { label: 'FAQs', value: counts.faqs, icon: HelpCircle, href: '/admin/faqs' },
    { label: 'Active Advisors', value: counts.advisors, icon: Users, href: '/admin/advisors' },
    {
      label: 'New Messages',
      value: counts.newMessages,
      icon: MessageSquare,
      href: '/admin/messages',
      highlight: counts.newMessages > 0,
    },
    {
      label: 'Active Alerts',
      value: counts.activeAlerts,
      icon: AlertTriangle,
      href: '/admin/travel-alerts',
      highlight: counts.activeAlerts > 0,
    },
  ]

  return (
    <div className="space-y-8 py-6">
      <AdminHeader
        heading="Dashboard"
        description="Overview of all NepaYatra content."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className={`transition-colors hover:border-primary/50 ${card.highlight ? 'border-primary/40' : ''}`}>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                    <p className={`mt-1 text-3xl font-semibold tabular-nums ${card.highlight ? 'text-primary' : ''}`}>
                      {card.value}
                    </p>
                  </div>
                  <card.icon className={`h-5 w-5 mt-0.5 ${card.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-medium">Recent Messages</CardTitle>
            <Link
              href="/admin/messages"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No messages yet.</p>
            ) : (
              recentMessages.map((msg) => (
                <Link
                  key={msg.id}
                  href={`/admin/messages/${msg.id}`}
                  className="flex items-start justify-between gap-3 rounded-md p-2 hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{msg.visitor_name}</p>
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${STATUS_BADGE[msg.status] ?? ''}`}
                      >
                        {msg.status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{msg.message}</p>
                  </div>
                  <p className="shrink-0 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                  </p>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Active alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-medium">Active Travel Alerts</CardTitle>
            <Link
              href="/admin/travel-alerts"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No active alerts.</p>
            ) : (
              recentAlerts.map((alert) => (
                <Link
                  key={alert.id}
                  href={`/admin/travel-alerts/${alert.id}/edit`}
                  className="flex items-center justify-between gap-3 rounded-md p-2 hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{alert.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Started {formatDistanceToNow(new Date(alert.starts_at), { addSuffix: true })}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium capitalize ${SEVERITY_BADGE[alert.severity] ?? ''}`}
                  >
                    {alert.severity}
                  </span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
