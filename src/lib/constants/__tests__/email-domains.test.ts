/**
 * Email Domains Utility Tests
 *
 * Tests for email validation and domain classification.
 */

import { describe, it, expect } from 'vitest'
import {
  isPersonalEmailDomain,
  extractEmailDomain,
  getAgencyDomain,
  isValidEmail,
  isTestEmail,
  processEmailForLead,
  PERSONAL_EMAIL_DOMAINS,
  TEST_EMAIL_DOMAINS,
  TEST_EMAIL_PREFIXES,
} from '../email-domains'

// =============================================================================
// isPersonalEmailDomain Tests
// =============================================================================

describe('isPersonalEmailDomain', () => {
  it('returns true for Gmail domains', () => {
    expect(isPersonalEmailDomain('gmail.com')).toBe(true)
    expect(isPersonalEmailDomain('googlemail.com')).toBe(true)
  })

  it('returns true for Yahoo domains', () => {
    expect(isPersonalEmailDomain('yahoo.com')).toBe(true)
    expect(isPersonalEmailDomain('yahoo.co.uk')).toBe(true)
    expect(isPersonalEmailDomain('yahoo.ca')).toBe(true)
    expect(isPersonalEmailDomain('yahoo.com.au')).toBe(true)
  })

  it('returns true for Microsoft domains', () => {
    expect(isPersonalEmailDomain('outlook.com')).toBe(true)
    expect(isPersonalEmailDomain('hotmail.com')).toBe(true)
    expect(isPersonalEmailDomain('live.com')).toBe(true)
    expect(isPersonalEmailDomain('msn.com')).toBe(true)
  })

  it('returns true for Apple domains', () => {
    expect(isPersonalEmailDomain('icloud.com')).toBe(true)
    expect(isPersonalEmailDomain('me.com')).toBe(true)
    expect(isPersonalEmailDomain('mac.com')).toBe(true)
  })

  it('returns true for privacy-focused providers', () => {
    expect(isPersonalEmailDomain('protonmail.com')).toBe(true)
    expect(isPersonalEmailDomain('proton.me')).toBe(true)
    expect(isPersonalEmailDomain('tutanota.com')).toBe(true)
    expect(isPersonalEmailDomain('fastmail.com')).toBe(true)
  })

  it('returns true for ISP domains', () => {
    expect(isPersonalEmailDomain('comcast.net')).toBe(true)
    expect(isPersonalEmailDomain('verizon.net')).toBe(true)
    expect(isPersonalEmailDomain('att.net')).toBe(true)
  })

  it('returns true for disposable email domains', () => {
    expect(isPersonalEmailDomain('mailinator.com')).toBe(true)
    expect(isPersonalEmailDomain('guerrillamail.com')).toBe(true)
    expect(isPersonalEmailDomain('tempmail.com')).toBe(true)
  })

  it('returns false for work/company domains', () => {
    expect(isPersonalEmailDomain('upskillaba.com')).toBe(false)
    expect(isPersonalEmailDomain('acme-therapy.com')).toBe(false)
    expect(isPersonalEmailDomain('mycompany.org')).toBe(false)
    expect(isPersonalEmailDomain('clinic.health')).toBe(false)
  })

  it('is case-insensitive', () => {
    expect(isPersonalEmailDomain('GMAIL.COM')).toBe(true)
    expect(isPersonalEmailDomain('Gmail.Com')).toBe(true)
    expect(isPersonalEmailDomain('YAHOO.COM')).toBe(true)
  })
})

// =============================================================================
// extractEmailDomain Tests
// =============================================================================

describe('extractEmailDomain', () => {
  it('extracts domain from valid email', () => {
    expect(extractEmailDomain('user@example.com')).toBe('example.com')
    expect(extractEmailDomain('admin@upskillaba.com')).toBe('upskillaba.com')
  })

  it('returns null for email without @', () => {
    expect(extractEmailDomain('invalid-email')).toBeNull()
    expect(extractEmailDomain('no-at-sign.com')).toBeNull()
  })

  it('returns null for email with multiple @ signs', () => {
    expect(extractEmailDomain('user@@example.com')).toBeNull()
    expect(extractEmailDomain('user@domain@example.com')).toBeNull()
  })

  it('lowercases the domain', () => {
    expect(extractEmailDomain('User@EXAMPLE.COM')).toBe('example.com')
    expect(extractEmailDomain('USER@Gmail.Com')).toBe('gmail.com')
  })

  it('trims whitespace', () => {
    expect(extractEmailDomain('  user@example.com  ')).toBe('example.com')
    expect(extractEmailDomain('\tuser@example.com\n')).toBe('example.com')
  })

  it('handles empty string', () => {
    expect(extractEmailDomain('')).toBeNull()
  })

  it('handles subdomains', () => {
    expect(extractEmailDomain('user@mail.company.com')).toBe('mail.company.com')
    expect(extractEmailDomain('user@sub.domain.org')).toBe('sub.domain.org')
  })
})

