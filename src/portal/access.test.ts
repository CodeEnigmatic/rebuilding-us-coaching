import { describe, expect, it } from 'vitest'
import { hasTierAccess, mayOpenRoute, readPortalRoute } from './access'

describe('portal routing authorization', () => {
  it('parses known portal routes and rejects unknown values', () => {
    expect(readPortalRoute('?portal=dashboard')).toBe('dashboard')
    expect(readPortalRoute('?portal=academy')).toBe('academy')
    expect(readPortalRoute('?portal=assessment')).toBe('assessment')
    expect(readPortalRoute('?portal=exercise')).toBe('exercise')
    expect(readPortalRoute('?portal=unknown')).toBeNull()
  })

  it('requires authentication and an admin role for the admin route', () => {
    expect(mayOpenRoute('dashboard', false)).toBe(false)
    expect(mayOpenRoute('dashboard', true, 'member')).toBe(true)
    expect(mayOpenRoute('admin', true, 'member')).toBe(false)
    expect(mayOpenRoute('admin', true, 'admin')).toBe(true)
  })

  it('protects every course experience behind authentication', () => {
    expect(mayOpenRoute('academy', false)).toBe(false)
    expect(mayOpenRoute('course', false)).toBe(false)
    expect(mayOpenRoute('lesson', false)).toBe(false)
    expect(mayOpenRoute('assessment', false)).toBe(false)
    expect(mayOpenRoute('exercise', false)).toBe(false)
    expect(mayOpenRoute('academy', true, 'member')).toBe(true)
  })
})

describe('cumulative tier access', () => {
  it('allows higher tiers to open lower-tier pathways', () => {
    expect(hasTierAccess('relationship', 'active', 'individual')).toBe(true)
    expect(hasTierAccess('community', 'trialing', 'relationship')).toBe(true)
  })

  it('denies higher content and inactive states', () => {
    expect(hasTierAccess('individual', 'active', 'relationship')).toBe(false)
    expect(hasTierAccess('community', 'past_due', 'individual')).toBe(false)
    expect(hasTierAccess(null, null, 'individual')).toBe(false)
  })
})
