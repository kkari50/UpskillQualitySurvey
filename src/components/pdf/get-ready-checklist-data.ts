/**
 * Get Ready Checklist - Shared Data
 *
 * Constants and types shared between the page and PDF component.
 * Extracted to avoid loading @react-pdf/renderer when only data is needed.
 */

export type Answer = "Y" | "N" | "NA" | null;

export interface ChecklistData {
  date: string;
  name: string;
  notes: string;
  answers: Record<string, Answer>;
  logoUrl?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  allowNA?: boolean;
  conditionalOn?: string;
}

export const DATA_COLLECTION_ITEMS: ChecklistItem[] = [
  { id: "data_sheets", text: "Is your data collection system set up and ready for the upcoming work session?" },
  { id: "materials", text: "Do you have all materials (flashcards, objects) for all programs?" },
  { id: "phase_changes", text: "Have you checked for phase changes?" },
  { id: "last_set", text: "Are you on the last set of a program?" },
  { id: "alert_bcba_last_set", text: "Have you formally alerted your BCBA?", conditionalOn: "last_set" },
  { id: "token_board", text: "Has the token board ratio been updated (if used)?", allowNA: true },
  { id: "program_progress", text: "Has any program received 50% or below for the last 5 sessions or no progress at 10 sessions?" },
  { id: "alert_bcba_progress", text: "Have you formally alerted your BCBA?", conditionalOn: "program_progress" },
];

export const GENERAL_ITEMS: ChecklistItem[] = [
  { id: "timer", text: "Do you have the timer available for break time?" },
  { id: "books_rotated", text: "Have the books/puzzles for down time been rotated since last week?" },
  { id: "preference_assessment", text: "Have you completed a preference assessment within the week?" },
  { id: "self_care", text: "Do you have tissues/baby wipes or any other required self-care items?" },
  { id: "visual_schedules", text: "Prepare visual schedules (if used)", allowNA: true },
  { id: "supervisor_notes", text: "Reviewed applicable notes from supervisor" },
];
