"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import {
  DATA_COLLECTION_ITEMS,
  GENERAL_ITEMS,
  type Answer,
  type ChecklistData,
  type ChecklistItem,
} from "./get-ready-checklist-data";

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
    fontSize: 9,
    fontWeight: "bold",
    color: colors.grayDark,
    width: 50,
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
  // Section Styles
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    backgroundColor: colors.primaryLight,
    padding: 6,
    marginBottom: 0,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderBottomWidth: 0,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.primaryDark,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Table Styles
  table: {
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderTopWidth: 0,
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
    minHeight: 22,
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
  textCell: {
    flex: 1,
    padding: 4,
    paddingRight: 6,
    justifyContent: "center",
  },
  itemText: {
    fontSize: 8,
    color: colors.black,
    lineHeight: 1.3,
  },
  checkboxCell: {
    width: 28,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 1,
    borderLeftColor: colors.grayLight,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    backgroundColor: colors.emerald,
    borderColor: colors.emerald,
  },
  checkboxNo: {
    backgroundColor: colors.rose,
    borderColor: colors.rose,
  },
  checkmark: {
    fontSize: 9,
    color: colors.white,
    fontWeight: "bold",
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
    height: 45,
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 3,
    padding: 6,
  },
  notesPlaceholder: {
    fontSize: 7,
    color: colors.gray,
    fontStyle: "italic",
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
  footerLeft: {
    flexDirection: "row",
    gap: 16,
  },
  footerStat: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerStatLabel: {
    fontSize: 8,
    color: colors.gray,
    marginRight: 4,
  },
  footerStatValue: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.black,
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

// Checkbox component
function Checkbox({ answer }: { answer: Answer }) {
  if (answer === "Y") {
    return (
      <View style={[styles.checkbox, styles.checkboxChecked]}>
        <Text style={styles.checkmark}>✓</Text>
      </View>
    );
  }
  if (answer === "N") {
    return (
      <View style={[styles.checkbox, styles.checkboxNo]}>
        <Text style={styles.checkmark}>✗</Text>
      </View>
    );
  }
  return <View style={styles.checkbox} />;
}

// Table Row component
function TableRow({
  item,
  index,
  answer,
  isLast,
}: {
  item: ChecklistItem;
  index: number;
  answer: Answer;
  isLast: boolean;
}) {
  return (
    <View style={[
      styles.tableRow,
      isLast ? styles.tableRowLast : {},
      index % 2 === 1 ? styles.tableRowAlt : {},
    ]}>
      <View style={styles.numberCell}>
        <Text style={styles.numberText}>{index + 1}</Text>
      </View>
      <View style={styles.textCell}>
        <Text style={styles.itemText}>{item.text}</Text>
      </View>
      <View style={styles.checkboxCell}>
        <Checkbox answer={answer} />
      </View>
    </View>
  );
}

// Section component
function ChecklistSection({
  title,
  items,
  answers,
  startIndex = 0,
}: {
  title: string;
  items: ChecklistItem[];
  answers: Record<string, Answer>;
  startIndex?: number;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <View style={[styles.numberCell, { borderRightWidth: 0 }]}>
            <Text style={styles.tableHeaderCell}>#</Text>
          </View>
          <View style={[styles.textCell, { flex: 1 }]}>
            <Text style={[styles.tableHeaderCell, { textAlign: "left" }]}>Item</Text>
          </View>
          <View style={[styles.checkboxCell, { borderLeftWidth: 0 }]}>
            <Text style={styles.tableHeaderCell}>✓</Text>
          </View>
        </View>
        {items.map((item, index) => (
          <TableRow
            key={item.id}
            item={item}
            index={startIndex + index}
            answer={answers[item.id] ?? null}
            isLast={index === items.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

// Main PDF Document
export function GetReadyChecklistPDF({ data }: { data: ChecklistData }) {
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
              <Text style={styles.formTitle}>Get Ready Checklist</Text>
              <Text style={styles.formSubtitle}>Session Preparation Form</Text>
            </View>
          </View>

          {/* Name and Date Fields */}
          <View style={styles.infoRow}>
            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Name:</Text>
              <View style={styles.infoLine}>
                <Text style={styles.infoValue}>{data.name}</Text>
              </View>
            </View>
            <View style={[styles.infoField, { marginLeft: 24 }]}>
              <Text style={styles.infoLabel}>Date:</Text>
              <View style={styles.infoLine}>
                <Text style={styles.infoValue}>{data.date}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Data Collection Section */}
        <ChecklistSection
          title="Section 1: Data Collection"
          items={DATA_COLLECTION_ITEMS}
          answers={data.answers}
          startIndex={0}
        />

        {/* General Section */}
        <ChecklistSection
          title="Section 2: General Preparation"
          items={GENERAL_ITEMS}
          answers={data.answers}
          startIndex={DATA_COLLECTION_ITEMS.length}
        />

        {/* Notes Section */}
        <View style={styles.notesSection}>
          <Text style={styles.notesHeader}>Notes / Comments</Text>
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
            <Text style={styles.footerText}>| Get Ready Checklist</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

// Re-export from shared data file for backwards compatibility
export { DATA_COLLECTION_ITEMS, GENERAL_ITEMS } from "./get-ready-checklist-data";
export type { ChecklistData, Answer } from "./get-ready-checklist-data";
