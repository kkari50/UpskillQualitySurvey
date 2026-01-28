/**
 * JWT Token Utility Tests
 *
 * Tests for magic link token creation and verification.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  isJwtToken,
  verifyMagicLinkToken,
  createMagicLinkToken,
} from '../tokens'

// =============================================================================
// isJwtToken Tests
// =============================================================================

describe('isJwtToken', () => {
  it('returns true for valid JWT format (3 parts)', () => {
    // A properly formatted JWT has 3 base64url-encoded parts separated by dots
    const validJwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20ifQ.dGVzdHNpZ25hdHVyZQ'
    expect(isJwtToken(validJwt)).toBe(true)
  })

  it('returns true for JWT-like string with valid characters', () => {
    // Base64url characters only: A-Z, a-z, 0-9, -, _
    const validFormat = 'aaa.bbb.ccc'
    expect(isJwtToken(validFormat)).toBe(true)
  })

  it('returns false for string with less than 3 parts', () => {
    expect(isJwtToken('part1.part2')).toBe(false)
    expect(isJwtToken('singlepart')).toBe(false)
    expect(isJwtToken('')).toBe(false)
  })

  it('returns false for string with more than 3 parts', () => {
    expect(isJwtToken('part1.part2.part3.part4')).toBe(false)
  })

  it('returns false for string with invalid base64 characters', () => {
    // Contains @ which is not valid base64url
    expect(isJwtToken('aaa.bb@b.ccc')).toBe(false)
    // Contains space
    expect(isJwtToken('aaa. bb.ccc')).toBe(false)
    // Contains +
    expect(isJwtToken('aaa.b+b.ccc')).toBe(false)
  })

  it('accepts underscore and hyphen (valid base64url)', () => {
    expect(isJwtToken('a_a.b-b.c_c')).toBe(true)
  })

  it('returns false for empty parts', () => {
    expect(isJwtToken('...')).toBe(false)
    expect(isJwtToken('..')).toBe(false)
  })

  it('returns false for UUID (not JWT format)', () => {
    // UUIDs have 5 parts separated by hyphens, not 3 parts with dots
    expect(isJwtToken('123e4567-e89b-12d3-a456-426614174000')).toBe(false)
  })
})

// =============================================================================
// createMagicLinkToken Tests
// =============================================================================

describe('createMagicLinkToken', () => {
  it('creates a valid JWT format token', () => {
    const email = 'test@example.com'
    const resultsToken = '123e4567-e89b-12d3-a456-426614174000'

    const token = createMagicLinkToken(email, resultsToken)

    expect(isJwtToken(token)).toBe(true)
  })

  it('creates tokens that can be verified', () => {
    const email = 'user@example.com'
    const resultsToken = 'test-results-token'

    const token = createMagicLinkToken(email, resultsToken)
    const payload = verifyMagicLinkToken(token)

    expect(payload).not.toBeNull()
    expect(payload?.email).toBe(email)
    expect(payload?.resultsToken).toBe(resultsToken)
  })

  it('creates unique tokens for different inputs', () => {
    const token1 = createMagicLinkToken('user1@example.com', 'token1')
    const token2 = createMagicLinkToken('user2@example.com', 'token2')

    expect(token1).not.toBe(token2)
  })

  it('uses default expiry of 7d when not specified', () => {
    const token = createMagicLinkToken('test@example.com', 'results-token')
    const payload = verifyMagicLinkToken(token)

    expect(payload).not.toBeNull()
    expect(payload?.exp).toBeDefined()

    if (payload?.exp && payload?.iat) {
      // 7 days = 604800 seconds
      const expectedExpiry = 7 * 24 * 60 * 60
      const actualExpiry = payload.exp - payload.iat
      // Allow small tolerance for timing differences
      expect(actualExpiry).toBeCloseTo(expectedExpiry, -1)
    }
  })

  it('respects custom expiry', () => {
    const token = createMagicLinkToken(
      'test@example.com',
      'results-token',
      '1h'
    )
    const payload = verifyMagicLinkToken(token)

    expect(payload).not.toBeNull()
    if (payload?.exp && payload?.iat) {
      // 1 hour = 3600 seconds
      const actualExpiry = payload.exp - payload.iat
      expect(actualExpiry).toBeCloseTo(3600, -1)
    }
  })

  it('handles special characters in email', () => {
    const email = 'test+tag@example.com'
    const resultsToken = 'results-token'

    const token = createMagicLinkToken(email, resultsToken)
    const payload = verifyMagicLinkToken(token)

    expect(payload?.email).toBe(email)
  })
})

// =============================================================================
// verifyMagicLinkToken Tests
// =============================================================================

describe('verifyMagicLinkToken', () => {
  it('returns payload for valid token', () => {
    const email = 'test@example.com'
    const resultsToken = 'my-results-token'

    const token = createMagicLinkToken(email, resultsToken)
    const payload = verifyMagicLinkToken(token)

    expect(payload).not.toBeNull()
    expect(payload?.email).toBe(email)
    expect(payload?.resultsToken).toBe(resultsToken)
  })

  it('returns null for invalid token', () => {
    const result = verifyMagicLinkToken('invalid-token')
    expect(result).toBeNull()
  })

  it('returns null for malformed JWT', () => {
    const result = verifyMagicLinkToken('not.a.valid.jwt.token')
    expect(result).toBeNull()
  })

  it('returns null for empty string', () => {
    const result = verifyMagicLinkToken('')
    expect(result).toBeNull()
  })

  it('returns null for token with wrong signature', () => {
    // Create a valid-looking but tampered token
    const token = createMagicLinkToken('test@example.com', 'results')
    const parts = token.split('.')
    // Tamper with the signature
    const tamperedToken = `${parts[0]}.${parts[1]}.tampered`

    const result = verifyMagicLinkToken(tamperedToken)
    expect(result).toBeNull()
  })

  it('includes iat (issued at) in payload', () => {
    const token = createMagicLinkToken('test@example.com', 'results')
    const payload = verifyMagicLinkToken(token)

    expect(payload?.iat).toBeDefined()
    expect(typeof payload?.iat).toBe('number')
  })

  it('includes exp (expiration) in payload', () => {
    const token = createMagicLinkToken('test@example.com', 'results')
    const payload = verifyMagicLinkToken(token)

    expect(payload?.exp).toBeDefined()
    expect(typeof payload?.exp).toBe('number')
  })
})

// =============================================================================
// Token Expiration Tests
// =============================================================================

describe('token expiration', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns null for expired token', () => {
    // Create token with 1 second expiry
    const token = createMagicLinkToken('test@example.com', 'results', '1s')

    // Advance time by 2 seconds
    vi.advanceTimersByTime(2000)

    const result = verifyMagicLinkToken(token)
    expect(result).toBeNull()
  })

  it('returns payload for non-expired token', () => {
    // Create token with 1 hour expiry
    const token = createMagicLinkToken('test@example.com', 'results', '1h')

    // Advance time by 30 minutes
    vi.advanceTimersByTime(30 * 60 * 1000)

    const result = verifyMagicLinkToken(token)
    expect(result).not.toBeNull()
    expect(result?.email).toBe('test@example.com')
  })
})

// =============================================================================
// Integration Tests
// =============================================================================

describe('token round-trip', () => {
  it('preserves all payload data through create/verify cycle', () => {
    const email = 'bcba@clinic.com'
    const resultsToken = 'abc-123-def-456'

    const token = createMagicLinkToken(email, resultsToken, '24h')
    const payload = verifyMagicLinkToken(token)

    expect(payload).toMatchObject({
      email,
      resultsToken,
    })
  })

  it('works with various email formats', () => {
    const testEmails = [
      'simple@example.com',
      'user+tag@domain.com',
      'user.name@subdomain.domain.org',
      'a@b.co',
    ]

    for (const email of testEmails) {
      const token = createMagicLinkToken(email, 'results')
      const payload = verifyMagicLinkToken(token)
      expect(payload?.email).toBe(email)
    }
  })

  it('works with various resultsToken formats', () => {
    const testTokens = [
      'simple-token',
      '123e4567-e89b-12d3-a456-426614174000',
      'abc123',
      'a',
    ]

    for (const resultsToken of testTokens) {
      const token = createMagicLinkToken('test@example.com', resultsToken)
      const payload = verifyMagicLinkToken(token)
      expect(payload?.resultsToken).toBe(resultsToken)
    }
  })
})
