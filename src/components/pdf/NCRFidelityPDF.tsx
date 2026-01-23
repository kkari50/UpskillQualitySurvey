"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Types matching the page component
type Answer = "yes" | "no" | "na" | null;

interface CriteriaAnswers {
  dataSheetsAccessible: Answer;
  confirmedPhase: Answer;
  timerSetCorrectly: Answer;
  immediateDelivery: Answer;
  waitedForTrial: Answer;
  noncomplianceHandled: Answer;
  timerReset: Answer;
  occurrencesRecorded: Answer;
  rateCalculated: Answer;
  phaseAdvancementNoted: Answer;
  phaseRegressionChecked: Answer;
}

interface Scores {
  setup: number;
  implementation: number;
  dataDecision: number;
  overall: number;
  answeredCount: number;
  totalCount: number;
}

export interface NCRFidelityData {
  date: string;
  client: string;
  btRbt: string;
  bcba: string;
  tangibleItem: string;
  currentPhase: string;
  intervalDuration: string;
  sessionDuration: number;
  regressionCriterion: string;
  noncomplianceCount: number;
  noncomplianceRate: number;
  answers: CriteriaAnswers;
  scores: Scores;
  notes: string;
}

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  // Header
  headerContainer: {
    marginBottom: 15,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logoUpskill: {
    color: "#0d9488",
  },
  logoABA: {
    color: "#64748b",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
  },
  // Info grid
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    marginBottom: 15,
  },
  infoItem: {
    width: "33.33%",
    padding: 8,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  infoItemHalf: {
    width: "50%",
  },
  infoItemLast: {
    borderRightWidth: 0,
  },
  infoItemBottom: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 7,
    color: "#64748b",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 9,
    color: "#1e293b",
    fontWeight: "medium",
  },
  // Score summary
  scoreSummary: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 8,
  },
  scoreBox: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  scoreBoxOverall: {
    backgroundColor: "#f1f5f9",
  },
  scoreBoxSetup: {
    backgroundColor: "#f1f5f9",
  },
  scoreBoxTeal: {
    backgroundColor: "#f0fdfa",
  },
  scoreBoxBlue: {
    backgroundColor: "#eff6ff",
  },
  scoreLabel: {
    fontSize: 7,
    color: "#64748b",
    marginBottom: 4,
    textTransform: "uppercase",
    textAlign: "center",
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scoreValueGreen: {
    color: "#059669",
  },
  scoreValueAmber: {
    color: "#d97706",
  },
  scoreValueRed: {
    color: "#dc2626",
  },
  scoreValueDefault: {
    color: "#475569",
  },
  scoreValueTeal: {
    color: "#0d9488",
  },
  scoreValueBlue: {
    color: "#2563eb",
  },
  // Noncompliance box
  noncomplianceBox: {
    flexDirection: "row",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  noncomplianceItem: {
    flex: 1,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: "#e2e8f0",
  },
  noncomplianceItemLast: {
    borderRightWidth: 0,
  },
  noncomplianceLabel: {
    fontSize: 7,
    color: "#64748b",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  noncomplianceValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
  },
  noncomplianceWarning: {
    backgroundColor: "#fffbeb",
  },
  noncomplianceWarningValue: {
    color: "#d97706",
  },
  // Section
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  // Criteria table
  criteriaTable: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
  },
  criteriaRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  criteriaRowLast: {
    borderBottomWidth: 0,
  },
  criteriaRowReversed: {
    backgroundColor: "#fffbeb",
  },
  criteriaLabel: {
    flex: 1,
    padding: 6,
    fontSize: 8,
    color: "#374151",
  },
  criteriaHint: {
    fontSize: 7,
    color: "#6b7280",
    marginTop: 2,
  },
  criteriaReversedBadge: {
    fontSize: 6,
    color: "#92400e",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
    marginLeft: 4,
  },
  criteriaAnswer: {
    width: 50,
    padding: 6,
    textAlign: "center",
    fontSize: 8,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
  },
  answerYes: {
    color: "#059669",
    backgroundColor: "#ecfdf5",
  },
  answerNo: {
    color: "#dc2626",
    backgroundColor: "#fef2f2",
  },
  answerNA: {
    color: "#6b7280",
    backgroundColor: "#f9fafb",
  },
  answerEmpty: {
    color: "#9ca3af",
  },
  // Reversed answer colors (for waitedForTrial where No is good)
  answerYesReversed: {
    color: "#dc2626",
    backgroundColor: "#fef2f2",
  },
  answerNoReversed: {
    color: "#059669",
    backgroundColor: "#ecfdf5",
  },
  // Notes section
  notesBox: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    padding: 10,
    minHeight: 60,
  },
  notesText: {
    fontSize: 8,
    color: "#374151",
    lineHeight: 1.4,
  },
  notesEmpty: {
    fontSize: 8,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: "#9ca3af",
  },
});

