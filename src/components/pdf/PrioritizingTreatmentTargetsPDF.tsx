"use client";

import {
  Document,
  Image,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const CRITERIA = [
  {
    title: "Safety and well-being of the learner and the family",
    text: '"The clinician should assess whether particular child behaviors or parenting interactions pose a threat to the safety and well-being of the child or others. Common behaviors that may need to be prioritized are self-injurious behaviors, pica (ingesting non-edible material), and aggression toward others. Other priority behaviors are those that expose the learner to dangerous situations, such as elopement, climbing or jumping from high surfaces, or playing with hazardous objects (e.g., electrical devices and outlets, scissors, matches). Clinicians should also look for maladaptive parenting repertoires that are harmful or could potentially be harmful in the future (e.g., heavy reliance on punishment or aversive procedures, excessive use of physical restraint or physical prompting)"',
    citation: "Gould & Redmond, 2014, p. 172",
  },
  {
    title: "Functional targets",
    text: '"Clinicians should target only those skills that are likely to produce natural sources of reinforcement once treatment ends, since these are the skills that are most likely to be maintained and benefit the family in the long term. Clinicians should consider the number of opportunities parents will have to use the skills they acquire and the degree of impact those skills will have on the family\'s daily life and then prioritize those parenting skills that will produce immediate benefits for the family. For example, hoarding and repetitive lining up of toys are concerns because they prevent a child from using toys in a functional manner, but parents may not consider those treatment priorities. However, if this restrictive, repetitive behavior significantly disrupts the learner\'s ability to participate in daily activities and routines and causes a great deal of stress because the learner engages in high-pitched screaming whenever one of his siblings touches his toys, parents might view the behavior as a high priority for treatment"',
    citation: "Gould & Redmond, 2014, p. 172",
  },
  {
    title: "Cost/benefit ratio",
    text: '"Clinicians should consider the amount of time it will take and the likelihood of success in establishing new parent skills, particularly when trying to optimize the use of limited parent training time"',
    citation: "Gould & Redmond, 2014, p. 173",
  },
  {
    title: "Choose targets that set the caregiver up for success",
    text: '"Setting goals and choosing procedures that ensure that parents will quickly contact reinforcement and success is especially important in the beginning in order to demonstrate the value of the treatment program to the parents and gain their trust"',
    citation: "Gould & Redmond, 2014, p. 173",
  },
  {
    title: "Choose targets that foster positive interactions",
    text: '"Skills that foster more positive interactions between the parent and child can also be prioritized, particularly for parents who are totally overwhelmed and experiencing a great deal of negative emotions during their interactions with their child"',
    citation: "Gould & Redmond, 2014, p. 174",
  },
  {
    title: "Consider social validity and if the goal benefits stakeholders",
    text: '"Does the response benefit others?... All other things being equal, selecting potential cusps based on their impact on the people who control reinforcers and punishers in a specific environment (e.g., parents, teachers, police officers) is more important than the impact on those who lack such control... Does the behavior have social validity in that the response meets the demands of the social community of which the learner is a member (Wolf, 1978)? This criterion is especially important in presenting behavior change programs to parents and other consumers. Parents\' indifference towards the target behavior may undermine the other criteria that might have identified the behavior as a potential cusp"',
    citation: "Bosch & Fuqua, 2001",
  },
  {
    title: "Value and preferences are in alignment with the caregivers",
    text: '"Consider the values and preferences of parents, care providers, and the individual with ASD. Stakeholder values and preferences play a particularly important role in decision making when:\n-- An intervention has been correctly implemented in the past and was not effective or had undesirable side effects.\n-- An intervention is contrary to the values of family members.\n-- The individual with ASD indicates that he or she does not want a specific intervention"',
    citation: "National Standards Project, Phase 2, 2015, p. 82",
  },
];

const REFERENCES = [
  'Bosch, S., & Fuqua, R. W. (2001). Behavioral cusps: a model for selecting target behaviors. Journal of Applied Behavior Analysis, 34(1), 123.',
  'Gould, E. R., & Redmond, V. (2014). Parent involvement. In Granpeesheh, D., Tarbox, J., Najdowski, A. C., & Kornack, J. (2014). Evidence-based treatment for children with autism: the CARD model. Elsevier.',
  "National Research Council. (2001). Educating children with autism. Committee on Educational Interventions for Children with Autism. C. Lord & J. P. McGee (Eds.), Division of Behavioral and Social Sciences and Education. Washington, DC: National Academy Press.",
];

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
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 9,
    color: "#64748b",
    lineHeight: 1.4,
    marginBottom: 15,
  },
  criteriaItem: {
    marginBottom: 10,
  },
  criteriaHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  criteriaNumber: {
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
  criteriaTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e293b",
    flex: 1,
    paddingTop: 2,
  },
  criteriaText: {
    fontSize: 8,
    color: "#374151",
    lineHeight: 1.5,
    marginLeft: 26,
    fontStyle: "italic",
  },
  criteriaCitation: {
    fontSize: 7,
    color: "#64748b",
    marginLeft: 26,
    marginTop: 2,
  },
  referencesSection: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  referencesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 6,
  },
  referenceText: {
    fontSize: 7,
    color: "#64748b",
    lineHeight: 1.5,
    marginBottom: 4,
    marginLeft: 10,
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

export function PrioritizingTreatmentTargetsPDF({ logoUrl }: { logoUrl?: string }) {
  return (
    <Document>
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
          Job Aid for Prioritizing Treatment Targets for Caregivers
        </Text>
        <Text style={styles.subtitle}>
          Caregiver engagement is a critical part of the treatment planning
          process. When designing caregiver goals consider whether or not they
          meet the following criteria:
        </Text>

        {/* Criteria */}
        {CRITERIA.map((item, idx) => (
          <View key={idx} style={styles.criteriaItem} wrap={false}>
            <View style={styles.criteriaHeader}>
              <Text style={styles.criteriaNumber}>{idx + 1}</Text>
              <Text style={styles.criteriaTitle}>{item.title}:</Text>
            </View>
            <Text style={styles.criteriaText}>{item.text}</Text>
            <Text style={styles.criteriaCitation}>({item.citation})</Text>
          </View>
        ))}

        {/* References */}
        <View style={styles.referencesSection}>
          <Text style={styles.referencesTitle}>References</Text>
          {REFERENCES.map((ref, idx) => (
            <Text key={idx} style={styles.referenceText}>
              {ref}
            </Text>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>Generated by Upskill ABA</Text>
          <Text>Job Aid for Prioritizing Treatment Targets for Caregivers</Text>
        </View>
      </Page>
    </Document>
  );
}
