"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Types
interface BarrierCategory {
  id: string;
  title: string;
  description: string;
  items: {
    id: string;
    label: string;
    description?: string;
  }[];
}

interface Summary {
  identifiedCount: number;
  totalItems: number;
  byCategory: {
    id: string;
    title: string;
    identified: number;
    total: number;
  }[];
  categoriesWithBarriers: number;
}

export interface BarrierIdentificationData {
  date: string;
  client: string;
  bcba: string;
  goalName: string;
  checkedItems: string[];
  categories: BarrierCategory[];
  summary: Summary;
  planningNotes: string;
  interventionPlan: string;
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
    padding: 12,
    marginBottom: 15,
    borderRadius: 4,
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 8,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 8,
  },
  summaryItem: {
    flex: 1,
    padding: 6,
    borderRadius: 4,
    alignItems: "center",
  },
  summaryItemActive: {
    backgroundColor: "#fef3c7",
  },
  summaryItemInactive: {
    backgroundColor: "#ffffff",
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#92400e",
  },
  summaryLabel: {
    fontSize: 6,
    color: "#78716c",
    textAlign: "center",
    marginTop: 2,
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
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
    flex: 1,
  },
  sectionCount: {
    fontSize: 8,
    color: "#92400e",
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
  itemRowChecked: {
    backgroundColor: "#fffbeb",
  },
  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderRadius: 2,
    marginRight: 6,
    marginTop: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#d97706",
    borderColor: "#d97706",
  },
  checkboxUnchecked: {
    backgroundColor: "#ffffff",
    borderColor: "#d1d5db",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 7,
    fontWeight: "bold",
  },
  itemLabel: {
    flex: 1,
    fontSize: 8,
    color: "#374151",
  },
  itemLabelChecked: {
    color: "#92400e",
    fontWeight: "medium",
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
    minHeight: 50,
    marginBottom: 10,
  },
  notesLabel: {
    fontSize: 7,
    color: "#64748b",
    marginBottom: 4,
    textTransform: "uppercase",
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

export function BarrierIdentificationPDF({
  date,
  client,
  bcba,
  goalName,
  checkedItems,
  categories,
  summary,
  planningNotes,
  interventionPlan,
}: BarrierIdentificationData) {
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
            <Text style={styles.title}>Barrier Identification Checklist</Text>
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
            <Text style={styles.infoLabel}>Goal/Program</Text>
            <Text style={styles.infoValue}>{goalName || "—"}</Text>
          </View>
        </View>

        {/* Summary */}
        {summary.identifiedCount > 0 && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>
              {summary.identifiedCount} Barrier
              {summary.identifiedCount !== 1 ? "s" : ""} Identified
            </Text>
            <View style={styles.summaryGrid}>
              {summary.byCategory.map((cat) => (
                <View
                  key={cat.id}
                  style={[
                    styles.summaryItem,
                    cat.identified > 0
                      ? styles.summaryItemActive
                      : styles.summaryItemInactive,
                  ]}
                >
                  <Text style={styles.summaryValue}>{cat.identified}</Text>
                  <Text style={styles.summaryLabel}>{cat.title}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Categories */}
        {categories.map((category) => {
          const catCount = category.items.filter((item) =>
            checkedSet.has(item.id)
          ).length;

          return (
            <View key={category.id} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{category.title}</Text>
                {catCount > 0 && (
                  <Text style={styles.sectionCount}>
                    {catCount} identified
                  </Text>
                )}
              </View>
              <View style={styles.itemsContainer}>
                {category.items.map((item, idx) => {
                  const isChecked = checkedSet.has(item.id);
                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.itemRow,
                        idx === category.items.length - 1 ? styles.itemRowLast : {},
                        isChecked ? styles.itemRowChecked : {},
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

        {/* Planning Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Planning Notes</Text>

          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>Additional Observations</Text>
            <Text style={planningNotes ? styles.notesText : styles.notesEmpty}>
              {planningNotes || "No additional observations noted"}
            </Text>
          </View>

          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>
              Proposed Intervention Modifications
            </Text>
            <Text
              style={interventionPlan ? styles.notesText : styles.notesEmpty}
            >
              {interventionPlan || "No intervention modifications noted"}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Upskill ABA</Text>
          <Text>Barrier Identification Planning Checklist</Text>
        </View>
      </Page>
    </Document>
  );
}
