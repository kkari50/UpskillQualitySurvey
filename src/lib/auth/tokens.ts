import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-dev";

interface MagicLinkPayload {
  email: string;
  resultsToken: string;
  iat?: number;
  exp?: number;
}

/**
 * Check if a string looks like a JWT token
 * JWTs have 3 base64-encoded parts separated by dots
 */
export function isJwtToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  // Check if each part is base64-ish (basic validation)
  const base64Regex = /^[A-Za-z0-9_-]+$/;
  return parts.every((part) => base64Regex.test(part));
}

/**
 * Verify and decode a magic link JWT token
 * Returns the payload if valid, null otherwise
 */
export function verifyMagicLinkToken(token: string): MagicLinkPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as MagicLinkPayload;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Create a magic link JWT token
 */
export function createMagicLinkToken(
  email: string,
  resultsToken: string,
  expiresIn: string = "7d"
): string {
  return jwt.sign({ email, resultsToken }, JWT_SECRET, { expiresIn } as SignOptions);
}
