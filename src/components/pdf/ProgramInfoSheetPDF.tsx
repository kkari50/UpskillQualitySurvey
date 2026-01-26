"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type {
  EvaluationAnswer,
  EvaluationItem,
  ProgramComponent,
  ProgramInfoSheetData,
} from "./program-info-sheet-data";

// Re-export types for backwards compatibility
export type {
  EvaluationAnswer,
  EvaluationItem,
  ProgramComponent,
  ProgramInfoSheetData,
} from "./program-info-sheet-data";

// Colors
const colors = {
  primary: "#0D9488",
  primaryLight: "#CCFBF1",
  primaryDark: "#115E59",
  black: "#1E293B",
  gray: "#64748B",
  grayLight: "#E2E8F0",
  grayDark: "#475569",
  white: "#FFFFFF",
  emerald: "#10B981",
  emeraldLight: "#D1FAE5",
  amber: "#F59E0B",
  amberLight: "#FEF3C7",
  rose: "#FB7185",
  roseLight: "#FFE4E6",
};

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 25,
    paddingBottom: 50,
    fontSize: 8,
    fontFamily: "Helvetica",
    backgroundColor: colors.white,
  },
  // Header Section
  headerContainer: {
    marginBottom: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  logoImage: {
    width: 80,
    height: 24,
  },
  logoText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  logoUpskill: {
    color: colors.primary,
  },
  logoABA: {
    color: colors.black,
  },
  formTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.black,
    textAlign: "right",
  },
  formSubtitle: {
    fontSize: 7,
    color: colors.gray,
    textAlign: "right",
    marginTop: 2,
  },
  // Info Fields
  infoSection: {
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
    paddingTop: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  infoField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: colors.grayDark,
    width: 60,
  },
  infoLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    height: 14,
    marginLeft: 4,
    paddingBottom: 2,
  },
  infoValue: {
    fontSize: 8,
    color: colors.black,
  },
  // Table Styles
  table: {
    borderWidth: 1,
    borderColor: colors.grayLight,
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.grayLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  tableHeaderCell: {
    fontSize: 6,
    fontWeight: "bold",
    color: colors.grayDark,
    textTransform: "uppercase",
    padding: 3,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
    minHeight: 20,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableRowAlt: {
    backgroundColor: "#F8FAFC",
  },
  criteriaCell: {
    flex: 1,
    padding: 3,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: colors.grayLight,
  },
  answerCell: {
    width: 38,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: colors.grayLight,
  },
  commentCell: {
    width: 80,
    padding: 3,
    justifyContent: "center",
  },
  cellText: {
    fontSize: 7,
    color: colors.black,
    lineHeight: 1.3,
  },
  cellTextSmall: {
    fontSize: 6,
    color: colors.gray,
    lineHeight: 1.2,
  },
  // Checkbox styles
  checkbox: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: colors.grayDark,
    marginRight: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    fontSize: 6,
    color: colors.white,
    fontWeight: "bold",
  },
  // Sub-checklist
  subChecklistContainer: {
    marginLeft: 8,
    marginTop: 2,
  },
  subChecklistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  subChecklistText: {
    fontSize: 6,
    color: colors.grayDark,
  },
  // Answer badges
  answerBadge: {
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 2,
  },
  answerYes: {
    backgroundColor: colors.emeraldLight,
  },
  answerNo: {
    backgroundColor: colors.roseLight,
  },
  answerNA: {
    backgroundColor: colors.amberLight,
  },
  answerText: {
    fontSize: 6,
    fontWeight: "bold",
    textAlign: "center",
  },
  answerTextYes: {
    color: "#065F46",
  },
  answerTextNo: {
    color: "#9F1239",
  },
  answerTextNA: {
    color: "#92400E",
  },
  // Score Section
  scoreSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 8,
    padding: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: 3,
  },
  scoreLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: colors.primaryDark,
    marginRight: 8,
  },
  scoreValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.primary,
  },
  // Skills Section
  skillsSection: {
    marginBottom: 8,
  },
  skillsHeader: {
    fontSize: 8,
    fontWeight: "bold",
    color: colors.grayDark,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  skillsBox: {
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 3,
    padding: 4,
  },
  skillItem: {
    flexDirection: "row",
    marginBottom: 3,
  },
  skillNumber: {
    fontSize: 7,
    color: colors.gray,
    width: 12,
  },
  skillLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
    height: 12,
  },
  skillText: {
    fontSize: 7,
    color: colors.black,
  },
  // Signature Section
  signatureSection: {
    marginTop: 8,
  },
  signatureRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  signatureField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  signatureLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: colors.grayDark,
    width: 80,
  },
  signatureLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    height: 16,
    marginRight: 20,
  },
  signatureValue: {
    fontSize: 8,
    color: colors.black,
    fontStyle: "italic",
  },
  dateLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: colors.grayDark,
    width: 30,
  },
  dateLine: {
    width: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    height: 16,
  },
  dateValue: {
    fontSize: 8,
    color: colors.black,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 15,
    left: 25,
    right: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerLogo: {
    fontSize: 8,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 7,
    color: colors.gray,
    marginLeft: 4,
  },
});

