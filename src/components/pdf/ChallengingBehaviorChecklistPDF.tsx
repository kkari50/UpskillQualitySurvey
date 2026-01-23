"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Types
type Answer = "yes" | "no" | "na" | null;

interface CriteriaAnswers {
  isMeasurableObservable: Answer;
  isCulturallySensitive: Answer;
  canSeeOrHear: Answer;
  freeOfInternalStates: Answer;
  includesDimension: Answer;
  appropriateMeasurement: Answer;
}

interface Scores {
  yesCount: number;
  noCount: number;
  naCount: number;
  answeredCount: number;
  scorableCount: number;
  totalCount: number;
  percentage: number;
  allAnswered: boolean;
  passed: boolean;
}

export interface ChallengingBehaviorChecklistData {
  date: string;
  evaluator: string;
  client: string;
  behaviorName: string;
  behaviorDefinition: string;
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
  subtitle: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 4,
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
    width: "25%",
    padding: 8,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  infoItemHalf: {
    width: "50%",
  },
  infoItemFull: {
    width: "100%",
    borderRightWidth: 0,
    borderBottomWidth: 0,
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
  definitionBox: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f8fafc",
  },
  definitionLabel: {
    fontSize: 7,
    color: "#64748b",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  definitionText: {
    fontSize: 9,
    color: "#1e293b",
    lineHeight: 1.4,
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
  answerNA: {
    color: "#6b7280",
    backgroundColor: "#f9fafb",
  },
  answerEmpty: {
    color: "#9ca3af",
  },
  notesBox: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    padding: 10,
    minHeight: 50,
  },
  notesText: {
    fontSize: 8,
    color: "#374151",
    lineHeight: 1.4,
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
  "Is the maladaptive behavior measurable and observable?",
  "Is the maladaptive behavior label culturally sensitive and age appropriate?",
  "Observer can see or hear the occurrence of the maladaptive behavior.",
  "Is the definition free of any reference to internal states (e.g., frustrated, overstimulated)?",
  "Does the definition (if applicable) include a dimension of the behavior such as intensity (e.g., leaves a red mark, breaks the skin)?",
  "Is the selected measurement procedure appropriate? (Use job aid with decision tree.)",
];

const formatAnswer = (answer: Answer): string => {
  if (answer === "yes") return "Yes";
  if (answer === "no") return "No";
  if (answer === "na") return "N/A";
  return "—";
};

const getAnswerStyle = (answer: Answer) => {
  if (answer === "yes") return styles.answerYes;
  if (answer === "no") return styles.answerNo;
  if (answer === "na") return styles.answerNA;
  return styles.answerEmpty;
};

export function ChallengingBehaviorChecklistPDF({
  date,
  evaluator,
  client,
  behaviorName,
  behaviorDefinition,
  answers,
  scores,
  notes,
}: ChallengingBehaviorChecklistData) {
  const answerArray = [
    answers.isMeasurableObservable,
    answers.isCulturallySensitive,
    answers.canSeeOrHear,
    answers.freeOfInternalStates,
    answers.includesDimension,
    answers.appropriateMeasurement,
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
            <View>
              <Text style={styles.title}>Challenging Behavior Definition</Text>
              <Text style={styles.subtitle}>Evaluation Checklist</Text>
            </View>
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
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Client</Text>
            <Text style={styles.infoValue}>{client || "—"}</Text>
          </View>
          <View style={[styles.infoItem, styles.infoItemLast]}>
            <Text style={styles.infoLabel}>Behavior Name</Text>
            <Text style={styles.infoValue}>{behaviorName || "—"}</Text>
          </View>
        </View>

        {/* Behavior Definition */}
        {behaviorDefinition && (
          <View style={styles.definitionBox}>
            <Text style={styles.definitionLabel}>
              Behavior Definition Being Evaluated
            </Text>
            <Text style={styles.definitionText}>{behaviorDefinition}</Text>
          </View>
        )}

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
            {scores.passed ? "MEETS CRITERIA" : "NEEDS REVISION"} —{" "}
            {scores.yesCount} of {scores.scorableCount} criteria met
            {scores.naCount > 0 && ` (${scores.naCount} N/A)`}
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

        {/* Reminder */}
        <View
          style={{
            padding: 8,
            backgroundColor: "#f0fdfa",
            borderRadius: 4,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 8, color: "#0d9488" }}>
            Remember: objectives should be observable, measurable, and repeatable.
          </Text>
        </View>

        {/* Criteria */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Definition Criteria</Text>
          <View style={styles.criteriaTable}>
            {CRITERIA_LABELS.map((label, idx) => (
              <View
                key={idx}
                style={[
                  styles.criteriaRow,
                  idx === CRITERIA_LABELS.length - 1 ? styles.criteriaRowLast : {},
                ]}
              >
                <Text style={styles.criteriaNumber}>{idx + 1}</Text>
                <Text style={styles.criteriaLabel}>{label}</Text>
                <View
                  style={[styles.criteriaAnswer, getAnswerStyle(answerArray[idx])]}
                >
                  <Text>{formatAnswer(answerArray[idx])}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Notes */}
        {notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommendations for Revision</Text>
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>{notes}</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Upskill ABA</Text>
          <Text>Challenging Behavior Definition Checklist</Text>
        </View>
      </Page>
    </Document>
  );
}
