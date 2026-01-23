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

export interface CriteriaItem {
  id: string;
  label: string;
  answer: Answer;
}

export interface SelfManagementFidelityData {
  date: string;
  client: string;
  btRbt: string;
  bcba: string;
  criteria: CriteriaItem[];
  score: number;
  totalAnswered: number;
  totalYes: number;
}

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  // Header
  headerContainer: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logoUpskill: {
    color: "#0d9488",
  },
  logoABA: {
    color: "#64748b",
  },
  title: {
    fontSize: 16,
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
    marginBottom: 20,
  },
  infoItem: {
    width: "50%",
    padding: 10,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },
  infoItemLast: {
    borderRightWidth: 0,
  },
  infoItemBottom: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 11,
    color: "#1e293b",
    fontWeight: "medium",
  },
  // Score summary
  scoreSummary: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  scoreBox: {
    flex: 1,
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
  },
  scoreBoxPrimary: {
    backgroundColor: "#f0fdfa",
    borderWidth: 1,
    borderColor: "#99f6e4",
  },
  scoreBoxSecondary: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  scoreLabel: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  scoreValuePrimary: {
    color: "#0d9488",
  },
  scoreValueSecondary: {
    color: "#475569",
  },
  scoreSubtext: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 3,
  },
  // Table
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: "#0d9488",
  },
  table: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableHeaderCell: {
    padding: 10,
    fontWeight: "bold",
    fontSize: 9,
    color: "#374151",
  },
  tableHeaderCriteria: {
    flex: 1,
  },
  tableHeaderAnswer: {
    width: 70,
    textAlign: "center",
    borderLeftWidth: 1,
    borderLeftColor: "#e2e8f0",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableCellCriteria: {
    flex: 1,
    padding: 10,
    fontSize: 9,
    color: "#374151",
  },
  tableCellAnswer: {
    width: 70,
    padding: 10,
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
    borderLeftWidth: 1,
    borderLeftColor: "#e2e8f0",
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
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#9ca3af",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
  },
});

// Helper to format answer
const formatAnswer = (answer: Answer): string => {
  if (answer === "yes") return "Yes";
  if (answer === "no") return "No";
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

// Main PDF Document
export function SelfManagementFidelityPDF({
  date,
  client,
  btRbt,
  bcba,
  criteria,
  score,
  totalAnswered,
  totalYes,
}: SelfManagementFidelityData) {
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
            <Text style={styles.title}>Self-Management Fidelity Checklist</Text>
          </View>
        </View>

        {/* Session Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{date || "—"}</Text>
          </View>
          <View style={[styles.infoItem, styles.infoItemLast]}>
            <Text style={styles.infoLabel}>Client</Text>
            <Text style={styles.infoValue}>{client || "—"}</Text>
          </View>
          <View style={[styles.infoItem, styles.infoItemBottom]}>
            <Text style={styles.infoLabel}>BT/RBT</Text>
            <Text style={styles.infoValue}>{btRbt || "—"}</Text>
          </View>
          <View style={[styles.infoItem, styles.infoItemLast, styles.infoItemBottom]}>
            <Text style={styles.infoLabel}>BCBA</Text>
            <Text style={styles.infoValue}>{bcba || "—"}</Text>
          </View>
        </View>

        {/* Score Summary */}
        <View style={styles.scoreSummary}>
          <View style={[styles.scoreBox, styles.scoreBoxPrimary]}>
            <Text style={styles.scoreLabel}>Fidelity Score</Text>
            <Text style={[styles.scoreValue, styles.scoreValuePrimary]}>
              {score}%
            </Text>
            <Text style={styles.scoreSubtext}>
              {totalYes} of {totalAnswered} criteria met
            </Text>
          </View>
          <View style={[styles.scoreBox, styles.scoreBoxSecondary]}>
            <Text style={styles.scoreLabel}>Items Assessed</Text>
            <Text style={[styles.scoreValue, styles.scoreValueSecondary]}>
              {totalAnswered}
            </Text>
            <Text style={styles.scoreSubtext}>
              of {criteria.length} total items
            </Text>
          </View>
        </View>

        {/* Implementation Criteria Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Implementation Criteria</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.tableHeaderCriteria]}>
                Criteria
              </Text>
              <Text style={[styles.tableHeaderCell, styles.tableHeaderAnswer]}>
                Response
              </Text>
            </View>

            {/* Table Rows */}
            {criteria.map((item, idx) => (
              <View
                key={item.id}
                style={
                  idx === criteria.length - 1
                    ? [styles.tableRow, styles.tableRowLast]
                    : styles.tableRow
                }
              >
                <Text style={styles.tableCellCriteria}>{item.label}</Text>
                <View style={[styles.tableCellAnswer, getAnswerStyle(item.answer)]}>
                  <Text>{formatAnswer(item.answer)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Upskill ABA</Text>
          <Text>
            Scoring: (Yes / total Yes+No responses) × 100 = {score}%
          </Text>
        </View>
      </Page>
    </Document>
  );
}
