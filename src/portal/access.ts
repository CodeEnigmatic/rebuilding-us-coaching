import type { AppRole, MembershipStatus, MembershipTier } from '../types/database'

export type PortalRoute = 'login' | 'register' | 'forgot-password' | 'update-password' | 'dashboard' | 'admin' | 'academy' | 'course' | 'lesson' | 'assessment' | 'exercise'

const tierRank: Record<MembershipTier, number> = { individual: 1, relationship: 2, community: 3 }
const activeStatuses = new Set<MembershipStatus>(['trialing', 'active'])

export function readPortalRoute(search: string): PortalRoute | null {
  const value = new URLSearchParams(search).get('portal')
  return value === 'login' || value === 'register' || value === 'forgot-password' ||
    value === 'update-password' || value === 'dashboard' || value === 'admin' || value === 'academy' || value === 'course' || value === 'lesson' || value === 'assessment' || value === 'exercise' ? value : null
}

export function isProtectedRoute(route: PortalRoute): boolean {
  return route === 'dashboard' || route === 'admin' || route === 'academy' || route === 'course' || route === 'lesson' || route === 'assessment' || route === 'exercise'
}

export function mayOpenRoute(route: PortalRoute, authenticated: boolean, role?: AppRole): boolean {
  if (!isProtectedRoute(route)) return true
  if (!authenticated) return false
  return route !== 'admin' || role === 'admin'
}

export function hasTierAccess(
  assignedTier: MembershipTier | null,
  status: MembershipStatus | null,
  requiredTier: MembershipTier,
): boolean {
  return Boolean(assignedTier && status && activeStatuses.has(status) && tierRank[assignedTier] >= tierRank[requiredTier])
}
