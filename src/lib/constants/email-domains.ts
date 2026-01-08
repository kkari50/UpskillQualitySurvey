/**
 * Email Domain Constants
 *
 * Personal email domain identification for agency grouping.
 * All emails are accepted - this list is used to identify personal vs work emails
 * for optional agency grouping purposes only.
 *
 * IMPORTANT: Personal emails are fully supported. Users with personal emails
 * can take the survey normally - they just won't be grouped into agencies.
 */

/**
 * Common personal email domains.
 * Users with these domains will have `email_domain: null` in the leads table,
 * meaning they won't be grouped into agencies. They can still take the survey.
 */
export const PERSONAL_EMAIL_DOMAINS: Set<string> = new Set([
  // Major providers
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.uk',
  'yahoo.ca',
  'yahoo.com.au',
  'outlook.com',
  'outlook.co.uk',
  'hotmail.com',
  'hotmail.co.uk',
  'live.com',
  'live.co.uk',
  'msn.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'protonmail.com',
  'proton.me',
  'pm.me',

  // Regional providers
  'mail.com',
  'email.com',
  'usa.com',
  'gmx.com',
  'gmx.net',
  'gmx.de',
  'web.de',
  'yandex.com',
  'yandex.ru',
  'mail.ru',
  'qq.com',
  '163.com',
  '126.com',
  'sina.com',
  'naver.com',
  'daum.net',
  'hanmail.net',
  'rediffmail.com',

  // ISP email domains (US)
  'comcast.net',
  'verizon.net',
  'att.net',
  'sbcglobal.net',
  'bellsouth.net',
  'charter.net',
  'cox.net',
  'earthlink.net',
  'juno.com',
  'netzero.net',
  'optonline.net',
  'frontier.com',
  'windstream.net',
  'centurylink.net',

  // Privacy-focused
  'tutanota.com',
  'tutamail.com',
  'tuta.io',
  'fastmail.com',
  'fastmail.fm',
  'hushmail.com',
  'mailfence.com',
  'posteo.de',
  'posteo.net',
  'runbox.com',
  'zoho.com',
  'zohomail.com',

  // Disposable/temporary (common ones)
  'mailinator.com',
  'guerrillamail.com',
  'tempmail.com',
  '10minutemail.com',
  'throwaway.email',
  'sharklasers.com',
  'yopmail.com',
  'getairmail.com',
  'discard.email',
  'fakeinbox.com',
  'trashmail.com',
])

/**
 * List format for iteration (if needed)
 */
export const PERSONAL_EMAIL_DOMAINS_LIST: string[] = Array.from(PERSONAL_EMAIL_DOMAINS)

/**
 * Check if an email domain is a personal email provider
 */
export function isPersonalEmailDomain(domain: string): boolean {
  return PERSONAL_EMAIL_DOMAINS.has(domain.toLowerCase())
}

/**
 * Extract domain from email address
 */
export function extractEmailDomain(email: string): string | null {
  const parts = email.toLowerCase().trim().split('@')
  if (parts.length !== 2) return null
  return parts[1]
}

/**
 * Get the agency domain from an email, or null if personal email
 */
export function getAgencyDomain(email: string): string | null {
  const domain = extractEmailDomain(email)
  if (!domain) return null
  if (isPersonalEmailDomain(domain)) return null
  return domain
}

/**
 * Validate email format (basic check)
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Test email domains and patterns.
 * These emails will be flagged as `is_test: true` in the database
 * and automatically cleaned up by a scheduled job.
 */
export const TEST_EMAIL_DOMAINS: Set<string> = new Set([
  'playwright.local',
  'test.example.com',
  'e2e.example.com',
  'test.local',
])

/**
 * Test email prefixes that indicate test data regardless of domain.
 * Emails starting with these prefixes will be flagged as test data.
 */
export const TEST_EMAIL_PREFIXES: string[] = [
  'test+',
  'e2e-',
  'e2e+',
  'playwright-',
  'playwright+',
  'cypress-',
  'cypress+',
]

/**
 * Check if an email is a test email (used by E2E tests).
 * Test emails are flagged in the database and auto-cleaned after 24 hours.
 */
export function isTestEmail(email: string): boolean {
  const trimmed = email.trim().toLowerCase()
  const domain = extractEmailDomain(trimmed)
  const localPart = trimmed.split('@')[0]

  // Check if domain is a test domain
  if (domain && TEST_EMAIL_DOMAINS.has(domain)) {
    return true
  }

  // Check if email starts with a test prefix
  for (const prefix of TEST_EMAIL_PREFIXES) {
    if (localPart.startsWith(prefix)) {
      return true
    }
  }

  return false
}

/**
 * Full email processing for lead capture
 */
export function processEmailForLead(email: string): {
  isValid: boolean
  normalizedEmail: string | null
  domain: string | null
  isPersonal: boolean
  agencyDomain: string | null
  isTest: boolean
} {
  const trimmed = email.trim().toLowerCase()

  if (!isValidEmail(trimmed)) {
    return {
      isValid: false,
      normalizedEmail: null,
      domain: null,
      isPersonal: false,
      agencyDomain: null,
      isTest: false,
    }
  }

  const domain = extractEmailDomain(trimmed)
  const isPersonal = domain ? isPersonalEmailDomain(domain) : false
  const isTest = isTestEmail(trimmed)

  return {
    isValid: true,
    normalizedEmail: trimmed,
    domain,
    isPersonal,
    agencyDomain: isPersonal ? null : domain,
    isTest,
  }
}
