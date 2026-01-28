/**
 * Results Link Email Template Tests
 *
 * Tests for email template generation.
 */

import { describe, it, expect } from 'vitest'
import { getResultsLinkEmail } from '../results-link'

// =============================================================================
// getResultsLinkEmail Tests
// =============================================================================

describe('getResultsLinkEmail', () => {
  const defaultProps = {
    resultsUrl: 'https://example.com/results/abc123',
    baseUrl: 'https://example.com',
  }

  describe('return structure', () => {
    it('returns object with subject, html, and text', () => {
      const result = getResultsLinkEmail(defaultProps)

      expect(result).toHaveProperty('subject')
      expect(result).toHaveProperty('html')
      expect(result).toHaveProperty('text')
    })

    it('returns strings for all properties', () => {
      const result = getResultsLinkEmail(defaultProps)

      expect(typeof result.subject).toBe('string')
      expect(typeof result.html).toBe('string')
      expect(typeof result.text).toBe('string')
    })
  })

  describe('subject', () => {
    it('returns correct subject line', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.subject).toBe('Your UpskillABA Survey Results')
    })
  })

  describe('HTML template', () => {
    it('contains DOCTYPE declaration', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.html).toContain('<!DOCTYPE html>')
    })

    it('includes logo with correct URL', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.html).toContain(`${defaultProps.baseUrl}/images/logo-medium.png`)
    })

    it('includes results URL in button link', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.html).toContain(`href="${defaultProps.resultsUrl}"`)
    })

    it('includes results URL as plain text', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.html).toContain(defaultProps.resultsUrl)
    })

    it('includes "View My Results" button text', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.html).toContain('View My Results')
    })

    it('includes brand color (#0D9488)', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.html).toContain('#0D9488')
    })

    it('includes copyright year', () => {
      const currentYear = new Date().getFullYear()
      const result = getResultsLinkEmail(defaultProps)
      expect(result.html).toContain(`${currentYear}`)
    })

    it('includes UpskillABA branding', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.html).toContain('UpskillABA')
    })

    it('includes "Survey Results Are Ready" heading', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.html).toContain('Your Survey Results Are Ready')
    })

    it('includes thank you message', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.html).toContain('Thank you for completing the Quick Quality Assessment')
    })

    it('includes responsive meta viewport tag', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.html).toContain('viewport')
      expect(result.html).toContain('width=device-width')
    })

    it('includes mobile-responsive styles', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.html).toContain('@media only screen and (max-width: 480px)')
    })
  })

  describe('text template', () => {
    it('includes results URL', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.text).toContain(defaultProps.resultsUrl)
    })

    it('includes "Survey Results Are Ready" message', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.text).toContain('Survey Results Are Ready')
    })

    it('includes thank you message', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.text).toContain('Thank you for completing the Quick Quality Assessment')
    })

    it('includes copyright year', () => {
      const currentYear = new Date().getFullYear()
      const result = getResultsLinkEmail(defaultProps)
      expect(result.text).toContain(`${currentYear}`)
    })

    it('includes UpskillABA branding', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.text).toContain('UpskillABA')
    })

    it('includes ignore notice', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.text).toContain("If you didn't request this email")
    })

    it('is readable without HTML formatting', () => {
      const result = getResultsLinkEmail(defaultProps)
      // Should not contain HTML tags in text version
      expect(result.text).not.toContain('<html')
      expect(result.text).not.toContain('<body')
      expect(result.text).not.toContain('<a href')
    })
  })

  describe('URL interpolation', () => {
    it('correctly interpolates different results URLs', () => {
      const customUrl = 'https://myapp.com/results/xyz789'
      const result = getResultsLinkEmail({
        resultsUrl: customUrl,
        baseUrl: 'https://myapp.com',
      })

      expect(result.html).toContain(customUrl)
      expect(result.text).toContain(customUrl)
    })

    it('correctly interpolates different base URLs', () => {
      const customBaseUrl = 'https://custom-domain.com'
      const result = getResultsLinkEmail({
        resultsUrl: 'https://custom-domain.com/results/123',
        baseUrl: customBaseUrl,
      })

      expect(result.html).toContain(`${customBaseUrl}/images/logo-medium.png`)
    })

    it('handles URLs with query parameters', () => {
      const urlWithParams = 'https://example.com/results/abc?token=xyz&source=email'
      const result = getResultsLinkEmail({
        resultsUrl: urlWithParams,
        baseUrl: 'https://example.com',
      })

      expect(result.html).toContain(urlWithParams)
      expect(result.text).toContain(urlWithParams)
    })

    it('handles localhost URLs', () => {
      const localUrl = 'http://localhost:3000/results/test123'
      const result = getResultsLinkEmail({
        resultsUrl: localUrl,
        baseUrl: 'http://localhost:3000',
      })

      expect(result.html).toContain(localUrl)
    })
  })

  describe('accessibility', () => {
    it('includes alt text for logo', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.html).toContain('alt="UpskillABA"')
    })

    it('uses role="presentation" for layout tables', () => {
      const result = getResultsLinkEmail(defaultProps)
      expect(result.html).toContain('role="presentation"')
    })
  })
})

// =============================================================================
// Edge Cases
// =============================================================================

describe('edge cases', () => {
  it('handles empty strings gracefully', () => {
    // While not ideal, the function should not throw
    const result = getResultsLinkEmail({
      resultsUrl: '',
      baseUrl: '',
    })

    expect(result.subject).toBeDefined()
    expect(result.html).toBeDefined()
    expect(result.text).toBeDefined()
  })

  it('handles special characters in URL', () => {
    const result = getResultsLinkEmail({
      resultsUrl: 'https://example.com/results/abc-123_test',
      baseUrl: 'https://example.com',
    })

    expect(result.html).toContain('abc-123_test')
  })
})

// =============================================================================
// Year Handling
// =============================================================================

describe('year handling', () => {
  const yearTestProps = {
    resultsUrl: 'https://example.com/results/abc123',
    baseUrl: 'https://example.com',
  }

  it('includes year in both HTML and text output', () => {
    const result = getResultsLinkEmail(yearTestProps)
    const currentYear = new Date().getFullYear().toString()

    // The template should include the current year in the copyright
    expect(result.html).toContain(currentYear)
    expect(result.text).toContain(currentYear)
  })

  it('uses dynamic year (not hardcoded)', () => {
    const result = getResultsLinkEmail(yearTestProps)

    // The year should appear in the copyright section
    // Verify it contains a 4-digit year pattern in the copyright area
    expect(result.html).toMatch(/&copy; \d{4} UpskillABA/)
    expect(result.text).toMatch(/\(c\) \d{4} UpskillABA/)
  })
})
