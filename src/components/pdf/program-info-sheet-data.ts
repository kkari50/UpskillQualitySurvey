/**
 * Program Info Sheet - Shared Data
 *
 * Types shared between the page and PDF component.
 * Extracted to avoid loading @react-pdf/renderer when only types are needed.
 */

export type EvaluationAnswer = "yes" | "no" | "na" | null;

export interface EvaluationItem {
  id: string;
  text: string;
  answer: EvaluationAnswer;
  comment: string;
  hasSubChecklist?: boolean;
}

export interface ProgramComponent {
  id: string;
  label: string;
  checked: boolean;
}

export interface ProgramInfoSheetData {
  supervisee: string;
  overseeingBCBA: string;
  dateStart: string;
  dateEnd: string;
  programName: string;
  evaluationItems: EvaluationItem[];
  programComponents: ProgramComponent[];
  skillsToMaintain: string[];
  skillsToWorkOn: string[];
  bcbaSignature: string;
  bcbaSignatureDate: string;
  superviseeSignature: string;
  superviseeSignatureDate: string;
  logoUrl?: string;
}
