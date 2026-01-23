/**
 * Practice Insight Resources
 *
 * Maps survey questions to helpful resources and tools
 * that can help improve practices in areas where gaps are identified.
 */

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "tool" | "guide" | "checklist" | "template" | "research";
  /** If set to "pdf-modal", opens in-app PDF viewer instead of navigating */
  viewerType?: "pdf-modal" | "external" | "default";
}

export interface QuestionInsight {
  questionId: string;
  educationText: string;
  resources: Resource[];
}

/**
 * Insights and resources mapped to specific question IDs
 */
export const QUESTION_INSIGHTS: QuestionInsight[] = [
  // ============================================
  // Daily Sessions Resources
  // ============================================
  {
    questionId: "ds_001",
    educationText:
      "Organized materials help BTs/RBTs work efficiently through assigned goals. In clinics, create a 'home base' for each learner's materials and consider fanny pouches for timers and visual schedules. For in-home services, work with caregivers to restrict materials during non-therapy time and dedicate a space for sessions.",
    resources: [
      {
        id: "get-ready-checklist",
        title: "Get Ready Checklist",
        description:
          "A fillable checklist to help ensure you're prepared before each session.",
        url: "/resources/get-ready-checklist",
        type: "checklist",
      },
    ],
  },
  {
    questionId: "ds_002",
    educationText:
      "Research demonstrates that higher trial counts correlate with better treatment outcomes. Howard et al. (2005) found significant differences in outcomes based on intervention intensity.",
    resources: [
      {
        id: "howard-2005",
        title: "Howard et al. (2005)",
        description:
          "A comparison of intensive behavior analytic and eclectic treatments for young children with autism.",
        url: "/resources/daily-sessions/howard-2005.pdf",
        type: "research",
        viewerType: "pdf-modal",
      },
    ],
  },
  {
    questionId: "ds_003",
    educationText:
      "Behavior analysis is a science, thus it's important that when reviewing data that we are comparing data points with the same number of trials.\n\nTrial presentation counts:\n• If I present 40 trials and the learner gets 2 incorrect, on the graph it will be displayed as 95%\n• If I present 3 trials and the learner gets 2 incorrect, on the graph it will be displayed as 33%\n\nTo solve this problem, please consider the following:\n1. First, ensure that each goal has clear expectations for a trial count.\n2. Work with the BT/RBT that work with the client to determine if there are barriers to completing a goal during a session. Some considerations include the total number of active goals, access to materials and clarity of instructions.",
    resources: [],
  },
  {
    questionId: "ds_004",
    educationText:
      "In order for a learner to acquire skills rapidly, it is critically important that the learner is exposed to the learning material on a consistent and frequent basis.\n\nConsiderations for why a goal is not implemented each session include, but are not limited to:\n1. The learner has too many goals for the amount of allocated therapy time\n2. Frequent illness or cancellations\n3. The BT/RBT does not have consistent access to required materials\n4. The goal is difficult to implement\n5. The BT/RBT are confused on proper implementation\n6. The learner exhibits challenging behavior during this goal and thus BT/RBT avoids the goal",
    resources: [],
  },
  {
    questionId: "ds_005",
    educationText:
      "Preference assessments are critically important in ABA therapy as they help identify what motivates the learner and can improve engagement. Preference assessments should occur frequently (sometimes daily for learners whose preferences change regularly). A starting point should be once a week, adjusted based on the individual learner. It's also important that new items and activities be added to the preference assessments.",
    resources: [
      {
        id: "building-new-preferences",
        title: "Building New Preferences",
        description:
          "A worksheet to introduce new social interactions/activities and tangibles to build new preferences.",
        url: "/resources/building-new-preferences",
        type: "tool",
      },
      {
        id: "fisher-1992",
        title: "Fisher et al. (1992)",
        description:
          "A comparison of two approaches for identifying reinforcers for persons with severe and profound disabilities.",
        url: "/resources/daily-sessions/fisher-1992.pdf",
        type: "research",
        viewerType: "pdf-modal",
      },
      {
        id: "mason-1989",
        title: "Mason et al. (1989)",
        description:
          "A practical strategy for ongoing reinforcer assessment.",
        url: "/resources/daily-sessions/mason-1989.pdf",
        type: "research",
        viewerType: "pdf-modal",
      },
      {
        id: "chazin-ledford-2016",
        title: "Chazin & Ledford (2016)",
        description:
          "Preference assessments - Evidence-based instructional practices for young children with autism.",
        url: "http://ebip.vkcsites.org/preference-assessments",
        type: "guide",
        viewerType: "external",
      },
    ],
  },
  {
    questionId: "ds_006",
    educationText:
      "If the SD, prompting strategy, reinforcement schedules, and target lists are missing from a learner's goals, it will make it very challenging for a BT/RBT to implement the goal as intended. Please consider the following resources to ensure comprehensive goal documentation.",
    resources: [
      {
        id: "program-component-list",
        title: "Written Goal Component List",
        description:
          "A checklist to ensure all necessary components are included in goal documentation.",
        url: "/resources/daily-sessions/program-component-list.pdf",
        type: "checklist",
        viewerType: "pdf-modal",
      },
      {
        id: "program-info-sheet",
        title: "Program Information Sheet Evaluation Tool",
        description:
          "An evaluation tool to assess the completeness of program information sheets.",
        url: "/resources/program-info-sheet",
        type: "tool",
      },
      {
        id: "parker-2023",
        title: "Parker et al. (2023)",
        description:
          "Research on effective goal documentation and implementation strategies.",
        url: "/resources/daily-sessions/parker-2023.pdf",
        type: "research",
        viewerType: "pdf-modal",
      },
    ],
  },
  {
    questionId: "ds_007",
    educationText:
      "The consistent implementation of a skill acquisition protocol is critical for client success. When BTs/RBTs are not familiar with a learner's programming, it can make it extremely difficult for them to implement the goal correctly and as the BCBA intends. This can lead to confusion and static progress for the learner.\n\nConsider implementing:\n• Regular team meetings to review client goals\n• Structured onboarding for new team members\n• Documentation that is easily accessible and clear\n• Periodic competency checks on goal implementation",
    resources: [],
  },
  // ============================================
  // Treatment Fidelity Resources
  // ============================================
  {
    questionId: "tf_001",
    educationText:
      "If a goal is not making adequate progress or there is high variability within the data, one reason may be due to inconsistent fidelity checks. Fidelity checks are important as they are used to determine if the goal is being implemented correctly and consistently by all BTs/RBTs.\n\nIt is strongly recommended that all goals are monitored at least once every two weeks across all direct care staff, or more frequently if the goal is not progressing. If your organization does not have a standardized approach to treatment fidelity monitoring you can utilize the following fidelity checklists.",
    resources: [
      {
        id: "monitoring-dtt",
        title: "Monitoring DTT Sessions",
        description:
          "An interactive fidelity checklist for monitoring Discrete Trial Training sessions across 10 trials.",
        url: "/resources/monitoring-dtt",
        type: "tool",
      },
      {
        id: "monitoring-net",
        title: "Monitoring NET Sessions",
        description:
          "An interactive fidelity checklist for monitoring Natural Environment Training sessions across assessment phases.",
        url: "/resources/monitoring-net",
        type: "tool",
      },
    ],
  },
  {
    questionId: "tf_002",
    educationText:
      "Behavior skills training (BST) is a comprehensive approach that can be used to teach a wide variety of skills and allows for consistency of implementation across staff. BST allows for active engagement and demonstration of the skills to ensure that the direct care staff can perform the desired behavior to competency.\n\nOne step of BST is providing the BT/RBT with written instructions of how to implement the goal. Clear instructions will increase the likelihood that the skill is taught correctly.",
    resources: [
      {
        id: "steps-bst",
        title: "Steps of Behavioral Skills Training",
        description:
          "A job aid on implementing BST with direct care staff.",
        url: "/resources/treatment-fidelity/steps-bst.pdf",
        type: "guide",
        viewerType: "pdf-modal",
      },
      {
        id: "tf-parker-2023",
        title: "Parker et al. (2023)",
        description:
          "Research on effective goal documentation and implementation strategies.",
        url: "/resources/treatment-fidelity/parker-2023.pdf",
        type: "research",
        viewerType: "pdf-modal",
      },
      {
        id: "tf-program-component-list",
        title: "Program Component List",
        description:
          "A checklist to ensure all necessary components are included in goal documentation.",
        url: "/resources/treatment-fidelity/program-component-list.pdf",
        type: "checklist",
        viewerType: "pdf-modal",
      },
      {
        id: "tf-program-info-sheet",
        title: "Program Information Sheet Evaluation Tool",
        description:
          "An evaluation tool to assess the completeness of program information sheets.",
        url: "/resources/program-info-sheet",
        type: "tool",
      },
    ],
  },
  {
    questionId: "tf_003",
    educationText:
      "In order to ensure that each component of a behavior plan is implemented with high treatment fidelity, it is crucial that each component is consistently monitored. Failure to do so prevents one's ability to make accurate conclusions about the effectiveness of treatment.\n\nPlease find the following example fidelity checklists for commonly implemented behavior intervention plan components.",
    resources: [
      {
        id: "fidelity-check-dro",
        title: "DRO Fidelity Checklist",
        description:
          "An interactive fidelity checklist for Differential Reinforcement of Other Behavior (DRO) interventions with interval-based tracking.",
        url: "/resources/fidelity-dro",
        type: "tool",
      },
      {
        id: "fidelity-check-self-management",
        title: "Self-Management Fidelity Checklist",
        description:
          "An interactive fidelity checklist for monitoring self-management intervention implementation.",
        url: "/resources/fidelity-self-management",
        type: "tool",
      },
      {
        id: "fidelity-check-ncr",
        title: "NCR Fidelity Checklist",
        description:
          "A fidelity checklist for Non-Contingent Reinforcement (NCR) interventions.",
        url: "/resources/treatment-fidelity/fidelity-check-ncr.pdf",
        type: "checklist",
        viewerType: "pdf-modal",
      },
    ],
  },
  {
    questionId: "tf_004",
    educationText:
      "Behavior skills training (BST) is a comprehensive approach that can be used to teach a wide variety of skills and allows for consistency of implementation across staff. BST allows for active engagement and demonstration of the skills to ensure that the direct care staff can perform the desired behavior to competency.\n\nOne step of BST is providing the BT/RBT with written instructions of how to implement the BIP. Clear instructions will increase the likelihood that the skill is taught correctly.",
    resources: [
      {
        id: "tf004-steps-bst",
        title: "Steps of Behavioral Skills Training",
        description:
          "A job aid on implementing BST with direct care staff.",
        url: "/resources/treatment-fidelity/steps-bst.pdf",
        type: "guide",
        viewerType: "pdf-modal",
      },
      {
        id: "bip-fidelity-rating-form",
        title: "BIP Fidelity Rating Form",
        description:
          "A form to rate the fidelity of behavior intervention plan implementation.",
        url: "/resources/treatment-fidelity/bip-fidelity-rating-form.pdf",
        type: "checklist",
        viewerType: "pdf-modal",
      },
      {
        id: "challenging-behavior-rating-form",
        title: "Challenging Behavior Rating Form",
        description:
          "A form to rate and document challenging behaviors.",
        url: "/resources/treatment-fidelity/challenging-behavior-rating-form.pdf",
        type: "tool",
        viewerType: "pdf-modal",
      },
      {
        id: "behavior-intensity-scale",
        title: "Behavior Intensity Scale",
        description:
          "A scale to measure and document behavior intensity levels.",
        url: "/resources/treatment-fidelity/behavior-intensity-scale.pdf",
        type: "tool",
        viewerType: "pdf-modal",
      },
    ],
  },
  {
    questionId: "tf_005",
    educationText:
      "Ensuring that behavior intervention plans are monitored consistently is a critical part of delivering quality services. Regular monitoring helps identify implementation issues early and ensures treatment effectiveness.",
    resources: [
      {
        id: "bip-monitoring-checklist",
        title: "Behavior Intervention Plan Monitoring Checklist",
        description:
          "A comprehensive checklist for monitoring BIP implementation.",
        url: "/resources/treatment-fidelity/bip-monitoring-checklist.pdf",
        type: "checklist",
        viewerType: "pdf-modal",
      },
    ],
  },
  // Additional insights can be added here as they become available
];

/**
 * Get insight (education text + resources) for a specific question
 */
export function getInsightForQuestion(questionId: string): QuestionInsight | null {
  return QUESTION_INSIGHTS.find((qi) => qi.questionId === questionId) ?? null;
}

/**
 * Get resources for a specific question
 */
export function getResourcesForQuestion(questionId: string): Resource[] {
  const insight = getInsightForQuestion(questionId);
  return insight?.resources ?? [];
}

/**
 * Get all questions that have insights
 */
export function getQuestionsWithInsights(): string[] {
  return QUESTION_INSIGHTS.map((qi) => qi.questionId);
}

/**
 * Check if a question has insights/resources
 */
export function hasInsights(questionId: string): boolean {
  return QUESTION_INSIGHTS.some((qi) => qi.questionId === questionId);
}