// Helper to format answer
const formatAnswer = (answer: Answer): string => {
  if (answer === "yes") return "Y";
  if (answer === "no") return "N";
  if (answer === "na") return "N/A";
  return "—";
};

// Helper to get answer style
const getAnswerStyle = (answer: Answer, reversed: boolean = false) => {
  if (reversed) {
    if (answer === "yes") return styles.answerYesReversed;
    if (answer === "no") return styles.answerNoReversed;
  } else {
    if (answer === "yes") return styles.answerYes;
    if (answer === "no") return styles.answerNo;
  }
  if (answer === "na") return styles.answerNA;
  return styles.answerEmpty;
};

// Helper to get score color style
const getScoreStyle = (score: number) => {
  if (score >= 85) return styles.scoreValueGreen;
  if (score >= 70) return styles.scoreValueAmber;
  return styles.scoreValueRed;
};

// Criteria row component
function CriteriaRowPDF({
  label,
  answer,
  isLast = false,
  reversed = false,
  hint,
}: {
  label: string;
  answer: Answer;
  isLast?: boolean;
  reversed?: boolean;
  hint?: string;
}) {
  const rowStyles = [
    styles.criteriaRow,
    isLast && styles.criteriaRowLast,
    reversed && styles.criteriaRowReversed,
  ].filter(Boolean);

  return (
    <View style={rowStyles}>
      <View style={styles.criteriaLabel}>
        <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
          <Text>{label}</Text>
          {reversed && <Text style={styles.criteriaReversedBadge}>Expect &quot;No&quot;</Text>}
        </View>
        {hint && <Text style={styles.criteriaHint}>{hint}</Text>}
      </View>
      <View style={[styles.criteriaAnswer, getAnswerStyle(answer, reversed)]}>
        <Text>{formatAnswer(answer)}</Text>
      </View>
    </View>
  );
}

