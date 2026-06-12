/**
 * React Query Hooks — Admin CMS
 * NepaYatra
 *
 * Centralised hooks for all admin data fetching and mutations.
 * Each entity follows the same pattern:
 *
 *   useXList(params)  → paginated list with filters + search
 *   useXDetail(id)    → single record
 *   useCreateX()      → mutation: calls Server Action + invalidates list
 *   useUpdateX()      → mutation: calls Server Action + invalidates list + detail
 *   useDeleteX()      → mutation: calls Server Action + invalidates list
 *
 * Data flow:
 *   Server Action → ActionResult → React Query mutation → toast notification
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import {
  createDestination,
  updateDestination,
  deleteDestination,
  toggleDestinationFeatured,
} from '@/lib/actions/destinations'
import type {
  Destination,
  Package,
  BorderCrossing,
  Faq,
  Advisor,
  TravelAlert,
  KnowledgeBaseArticle,
  ContactInquiry,
  SiteSetting,
  DestinationConnection,
} from '@/lib/supabase/types'
import type {
  CreateDestinationFormValues,
  UpdateDestinationFormValues,
} from '@/lib/validations/admin'

// ─────────────────────────────────────────────────────────────
// Query Key factory — centralised, prevents typos
// ─────────────────────────────────────────────────────────────

export const queryKeys = {
  destinations: {
    all: ['destinations'] as const,
    lists: () => [...queryKeys.destinations.all, 'list'] as const,
    list: (params: Record<string, unknown>) =>
      [...queryKeys.destinations.lists(), params] as const,
    detail: (id: string) => [...queryKeys.destinations.all, 'detail', id] as const,
  },
  borderCrossings: {
    all: ['border-crossings'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.borderCrossings.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.borderCrossings.all, 'detail', id] as const,
  },
  destinationConnections: {
    all: ['destination-connections'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.destinationConnections.all, 'list', params] as const,
  },
  packages: {
    all: ['packages'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.packages.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.packages.all, 'detail', id] as const,
  },
  faqs: {
    all: ['faqs'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.faqs.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.faqs.all, 'detail', id] as const,
  },
  advisors: {
    all: ['advisors'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.advisors.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.advisors.all, 'detail', id] as const,
  },
  travelAlerts: {
    all: ['travel-alerts'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.travelAlerts.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.travelAlerts.all, 'detail', id] as const,
  },
  knowledgeBase: {
    all: ['knowledge-base'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.knowledgeBase.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.knowledgeBase.all, 'detail', id] as const,
  },
  siteSettings: {
    all: ['site-settings'] as const,
    group: (group: string) => [...queryKeys.siteSettings.all, 'group', group] as const,
  },
  contactInquiries: {
    all: ['contact-inquiries'] as const,
    list: (params?: Record<string, unknown>) =>
      [...queryKeys.contactInquiries.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.contactInquiries.all, 'detail', id] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    counts: () => [...queryKeys.dashboard.all, 'counts'] as const,
  },
} as const

// ─────────────────────────────────────────────────────────────
// List params type — shared across all list hooks
// ─────────────────────────────────────────────────────────────

export interface ListParams {
  page?: number
  pageSize?: number
  search?: string
  category?: string
  province?: string
  featured?: boolean
  active?: boolean
  status?: string
  severity?: string
  [key: string]: unknown
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────

export interface DashboardCounts {
  destinations: number
  packages: number
  faqs: number
  messages: number
  activeAlerts: number
}

export function useDashboardCounts() {
  const supabase = createClient()

  return useQuery({
    queryKey: queryKeys.dashboard.counts(),
    queryFn: async (): Promise<DashboardCounts> => {
      const [destinations, packages, faqs, messages, alerts] = await Promise.all([
        supabase.from('destinations').select('*', { count: 'exact', head: true }),
        supabase.from('packages').select('*', { count: 'exact', head: true }),
        supabase.from('faqs').select('*', { count: 'exact', head: true }),
        supabase.from('contact_inquiries').select('*', { count: 'exact', head: true }),
        supabase.from('travel_alerts')
          .select('*', { count: 'exact', head: true })
          .eq('active', true)
          .lte('starts_at', new Date().toISOString()),
      ])

      return {
        destinations: destinations.count ?? 0,
        packages: packages.count ?? 0,
        faqs: faqs.count ?? 0,
        messages: messages.count ?? 0,
        activeAlerts: alerts.count ?? 0,
      }
    },
    staleTime: 60_000, // 1 minute
  })
}

// ─────────────────────────────────────────────────────────────
// DESTINATIONS
// ─────────────────────────────────────────────────────────────

export function useDestinationList(params: ListParams = {}) {
  const supabase = createClient()
  const { page = 1, pageSize = 20, search, category, province, featured } = params

  return useQuery({
    queryKey: queryKeys.destinations.list(params),
    queryFn: async () => {
      let query = supabase
        .from('destinations')
        .select('id, name, slug, category, province, featured, created_at', {
          count: 'exact',
        })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (search) query = query.ilike('name', `%${search}%`)
      if (category) query = query.eq('category', category as Destination['category'])
      if (province) query = query.eq('province', province as Destination['province'])
      if (featured !== undefined) query = query.eq('featured', featured)

      const { data, error, count } = await query
      if (error) throw new Error(error.message)
      return { data: data as Destination[], count: count ?? 0 }
    },
    staleTime: 30_000,
  })
}

export function useDestinationDetail(id: string, options?: UseQueryOptions<Destination>) {
  const supabase = createClient()

  return useQuery({
    queryKey: queryKeys.destinations.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw new Error(error.message)
      return data as Destination
    },
    enabled: !!id,
    ...options,
  })
}

export function useCreateDestination() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateDestinationFormValues) => createDestination(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.destinations.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.counts() })
    },
  })
}

export function useUpdateDestination() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateDestinationFormValues) => updateDestination(input),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.destinations.all })
      }
    },
  })
}

export function useDeleteDestination() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteDestination(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.destinations.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.counts() })
    },
  })
}

export function useToggleDestinationFeatured() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      toggleDestinationFeatured(id, featured),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.destinations.all })
    },
  })
}

// ─────────────────────────────────────────────────────────────
// CONTACT INQUIRIES
// ─────────────────────────────────────────────────────────────

export function useContactInquiryList(params: ListParams = {}) {
  const supabase = createClient()
  const { page = 1, pageSize = 20, status } = params

  return useQuery({
    queryKey: queryKeys.contactInquiries.list(params),
    queryFn: async () => {
      let query = supabase
        .from('contact_inquiries')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (status) query = query.eq('status', status as ContactInquiry['status'])

      const { data, error, count } = await query
      if (error) throw new Error(error.message)
      return { data: data as ContactInquiry[], count: count ?? 0 }
    },
    staleTime: 30_000,
  })
}

// ─────────────────────────────────────────────────────────────
// SITE SETTINGS
// ─────────────────────────────────────────────────────────────

export function useSiteSettings() {
  const supabase = createClient()

  return useQuery({
    queryKey: queryKeys.siteSettings.all,
    queryFn: async () => {
      const { data, error } = await supabase.from('site_settings').select('*')
      if (error) throw new Error(error.message)
      return data as SiteSetting[]
    },
    staleTime: 300_000, // 5 minutes — settings change rarely
  })
}

// ─────────────────────────────────────────────────────────────
// TRAVEL ALERTS (admin — all alerts)
// ─────────────────────────────────────────────────────────────

export function useTravelAlertList(params: ListParams = {}) {
  const supabase = createClient()
  const { page = 1, pageSize = 20, severity, active } = params

  return useQuery({
    queryKey: queryKeys.travelAlerts.list(params),
    queryFn: async () => {
      let query = supabase
        .from('travel_alerts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (severity) query = query.eq('severity', severity as TravelAlert['severity'])
      if (active !== undefined) query = query.eq('active', active)

      const { data, error, count } = await query
      if (error) throw new Error(error.message)
      return { data: data as TravelAlert[], count: count ?? 0 }
    },
    staleTime: 30_000,
  })
}
