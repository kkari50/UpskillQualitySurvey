"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Types
type Answer = "yes" | "no" | null;

interface CriteriaAnswers {
  hasRequiredFields: Answer;
  hasAntecedentDescription: Answer;
  hasConsequenceDescription: Answer;
  hasImplementationRating: Answer;
  hasCommentsSection: Answer;
  hasOverallScoreSystem: Answer;
}

interface Scores {
  yesCount: number;
  noCount: number;
  answeredCount: number;
  totalCount: number;
  percentage: number;
  passed: boolean;
}

export interface BIPFidelityRatingData {
  date: string;
  evaluator: string;
  maladaptiveBehavior: string;
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
  infoItemFull: {
    width: "100%",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  infoItemLast: {
    borderRightWidth: 0,
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
  scoreBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginBottom: 15,
    borderRadius: 4,
    borderWidth: 1,
  },
  scoreBoxPass: {
    backgroundColor: "#ecfdf5",
    borderColor: "#a7f3d0",
  },
  scoreBoxFail: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: "bold",
  },
  scoreLabelPass: {
    color: "#059669",
  },
  scoreLabelFail: {
    color: "#dc2626",
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scoreValuePass: {
    color: "#059669",
  },
  scoreValueFail: {
    color: "#dc2626",
  },
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
  criteriaNumber: {
    width: 25,
    padding: 6,
    backgroundColor: "#f1f5f9",
    fontSize: 8,
    fontWeight: "bold",
    color: "#0d9488",
    textAlign: "center",
  },
  criteriaLabel: {
    flex: 1,
    padding: 6,
    fontSize: 8,
    color: "#374151",
  },
  criteriaAnswer: {
    width: 50,
    padding: 6,
    textAlign: "center",
    fontSize: 8,
    fontWeight: "bold",
  },
  answerYes: {
    color: "#059669",
    backgroundColor: "#ecfdf5",
  },
  answerNo: {
    color: "#dc2626",
    backgroundColor: "#fef2f2",
  },
  answerEmpty: {
    color: "#9ca3af",
  },
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
  reference: {
    marginTop: 15,
    padding: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },
  referenceText: {
    fontSize: 7,
    color: "#64748b",
    fontStyle: "italic",
  },
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

const CRITERIA_LABELS = [
  "Does the fidelity checklist have a space for: date, time, patient name, RBT name/caregiver name, and supervisor name?",
  "Does the checklist provide a description of the plan components for antecedent procedure steps?",
  "Does the checklist provide a description of the plan components for consequence procedure steps?",
  "Does the checklist provide an implementation rating for each step?",
  "Does the checklist have a section for comments?",
  "Does the checklist have an overall score system?",
];

const formatAnswer = (answer: Answer): string => {
  if (answer === "yes") return "Yes";
  if (answer === "no") return "No";
  return "—";
};

const getAnswerStyle = (answer: Answer) => {
  if (answer === "yes") return styles.answerYes;
  if (answer === "no") return styles.answerNo;
  return styles.answerEmpty;
};

export function BIPFidelityRatingPDF({
  date,
  evaluator,
  maladaptiveBehavior,
  answers,
  scores,
  notes,
}: BIPFidelityRatingData) {
  const answerArray = [
    answers.hasRequiredFields,
    answers.hasAntecedentDescription,
    answers.hasConsequenceDescription,
    answers.hasImplementationRating,
    answers.hasCommentsSection,
    answers.hasOverallScoreSystem,
  ];

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
            <Text style={styles.title}>BIP Fidelity Rating Form</Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{date || "—"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Evaluator</Text>
            <Text style={styles.infoValue}>{evaluator || "—"}</Text>
          </View>
          <View style={[styles.infoItem, styles.infoItemLast]}>
            <Text style={styles.infoLabel}>Score</Text>
            <Text style={styles.infoValue}>{scores.percentage}%</Text>
          </View>
          <View style={[styles.infoItem, styles.infoItemFull]}>
            <Text style={styles.infoLabel}>Maladaptive Behavior Being Observed</Text>
            <Text style={styles.infoValue}>{maladaptiveBehavior || "—"}</Text>
          </View>
        </View>

        {/* Score Summary */}
        <View
          style={[
            styles.scoreBox,
            scores.passed ? styles.scoreBoxPass : styles.scoreBoxFail,
          ]}
        >
          <Text
            style={[
              styles.scoreLabel,
              scores.passed ? styles.scoreLabelPass : styles.scoreLabelFail,
            ]}
          >
            {scores.passed ? "PASSED" : "NOT PASSED"} - {scores.yesCount} of{" "}
            {scores.totalCount} criteria met
          </Text>
          <Text
            style={[
              styles.scoreValue,
              scores.passed ? styles.scoreValuePass : styles.scoreValueFail,
            ]}
          >
            {scores.percentage}%
          </Text>
        </View>

        {/* Criteria */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Checklist Components</Text>
          <View style={styles.criteriaTable}>
            {CRITERIA_LABELS.map((label, idx) => (
              <View
                key={idx}
                style={[
                  styles.criteriaRow,
                  idx === CRITERIA_LABELS.length - 1 && styles.criteriaRowLast,
                ]}
              >
                <Text style={styles.criteriaNumber}>{idx + 1}</Text>
                <Text style={styles.criteriaLabel}>{label}</Text>
                <View style={[styles.criteriaAnswer, getAnswerStyle(answerArray[idx])]}>
                  <Text>{formatAnswer(answerArray[idx])}</Text>
                </View>
              </View>
            ))}
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

        {/* Note about 100% requirement */}
        <View style={{ padding: 8, backgroundColor: "#fffbeb", borderRadius: 4, marginBottom: 10 }}>
          <Text style={{ fontSize: 8, color: "#92400e" }}>
            **NOTE: A score of 100% must be reached to pass this rating form.
          </Text>
        </View>

        {/* Reference */}
        <View style={styles.reference}>
          <Text style={styles.referenceText}>
            Reference: Codding, R. S., Feinberg, A. B., Dunn, E. K., & Pace, G. M.
            (2005). Effects of immediate performance feedback on implementation of
            behavior support plans. Journal of Applied Behavior Analysis, 38(2),
            205-219.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Upskill ABA</Text>
          <Text>
            Scoring: (Yes / {scores.totalCount}) × 100 = {scores.percentage}%
          </Text>
        </View>
      </Page>
    </Document>
  );
}