// =============================================================================
// getAgencyDomain Tests
// =============================================================================

describe('getAgencyDomain', () => {
  it('returns null for personal email domains', () => {
    expect(getAgencyDomain('user@gmail.com')).toBeNull()
    expect(getAgencyDomain('user@yahoo.com')).toBeNull()
    expect(getAgencyDomain('user@hotmail.com')).toBeNull()
    expect(getAgencyDomain('user@icloud.com')).toBeNull()
  })

  it('returns domain for work emails', () => {
    expect(getAgencyDomain('user@upskillaba.com')).toBe('upskillaba.com')
    expect(getAgencyDomain('admin@acme-therapy.org')).toBe('acme-therapy.org')
    expect(getAgencyDomain('bcba@my-clinic.health')).toBe('my-clinic.health')
  })

  it('returns null for invalid email format', () => {
    expect(getAgencyDomain('not-an-email')).toBeNull()
    expect(getAgencyDomain('')).toBeNull()
  })

  it('is case-insensitive', () => {
    expect(getAgencyDomain('User@UpskillABA.com')).toBe('upskillaba.com')
    expect(getAgencyDomain('USER@GMAIL.COM')).toBeNull()
  })
})

// =============================================================================
// isValidEmail Tests
// =============================================================================

describe('isValidEmail', () => {
  it('returns true for valid email formats', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('user.name@example.com')).toBe(true)
    expect(isValidEmail('user+tag@example.com')).toBe(true)
    expect(isValidEmail('user@sub.domain.com')).toBe(true)
  })

  it('returns false for missing @', () => {
    expect(isValidEmail('userexample.com')).toBe(false)
    expect(isValidEmail('user.example.com')).toBe(false)
  })

  it('returns false for missing domain', () => {
    expect(isValidEmail('user@')).toBe(false)
  })

  it('returns false for missing local part', () => {
    expect(isValidEmail('@example.com')).toBe(false)
  })

  it('returns false for spaces in email', () => {
    expect(isValidEmail('user @example.com')).toBe(false)
    expect(isValidEmail('user@ example.com')).toBe(false)
    expect(isValidEmail('user name@example.com')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })

  it('returns false for missing TLD', () => {
    expect(isValidEmail('user@example')).toBe(false)
  })
})

// =============================================================================
// isTestEmail Tests
// =============================================================================

describe('isTestEmail', () => {
  it('returns true for test domains', () => {
    expect(isTestEmail('user@playwright.local')).toBe(true)
    expect(isTestEmail('user@test.example.com')).toBe(true)
    expect(isTestEmail('user@e2e.example.com')).toBe(true)
    expect(isTestEmail('user@test.local')).toBe(true)
  })

  it('returns true for test+ prefix pattern', () => {
    expect(isTestEmail('test+1234@gmail.com')).toBe(true)
    expect(isTestEmail('test+scenario@example.com')).toBe(true)
  })

  it('returns true for e2e- prefix pattern', () => {
    expect(isTestEmail('e2e-survey@example.com')).toBe(true)
    expect(isTestEmail('e2e-user@company.com')).toBe(true)
  })

  it('returns true for e2e+ prefix pattern', () => {
    expect(isTestEmail('e2e+survey@example.com')).toBe(true)
  })

  it('returns true for playwright- prefix pattern', () => {
    expect(isTestEmail('playwright-test@example.com')).toBe(true)
  })

  it('returns true for cypress- prefix pattern', () => {
    expect(isTestEmail('cypress-test@example.com')).toBe(true)
  })

  it('returns false for regular emails', () => {
    expect(isTestEmail('user@gmail.com')).toBe(false)
    expect(isTestEmail('admin@upskillaba.com')).toBe(false)
    expect(isTestEmail('tester@company.com')).toBe(false)
  })

  it('returns false for emails starting with "testing" (not test+)', () => {
    expect(isTestEmail('testing@example.com')).toBe(false)
    expect(isTestEmail('tester@example.com')).toBe(false)
  })

  it('is case-insensitive', () => {
    expect(isTestEmail('TEST+123@gmail.com')).toBe(true)
    expect(isTestEmail('User@PLAYWRIGHT.LOCAL')).toBe(true)
    expect(isTestEmail('E2E-test@Example.com')).toBe(true)
  })

  it('handles whitespace correctly', () => {
    expect(isTestEmail('  test+123@gmail.com  ')).toBe(true)
    expect(isTestEmail('  user@playwright.local  ')).toBe(true)
  })
})

