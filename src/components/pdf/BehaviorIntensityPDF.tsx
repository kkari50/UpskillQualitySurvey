"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Types
interface BehaviorObservation {
  id: string;
  time: string;
  behaviorType: string;
  intensity: number;
  notes: string;
}

interface IntensityLevel {
  value: number;
  label: string;
  description: string;
  color: string;
}

interface BehaviorType {
  value: string;
  label: string;
}

interface Summary {
  count: number;
  avgIntensity: number;
  maxIntensity: number;
  byType: Record<string, number>;
  byLevel: { none: number; mild: number; moderate: number; serious: number };
}

export interface BehaviorIntensityData {
  date: string;
  client: string;
  observer: string;
  sessionStart: string;
  sessionEnd: string;
  observations: BehaviorObservation[];
  summary: Summary;
  sessionNotes: string;
  intensityLevels: IntensityLevel[];
  behaviorTypes: BehaviorType[];
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
    marginBottom: 15,
    gap: 8,
  },
  summaryItem: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 7,
    color: "#64748b",
    textTransform: "uppercase",
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
  observationTable: {
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
    padding: 6,
    fontSize: 7,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableCell: {
    padding: 6,
    fontSize: 8,
    color: "#374151",
  },
  intensityBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  intensityText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#ffffff",
  },
  scaleReference: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },
  scaleTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 6,
  },
  scaleRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  scaleBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  scaleLabel: {
    fontSize: 7,
    color: "#374151",
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
  reference: {
    marginTop: 10,
    fontSize: 6,
    color: "#9ca3af",
    fontStyle: "italic",
  },
});

const getIntensityColor = (intensity: number): string => {
  if (intensity === 0) return "#22c55e"; // green
  if (intensity <= 2) return "#84cc16"; // lime
  if (intensity <= 4) return "#f59e0b"; // amber/orange
  if (intensity <= 5) return "#ea580c"; // orange
  return "#dc2626"; // red
};

const getIntensityLabel = (intensity: number): string => {
  if (intensity === 0) return "None";
  if (intensity <= 2) return "Mild";
  if (intensity <= 5) return "Moderate";
  return "Serious";
};