// Main PDF Document
export function NCRFidelityPDF({
  date,
  client,
  btRbt,
  bcba,
  tangibleItem,
  currentPhase,
  intervalDuration,
  sessionDuration,
  regressionCriterion,
  noncomplianceCount,
  noncomplianceRate,
  answers,
  scores,
  notes,
}: NCRFidelityData) {
  const rateExceedsCriterion =
    regressionCriterion && noncomplianceRate > parseFloat(regressionCriterion);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTop}>
            <Text style={styles.logoText}>
              <Text style={styles.logoUpskill}>Upskill</Text>
              <Text style={styles.logoABA}>ABA</Text>
            </Text>
            <Text style={styles.title}>NCR Fidelity Checklist</Text>
          </View>
        </View>

        {/* Session Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{date || "—"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Client</Text>
            <Text style={styles.infoValue}>{client || "—"}</Text>
          </View>
          <View style={[styles.infoItem, styles.infoItemLast]}>
            <Text style={styles.infoLabel}>BT/RBT</Text>
            <Text style={styles.infoValue}>{btRbt || "—"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>BCBA</Text>
            <Text style={styles.infoValue}>{bcba || "—"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Tangible Item</Text>
            <Text style={styles.infoValue}>{tangibleItem || "—"}</Text>
          </View>
          <View style={[styles.infoItem, styles.infoItemLast]}>
            <Text style={styles.infoLabel}>Current Phase</Text>
            <Text style={styles.infoValue}>{currentPhase || "—"}</Text>
          </View>
          <View style={[styles.infoItem, styles.infoItemBottom]}>
            <Text style={styles.infoLabel}>Interval Duration</Text>
            <Text style={styles.infoValue}>{intervalDuration || "—"}</Text>
          </View>
          <View style={[styles.infoItem, styles.infoItemBottom]}>
            <Text style={styles.infoLabel}>Session Length</Text>
            <Text style={styles.infoValue}>{sessionDuration} min</Text>
          </View>
          <View style={[styles.infoItem, styles.infoItemLast, styles.infoItemBottom]}>
            <Text style={styles.infoLabel}>Regression Criterion</Text>
            <Text style={styles.infoValue}>{regressionCriterion || "—"}/hr</Text>
          </View>
        </View>

        {/* Score Summary */}
        <View style={styles.scoreSummary}>
          <View style={[styles.scoreBox, styles.scoreBoxOverall]}>
            <Text style={styles.scoreLabel}>Overall</Text>
            <Text style={[styles.scoreValue, getScoreStyle(scores.overall)]}>
              {scores.overall}%
            </Text>
          </View>
          <View style={[styles.scoreBox, styles.scoreBoxSetup]}>
            <Text style={styles.scoreLabel}>Setup</Text>
            <Text style={[styles.scoreValue, styles.scoreValueDefault]}>
              {scores.setup}%
            </Text>
          </View>
          <View style={[styles.scoreBox, styles.scoreBoxTeal]}>
            <Text style={styles.scoreLabel}>Implementation</Text>
            <Text style={[styles.scoreValue, styles.scoreValueTeal]}>
              {scores.implementation}%
            </Text>
          </View>
          <View style={[styles.scoreBox, styles.scoreBoxBlue]}>
            <Text style={styles.scoreLabel}>Data & Decisions</Text>
            <Text style={[styles.scoreValue, styles.scoreValueBlue]}>
              {scores.dataDecision}%
            </Text>
          </View>
        </View>

        {/* Noncompliance Tracking */}
        <View style={styles.noncomplianceBox}>
          <View style={styles.noncomplianceItem}>
            <Text style={styles.noncomplianceLabel}>Noncompliance Count</Text>
            <Text style={styles.noncomplianceValue}>{noncomplianceCount}</Text>
          </View>
          <View
            style={[
              styles.noncomplianceItem,
              styles.noncomplianceItemLast,
              rateExceedsCriterion && styles.noncomplianceWarning,
            ]}
          >
            <Text style={styles.noncomplianceLabel}>Rate (per hour)</Text>
            <Text
              style={[
                styles.noncomplianceValue,
                rateExceedsCriterion && styles.noncomplianceWarningValue,
              ]}
            >
              {noncomplianceRate.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Session Setup Criteria */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Setup ({scores.setup}%)</Text>
          <View style={styles.criteriaTable}>
            <CriteriaRowPDF
              label="Data sheets are accessible and appropriate information is entered"
              answer={answers.dataSheetsAccessible}
            />
            <CriteriaRowPDF
              label="BT/RBT confirms the correct phase for the session"
              answer={answers.confirmedPhase}
            />
            <CriteriaRowPDF
              label="BT/RBT sets timer for the correct duration for the current phase"
              answer={answers.timerSetCorrectly}
              isLast
            />
          </View>
        </View>

        {/* Implementation Criteria */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Implementation ({scores.implementation}%)</Text>
          <View style={styles.criteriaTable}>
            <CriteriaRowPDF
              label="When the timer goes off, the BT/RBT immediately delivers the tangible for 30 seconds"
              answer={answers.immediateDelivery}
            />
            <CriteriaRowPDF
              label="BT/RBT waits to finish a skill acquisition trial before delivering the tangible"
              answer={answers.waitedForTrial}
              reversed
              hint="Tangible should be delivered immediately, not delayed"
            />
            <CriteriaRowPDF
              label="If client engaged in noncompliance when timer went off, BT/RBT waited 30 seconds then delivered access"
              answer={answers.noncomplianceHandled}
              hint="N/A if no noncompliance occurred"
            />
            <CriteriaRowPDF
              label="Timer is reset for next interval"
              answer={answers.timerReset}
              isLast
            />
          </View>
        </View>

        {/* Data & Decision Making Criteria */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Decision Making ({scores.dataDecision}%)</Text>
          <View style={styles.criteriaTable}>
            <CriteriaRowPDF
              label="Occurrences of noncompliance are recorded on the data sheet"
              answer={answers.occurrencesRecorded}
            />
            <CriteriaRowPDF
              label="Rate of noncompliance is calculated at the end of each day"
              answer={answers.rateCalculated}
            />
            <CriteriaRowPDF
              label="If phase change criterion is met, BT/RBT makes a note to proceed to the next phase"
              answer={answers.phaseAdvancementNoted}
              hint="N/A if criterion not met"
            />
            <CriteriaRowPDF
              label="If client engaged in noncompliance at criterion rate for 2 consecutive days, move back one phase"
              answer={answers.phaseRegressionChecked}
              hint="N/A if not applicable"
              isLast
            />
          </View>
        </View>

        {/* Notes */}
        {notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>{notes}</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Upskill ABA</Text>
          <Text>
            Scoring: (Y / total Y+N responses) × 100 = {scores.overall}%
          </Text>
        </View>
      </Page>
    </Document>
  );
}
