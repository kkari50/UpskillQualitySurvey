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
  Category,
  Reaction,
  PreferenceEntry,
  PreferencesData,
} from "./building-new-preferences-data";

// Re-export types for backwards compatibility
export type { Category, Reaction, PreferenceEntry, PreferencesData } from "./building-new-preferences-data";

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
  amber: "#F59E0B",
  rose: "#FB7185",
};

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingBottom: 50,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: colors.white,
  },
  // Header Section
  headerContainer: {
    marginBottom: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  logoImage: {
    width: 90,
    height: 27,
  },
  logoText: {
    fontSize: 18,
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
  // Info Fields Row
  infoRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
    paddingTop: 8,
  },
  infoField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: colors.grayDark,
    width: 55,
    textTransform: "uppercase",
  },
  infoLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    height: 16,
    marginLeft: 4,
    paddingBottom: 2,
  },
  infoValue: {
    fontSize: 10,
    color: colors.black,
  },
  // Instructions
  instructionsBox: {
    backgroundColor: colors.primaryLight,
    padding: 8,
    borderRadius: 3,
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 7,
    color: colors.primaryDark,
    lineHeight: 1.4,
  },
  // Table Styles
  table: {
    borderWidth: 1,
    borderColor: colors.grayLight,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.grayLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontWeight: "bold",
    color: colors.grayDark,
    textTransform: "uppercase",
    padding: 4,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
    minHeight: 28,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableRowAlt: {
    backgroundColor: "#F8FAFC",
  },
  numberCell: {
    width: 22,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: colors.grayLight,
  },
  numberText: {
    fontSize: 8,
    color: colors.gray,
    fontWeight: "bold",
  },
  categoryCell: {
    width: 70,
    padding: 4,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: colors.grayLight,
  },
  descriptionCell: {
    flex: 1,
    padding: 4,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: colors.grayLight,
  },
  reactionCell: {
    width: 90,
    padding: 4,
    justifyContent: "center",
  },
  cellText: {
    fontSize: 8,
    color: colors.black,
    lineHeight: 1.3,
  },
  cellTextEmpty: {
    fontSize: 8,
    color: colors.gray,
    fontStyle: "italic",
  },
  // Reaction indicators
  reactionBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
    alignSelf: "flex-start",
  },
  reactionEnjoyed: {
    backgroundColor: "#D1FAE5",
  },
  reactionNeutral: {
    backgroundColor: "#FEF3C7",
  },
  reactionRejected: {
    backgroundColor: "#FFE4E6",
  },
  reactionText: {
    fontSize: 7,
    fontWeight: "bold",
  },
  reactionTextEnjoyed: {
    color: "#065F46",
  },
  reactionTextNeutral: {
    color: "#92400E",
  },
  reactionTextRejected: {
    color: "#9F1239",
  },
  // Notes Section
  notesSection: {
    marginTop: 10,
    marginBottom: 0,
  },
  notesHeader: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.grayDark,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  notesBox: {
    minHeight: 45,
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 3,
    padding: 6,
  },
  notesText: {
    fontSize: 8,
    color: colors.black,
    lineHeight: 1.4,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerLogo: {
    fontSize: 9,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 8,
    color: colors.gray,
    marginLeft: 4,
  },
});

// Helper functions
function getCategoryLabel(category: Category): string {
  if (category === "tangible") return "Tangible";
  if (category === "social") return "Social Interaction";
  return "";
}

function getReactionLabel(reaction: Reaction): string {
  if (reaction === "enjoyed") return "Enjoyed";
  if (reaction === "neutral") return "Neutral";
  if (reaction === "rejected") return "Rejected";
  return "";
}