// =============================================================================
// processEmailForLead Tests
// =============================================================================

describe('processEmailForLead', () => {
  it('returns valid=false for invalid email format', () => {
    const result = processEmailForLead('not-an-email')

    expect(result.isValid).toBe(false)
    expect(result.normalizedEmail).toBeNull()
    expect(result.domain).toBeNull()
    expect(result.isPersonal).toBe(false)
    expect(result.agencyDomain).toBeNull()
    expect(result.isTest).toBe(false)
  })

  it('processes personal email correctly', () => {
    const result = processEmailForLead('User@Gmail.com')

    expect(result.isValid).toBe(true)
    expect(result.normalizedEmail).toBe('user@gmail.com')
    expect(result.domain).toBe('gmail.com')
    expect(result.isPersonal).toBe(true)
    expect(result.agencyDomain).toBeNull()
    expect(result.isTest).toBe(false)
  })

  it('processes work email correctly', () => {
    const result = processEmailForLead('BCBA@UpskillABA.com')

    expect(result.isValid).toBe(true)
    expect(result.normalizedEmail).toBe('bcba@upskillaba.com')
    expect(result.domain).toBe('upskillaba.com')
    expect(result.isPersonal).toBe(false)
    expect(result.agencyDomain).toBe('upskillaba.com')
    expect(result.isTest).toBe(false)
  })

  it('identifies test emails correctly', () => {
    const result = processEmailForLead('test+survey@gmail.com')

    expect(result.isValid).toBe(true)
    expect(result.isTest).toBe(true)
    expect(result.isPersonal).toBe(true)
  })

  it('identifies test domain emails', () => {
    const result = processEmailForLead('user@playwright.local')

    expect(result.isValid).toBe(true)
    expect(result.isTest).toBe(true)
  })

  it('normalizes email to lowercase', () => {
    const result = processEmailForLead('USER@EXAMPLE.COM')

    expect(result.normalizedEmail).toBe('user@example.com')
    expect(result.domain).toBe('example.com')
  })

  it('trims whitespace from email', () => {
    const result = processEmailForLead('  user@example.com  ')

    expect(result.normalizedEmail).toBe('user@example.com')
  })

  it('handles empty string', () => {
    const result = processEmailForLead('')

    expect(result.isValid).toBe(false)
  })
})

// =============================================================================
// Constants Validation Tests
// =============================================================================

describe('PERSONAL_EMAIL_DOMAINS constant', () => {
  it('is a Set', () => {
    expect(PERSONAL_EMAIL_DOMAINS).toBeInstanceOf(Set)
  })

  it('contains major email providers', () => {
    const majorProviders = [
      'gmail.com',
      'yahoo.com',
      'outlook.com',
      'hotmail.com',
      'icloud.com',
    ]

    for (const provider of majorProviders) {
      expect(PERSONAL_EMAIL_DOMAINS.has(provider)).toBe(true)
    }
  })

  it('has reasonable size (50+ domains)', () => {
    expect(PERSONAL_EMAIL_DOMAINS.size).toBeGreaterThan(50)
  })
})

describe('TEST_EMAIL_DOMAINS constant', () => {
  it('contains playwright.local', () => {
    expect(TEST_EMAIL_DOMAINS.has('playwright.local')).toBe(true)
  })

  it('contains test.example.com', () => {
    expect(TEST_EMAIL_DOMAINS.has('test.example.com')).toBe(true)
  })
})

describe('TEST_EMAIL_PREFIXES constant', () => {
  it('includes test+ prefix', () => {
    expect(TEST_EMAIL_PREFIXES).toContain('test+')
  })

  it('includes e2e prefixes', () => {
    expect(TEST_EMAIL_PREFIXES).toContain('e2e-')
    expect(TEST_EMAIL_PREFIXES).toContain('e2e+')
  })

  it('includes playwright prefix', () => {
    expect(TEST_EMAIL_PREFIXES).toContain('playwright-')
  })
})
