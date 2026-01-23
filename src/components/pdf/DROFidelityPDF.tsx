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

interface IntervalData {
  behaviorOccurred: boolean | null;
  endedCorrectly: Answer;
  deliveredReinforcer: Answer;
  reinforcedTimely: Answer;
  reinforcedOtherBehaviors: Answer;
  restartedImmediately: Answer;
  withheldReinforcement: Answer;
  noAttentionGiven: Answer;
  continuedReinforcingOthers: Answer;
  notes: string;
}

interface SessionSetup {
  timerSet: Answer;
  materialsReady: Answer;
  dataCollectionAccurate: Answer;
}

interface Scores {
  setup: number;
  behaviorAbsent: number;
  behaviorOccurs: number;
  overall: number;
  intervalsWithBehavior: number;
  intervalsWithoutBehavior: number;
  totalIntervals: number;
}

export interface DROFidelityData {
  date: string;
  client: string;
  btRbt: string;
  bcba: string;
  targetBehavior: string;
  intervalLength: string;
  designatedReinforcer: string;
  sessionSetup: SessionSetup;
  intervals: IntervalData[];
  scores: Scores;
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
  scoreBoxGreen: {
    backgroundColor: "#ecfdf5",
  },
  scoreBoxAmber: {
    backgroundColor: "#fffbeb",
  },
  scoreLabel: {
    fontSize: 7,
    color: "#64748b",
    marginBottom: 4,
    textTransform: "uppercase",
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
  scoreValueDefault: {
    color: "#475569",
  },
  scoreSubtext: {
    fontSize: 7,
    color: "#64748b",
    marginTop: 2,
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
  // Interval summary
  intervalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  intervalBox: {
    width: "18%",
    padding: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  intervalBoxGreen: {
    backgroundColor: "#ecfdf5",
    borderColor: "#a7f3d0",
  },
  intervalBoxAmber: {
    backgroundColor: "#fffbeb",
    borderColor: "#fde68a",
  },
  intervalBoxGray: {
    backgroundColor: "#f9fafb",
    borderColor: "#e5e7eb",
  },
  intervalNumber: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 2,
  },
  intervalStatus: {
    fontSize: 7,
    color: "#6b7280",
  },
  intervalNotes: {
    fontSize: 7,
    color: "#6b7280",
    marginTop: 3,
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
const getAnswerStyle = (answer: Answer) => {
  if (answer === "yes") return styles.answerYes;
  if (answer === "no") return styles.answerNo;
  if (answer === "na") return styles.answerNA;
  return styles.answerEmpty;
};

// Criteria row component
function CriteriaRowPDF({
  label,
  answer,
  isLast = false,
}: {
  label: string;
  answer: Answer;
  isLast?: boolean;
}) {
  return (
    <View style={isLast ? [styles.criteriaRow, styles.criteriaRowLast] : styles.criteriaRow}>
      <Text style={styles.criteriaLabel}>{label}</Text>
      <View style={[styles.criteriaAnswer, getAnswerStyle(answer)]}>
        <Text>{formatAnswer(answer)}</Text>
      </View>
    </View>
  );
}

// Main PDF Document
export function DROFidelityPDF({
  date,
  client,
  btRbt,
  bcba,
  targetBehavior,
  intervalLength,
  designatedReinforcer,
  sessionSetup,
  intervals,
  scores,
}: DROFidelityData) {
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
            <Text style={styles.title}>DRO Fidelity Checklist</Text>
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
            <Text style={styles.infoLabel}>Target Behavior</Text>
            <Text style={styles.infoValue}>{targetBehavior || "—"}</Text>
          </View>
          <View style={[styles.infoItem, styles.infoItemLast]}>
            <Text style={styles.infoLabel}>Interval Length</Text>
            <Text style={styles.infoValue}>{intervalLength || "—"}</Text>
          </View>
          <View style={[styles.infoItem, { width: "100%", borderRightWidth: 0, borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Designated Reinforcer</Text>
            <Text style={styles.infoValue}>{designatedReinforcer || "—"}</Text>
          </View>
        </View>

        {/* Score Summary */}
        <View style={styles.scoreSummary}>
          <View style={[styles.scoreBox, styles.scoreBoxOverall]}>
            <Text style={styles.scoreLabel}>Overall</Text>
            <Text style={[styles.scoreValue, styles.scoreValueDefault]}>
              {scores.overall}%
            </Text>
            <Text style={styles.scoreSubtext}>
              {scores.totalIntervals} intervals
            </Text>
          </View>
          <View style={[styles.scoreBox, styles.scoreBoxGreen]}>
            <Text style={styles.scoreLabel}>Behavior Absent</Text>
            <Text style={[styles.scoreValue, styles.scoreValueGreen]}>
              {scores.behaviorAbsent}%
            </Text>
            <Text style={styles.scoreSubtext}>
              {scores.intervalsWithoutBehavior} intervals
            </Text>
          </View>
          <View style={[styles.scoreBox, styles.scoreBoxAmber]}>
            <Text style={styles.scoreLabel}>Behavior Occurred</Text>
            <Text style={[styles.scoreValue, styles.scoreValueAmber]}>
              {scores.behaviorOccurs}%
            </Text>
            <Text style={styles.scoreSubtext}>
              {scores.intervalsWithBehavior} intervals
            </Text>
          </View>
        </View>

        {/* Session Setup */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Setup ({scores.setup}%)</Text>
          <View style={styles.criteriaTable}>
            <CriteriaRowPDF
              label="Timer set for appropriate interval length"
              answer={sessionSetup.timerSet}
            />
            <CriteriaRowPDF
              label="All materials/reinforcers set up prior to session"
              answer={sessionSetup.materialsReady}
            />
            <CriteriaRowPDF
              label="Collects accurate data on behavior occurrence/absence"
              answer={sessionSetup.dataCollectionAccurate}
              isLast
            />
          </View>
        </View>

        {/* Interval Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interval Observations</Text>
          <View style={styles.intervalGrid}>
            {intervals.map((interval, idx) => {
              const boxStyle =
                interval.behaviorOccurred === false
                  ? styles.intervalBoxGreen
                  : interval.behaviorOccurred === true
                    ? styles.intervalBoxAmber
                    : styles.intervalBoxGray;

              const status =
                interval.behaviorOccurred === false
                  ? "Absent"
                  : interval.behaviorOccurred === true
                    ? "Occurred"
                    : "Not recorded";

              return (
                <View key={idx} style={[styles.intervalBox, boxStyle]}>
                  <Text style={styles.intervalNumber}>Interval #{idx + 1}</Text>
                  <Text style={styles.intervalStatus}>{status}</Text>
                  {interval.notes && (
                    <Text style={styles.intervalNotes}>
                      {interval.notes.substring(0, 50)}
                      {interval.notes.length > 50 ? "..." : ""}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Behavior Absent Criteria (if any intervals) */}
        {scores.intervalsWithoutBehavior > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              When Behavior Absent ({scores.behaviorAbsent}%)
            </Text>
            <View style={styles.criteriaTable}>
              {intervals
                .filter((i) => i.behaviorOccurred === false)
                .map((interval, idx, arr) => (
                  <View key={idx}>
                    {idx > 0 && (
                      <View
                        style={{
                          borderTopWidth: 2,
                          borderTopColor: "#e2e8f0",
                          marginVertical: 2,
                        }}
                      />
                    )}
                    <View style={{ backgroundColor: "#f8fafc", padding: 4 }}>
                      <Text style={{ fontSize: 7, color: "#64748b", fontWeight: "bold" }}>
                        Interval #{intervals.indexOf(interval) + 1}
                      </Text>
                    </View>
                    <CriteriaRowPDF
                      label="Ended interval at correct time"
                      answer={interval.endedCorrectly}
                    />
                    <CriteriaRowPDF
                      label="Delivered designated reinforcer"
                      answer={interval.deliveredReinforcer}
                    />
                    <CriteriaRowPDF
                      label="Reinforcement delivered within acceptable time"
                      answer={interval.reinforcedTimely}
                    />
                    <CriteriaRowPDF
                      label="Reinforced other appropriate behaviors during interval"
                      answer={interval.reinforcedOtherBehaviors}
                      isLast={idx === arr.length - 1}
                    />
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* Behavior Occurred Criteria (if any intervals) */}
        {scores.intervalsWithBehavior > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              When Behavior Occurred ({scores.behaviorOccurs}%)
            </Text>
            <View style={styles.criteriaTable}>
              {intervals
                .filter((i) => i.behaviorOccurred === true)
                .map((interval, idx, arr) => (
                  <View key={idx}>
                    {idx > 0 && (
                      <View
                        style={{
                          borderTopWidth: 2,
                          borderTopColor: "#e2e8f0",
                          marginVertical: 2,
                        }}
                      />
                    )}
                    <View style={{ backgroundColor: "#fffbeb", padding: 4 }}>
                      <Text style={{ fontSize: 7, color: "#92400e", fontWeight: "bold" }}>
                        Interval #{intervals.indexOf(interval) + 1}
                      </Text>
                    </View>
                    <CriteriaRowPDF
                      label="Restarted interval immediately"
                      answer={interval.restartedImmediately}
                    />
                    <CriteriaRowPDF
                      label="Withheld reinforcement appropriately"
                      answer={interval.withheldReinforcement}
                    />
                    <CriteriaRowPDF
                      label="Did not provide attention for behavior"
                      answer={interval.noAttentionGiven}
                    />
                    <CriteriaRowPDF
                      label="Continued reinforcing other appropriate behaviors"
                      answer={interval.continuedReinforcingOthers}
                      isLast={idx === arr.length - 1}
                    />
                  </View>
                ))}
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
