"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Types
export interface TrialCriteria {
  setupMaterials: boolean;
  sdAttending: boolean;
  sdAsWritten: boolean;
  sdIntonation: boolean;
  responseCorrect: boolean | null;
  correctionTimely: boolean | null;
  correctionAttending: boolean | null;
  correctionAsWritten: boolean | null;
  correctionIntonation: boolean | null;
  reinforcerImmediate: boolean;
  reinforcerEffective: boolean;
  reinforcerDescriptive: boolean;
  reinforcerIntonation: boolean;
  reinforcerAffectPlay: boolean;
  pacingAdequate: boolean;
  extraSR: boolean;
  attentionForDisruptive: boolean;
}

export interface DTTMonitoringData {
  date: string;
  supervisee: string;
  client: string;
  program: string;
  monitor: string;
  trials: TrialCriteria[];
  scores: {
    setupMaterials: number;
    sd: number;
    correction: number;
    reinforcer: number;
    pacing: number;
    extraSR: number;
    attention: number;
    overall: number;
  };
}

// Colors
const colors = {
  primary: "#0D9488",
  primaryLight: "#CCFBF1",
  primaryDark: "#115E59",
  black: "#1E293B",
  gray: "#64748B",
  grayLight: "#F1F5F9",
  grayMedium: "#E2E8F0",
  grayDark: "#475569",
  white: "#FFFFFF",
  emerald: "#10B981",
  emeraldLight: "#D1FAE5",
  amber: "#F59E0B",
  amberLight: "#FEF3C7",
  rose: "#FB7185",
  roseLight: "#FFE4E6",
};

