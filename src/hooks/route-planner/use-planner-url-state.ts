'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  parsePlannerState,
  serializePlannerPatch,
  type PlannerState,
} from '@/lib/route-planner'

export type PlannerStatePatch =
  | Partial<PlannerState>
  | ((current: PlannerState) => Partial<PlannerState>)

/** Sync route planner wizard state with URL search params. */
export function usePlannerUrlState() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const state = React.useMemo(
    () => parsePlannerState(searchParams),
    [searchParams]
  )

  const stateRef = React.useRef(state)
  stateRef.current = state

  const update = React.useCallback(
    (patch: PlannerStatePatch, options?: { replace?: boolean }) => {
      const current = stateRef.current
      const resolved =
        typeof patch === 'function' ? patch(current) : patch
      const params = serializePlannerPatch(current, resolved)
      const qs = params.toString()
      const url = qs ? `/route-planner?${qs}` : '/route-planner'
      if (options?.replace !== false) {
        router.replace(url, { scroll: false })
      } else {
        router.push(url, { scroll: false })
      }
    },
    [router]
  )

  return { state, update }
}
