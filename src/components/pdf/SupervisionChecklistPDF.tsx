"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

interface ChecklistSection {
  id: string;
  title: string;
  items: {
    id: string;
    label: string;
    hint?: string;
  }[];
}

interface Scores {
  checkedCount: number;
  totalItems: number;
  naCount: number;
  percentage: number;
  sectionScores: {
    id: string;
    title: string;
    checked: number;
    total: number;
    naCount: number;
    complete: boolean;
  }[];
  completeSections: number;
}

interface SupervisionChecklistPDFProps {
  date: string;
  supervisee: string;
  bcba: string;
  client: string;
  supervisionType: string;
  checkedItems: string[];
  naItems: string[];
  sections: ChecklistSection[];
  scores: Scores;
  notes: string;
  followUpItems: string;
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
  green: "#10B981",
  greenLight: "#D1FAE5",
};

const styles = StyleSheet.create({
  page: {
    padding: 25,
    paddingBottom: 50,
    fontSize: 8,
    fontFamily: "Helvetica",
    backgroundColor: colors.white,
  },
  header: {
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primaryDark,
    marginBottom: 8,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  infoField: {
    flexDirection: "row",
    minWidth: "45%",
  },
  infoLabel: {
    fontWeight: "bold",
    color: colors.grayDark,
    marginRight: 4,
    fontSize: 8,
  },
  infoValue: {
    color: colors.black,
    fontSize: 8,
  },
  progressSection: {
    backgroundColor: colors.primaryLight,
    padding: 8,
    borderRadius: 3,
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.primaryDark,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.grayLight,
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressStat: {
    fontSize: 7,
    color: colors.grayDark,
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.grayLight,
    padding: 5,
    borderRadius: 2,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.black,
  },
  sectionProgress: {
    fontSize: 7,
    color: colors.grayDark,
  },
  sectionComplete: {
    fontSize: 7,
    color: colors.green,
    fontWeight: "bold",
  },
  itemsContainer: {
    paddingLeft: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3,
    paddingVertical: 2,
  },
  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: colors.grayDark,
    borderRadius: 2,
    marginRight: 6,
    marginTop: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  checkmark: {
    fontSize: 7,
    color: colors.white,
    fontWeight: "bold",
  },
  itemText: {
    flex: 1,
    fontSize: 8,
    color: colors.black,
    lineHeight: 1.3,
  },
  itemTextChecked: {
    color: colors.grayDark,
  },
  itemTextNA: {
    fontSize: 8,
    color: "#9ca3af",
    fontStyle: "italic",
    textDecoration: "line-through",
    lineHeight: 1.3,
  },
  naNote: {
    fontSize: 7,
    color: "#9ca3af",
    fontStyle: "italic",
    marginTop: 1,
  },
  checkboxNA: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderRadius: 2,
    marginRight: 6,
    marginTop: 1,
    backgroundColor: "#f1f5f9",
    borderColor: "#e2e8f0",
  },
  notesSection: {
    marginTop: 10,
    marginBottom: 10,
  },
  notesHeader: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 4,
  },
  notesBox: {
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 3,
    padding: 6,
    minHeight: 50,
  },
  notesText: {
    fontSize: 8,
    color: colors.black,
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 15,
    left: 25,
    right: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: colors.gray,
  },
  footerLogo: {
    fontSize: 8,
    fontWeight: "bold",
  },
  logoUpskill: {
    color: colors.primary,
  },
  logoABA: {
    color: colors.black,
  },
});

function ChecklistItem({
  label,
  checked,
  isNA,
}: {
  label: string;
  checked: boolean;
  isNA: boolean;
}) {
  if (isNA) {
    return (
      <View style={styles.item}>
        <View style={styles.checkboxNA} />
        <View style={{ flex: 1 }}>
          <Text style={styles.itemTextNA}>{label}</Text>
          <Text style={styles.naNote}>Not applicable</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.item}>
      <View style={checked ? [styles.checkbox, styles.checkboxChecked] : styles.checkbox}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={checked ? [styles.itemText, styles.itemTextChecked] : styles.itemText}>
        {label}
      </Text>
    </View>
  );
}

function SectionBlock({
  section,
  checkedItems,
  naItems,
  sectionScore,
}: {
  section: ChecklistSection;
  checkedItems: string[];
  naItems: string[];
  sectionScore: { checked: number; total: number; naCount: number; complete: boolean };
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        {sectionScore.complete ? (
          <Text style={styles.sectionComplete}>
            ✓ Complete{sectionScore.naCount > 0 ? ` (${sectionScore.naCount} N/A)` : ""}
          </Text>
        ) : (
          <Text style={styles.sectionProgress}>
            {sectionScore.checked}/{sectionScore.total}
            {sectionScore.naCount > 0 ? ` (${sectionScore.naCount} N/A)` : ""}
          </Text>
        )}
      </View>
      <View style={styles.itemsContainer}>
        {section.items.map((item) => (
          <ChecklistItem
            key={item.id}
            label={item.label}
            checked={checkedItems.includes(item.id)}
            isNA={naItems.includes(item.id)}
          />
        ))}
      </View>
    </View>
  );
}

export function SupervisionChecklistPDF({
  date,
  supervisee,
  bcba,
  client,
  supervisionType,
  checkedItems,
  naItems,
  sections,
  scores,
  notes,
  followUpItems,
}: SupervisionChecklistPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>BCBA Supervision Session Checklist</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>{date || "___________"}</Text>
            </View>
            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Type:</Text>
              <Text style={styles.infoValue}>{supervisionType || "___________"}</Text>
            </View>
            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Supervisee:</Text>
              <Text style={styles.infoValue}>{supervisee || "___________"}</Text>
            </View>
            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>BCBA:</Text>
              <Text style={styles.infoValue}>{bcba || "___________"}</Text>
            </View>
            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Client:</Text>
              <Text style={styles.infoValue}>{client || "___________"}</Text>
            </View>
          </View>
        </View>

        {/* Progress Summary */}
        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Overall Completion</Text>
            <Text style={styles.progressValue}>{scores.percentage}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${scores.percentage}%` }]}
            />
          </View>
          <View style={styles.progressStats}>
            <Text style={styles.progressStat}>
              {scores.checkedCount} of {scores.totalItems} items
              {scores.naCount > 0 ? ` (${scores.naCount} N/A)` : ""}
            </Text>
            <Text style={styles.progressStat}>
              {scores.completeSections} of {sections.length} sections complete
            </Text>
          </View>
        </View>

        {/* Checklist Sections */}
        {sections.map((section) => {
          const sectionScore = scores.sectionScores.find(
            (s) => s.id === section.id
          ) || { checked: 0, total: section.items.length, naCount: 0, complete: false };
          return (
            <SectionBlock
              key={section.id}
              section={section}
              checkedItems={checkedItems}
              naItems={naItems}
              sectionScore={sectionScore}
            />
          );
        })}

        {/* Notes Section */}
        {notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesHeader}>Session Notes</Text>
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>{notes}</Text>
            </View>
          </View>
        )}

        {/* Follow-up Items */}
        {followUpItems && (
          <View style={styles.notesSection}>
            <Text style={styles.notesHeader}>Follow-up Items</Text>
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>{followUpItems}</Text>
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
            BCBA Supervision Session Checklist
          </Text>
        </View>
      </Page>
    </Document>
  );
}