// Fixed width for trial columns
const TRIAL_COL_WIDTH = 35;
const CRITERIA_COL_WIDTH = 180;

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingBottom: 50,
    fontSize: 8,
    fontFamily: "Helvetica",
    backgroundColor: colors.white,
  },
  // Header Section
  headerContainer: {
    marginBottom: 15,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  logoText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  logoUpskill: {
    color: colors.primary,
  },
  logoABA: {
    color: colors.black,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.black,
    textAlign: "right",
  },
  formSubtitle: {
    fontSize: 8,
    color: colors.gray,
    textAlign: "right",
    marginTop: 2,
  },
  // Info Section - Card style
  infoCard: {
    backgroundColor: colors.grayLight,
    padding: 12,
    borderRadius: 4,
    marginBottom: 15,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoItem: {
    width: "33%",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: colors.gray,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 9,
    color: colors.black,
    fontWeight: "bold",
  },
  // Table Container - for centering
  tableContainer: {
    marginBottom: 15,
  },
  // Table Styles
  table: {
    borderWidth: 1,
    borderColor: colors.grayMedium,
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.grayMedium,
  },
  tableHeaderCriteria: {
    width: CRITERIA_COL_WIDTH,
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: colors.grayDark,
  },
  tableHeaderCell: {
    width: TRIAL_COL_WIDTH,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: colors.grayMedium,
    alignItems: "center",
    justifyContent: "center",
  },
  tableHeaderText: {
    fontSize: 8,
    fontWeight: "bold",
    color: colors.grayDark,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
    minHeight: 18,
  },
  tableRowAlt: {
    backgroundColor: "#FAFAFA",
  },
  tableCategoryRow: {
    flexDirection: "row",
    backgroundColor: colors.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayMedium,
    minHeight: 22,
  },
  categoryCell: {
    width: CRITERIA_COL_WIDTH,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: colors.primary,
    justifyContent: "center",
  },
  categoryText: {
    fontSize: 8,
    fontWeight: "bold",
    color: colors.primaryDark,
  },
  criteriaCell: {
    width: CRITERIA_COL_WIDTH,
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: colors.grayLight,
    justifyContent: "center",
  },
  criteriaText: {
    fontSize: 7,
    color: colors.black,
  },
  criteriaTextSmall: {
    fontSize: 6,
    color: colors.gray,
    marginTop: 1,
  },
  dataCell: {
    width: TRIAL_COL_WIDTH,
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: colors.grayLight,
    alignItems: "center",
    justifyContent: "center",
  },
  // Checkbox - Larger and cleaner
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1.5,
    borderColor: colors.grayDark,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxUnchecked: {
    backgroundColor: colors.white,
    borderColor: colors.grayMedium,
  },
  checkboxNA: {
    backgroundColor: colors.amberLight,
    borderColor: colors.amber,
  },
  checkmark: {
    fontSize: 8,
    color: colors.white,
    fontWeight: "bold",
  },
  naText: {
    fontSize: 6,
    color: colors.amber,
    fontWeight: "bold",
  },
  // Response indicator
  responseText: {
    fontSize: 9,
    fontWeight: "bold",
  },
  responseYes: {
    color: "#059669",
  },
  responseNo: {
    color: "#DC2626",
  },
  responseNA: {
    color: colors.gray,
  },
  // Scores Section
  scoresSection: {
    marginBottom: 10,
  },
  scoresTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 8,
  },
  scoresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  scoreCard: {
    width: "23%",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  scoreCardGreen: {
    backgroundColor: colors.emeraldLight,
  },
  scoreCardAmber: {
    backgroundColor: colors.amberLight,
  },
  scoreCardRed: {
    backgroundColor: colors.roseLight,
  },
  scoreCardPrimary: {
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  scoreValueGreen: {
    color: "#065F46",
  },
  scoreValueAmber: {
    color: "#92400E",
  },
  scoreValueRed: {
    color: "#9F1239",
  },
  scoreValuePrimary: {
    color: colors.primary,
  },
  scoreLabel: {
    fontSize: 7,
    color: colors.grayDark,
    marginTop: 2,
    textAlign: "center",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 15,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.grayMedium,
  },
  footerLogo: {
    fontSize: 9,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 7,
    color: colors.gray,
    marginLeft: 6,
  },
  // Trial count badge
  trialBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  trialBadgeText: {
    fontSize: 7,
    color: colors.white,
    fontWeight: "bold",
  },
});

// Checkbox component
function Checkbox({ checked, isNA = false }: { checked: boolean | null; isNA?: boolean }) {
  if (checked === null || isNA) {
    return (
      <View style={[styles.checkbox, styles.checkboxNA]}>
        <Text style={styles.naText}>-</Text>
      </View>
    );
  }
  return (
    <View style={[styles.checkbox, checked ? styles.checkboxChecked : styles.checkboxUnchecked]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
  );
}

// Score Card component
function ScoreCard({
  label,
  score,
  isOverall = false,
}: {
  label: string;
  score: number;
  isOverall?: boolean;
}) {
  const getScoreStyle = () => {
    if (isOverall) return { card: styles.scoreCardPrimary, value: styles.scoreValuePrimary };
    if (score >= 85) return { card: styles.scoreCardGreen, value: styles.scoreValueGreen };
    if (score >= 60) return { card: styles.scoreCardAmber, value: styles.scoreValueAmber };
    return { card: styles.scoreCardRed, value: styles.scoreValueRed };
  };

  const style = getScoreStyle();

  return (
    <View style={[styles.scoreCard, style.card]}>
      <Text style={[styles.scoreValue, style.value]}>{score}%</Text>
      <Text style={styles.scoreLabel}>{label}</Text>
    </View>
  );
}

// Criteria row definitions
const CRITERIA_ROWS = [
  { category: "Set up of Materials", criteria: "Materials match program sheet", field: "setupMaterials" as const },
  { category: "SD (Discriminative Stimulus)", criteria: "A. Attending", field: "sdAttending" as const },
  { criteria: "B. SD as written", field: "sdAsWritten" as const },
  { criteria: "C. Intonation", field: "sdIntonation" as const },
  { category: "Response", criteria: "Response Correct?", field: "responseCorrect" as const, isYesNo: true },
  { category: "Correction Procedure", criteria: "A. Timely", field: "correctionTimely" as const, nullable: true },
  { criteria: "B. Attending", field: "correctionAttending" as const, nullable: true },
  { criteria: "C. As written", field: "correctionAsWritten" as const, nullable: true },
  { criteria: "D. Intonation", field: "correctionIntonation" as const, nullable: true },
  { category: "Reinforcer (SR+)", criteria: "A. Immediate", field: "reinforcerImmediate" as const },
  { criteria: "B. Effective", field: "reinforcerEffective" as const },
  { criteria: "C. Descriptive", field: "reinforcerDescriptive" as const },
  { criteria: "D. Intonation", field: "reinforcerIntonation" as const },
  { criteria: "E. Affect/Play", field: "reinforcerAffectPlay" as const },
  { category: "Pacing & Other", criteria: "Pacing Adequate", field: "pacingAdequate" as const },
  { criteria: "Extra SR", field: "extraSR" as const },
  { criteria: "Attention for disruptive behavior", field: "attentionForDisruptive" as const },
];

// Main PDF Document
export function DTTMonitoringPDF({
  date,
  supervisee,
  client,
  program,
  monitor,
  trials,
  scores,
}: DTTMonitoringData) {
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTop}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.logoText}>
                <Text style={styles.logoUpskill}>Upskill</Text>
                <Text style={styles.logoABA}>ABA</Text>
              </Text>
              <View style={styles.trialBadge}>
                <Text style={styles.trialBadgeText}>{trials.length} Trial{trials.length !== 1 ? "s" : ""}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.formTitle}>DTT Session Monitoring Form</Text>
              <Text style={styles.formSubtitle}>Discrete Trial Teaching Fidelity Assessment</Text>
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Date</Text>
                <Text style={styles.infoValue}>{date || "—"}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Supervisee</Text>
                <Text style={styles.infoValue}>{supervisee || "—"}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Client</Text>
                <Text style={styles.infoValue}>{client || "—"}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Program</Text>
                <Text style={styles.infoValue}>{program || "—"}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Monitor</Text>
                <Text style={styles.infoValue}>{monitor || "—"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Trial Monitoring Table */}
        <View style={styles.tableContainer}>
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.tableHeader}>
              <View style={styles.tableHeaderCriteria}>
                <Text style={[styles.tableHeaderText, { textAlign: "left" }]}>Criteria</Text>
              </View>
              {trials.map((_, i) => (
                <View key={i} style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>{i + 1}</Text>
                </View>
              ))}
            </View>

            {/* Data Rows */}
            {CRITERIA_ROWS.map((row, rowIndex) => (
              <View
                key={rowIndex}
                style={[
                  row.category ? styles.tableCategoryRow : styles.tableRow,
                  !row.category && rowIndex % 2 === 1 ? styles.tableRowAlt : {},
                ]}
              >
                <View style={row.category ? styles.categoryCell : styles.criteriaCell}>
                  {row.category && <Text style={styles.categoryText}>{row.category}</Text>}
                  <Text style={row.category ? styles.criteriaTextSmall : styles.criteriaText}>
                    {row.criteria}
                  </Text>
                </View>
                {trials.map((trial, trialIndex) => {
                  const value = trial[row.field];
                  const isNullable = row.nullable && trial.responseCorrect !== false;

                  return (
                    <View key={trialIndex} style={styles.dataCell}>
                      {row.isYesNo ? (
                        <Text
                          style={[
                            styles.responseText,
                            value === true
                              ? styles.responseYes
                              : value === false
                                ? styles.responseNo
                                : styles.responseNA,
                          ]}
                        >
                          {value === true ? "Y" : value === false ? "N" : "—"}
                        </Text>
                      ) : (
                        <Checkbox checked={value as boolean | null} isNA={isNullable} />
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        {/* Scores Section */}
        <View style={styles.scoresSection}>
          <Text style={styles.scoresTitle}>Fidelity Scores</Text>
          <View style={styles.scoresGrid}>
            <ScoreCard label="Setup Materials" score={scores.setupMaterials} />
            <ScoreCard label="SD Delivery" score={scores.sd} />
            <ScoreCard label="Correction" score={scores.correction} />
            <ScoreCard label="Reinforcer" score={scores.reinforcer} />
            <ScoreCard label="Pacing" score={scores.pacing} />
            <ScoreCard label="Extra SR" score={scores.extraSR} />
            <ScoreCard label="Attention" score={scores.attention} />
            <ScoreCard label="OVERALL" score={scores.overall} isOverall />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.footerLogo}>
              <Text style={styles.logoUpskill}>Upskill</Text>
              <Text style={styles.logoABA}>ABA</Text>
            </Text>
            <Text style={styles.footerText}>| DTT Session Monitoring Form</Text>
          </View>
          <Text style={styles.footerText}>
            Generated: {new Date().toLocaleDateString()}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
