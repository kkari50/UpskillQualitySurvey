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
  // ============================================
  // Caregiver Guidance Resources
  // ============================================
  {
    questionId: "cg_001",
    educationText:
      "Having consistent and frequent training opportunities with families is important. Equally as important is teaching skills utilizing behavioral skills training (BST). BST is a comprehensive approach that involves instruction, modeling, rehearsal, and feedback to ensure caregivers can implement strategies correctly and confidently.",
    resources: [
      {
        id: "cg-steps-bst",
        title: "Steps of Behavioral Skills Training",
        description:
          "A handy reminder on the steps of BST for training caregivers on implementing interventions.",
        url: "/resources/caregiver-guidance/steps-bst.pdf",
        type: "guide",
        viewerType: "pdf-modal",
      },
      {
        id: "cg-monthly-check-in",
        title: "BCBA Monthly Caregiver Check-In Form",
        description:
          "A structured form for conducting monthly caregiver check-ins covering medication changes, concerns, and progress updates.",
        url: "/resources/caregiver-check-in",
        type: "tool",
      },
    ],
  },
  {
    questionId: "cg_002",
    educationText:
      "When a caregiver does not collect data consistently it can be difficult to determine if progress is being made in the home environment. One reason there may be a lack of data collection is that the goals assigned to caregivers are not meaningful to them. Please consider the following resources to help prioritize meaningful goals and provide practical data collection strategies.",
    resources: [
      {
        id: "cg-prioritizing-targets",
        title: "Job Aid for Prioritizing Treatment Targets for Caregivers",
        description:
          "A job aid to help BCBAs prioritize treatment targets that are meaningful and achievable for caregivers.",
        url: "/resources/caregiver-guidance/prioritizing-treatment-targets.pdf",
        type: "tool",
        viewerType: "pdf-modal",
      },
      {
        id: "cg-data-collection-tips",
        title: "Data Collection Tips for Caregivers",
        description:
          "Practical tips for helping caregivers collect data accurately and consistently.",
        url: "/resources/caregiver-guidance/data-collection-tips-caregivers.pdf",
        type: "guide",
        viewerType: "pdf-modal",
      },
    ],
  },
  {
    questionId: "cg_003",
    educationText:
      "Regular caregiver surveys in ABA therapy are essential for monitoring treatment effectiveness, as caregivers provide valuable data on the child's behavior across various settings. These surveys respect caregivers' perspectives, fostering family engagement and better outcomes. The article by Taylor, LeBlanc, & Nosik (2018) provides suggested questions to include on a caregiver survey on pages 4 and 5.",
    resources: [
      {
        id: "cg-taylor-2018-satisfaction",
        title: "Taylor, LeBlanc & Nosik (2018)",
        description:
          "Research on compassionate care with suggested questions for caregiver satisfaction surveys (see pages 4-5).",
        url: "/resources/caregiver-guidance/taylor-leblanc-nosik-2018.pdf",
        type: "research",
        viewerType: "pdf-modal",
      },
    ],
  },
  {
    questionId: "cg_004",
    educationText:
      "A structured monthly update interview form to review items such as medication changes with caregivers allows BCBAs to be informed of any issues that may impact service delivery. This standardized approach prevents important information from being missed and creates documentation for the clinical record.",
    resources: [
      {
        id: "cg-monthly-check-in-form",
        title: "BCBA Monthly Caregiver Check-In Form",
        description:
          "An interactive form for structured monthly caregiver updates including medication changes, concerns, and progress notes.",
        url: "/resources/caregiver-check-in",
        type: "tool",
      },
    ],
  },
  {
    questionId: "cg_005",
    educationText:
      "Caregiver goals should address caregiver primary concerns. Including an area for caregivers to express their concerns during the initial interview sets the tone for a collaborative relationship. It communicates that the family's perspective is valued and ensures that treatment planning addresses the issues most important to the family, not just clinically identified needs.",
    resources: [
      {
        id: "cg-prioritizing-targets-initial",
        title: "Job Aid for Prioritizing Treatment Targets for Caregivers",
        description:
          "Guidance on incorporating caregiver concerns into treatment target prioritization.",
        url: "/resources/caregiver-guidance/prioritizing-treatment-targets.pdf",
        type: "tool",
        viewerType: "pdf-modal",
      },
    ],
  },
  {
    questionId: "cg_006",
    educationText:
      "Including a quality of life assessment at the initial assessment and the 6-month reassessment allows the BCBA to assess if things are improving for the entire family, not just the learner. Research increasingly emphasizes the importance of socially valid outcomes that matter to families.",
    resources: [
      {
        id: "cg-fqol",
        title: "Family Quality of Life (FQOL) Scale",
        description:
          "Free access to a lite version of the Family Quality of Life Scale for assessments.",
        url: "https://www.upskillaba.com/clinical-intelligence-forms",
        type: "tool",
        viewerType: "external",
      },
    ],
  },
  // ============================================
  // Supervision Resources
  // ============================================
  {
    questionId: "sup_001",
    educationText:
      "Making the most out of supervision sessions is critical for both the learner and the BT/RBT. A structured approach helps ensure all necessary topics are covered, progress is reviewed systematically, and specific training needs are addressed rather than supervision becoming reactive or unfocused. Additionally, supervision should involve the analysis of each treatment plan goal. While it may not be possible to address each goal during a supervision session, static goals should be prioritized.",
    resources: [
      {
        id: "sup-session-checklist",
        title: "BCBA Supervision Session Checklist",
        description:
          "An interactive checklist to help BCBAs prepare structured supervision sessions covering all essential components.",
        url: "/resources/supervision-checklist",
        type: "tool",
      },
    ],
  },
  {
    questionId: "sup_002",
    educationText:
      "Behavior skills training (BST) is a comprehensive approach that can be used to teach a wide variety of skills and allows for consistency of implementation across staff. BST allows for active engagement and demonstration of the skills to ensure that the direct care staff can perform the desired behavior to competency. One step of BST is providing the BT/RBT with written instructions of how to implement the goal. Clear instructions will increase the likelihood that the skill is taught correctly.",
    resources: [
      {
        id: "sup-steps-bst",
        title: "Steps of Behavioral Skills Training",
        description:
          "A job aid on implementing BST with direct care staff during supervision.",
        url: "/resources/supervision/steps-bst.pdf",
        type: "guide",
        viewerType: "pdf-modal",
      },
      {
        id: "sup-parker-2023",
        title: "Parker et al. (2023)",
        description:
          "Research on effective goal documentation and implementation strategies.",
        url: "/resources/supervision/parker-2023.pdf",
        type: "research",
        viewerType: "pdf-modal",
      },
      {
        id: "sup-program-component-list",
        title: "Program Component List",
        description:
          "A checklist of essential program components to review during supervision.",
        url: "/resources/supervision/program-component-list.pdf",
        type: "checklist",
        viewerType: "pdf-modal",
      },
      {
        id: "sup-program-info-eval",
        title: "Program Information Sheet Evaluation Tool",
        description:
          "An interactive tool to evaluate whether program information sheets contain all necessary components for proper implementation.",
        url: "/resources/program-info-sheet",
        type: "tool",
      },
    ],
  },
  {
    questionId: "sup_003",
    educationText:
      "Regular supervision ensures that behavior intervention plans and skill acquisition goals are being implemented correctly and consistently. This helps maintain high standards of care and maximizes client outcomes. Less frequent supervision can result in errors going uncorrected for extended periods.",
    resources: [],
  },
  {
    questionId: "sup_004",
    educationText:
      "If your agency just provides the minimum 5% supervision, this may be insufficient. Clinical judgment should determine when additional supervision is necessary; keeping in mind that higher supervision rates may improve treatment outcomes. More complex cases, newer staff, or cases with challenging behaviors may require higher supervision percentages.",
    resources: [
      {
        id: "sup-percentage-checklist",
        title: "Checklist for More Than 5% Supervision",
        description:
          "A checklist to help determine when more than the minimum 5% supervision may be warranted.",
        url: "/resources/supervision/supervision-percentage-checklist.pdf",
        type: "checklist",
        viewerType: "pdf-modal",
      },
      {
        id: "sup-session-checklist-clinical",
        title: "BCBA Supervision Session Checklist",
        description:
          "Use this interactive checklist to document supervision activities and ensure clinical alignment.",
        url: "/resources/supervision-checklist",
        type: "tool",
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
