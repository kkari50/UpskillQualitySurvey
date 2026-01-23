"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Types
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
  percentage: number;
  sectionScores: {
    id: string;
    title: string;
    checked: number;
    total: number;
    complete: boolean;
  }[];
  completeSections: number;
}

export interface BIPMonitoringChecklistData {
  date: string;
  client: string;
  bcba: string;
  nextMonitoringDate: string;
  checkedItems: string[];
  sections: ChecklistSection[];
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
    width: "25%",
    padding: 8,
    borderRightWidth: 1,
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
  summaryBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginBottom: 15,
    borderRadius: 4,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#475569",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0d9488",
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 6,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#e2e8f0",
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1e293b",
  },
  sectionProgress: {
    fontSize: 8,
    color: "#64748b",
  },
  sectionComplete: {
    color: "#059669",
    fontWeight: "bold",
  },
  itemsContainer: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#e2e8f0",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 4,
    paddingLeft: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  itemRowLast: {
    borderBottomWidth: 0,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderRadius: 2,
    marginRight: 6,
    marginTop: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#059669",
    borderColor: "#059669",
  },
  checkboxUnchecked: {
    backgroundColor: "#ffffff",
    borderColor: "#d1d5db",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "bold",
  },
  itemLabel: {
    flex: 1,
    fontSize: 8,
    color: "#374151",
  },
  itemLabelChecked: {
    color: "#059669",
  },
  notesSection: {
    marginTop: 10,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 6,
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

export function BIPMonitoringChecklistPDF({
  date,
  client,
  bcba,
  nextMonitoringDate,
  checkedItems,
  sections,
  scores,
  notes,
}: BIPMonitoringChecklistData) {
  const checkedSet = new Set(checkedItems);

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
            <Text style={styles.title}>BIP Monthly Monitoring Checklist</Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{date || "—"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Client</Text>
            <Text style={styles.infoValue}>{client || "—"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>BCBA</Text>
            <Text style={styles.infoValue}>{bcba || "—"}</Text>
          </View>
          <View style={[styles.infoItem, styles.infoItemLast]}>
            <Text style={styles.infoLabel}>Next Review</Text>
            <Text style={styles.infoValue}>{nextMonitoringDate || "—"}</Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>
            {scores.checkedCount} of {scores.totalItems} items completed •{" "}
            {scores.completeSections} of {sections.length} sections complete
          </Text>
          <Text style={styles.summaryValue}>{scores.percentage}%</Text>
        </View>

        {/* Sections */}
        {sections.map((section) => {
          const sectionScore = scores.sectionScores.find(
            (s) => s.id === section.id
          );
          return (
            <View key={section.id} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text
                  style={[
                    styles.sectionProgress,
                    sectionScore?.complete ? styles.sectionComplete : {},
                  ]}
                >
                  {sectionScore?.checked || 0}/{sectionScore?.total || 0}
                  {sectionScore?.complete && " ✓"}
                </Text>
              </View>
              <View style={styles.itemsContainer}>
                {section.items.map((item, idx) => {
                  const isChecked = checkedSet.has(item.id);
                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.itemRow,
                        idx === section.items.length - 1 ? styles.itemRowLast : {},
                      ]}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          isChecked
                            ? styles.checkboxChecked
                            : styles.checkboxUnchecked,
                        ]}
                      >
                        {isChecked && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <Text
                        style={[
                          styles.itemLabel,
                          isChecked ? styles.itemLabelChecked : {},
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* Notes */}
        {notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Notes</Text>
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>{notes}</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Upskill ABA</Text>
          <Text>BIP Monthly Monitoring Checklist</Text>
        </View>
      </Page>
    </Document>
  );
}
