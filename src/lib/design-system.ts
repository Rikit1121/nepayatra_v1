import { cn } from '@/lib/utils'

/** Small uppercase section label — explorer atlas style. */
export const atlasSectionEyebrow =
  'text-xs font-semibold uppercase tracking-[0.14em] text-[hsl(var(--atlas-saffron))]'

/** Subtle hero / page header background. */
export const atlasHeroGradient =
  'bg-gradient-to-b from-[hsl(var(--atlas-mist))] to-[hsl(var(--atlas-snow))]'

/** Image-first destination card shell. */
export const atlasCardDestination = cn(
  'group/card overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm',
  'transition-colors hover:border-[hsl(var(--atlas-blue-light))] hover:shadow-md'
)

/** Editorial guide / article card shell. */
export const atlasCardEditorial = cn(
  'group/card overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm',
  'border-l-4 border-l-[hsl(var(--atlas-saffron))]',
  'transition-colors hover:border-[hsl(var(--atlas-blue-light))] hover:shadow-md'
)

/** Route planner / product option card base. */
export const atlasCardPlanner = cn(
  'rounded-xl border border-border bg-card text-left shadow-sm',
  'transition-colors hover:border-[hsl(var(--atlas-blue-light))]/60'
)

/** Default planner step option (unselected). */
export const atlasStepDefault = cn(
  atlasCardPlanner,
  'min-h-[44px] p-3 hover:bg-[hsl(var(--atlas-mist))]/50'
)

/** Selected planner step option. */
export const atlasStepSelected = cn(
  atlasCardPlanner,
  'min-h-[44px] border-[hsl(var(--atlas-blue))] bg-[hsl(var(--atlas-mist))]/80 p-3 ring-1 ring-[hsl(var(--atlas-blue))]/20'
)

/** Atlas map panel frame (hero preview, etc.). */
export const atlasMapFrame = cn(
  'overflow-hidden rounded-xl border-2 border-[hsl(var(--atlas-blue))]/20 bg-[hsl(var(--atlas-mist))]/40 shadow-md'
)

/** Deep footer band. */
export const atlasFooterBand = 'border-t border-[hsl(var(--atlas-blue))]/30 bg-[hsl(var(--atlas-blue))] text-[hsl(var(--atlas-snow))]'

/** Display heading scale — mobile first. */
export const atlasDisplayLg = 'font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl'
export const atlasDisplayMd = 'font-display text-2xl font-bold tracking-tight md:text-3xl'
export const atlasBodyLg = 'text-base leading-relaxed text-muted-foreground sm:text-lg'
