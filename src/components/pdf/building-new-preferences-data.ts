/**
 * Building New Preferences - Shared Data
 *
 * Types shared between the page and PDF component.
 * Extracted to avoid loading @react-pdf/renderer when only types are needed.
 */

export type Category = "tangible" | "social" | null;
export type Reaction = "enjoyed" | "neutral" | "rejected" | null;

export interface PreferenceEntry {
  id: string;
  category: Category;
  description: string;
  reaction: Reaction;
}

export interface PreferencesData {
  date: string;
  clientName: string;
  therapistName: string;
  entries: PreferenceEntry[];
  notes: string;
  logoUrl?: string;
}