// Table Row component
function TableRow({
  entry,
  index,
  isLast,
}: {
  entry: PreferenceEntry;
  index: number;
  isLast: boolean;
}) {
  const reactionStyles = {
    enjoyed: { badge: styles.reactionEnjoyed, text: styles.reactionTextEnjoyed },
    neutral: { badge: styles.reactionNeutral, text: styles.reactionTextNeutral },
    rejected: { badge: styles.reactionRejected, text: styles.reactionTextRejected },
  };

  return (
    <View
      style={[
        styles.tableRow,
        isLast ? styles.tableRowLast : {},
        index % 2 === 1 ? styles.tableRowAlt : {},
      ]}
    >
      <View style={styles.numberCell}>
        <Text style={styles.numberText}>{index + 1}</Text>
      </View>
      <View style={styles.categoryCell}>
        <Text style={entry.category ? styles.cellText : styles.cellTextEmpty}>
          {getCategoryLabel(entry.category) || "-"}
        </Text>
      </View>
      <View style={styles.descriptionCell}>
        <Text style={entry.description ? styles.cellText : styles.cellTextEmpty}>
          {entry.description || "-"}
        </Text>
      </View>
      <View style={styles.reactionCell}>
        {entry.reaction ? (
          <View style={[styles.reactionBadge, reactionStyles[entry.reaction].badge]}>
            <Text style={[styles.reactionText, reactionStyles[entry.reaction].text]}>
              {getReactionLabel(entry.reaction)}
            </Text>
          </View>
        ) : (
          <Text style={styles.cellTextEmpty}>-</Text>
        )}
      </View>
    </View>
  );
}

// Main PDF Document
export function BuildingNewPreferencesPDF({ data }: { data: PreferencesData }) {
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
              <Text style={styles.formTitle}>Building New Preferences</Text>
              <Text style={styles.formSubtitle}>Preference Assessment Form</Text>
            </View>
          </View>

          {/* Info Fields */}
          <View style={styles.infoRow}>
            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Client:</Text>
              <View style={styles.infoLine}>
                <Text style={styles.infoValue}>{data.clientName}</Text>
              </View>
            </View>
            <View style={[styles.infoField, { marginLeft: 12 }]}>
              <Text style={styles.infoLabel}>Therapist:</Text>
              <View style={styles.infoLine}>
                <Text style={styles.infoValue}>{data.therapistName}</Text>
              </View>
            </View>
            <View style={[styles.infoField, { marginLeft: 12 }]}>
              <Text style={styles.infoLabel}>Date:</Text>
              <View style={styles.infoLine}>
                <Text style={styles.infoValue}>{data.date}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsText}>
            Use this form to introduce new social interactions/activities and tangibles to your client.
            Provide these items and interactions only in the absence of dangerous and disruptive behavior.
            Deliver items/interactions multiple times over several days at different times during therapy sessions.
            Try different approaches (silly voices, softer voice, different actions).
            These should NOT be currently known preferred items - this is to build NEW preferences.
          </Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={[styles.numberCell, { borderRightWidth: 0 }]}>
              <Text style={styles.tableHeaderCell}>#</Text>
            </View>
            <View style={[styles.categoryCell, { borderRightWidth: 0 }]}>
              <Text style={[styles.tableHeaderCell, { textAlign: "left" }]}>Category</Text>
            </View>
            <View style={[styles.descriptionCell, { borderRightWidth: 0 }]}>
              <Text style={[styles.tableHeaderCell, { textAlign: "left" }]}>Description</Text>
            </View>
            <View style={styles.reactionCell}>
              <Text style={[styles.tableHeaderCell, { textAlign: "left" }]}>Reaction</Text>
            </View>
          </View>
          {data.entries.map((entry, index) => (
            <TableRow
              key={entry.id}
              entry={entry}
              index={index}
              isLast={index === data.entries.length - 1}
            />
          ))}
        </View>

        {/* Notes Section */}
        <View style={styles.notesSection}>
          <Text style={styles.notesHeader}>Notes / Observations</Text>
          <View style={styles.notesBox}>
            {data.notes && <Text style={styles.notesText}>{data.notes}</Text>}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerRight}>
            <Text style={styles.footerLogo}>
              <Text style={styles.logoUpskill}>Upskill</Text>
              <Text style={styles.logoABA}>ABA</Text>
            </Text>
            <Text style={styles.footerText}>| Building New Preferences</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
