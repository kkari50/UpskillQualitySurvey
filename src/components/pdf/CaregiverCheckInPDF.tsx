"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

interface CaregiverCheckInData {
  clientName: string;
  date: string;
  bcbaName: string;
  medicationChanges: string;
  currentMedications: string;
  recentChanges: string;
  sideEffects: string;
  medicalAppointments: string;
  followUpNeeded: string;
  newChallengingBehaviors: string;
  newBehaviorDescription: string;
  newBehaviorFrequency: string;
  newBehaviorTimeOfDay: string;
  currentResponseToBehavior: string;
  frequencyChanges: string;
  behaviorsImproved: string;
  behaviorsWorsened: string;
  specificConcerns: string;
  sleepPatterns: string;
  eatingHabits: string;
  toileting: string;
  selfCareRoutines: string;
  communicationAttempts: string;
  socialInteractions: string;
  newWordsPhrases: string;
  whatsWorkingWell: string;
  whatsChallenging: string;
  additionalSupportNeeded: string;
  progressOnGoals: string;
  newConcerns: string;
  familyPriorities: string;
  additionalNotes: string;
  immediateAttention: string;
  nextTeamMeetingTopics: string;
  resourcesRequested: string;
  parentSignature: string;
  parentSignatureDate: string;
  bcbaSignature: string;
  bcbaSignatureDate: string;
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
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingBottom: 50,
    fontSize: 9,
    fontFamily: "Helvetica",
    backgroundColor: colors.white,
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primaryDark,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    gap: 20,
  },
  infoField: {
    flex: 1,
    flexDirection: "row",
  },
  infoLabel: {
    fontWeight: "bold",
    color: colors.grayDark,
    marginRight: 4,
  },
  infoValue: {
    color: colors.black,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
    flex: 1,
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    backgroundColor: colors.primaryLight,
    padding: 6,
    marginBottom: 8,
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.primaryDark,
  },
  fieldRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  fieldLabel: {
    width: 140,
    fontWeight: "bold",
    color: colors.grayDark,
    fontSize: 8,
  },
  fieldValue: {
    flex: 1,
    color: colors.black,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
    minHeight: 12,
    paddingBottom: 2,
  },
  fullWidthField: {
    marginBottom: 6,
  },
  fullWidthLabel: {
    fontWeight: "bold",
    color: colors.grayDark,
    fontSize: 8,
    marginBottom: 2,
  },
  fullWidthValue: {
    color: colors.black,
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 2,
    padding: 4,
    minHeight: 20,
  },
  twoColumn: {
    flexDirection: "row",
    gap: 15,
  },
  column: {
    flex: 1,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  radioLabel: {
    fontWeight: "bold",
    color: colors.grayDark,
    fontSize: 8,
    marginRight: 8,
  },
  radioValue: {
    color: colors.black,
    fontSize: 8,
  },
  signatureSection: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
    paddingTop: 10,
  },
  signatureRow: {
    flexDirection: "row",
    gap: 30,
  },
  signatureBlock: {
    flex: 1,
  },
  signatureLabel: {
    fontSize: 8,
    color: colors.grayDark,
    marginBottom: 2,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    height: 20,
    marginBottom: 4,
  },
  signatureValue: {
    fontSize: 9,
    color: colors.black,
    fontStyle: "italic",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
    paddingTop: 8,
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

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}:</Text>
      <Text style={styles.fieldValue}>{value || " "}</Text>
    </View>
  );
}

