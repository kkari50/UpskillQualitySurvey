"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

interface ChecklistItem {
  id: string;
  label: string;
}

interface SupervisionPercentageChecklistPDFProps {
  date: string;
  client: string;
  bcba: string;
  rbt: string;
  checkedItems: string[];
  items: ChecklistItem[];
  recommendation: string;
  notes: string;
  recommendedPercentage: string;
}

const colors = {
  primary: "#0D9488",
  primaryLight: "#CCFBF1",
  primaryDark: "#115E59",
  black: "#1E293B",
  gray: "#64748B",
  grayLight: "#E2E8F0",
  grayDark: "#475569",
  white: "#FFFFFF",
  amber: "#F59E0B",
  amberLight: "#FEF3C7",
  amberDark: "#92400E",
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingBottom: 60,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: colors.white,
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primaryDark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: colors.gray,
    marginBottom: 10,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  infoField: {
    flexDirection: "row",
    minWidth: "45%",
  },
  infoLabel: {
    fontWeight: "bold",
    color: colors.grayDark,
    marginRight: 4,
    fontSize: 9,
  },
  infoValue: {
    color: colors.black,
    fontSize: 9,
  },
  recommendationBox: {
    backgroundColor: colors.amberLight,
    borderWidth: 1,
    borderColor: colors.amber,
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
  },
  recommendationTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.amberDark,
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.amberDark,
  },
  recommendationStats: {
    fontSize: 8,
    color: colors.grayDark,
    marginTop: 4,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.primaryDark,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  checklistContainer: {
    paddingLeft: 4,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingVertical: 3,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: colors.grayDark,
    borderRadius: 2,
    marginRight: 8,
    marginTop: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.amber,
    borderColor: colors.amber,
  },
  checkmark: {
    fontSize: 8,
    color: colors.white,
    fontWeight: "bold",
  },
  itemText: {
    flex: 1,
    fontSize: 9,
    color: colors.black,
    lineHeight: 1.4,
  },
  itemTextChecked: {
    color: colors.amberDark,
    fontWeight: "bold",
  },
  notesSection: {
    marginTop: 10,
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.grayDark,
    marginBottom: 4,
  },
  notesBox: {
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 3,
    padding: 8,
    minHeight: 60,
  },
  notesText: {
    fontSize: 9,
    color: colors.black,
    lineHeight: 1.4,
  },
  percentageField: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: colors.primaryLight,
    padding: 8,
    borderRadius: 3,
  },
  percentageLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.primaryDark,
    marginRight: 8,
  },
  percentageValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: colors.gray,
  },
  footerLogo: {
    fontSize: 9,
    fontWeight: "bold",
  },
  logoUpskill: {
    color: colors.primary,
  },
  logoABA: {
    color: colors.black,
  },
});

function ChecklistItemRow({
  label,
  checked,
}: {
  label: string;
  checked: boolean;
}) {
  return (
    <View style={styles.checklistItem}>
      <View
        style={
          checked
            ? [styles.checkbox, styles.checkboxChecked]
            : styles.checkbox
        }
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text
        style={
          checked
            ? [styles.itemText, styles.itemTextChecked]
            : styles.itemText
        }
      >
        {label}
      </Text>
    </View>
  );
}

export function SupervisionPercentageChecklistPDF({
  date,
  client,
  bcba,
  rbt,
  checkedItems,
  items,
  recommendation,
  notes,
  recommendedPercentage,
}: SupervisionPercentageChecklistPDFProps) {
  const checkedCount = checkedItems.length;
  const totalItems = items.length;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Checklist for More Than 5% Supervision
          </Text>
          <Text style={styles.subtitle}>
            Guidelines for determining when increased supervision may be warranted
          </Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>{date || "___________"}</Text>
            </View>
            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Client:</Text>
              <Text style={styles.infoValue}>{client || "___________"}</Text>
            </View>
            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>BCBA:</Text>
              <Text style={styles.infoValue}>{bcba || "___________"}</Text>
            </View>
            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>RBT:</Text>
              <Text style={styles.infoValue}>{rbt || "___________"}</Text>
            </View>
          </View>
        </View>

        {/* Recommendation Summary */}
        <View style={styles.recommendationBox}>
          <Text style={styles.recommendationTitle}>Assessment Result</Text>
          <Text style={styles.recommendationText}>{recommendation}</Text>
          <Text style={styles.recommendationStats}>
            {checkedCount} of {totalItems} factors identified
          </Text>
        </View>

        {/* Recommended Percentage */}
        {recommendedPercentage && (
          <View style={styles.percentageField}>
            <Text style={styles.percentageLabel}>
              Recommended Supervision Percentage:
            </Text>
            <Text style={styles.percentageValue}>{recommendedPercentage}</Text>
          </View>
        )}

        {/* Checklist */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Factors Warranting Increased Supervision
          </Text>
          <View style={styles.checklistContainer}>
            {items.map((item) => (
              <ChecklistItemRow
                key={item.id}
                label={item.label}
                checked={checkedItems.includes(item.id)}
              />
            ))}
          </View>
        </View>

        {/* Clinical Justification */}
        {notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Clinical Justification:</Text>
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>{notes}</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>
            <Text style={styles.logoUpskill}>Upskill</Text>
            <Text style={styles.logoABA}>ABA</Text>
          </Text>
          <Text style={styles.footerText}>
            Checklist for More Than 5% Supervision
          </Text>
        </View>
      </Page>
    </Document>
  );
}
