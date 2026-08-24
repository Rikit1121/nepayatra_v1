import type { Activity } from '@/lib/supabase/types'
import type { PlannerInterest, TravelBudgetStyle } from '@/lib/route-planner/types'
import type { SelectedActivity } from './types'
import { MAX_ACTIVITIES_PER_DAY } from './config'

interface SelectActivitiesParams {
  destinationId: string
  interests: PlannerInterest[]
  travelStyle: TravelBudgetStyle
  travelerCount: number
  activities: Activity[]
  maxCount?: number
  budgetConscious?: boolean
  excludeIds?: Set<string>
}

const INTEREST_CATEGORY_MAP: Record<string, string[]> = {
  nature: ['nature', 'sightseeing', 'trekking'],
  culture: ['cultural', 'sightseeing', 'spiritual'],
  adventure: ['adventure', 'trekking'],
  wildlife: ['wildlife', 'nature'],
  spiritual: ['spiritual', 'cultural'],
  family: ['sightseeing', 'cultural', 'nature'],
  food: ['cultural', 'other'],
  nightlife: ['other'],
  relaxation: ['nature', 'spiritual'],
}

export function selectActivitiesForDestination({
  destinationId,
  interests,
  travelStyle,
  travelerCount,
  activities,
  maxCount = MAX_ACTIVITIES_PER_DAY,
  budgetConscious = false,
  excludeIds,
}: SelectActivitiesParams): SelectedActivity[] {
  const destActivities = activities.filter(
    (a) =>
      a.destination_id === destinationId &&
      a.public_visible !== false &&
      (!excludeIds || !excludeIds.has(a.id))
  )

  if (destActivities.length === 0) return []

  // Collect all matching categories from selected interests
  const targetCategories = new Set<string>()
  for (const interest of interests) {
    const mapped = INTEREST_CATEGORY_MAP[interest]
    if (mapped) {
      mapped.forEach((c) => targetCategories.add(c))
    }
  }

  // Score candidates
  const scored = destActivities.map((act) => {
    let score = 0
    const isMatch = targetCategories.has(act.category.toLowerCase())
    if (isMatch) score += 10

    const cost = act.estimated_cost ?? 0

    if (budgetConscious) {
      // Prioritize free or low-cost activities
      if (cost === 0) score += 6
      else if (cost <= 1000) score += 3
      else score -= 2
    } else if (travelStyle === 'premium') {
      // Premium travelers enjoy signature experiences
      if (cost > 2000) score += 4
    }

    return { act, score, isMatch, cost }
  })

  // Sort deterministically: highest score first, then lowest cost
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.cost - b.cost
  })

  const chosen = scored.slice(0, maxCount)

  return chosen.map(({ act, isMatch }) => {
    const minCost = act.estimated_cost || 0
    const maxCost = act.estimated_cost_max || minCost
    const costPerPerson = Math.round((minCost + maxCost) / 2)
    return {
      id: act.id,
      name: act.name,
      category: act.category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      duration: act.duration,
      description: act.description,
      costPerPersonNpr: costPerPerson,
      totalCostNpr: costPerPerson * travelerCount,
      isInterestMatch: isMatch,
    }
  })
}
