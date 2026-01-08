/**
 * Test Utilities
 *
 * Custom render function and common test helpers.
 */

import { render, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'

/**
 * Custom render wrapper with providers
 */
type CustomRenderOptions = Omit<RenderOptions, 'wrapper'>

function AllProviders({ children }: { children: ReactNode }) {
  // Add providers here as needed (e.g., ThemeProvider, QueryClient)
  return <>{children}</>
}

function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  return render(ui, { wrapper: AllProviders, ...options })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { customRender as render }

/**
 * Generate mock survey answers
 */
export function createMockAnswers(
  overrides: Record<string, boolean> = {}
): Record<string, boolean> {
  const defaultAnswers: Record<string, boolean> = {
    // Daily Sessions
    ds_001: true,
    ds_002: false,
    ds_003: true,
    ds_004: true,
    ds_005: false,
    ds_006: true,
    ds_007: true,
    // Treatment Fidelity
    tf_001: true,
    tf_002: false,
    tf_003: true,
    tf_004: false,
    tf_005: true,
    // Data Analysis
    da_001: true,
    da_002: true,
    da_003: false,
    da_004: true,
    da_005: false,
    // Caregiver Guidance
    cg_001: true,
    cg_002: true,
    cg_003: false,
    cg_004: true,
    cg_005: true,
    cg_006: false,
    // Supervision
    sup_001: true,
    sup_002: false,
    sup_003: true,
    sup_004: true,
  }

  return { ...defaultAnswers, ...overrides }
}

/**
 * Generate mock lead data
 */
export function createMockLead(overrides: Partial<{
  email: string
  name: string
  role: string
  marketingConsent: boolean
}> = {}) {
  return {
    email: 'test@example.com',
    name: 'Test User',
    role: 'bcba',
    marketingConsent: true,
    ...overrides,
  }
}

/**
 * Wait for async operations
 */
export async function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
