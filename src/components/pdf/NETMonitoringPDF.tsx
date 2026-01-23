"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { format } from "date-fns";

// Types
type Phase = "initial" | "remediation" | "reassessment";

interface PhaseCriteria {
  areaIsNeat: boolean;
  materialsReady: boolean;
  beginsPromptly: boolean;
  followsMO: boolean;
  beginsWithManding: boolean;
  appropriateEnthusiasm: boolean;
  mixesVerbalOperants: boolean;
  usesErrorlessTeaching: boolean;
  correctResponseRate: boolean;
  taughtAppropriateTargets: boolean;
  exposedToNewActivities: boolean;
  varietyOfActivities: boolean;
  variesProcedures: boolean;
  reinforcerCompetes: boolean;
  pairsSocialReinforcement: boolean;
  implementsBehaviorReduction: boolean;
  maintainsComposure: boolean;
  recordsDataAccurately: boolean;
}

interface PhaseData {
  date: Date | undefined;
  criteria: PhaseCriteria;
  recommendation: string;
}

export interface NETMonitoringData {
  supervisee: string;
  client: string;
  observer: string;
  phases: Record<Phase, PhaseData>;
  responsesPerMinute: string;
  additionalComments: string;
  targets: string[];
  scores: Record<Phase, { overall: number; areas: Record<string, { checked: number; total: number }> }>;
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
  blue: "#3B82F6",
  blueLight: "#DBEAFE",
  rose: "#FB7185",
  roseLight: "#FFE4E6",
};

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingBottom: 50,
    fontSize: 8,
    fontFamily: "Helvetica",
    backgroundColor: colors.white,
  },
  // Header
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
  // Info Card
  infoCard: {
    backgroundColor: colors.grayLight,
    padding: 10,
    borderRadius: 4,
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoItem: {
    width: "33%",
    marginBottom: 4,
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
  // Table
  table: {
    borderWidth: 1,
    borderColor: colors.grayMedium,
    borderRadius: 4,
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.grayMedium,
  },
  tableHeaderCell: {
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: colors.grayDark,
    alignItems: "center",
    justifyContent: "center",
  },
  tableHeaderCriteria: {
    width: 200,
  },
  tableHeaderPhase: {
    width: 80,
  },
  tableHeaderText: {
    fontSize: 7,
    fontWeight: "bold",
    color: colors.grayDark,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
    minHeight: 16,
  },
  tableRowAlt: {
    backgroundColor: "#FAFAFA",
  },
  tableCategoryRow: {
    flexDirection: "row",
    backgroundColor: colors.primaryLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayMedium,
  },
  categoryCell: {
    width: 200,
    padding: 4,
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
    width: 200,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: colors.grayLight,
    justifyContent: "center",
  },
  criteriaText: {
    fontSize: 7,
    color: colors.black,
  },
  dataCell: {
    width: 80,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: colors.grayLight,
    alignItems: "center",
    justifyContent: "center",
  },
  // Checkbox
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1.5,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxUnchecked: {
    backgroundColor: colors.white,
    borderColor: colors.grayMedium,
  },
  checkmark: {
    fontSize: 8,
    color: colors.white,
    fontWeight: "bold",
  },
  // Scores
  scoresSection: {
    marginBottom: 12,
  },
  scoresTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 6,
  },
  scoresGrid: {
    flexDirection: "row",
    gap: 8,
  },
  scoreCard: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  scoreCardInitial: {
    backgroundColor: colors.blueLight,
  },
  scoreCardRemediation: {
    backgroundColor: colors.amberLight,
  },
  scoreCardReassessment: {
    backgroundColor: colors.emeraldLight,
  },
  scoreLabel: {
    fontSize: 7,
    color: colors.grayDark,
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  scoreValueBlue: {
    color: colors.blue,
  },
  scoreValueAmber: {
    color: colors.amber,
  },
  scoreValueGreen: {
    color: colors.emerald,
  },
  // Additional sections
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 4,
  },
  additionalCard: {
    backgroundColor: colors.grayLight,
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  targetsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  targetItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  targetNumber: {
    fontSize: 7,
    color: colors.gray,
    width: 12,
  },
  targetText: {
    fontSize: 8,
    color: colors.black,
    flex: 1,
  },
  commentsText: {
    fontSize: 8,
    color: colors.black,
    lineHeight: 1.4,
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
});

// Checkbox component
function Checkbox({ checked }: { checked: boolean }) {
  return (
    <View style={[styles.checkbox, checked ? styles.checkboxChecked : styles.checkboxUnchecked]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
  );
}

// Criteria definitions
const CRITERIA_AREAS = [
  {
    id: "organization",
    title: "Organization",
    items: [
      { field: "areaIsNeat" as const, label: "Instructional area is neat and clean" },
      { field: "materialsReady" as const, label: "All materials needed are organized and ready" },
      { field: "beginsPromptly" as const, label: "Begins promptly/avoids wasting time" },
    ],
  },
  {
    id: "instructional",
    title: "Instructional Delivery",
    items: [
      { field: "followsMO" as const, label: "Follows MO of learner" },
      { field: "beginsWithManding" as const, label: "Begins NET session with manding" },
      { field: "appropriateEnthusiasm" as const, label: "Appropriate level of enthusiasm" },
      { field: "mixesVerbalOperants" as const, label: "Mixes verbal operants" },
      { field: "usesErrorlessTeaching" as const, label: "Uses errorless teaching" },
      { field: "correctResponseRate" as const, label: "Averages correct number of responses per min" },
      { field: "taughtAppropriateTargets" as const, label: "Taught appropriate targets" },
      { field: "exposedToNewActivities" as const, label: "Exposed learner to new activities" },
      { field: "varietyOfActivities" as const, label: "Uses appropriate variety of activities" },
      { field: "variesProcedures" as const, label: "Varies elements of teaching procedures" },
    ],
  },
  {
    id: "reinforcement",
    title: "Reinforcement",
    items: [
      { field: "reinforcerCompetes" as const, label: "SR+ reinforcer competes with Sr-/SrA+" },
      { field: "pairsSocialReinforcement" as const, label: "Pairs social reinforcement with tangible items" },
    ],
  },
  {
    id: "behavior",
    title: "Behavior Management/Data",
    items: [
      { field: "implementsBehaviorReduction" as const, label: "Correctly implements behavior reduction procedures" },
      { field: "maintainsComposure" as const, label: "Maintains composure during behavior reduction" },
      { field: "recordsDataAccurately" as const, label: "Accurately records behavior data/ABC" },
    ],
  },
];

// Main PDF Document
export function NETMonitoringPDF({
  supervisee,
  client,
  observer,
  phases,
  responsesPerMinute,
  additionalComments,
  targets,
  scores,
}: NETMonitoringData) {
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
              <Text style={styles.formTitle}>NET Session Monitoring Form</Text>
              <Text style={styles.formSubtitle}>Natural Environment Teaching Competency Assessment</Text>
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Staff/Supervisee</Text>
                <Text style={styles.infoValue}>{supervisee || "—"}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Client</Text>
                <Text style={styles.infoValue}>{client || "—"}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Observer</Text>
                <Text style={styles.infoValue}>{observer || "—"}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Initial Date</Text>
                <Text style={styles.infoValue}>
                  {phases.initial.date ? format(phases.initial.date, "MMM d, yyyy") : "—"}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Remediation Date</Text>
                <Text style={styles.infoValue}>
                  {phases.remediation.date ? format(phases.remediation.date, "MMM d, yyyy") : "—"}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Re-Assessment Date</Text>
                <Text style={styles.infoValue}>
                  {phases.reassessment.date ? format(phases.reassessment.date, "MMM d, yyyy") : "—"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Score Summary */}
        <View style={styles.scoresSection}>
          <Text style={styles.scoresTitle}>Competency Scores</Text>
          <View style={styles.scoresGrid}>
            <View style={[styles.scoreCard, styles.scoreCardInitial]}>
              <Text style={styles.scoreLabel}>Initial</Text>
              <Text style={[styles.scoreValue, styles.scoreValueBlue]}>{scores.initial.overall}%</Text>
            </View>
            <View style={[styles.scoreCard, styles.scoreCardRemediation]}>
              <Text style={styles.scoreLabel}>Remediation</Text>
              <Text style={[styles.scoreValue, styles.scoreValueAmber]}>{scores.remediation.overall}%</Text>
            </View>
            <View style={[styles.scoreCard, styles.scoreCardReassessment]}>
              <Text style={styles.scoreLabel}>Re-Assessment</Text>
              <Text style={[styles.scoreValue, styles.scoreValueGreen]}>{scores.reassessment.overall}%</Text>
            </View>
          </View>
        </View>

        {/* Criteria Table */}
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <View style={[styles.tableHeaderCell, styles.tableHeaderCriteria]}>
              <Text style={[styles.tableHeaderText, { textAlign: "left" }]}>Criteria</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.tableHeaderPhase]}>
              <Text style={styles.tableHeaderText}>Initial</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.tableHeaderPhase]}>
              <Text style={styles.tableHeaderText}>Remediation</Text>
            </View>
            <View style={[styles.tableHeaderCell, styles.tableHeaderPhase, { borderRightWidth: 0 }]}>
              <Text style={styles.tableHeaderText}>Re-Assessment</Text>
            </View>
          </View>

          {/* Criteria Rows */}
          {CRITERIA_AREAS.map((area) => (
            <View key={area.id}>
              {/* Category Header */}
              <View style={styles.tableCategoryRow}>
                <View style={styles.categoryCell}>
                  <Text style={styles.categoryText}>{area.title}</Text>
                </View>
                <View style={styles.dataCell} />
                <View style={styles.dataCell} />
                <View style={[styles.dataCell, { borderRightWidth: 0 }]} />
              </View>
              {/* Items */}
              {area.items.map((item, itemIndex) => (
                <View
                  key={item.field}
                  style={[
                    styles.tableRow,
                    itemIndex % 2 === 1 ? styles.tableRowAlt : {},
                  ]}
                >
                  <View style={styles.criteriaCell}>
                    <Text style={styles.criteriaText}>{item.label}</Text>
                  </View>
                  <View style={styles.dataCell}>
                    <Checkbox checked={phases.initial.criteria[item.field]} />
                  </View>
                  <View style={styles.dataCell}>
                    <Checkbox checked={phases.remediation.criteria[item.field]} />
                  </View>
                  <View style={[styles.dataCell, { borderRightWidth: 0 }]}>
                    <Checkbox checked={phases.reassessment.criteria[item.field]} />
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Additional Info */}
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
          {/* Targets */}
          <View style={[styles.additionalCard, { flex: 1 }]}>
            <Text style={styles.sectionTitle}>Targets</Text>
            <View style={styles.targetsGrid}>
              {targets.length > 0 ? (
                targets.map((target, index) => (
                  <View key={index} style={styles.targetItem}>
                    <Text style={styles.targetNumber}>{index + 1}.</Text>
                    <Text style={styles.targetText}>{target || "—"}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.commentsText}>No targets specified</Text>
              )}
            </View>
          </View>

          {/* RPM & Comments */}
          <View style={[styles.additionalCard, { flex: 1 }]}>
            <Text style={styles.sectionTitle}>
              Responses per Minute: {responsesPerMinute || "—"}
            </Text>
            {additionalComments && (
              <View style={{ marginTop: 6 }}>
                <Text style={[styles.sectionTitle, { marginBottom: 2 }]}>Comments:</Text>
                <Text style={styles.commentsText}>{additionalComments}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Recommendations */}
        {(phases.initial.recommendation || phases.remediation.recommendation || phases.reassessment.recommendation) && (
          <View style={styles.additionalCard}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            {phases.initial.recommendation && (
              <View style={{ marginBottom: 4 }}>
                <Text style={{ fontSize: 7, color: colors.gray }}>Initial:</Text>
                <Text style={styles.commentsText}>{phases.initial.recommendation}</Text>
              </View>
            )}
            {phases.remediation.recommendation && (
              <View style={{ marginBottom: 4 }}>
                <Text style={{ fontSize: 7, color: colors.gray }}>Remediation:</Text>
                <Text style={styles.commentsText}>{phases.remediation.recommendation}</Text>
              </View>
            )}
            {phases.reassessment.recommendation && (
              <View>
                <Text style={{ fontSize: 7, color: colors.gray }}>Re-Assessment:</Text>
                <Text style={styles.commentsText}>{phases.reassessment.recommendation}</Text>
              </View>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.footerLogo}>
              <Text style={styles.logoUpskill}>Upskill</Text>
              <Text style={styles.logoABA}>ABA</Text>
            </Text>
            <Text style={styles.footerText}>| NET Session Monitoring Form</Text>
          </View>
          <Text style={styles.footerText}>
            Generated: {new Date().toLocaleDateString()}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