// Helper to get answer label
function getAnswerLabel(answer: EvaluationAnswer): string {
  if (answer === "yes") return "Yes";
  if (answer === "no") return "No";
  if (answer === "na") return "N/A";
  return "";
}

// Checkbox component
function Checkbox({ checked }: { checked: boolean }) {
  return (
    <View style={[styles.checkbox, checked ? styles.checkboxChecked : {}]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
  );
}

// Answer Badge component
function AnswerBadge({ answer }: { answer: EvaluationAnswer }) {
  if (!answer) return <Text style={styles.cellTextSmall}>-</Text>;

  const badgeStyle =
    answer === "yes"
      ? styles.answerYes
      : answer === "no"
        ? styles.answerNo
        : styles.answerNA;

  const textStyle =
    answer === "yes"
      ? styles.answerTextYes
      : answer === "no"
        ? styles.answerTextNo
        : styles.answerTextNA;

  return (
    <View style={[styles.answerBadge, badgeStyle]}>
      <Text style={[styles.answerText, textStyle]}>{getAnswerLabel(answer)}</Text>
    </View>
  );
}

// Evaluation Row component
function EvaluationRow({
  item,
  index,
  isLast,
  programComponents,
}: {
  item: EvaluationItem;
  index: number;
  isLast: boolean;
  programComponents?: ProgramComponent[];
}) {
  return (
    <View
      style={[
        styles.tableRow,
        isLast ? styles.tableRowLast : {},
        index % 2 === 1 ? styles.tableRowAlt : {},
      ]}
    >
      <View style={styles.criteriaCell}>
        <Text style={styles.cellText}>{item.text}</Text>
        {item.hasSubChecklist && programComponents && (
          <View style={styles.subChecklistContainer}>
            {programComponents.map((comp) => (
              <View key={comp.id} style={styles.subChecklistItem}>
                <Checkbox checked={comp.checked} />
                <Text style={styles.subChecklistText}>{comp.label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <View style={styles.answerCell}>
        <AnswerBadge answer={item.answer} />
      </View>
      <View style={styles.commentCell}>
        <Text style={styles.cellTextSmall}>{item.comment || "-"}</Text>
      </View>
    </View>
  );
}

// Main PDF Document
export function ProgramInfoSheetPDF({ data }: { data: ProgramInfoSheetData }) {
  // Calculate score (count of "yes" answers)
  const yesCount = data.evaluationItems.filter((item) => item.answer === "yes").length;
  const percentage = Math.round((yesCount / 10) * 100);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTop}>
            {data.logoUrl ? (
              // eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image doesn't support alt
              <Image src={data.logoUrl} style={styles.logoImage} />
            ) : (
              <Text style={styles.logoText}>
                <Text style={styles.logoUpskill}>Upskill</Text>
                <Text style={styles.logoABA}>ABA</Text>
              </Text>
            )}
            <View>
              <Text style={styles.formTitle}>Program Evaluation Feedback</Text>
              <Text style={styles.formSubtitle}>Skill Acquisition Program Assessment</Text>
            </View>
          </View>

          {/* Info Fields */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <View style={styles.infoField}>
                <Text style={styles.infoLabel}>Supervisee:</Text>
                <View style={styles.infoLine}>
                  <Text style={styles.infoValue}>{data.supervisee}</Text>
                </View>
              </View>
              <View style={[styles.infoField, { marginLeft: 12 }]}>
                <Text style={styles.infoLabel}>Overseeing BCBA:</Text>
                <View style={styles.infoLine}>
                  <Text style={styles.infoValue}>{data.overseeingBCBA}</Text>
                </View>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoField}>
                <Text style={styles.infoLabel}>Date Start:</Text>
                <View style={styles.infoLine}>
                  <Text style={styles.infoValue}>{data.dateStart}</Text>
                </View>
              </View>
              <View style={[styles.infoField, { marginLeft: 12 }]}>
                <Text style={styles.infoLabel}>Date End:</Text>
                <View style={styles.infoLine}>
                  <Text style={styles.infoValue}>{data.dateEnd}</Text>
                </View>
              </View>
              <View style={[styles.infoField, { marginLeft: 12 }]}>
                <Text style={styles.infoLabel}>Program Name:</Text>
                <View style={styles.infoLine}>
                  <Text style={styles.infoValue}>{data.programName}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Evaluation Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={[styles.criteriaCell, { borderRightWidth: 0 }]}>
              <Text style={[styles.tableHeaderCell, { textAlign: "left" }]}>Evaluation Criteria</Text>
            </View>
            <View style={[styles.answerCell, { borderRightWidth: 0 }]}>
              <Text style={styles.tableHeaderCell}>Answer</Text>
            </View>
            <View style={styles.commentCell}>
              <Text style={[styles.tableHeaderCell, { textAlign: "left" }]}>Comments</Text>
            </View>
          </View>
          {data.evaluationItems.map((item, index) => (
            <EvaluationRow
              key={item.id}
              item={item}
              index={index}
              isLast={index === data.evaluationItems.length - 1}
              programComponents={item.hasSubChecklist ? data.programComponents : undefined}
            />
          ))}
        </View>

        {/* Score Section */}
        <View style={styles.scoreSection}>
          <Text style={styles.scoreLabel}>Score:</Text>
          <Text style={styles.scoreValue}>
            {yesCount}/10 = {percentage}%
          </Text>
        </View>

        {/* Skills to Maintain */}
        <View style={styles.skillsSection}>
          <Text style={styles.skillsHeader}>
            Skills to Maintain and/or Skills Improved/Changed from Last Evaluation
          </Text>
          <View style={styles.skillsBox}>
            {data.skillsToMaintain.map((skill, index) => (
              <View key={index} style={styles.skillItem}>
                <Text style={styles.skillNumber}>{index + 1}.</Text>
                {skill ? (
                  <Text style={styles.skillText}>{skill}</Text>
                ) : (
                  <View style={styles.skillLine} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Skills to Work On */}
        <View style={styles.skillsSection}>
          <Text style={styles.skillsHeader}>Skills to Work On</Text>
          <View style={styles.skillsBox}>
            {data.skillsToWorkOn.map((skill, index) => (
              <View key={index} style={styles.skillItem}>
                <Text style={styles.skillNumber}>{index + 1}.</Text>
                {skill ? (
                  <Text style={styles.skillText}>{skill}</Text>
                ) : (
                  <View style={styles.skillLine} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureRow}>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>BCBA Signature:</Text>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureValue}>{data.bcbaSignature}</Text>
              </View>
            </View>
            <View style={styles.signatureField}>
              <Text style={styles.dateLabel}>Date:</Text>
              <View style={styles.dateLine}>
                <Text style={styles.dateValue}>{data.bcbaSignatureDate}</Text>
              </View>
            </View>
          </View>
          <View style={styles.signatureRow}>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Supervisee Signature:</Text>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureValue}>{data.superviseeSignature}</Text>
              </View>
            </View>
            <View style={styles.signatureField}>
              <Text style={styles.dateLabel}>Date:</Text>
              <View style={styles.dateLine}>
                <Text style={styles.dateValue}>{data.superviseeSignatureDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerRight}>
            <Text style={styles.footerLogo}>
              <Text style={styles.logoUpskill}>Upskill</Text>
              <Text style={styles.logoABA}>ABA</Text>
            </Text>
            <Text style={styles.footerText}>| Program Evaluation Feedback</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