export function BehaviorIntensityPDF({
  date,
  client,
  observer,
  sessionStart,
  sessionEnd,
  observations,
  summary,
  sessionNotes,
  behaviorTypes,
}: BehaviorIntensityData) {
  const getBehaviorLabel = (value: string) => {
    return behaviorTypes.find((b) => b.value === value)?.label || value;
  };

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
            <Text style={styles.title}>Behavior Intensity Log</Text>
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
            <Text style={styles.infoLabel}>Observer</Text>
            <Text style={styles.infoValue}>{observer || "—"}</Text>
          </View>
          <View style={[styles.infoItem, styles.infoItemLast]}>
            <Text style={styles.infoLabel}>Session Time</Text>
            <Text style={styles.infoValue}>
              {sessionStart && sessionEnd
                ? `${sessionStart} - ${sessionEnd}`
                : sessionStart || sessionEnd || "—"}
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryBox}>
          <View style={[styles.summaryItem, { backgroundColor: "#f1f5f9" }]}>
            <Text style={[styles.summaryValue, { color: "#475569" }]}>
              {summary.count}
            </Text>
            <Text style={styles.summaryLabel}>Observations</Text>
          </View>
          <View
            style={[
              styles.summaryItem,
              {
                backgroundColor:
                  summary.avgIntensity >= 5
                    ? "#fef2f2"
                    : summary.avgIntensity >= 3
                      ? "#fffbeb"
                      : "#f0fdf4",
              },
            ]}
          >
            <Text
              style={[
                styles.summaryValue,
                {
                  color:
                    summary.avgIntensity >= 5
                      ? "#dc2626"
                      : summary.avgIntensity >= 3
                        ? "#d97706"
                        : "#16a34a",
                },
              ]}
            >
              {summary.avgIntensity}
            </Text>
            <Text style={styles.summaryLabel}>Avg Intensity</Text>
          </View>
          <View
            style={[
              styles.summaryItem,
              {
                backgroundColor:
                  summary.maxIntensity >= 5
                    ? "#fef2f2"
                    : summary.maxIntensity >= 3
                      ? "#fffbeb"
                      : "#f0fdf4",
              },
            ]}
          >
            <Text
              style={[
                styles.summaryValue,
                {
                  color:
                    summary.maxIntensity >= 5
                      ? "#dc2626"
                      : summary.maxIntensity >= 3
                        ? "#d97706"
                        : "#16a34a",
                },
              ]}
            >
              {summary.maxIntensity}
            </Text>
            <Text style={styles.summaryLabel}>Max Intensity</Text>
          </View>
          <View style={[styles.summaryItem, { backgroundColor: "#fef2f2" }]}>
            <Text style={[styles.summaryValue, { color: "#dc2626" }]}>
              {summary.byLevel.serious}
            </Text>
            <Text style={styles.summaryLabel}>Serious (6-7)</Text>
          </View>
        </View>

        {/* Observations Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Observations ({observations.length})
          </Text>
          <View style={styles.observationTable}>
            {/* Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: "10%" }]}>#</Text>
              <Text style={[styles.tableHeaderCell, { width: "12%" }]}>
                Time
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "20%" }]}>
                Behavior
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "15%" }]}>
                Intensity
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "43%" }]}>
                Notes
              </Text>
            </View>
            {/* Rows */}
            {observations.map((obs, idx) => (
              <View
                key={obs.id}
                style={[
                  styles.tableRow,
                  idx === observations.length - 1 ? styles.tableRowLast : {},
                ]}
              >
                <Text style={[styles.tableCell, { width: "10%" }]}>
                  {idx + 1}
                </Text>
                <Text style={[styles.tableCell, { width: "12%" }]}>
                  {obs.time}
                </Text>
                <Text style={[styles.tableCell, { width: "20%" }]}>
                  {getBehaviorLabel(obs.behaviorType)}
                </Text>
                <View
                  style={[
                    styles.tableCell,
                    { width: "15%", flexDirection: "row", alignItems: "center" },
                  ]}
                >
                  <View
                    style={[
                      styles.intensityBadge,
                      { backgroundColor: getIntensityColor(obs.intensity) },
                    ]}
                  >
                    <Text style={styles.intensityText}>{obs.intensity}</Text>
                  </View>
                  <Text style={{ marginLeft: 4, fontSize: 7, color: "#6b7280" }}>
                    {getIntensityLabel(obs.intensity)}
                  </Text>
                </View>
                <Text
                  style={[styles.tableCell, { width: "43%", fontSize: 7 }]}
                >
                  {obs.notes || "—"}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Session Notes */}
        {sessionNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Session Notes</Text>
            <View style={styles.notesBox}>
              <Text style={styles.notesText}>{sessionNotes}</Text>
            </View>
          </View>
        )}

        {/* Scale Reference */}
        <View style={styles.scaleReference}>
          <Text style={styles.scaleTitle}>Intensity Rating Scale (IRS)</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            <View style={styles.scaleRow}>
              <View
                style={[styles.scaleBadge, { backgroundColor: "#22c55e" }]}
              >
                <Text style={{ color: "#fff", fontSize: 7, fontWeight: "bold" }}>
                  0
                </Text>
              </View>
              <Text style={styles.scaleLabel}>None</Text>
            </View>
            <View style={styles.scaleRow}>
              <View
                style={[styles.scaleBadge, { backgroundColor: "#84cc16" }]}
              >
                <Text style={{ color: "#fff", fontSize: 7, fontWeight: "bold" }}>
                  1
                </Text>
              </View>
              <Text style={styles.scaleLabel}>Mild</Text>
            </View>
            <View style={styles.scaleRow}>
              <View
                style={[styles.scaleBadge, { backgroundColor: "#f59e0b" }]}
              >
                <Text style={{ color: "#fff", fontSize: 7, fontWeight: "bold" }}>
                  4
                </Text>
              </View>
              <Text style={styles.scaleLabel}>Moderate</Text>
            </View>
            <View style={styles.scaleRow}>
              <View
                style={[styles.scaleBadge, { backgroundColor: "#dc2626" }]}
              >
                <Text style={{ color: "#fff", fontSize: 7, fontWeight: "bold" }}>
                  7
                </Text>
              </View>
              <Text style={styles.scaleLabel}>Serious</Text>
            </View>
          </View>
          <Text style={styles.reference}>
            Source: Reeve, C. E., & Carr, E. G. (2000). Prevention of severe
            behavior problems in children with developmental disorders. Journal
            of Positive Behavior Interventions, 2(3), 144-160.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Upskill ABA</Text>
          <Text>Behavior Intensity Scale</Text>
        </View>
      </Page>
    </Document>
  );
}
