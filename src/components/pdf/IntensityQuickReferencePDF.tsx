"use client";

import {
  Document,
  Image,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  STEPS,
  DOS_AND_DONTS,
  BEHAVIOR_EXAMPLES,
  INTENSITY_COLOR_MAP,
} from "./intensity-quick-reference-data";

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingBottom: 50,
    fontSize: 9,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    marginBottom: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
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
    color: "#0d9488",
  },
  logoABA: {
    color: "#64748b",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0d9488",
    marginBottom: 2,
  },
  titleRule: {
    height: 2,
    backgroundColor: "#0d9488",
    marginBottom: 8,
    borderRadius: 1,
  },
  subtitle: {
    fontSize: 9,
    color: "#64748b",
    lineHeight: 1.4,
    marginBottom: 14,
  },
  // Steps
  stepItem: {
    marginBottom: 8,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  stepNumber: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#0d9488",
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 3,
    marginRight: 8,
    flexShrink: 0,
  },
  stepTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e293b",
    flex: 1,
    paddingTop: 2,
  },
  stepDescription: {
    fontSize: 8,
    color: "#374151",
    marginLeft: 26,
    marginBottom: 2,
  },
  stepBullet: {
    fontSize: 8,
    color: "#4b5563",
    marginLeft: 34,
    lineHeight: 1.5,
  },
  // Do's and Don'ts
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 6,
    marginTop: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 4,
    marginBottom: 10,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tableHeaderCellAvoid: {
    width: "50%",
    padding: 6,
    fontSize: 8,
    fontWeight: "bold",
    color: "#dc2626",
  },
  tableHeaderCellDo: {
    width: "50%",
    padding: 6,
    fontSize: 8,
    fontWeight: "bold",
    color: "#16a34a",
    borderLeftWidth: 1,
    borderLeftColor: "#e2e8f0",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableCellLeft: {
    width: "50%",
    padding: 6,
    fontSize: 8,
    color: "#374151",
  },
  tableCellRight: {
    width: "50%",
    padding: 6,
    fontSize: 8,
    color: "#374151",
    borderLeftWidth: 1,
    borderLeftColor: "#e2e8f0",
  },
  // Appendix
  appendixTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  appendixSubtitle: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 10,
    lineHeight: 1.4,
  },
  behaviorSection: {
    marginBottom: 12,
  },
  behaviorName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 2,
  },
  behaviorDefinition: {
    fontSize: 8,
    color: "#64748b",
    fontStyle: "italic",
    marginBottom: 4,
  },
  levelRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    minHeight: 18,
  },
  levelBadge: {
    width: 24,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  levelBadgeText: {
    fontSize: 8,
    fontWeight: "bold",
  },
  levelExample: {
    flex: 1,
    padding: 4,
    fontSize: 7,
    color: "#374151",
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
    fontSize: 7,
    color: "#9ca3af",
  },
});

// ---------------------------------------------------------------------------
// Helpers — Helvetica lacks many Unicode glyphs; replace with ASCII
// ---------------------------------------------------------------------------

function sanitize(text: string): string {
  return text
    .replace(/\u2265/g, ">=")   // ≥
    .replace(/\u00B1/g, "+/-")  // ±
    .replace(/\u2018/g, "'")    // '
    .replace(/\u2019/g, "'")    // '
    .replace(/\u201C/g, '"')    // "
    .replace(/\u201D/g, '"')    // "
    .replace(/\u2013/g, "-")    // –
    .replace(/\u2014/g, "--")   // —
    .replace(/\u274C/g, "X")    // ❌
    .replace(/\u2713/g, "v")    // ✓
    .replace(/\u2022/g, "-");   // •
}

// ---------------------------------------------------------------------------
// PDF Component
// ---------------------------------------------------------------------------

export function IntensityQuickReferencePDF({
  logoUrl,
}: {
  logoUrl?: string;
}) {
  return (
    <Document>
      {/* ---- Page 1: Steps + Do's/Don'ts ---- */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTop}>
            {logoUrl ? (
              // eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image doesn't support alt
              <Image src={logoUrl} style={styles.logoImage} />
            ) : (
              <Text style={styles.logoText}>
                <Text style={styles.logoUpskill}>Upskill</Text>
                <Text style={styles.logoABA}>ABA</Text>
              </Text>
            )}
          </View>
        </View>

        <Text style={styles.title}>
          Intensity Measure Development Quick Reference
        </Text>
        <View style={styles.titleRule} />
        <Text style={styles.subtitle}>
          A step-by-step job aid for developing behavior-specific intensity
          scales (0-7) with inter-observer agreement targets and rater training
          guidance.
        </Text>

        {/* Steps */}
        {STEPS.map((step) => (
          <View key={step.number} style={styles.stepItem} wrap={false}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepNumber}>{step.number}</Text>
              <Text style={styles.stepTitle}>{sanitize(step.title)}</Text>
            </View>
            <Text style={styles.stepDescription}>{sanitize(step.description)}</Text>
            {step.bullets.map((bullet, i) => (
              <Text key={i} style={styles.stepBullet}>
                - {sanitize(bullet)}
              </Text>
            ))}
          </View>
        ))}

        {/* Do's and Don'ts — wrap={false} keeps the table on one page */}
        <View wrap={false}>
          <Text style={styles.sectionTitle}>{"Do's and Don'ts"}</Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableHeaderCellAvoid}>
                X  Avoid
              </Text>
              <Text style={styles.tableHeaderCellDo}>
                {">"} Do This
              </Text>
            </View>
            {DOS_AND_DONTS.map((row, idx) => (
              <View
                key={idx}
                style={[
                  styles.tableRow,
                  idx === DOS_AND_DONTS.length - 1 ? styles.tableRowLast : {},
                ]}
              >
                <Text style={styles.tableCellLeft}>{sanitize(row.dont)}</Text>
                <Text style={styles.tableCellRight}>{sanitize(row.do_)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ---- Appendix A - Behavior Examples (flows naturally) ---- */}
        <Text style={styles.appendixTitle}>
          Appendix A: Behavior-Specific Intensity Examples
        </Text>
        <Text style={styles.appendixSubtitle}>
          Real-world examples of challenging behaviors at each intensity level
          (0-7). Use these for rater training and to develop your own scales.
          Each example shows natural progression from no behavior through crisis
          levels.
        </Text>

        {BEHAVIOR_EXAMPLES.map((behavior) => (
          <View key={behavior.id} style={styles.behaviorSection} wrap={false}>
            <Text style={styles.behaviorName}>{sanitize(behavior.behaviorName)}</Text>
            <Text style={styles.behaviorDefinition}>
              {sanitize(behavior.definition)}
            </Text>
            <View style={styles.table}>
              {behavior.levels.map((lvl, i) => (
                <View
                  key={lvl.level}
                  style={[
                    styles.levelRow,
                    i === behavior.levels.length - 1
                      ? styles.tableRowLast
                      : {},
                  ]}
                >
                  <View
                    style={[
                      styles.levelBadge,
                      {
                        backgroundColor:
                          INTENSITY_COLOR_MAP[lvl.level]?.pdfColor ?? "#f8fafc",
                      },
                    ]}
                  >
                    <Text style={styles.levelBadgeText}>{lvl.level}</Text>
                  </View>
                  <Text style={styles.levelExample}>{sanitize(lvl.example)}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer} fixed>
          <Text>Generated by Upskill ABA</Text>
          <Text>Intensity Measure Development Quick Reference</Text>
        </View>
      </Page>
    </Document>
  );
}
