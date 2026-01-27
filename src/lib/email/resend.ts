import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable is not set");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Use Resend's test address for unverified domains, or your verified domain
// Change this to "UpskillABA <noreply@upskillaba.com>" once domain is verified
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "UpskillABA <onboarding@resend.dev>";