function FullWidthField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fullWidthField}>
      <Text style={styles.fullWidthLabel}>{label}:</Text>
      <View style={styles.fullWidthValue}>
        <Text>{value || " "}</Text>
      </View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export function CaregiverCheckInPDF({ data }: { data: CaregiverCheckInData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>BCBA Monthly Caregiver Check-In Form</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Client Name:</Text>
              <Text style={styles.infoValue}>{data.clientName}</Text>
            </View>
            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>{data.date}</Text>
            </View>
            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>BCBA:</Text>
              <Text style={styles.infoValue}>{data.bcbaName}</Text>
            </View>
          </View>
        </View>

        {/* Medical Updates */}
        <Section title="Medical Updates">
          <View style={styles.radioRow}>
            <Text style={styles.radioLabel}>Changes to medications since last meeting?</Text>
            <Text style={styles.radioValue}>
              {data.medicationChanges === "yes" ? "☑ Yes" : data.medicationChanges === "no" ? "☑ No" : "☐ Yes ☐ No"}
            </Text>
          </View>
          {data.medicationChanges === "yes" && (
            <>
              <FieldRow label="Current medications" value={data.currentMedications} />
              <FieldRow label="Recent changes" value={data.recentChanges} />
              <FieldRow label="Side effects" value={data.sideEffects} />
            </>
          )}
          <FullWidthField label="Medical appointments/procedures" value={data.medicalAppointments} />
          <FieldRow label="Follow-up needed" value={data.followUpNeeded} />
        </Section>

        {/* Behavioral Updates */}
        <Section title="Behavioral Updates">
          <Text style={{ fontSize: 9, fontWeight: "bold", marginBottom: 4 }}>New Challenging Behaviors</Text>
          <View style={styles.radioRow}>
            <Text style={styles.radioLabel}>Observed new challenging behaviors?</Text>
            <Text style={styles.radioValue}>
              {data.newChallengingBehaviors === "yes" ? "☑ Yes" : data.newChallengingBehaviors === "no" ? "☑ No" : "☐ Yes ☐ No"}
            </Text>
          </View>
          {data.newChallengingBehaviors === "yes" && (
            <>
              <FullWidthField label="Description" value={data.newBehaviorDescription} />
              <View style={styles.twoColumn}>
                <View style={styles.column}>
                  <FieldRow label="Frequency" value={data.newBehaviorFrequency} />
                </View>
                <View style={styles.column}>
                  <FieldRow label="Time of day" value={data.newBehaviorTimeOfDay} />
                </View>
              </View>
              <FieldRow label="Current response" value={data.currentResponseToBehavior} />
            </>
          )}
          <Text style={{ fontSize: 9, fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>Existing Target Behaviors</Text>
          <View style={styles.radioRow}>
            <Text style={styles.radioLabel}>Changes in frequency?</Text>
            <Text style={styles.radioValue}>
              {data.frequencyChanges === "increase" ? "☑ Increase" : "☐ Increase"}{" "}
              {data.frequencyChanges === "decrease" ? "☑ Decrease" : "☐ Decrease"}{" "}
              {data.frequencyChanges === "same" ? "☑ Same" : "☐ Same"}
            </Text>
          </View>
          <FieldRow label="Behaviors improved" value={data.behaviorsImproved} />
          <FieldRow label="Behaviors worsened" value={data.behaviorsWorsened} />
          <FullWidthField label="Specific concerns" value={data.specificConcerns} />
        </Section>

        {/* Daily Living Skills */}
        <Section title="Daily Living Skills">
          <View style={styles.twoColumn}>
            <View style={styles.column}>
              <FieldRow label="Sleep patterns" value={data.sleepPatterns} />
              <FieldRow label="Toileting" value={data.toileting} />
            </View>
            <View style={styles.column}>
              <FieldRow label="Eating habits" value={data.eatingHabits} />
              <FieldRow label="Self-care" value={data.selfCareRoutines} />
            </View>
          </View>
        </Section>

        {/* Social/Communication */}
        <Section title="Social/Communication">
          <FullWidthField label="Communication attempts" value={data.communicationAttempts} />
          <FullWidthField label="Social interactions" value={data.socialInteractions} />
          <FieldRow label="New words/phrases" value={data.newWordsPhrases} />
        </Section>

        {/* Home Implementation */}
        <Section title="Home Implementation">
          <FullWidthField label="What's working well" value={data.whatsWorkingWell} />
          <FullWidthField label="What's challenging" value={data.whatsChallenging} />
          <FieldRow label="Additional support needed" value={data.additionalSupportNeeded} />
        </Section>

        {/* Goals and Priorities */}
        <Section title="Goals and Priorities">
          <FullWidthField label="Progress on current goals" value={data.progressOnGoals} />
          <FullWidthField label="New concerns to address" value={data.newConcerns} />
          <FullWidthField label="Family priorities for next month" value={data.familyPriorities} />
        </Section>

        {/* Additional Notes */}
        <Section title="Additional Notes">
          <View style={styles.fullWidthValue}>
            <Text>{data.additionalNotes || " "}</Text>
          </View>
        </Section>

        {/* Follow-up Items */}
        <Section title="Follow-up Items">
          <FullWidthField label="Items requiring immediate attention" value={data.immediateAttention} />
          <FieldRow label="Topics for next team meeting" value={data.nextTeamMeetingTopics} />
          <FieldRow label="Resources requested" value={data.resourcesRequested} />
        </Section>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureRow}>
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureLabel}>Parent Signature:</Text>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureValue}>{data.parentSignature}</Text>
              </View>
              <Text style={styles.signatureLabel}>Date: {data.parentSignatureDate}</Text>
            </View>
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureLabel}>BCBA Signature:</Text>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureValue}>{data.bcbaSignature}</Text>
              </View>
              <Text style={styles.signatureLabel}>Date: {data.bcbaSignatureDate}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>
            <Text style={styles.logoUpskill}>Upskill</Text>
            <Text style={styles.logoABA}>ABA</Text>
          </Text>
          <Text style={styles.footerText}>BCBA Monthly Caregiver Check-In Form</Text>
        </View>
      </Page>
    </Document>
  );
}
