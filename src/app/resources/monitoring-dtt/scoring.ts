// Criteria structure for each trial
export interface TrialCriteria {
  setupMaterials: boolean;
  sdAttending: boolean;
  sdAsWritten: boolean;
  sdIntonation: boolean;
  responseCorrect: boolean | null; // null = N/A (no response to mark)
  correctionTimely: boolean | null;
  correctionAttending: boolean | null;
  correctionAsWritten: boolean | null;
  correctionIntonation: boolean | null;
  reinforcerImmediate: boolean;
  reinforcerEffective: boolean;
  reinforcerDescriptive: boolean;
  reinforcerIntonation: boolean;
  reinforcerAffectPlay: boolean;
  pacingAdequate: boolean;
  extraSR: boolean;
  attentionForDisruptive: boolean;
}

export const createEmptyTrial = (): TrialCriteria => ({
  setupMaterials: false,
  sdAttending: false,
  sdAsWritten: false,
  sdIntonation: false,
  responseCorrect: null,
  correctionTimely: null,
  correctionAttending: null,
  correctionAsWritten: null,
  correctionIntonation: null,
  reinforcerImmediate: false,
  reinforcerEffective: false,
  reinforcerDescriptive: false,
  reinforcerIntonation: false,
  reinforcerAffectPlay: false,
  pacingAdequate: false,
  extraSR: false,
  attentionForDisruptive: false,
});

// Calculate trial completion percentage
export const getTrialCompletion = (trial: TrialCriteria): number => {
  const fields: (keyof TrialCriteria)[] = [
    "setupMaterials",
    "sdAttending",
    "sdAsWritten",
    "sdIntonation",
    "pacingAdequate",
    "extraSR",
    "attentionForDisruptive",
  ];

  // Response is required
  let total = fields.length + 1; // +1 for responseCorrect
  let completed = trial.responseCorrect !== null ? 1 : 0;

  fields.forEach((field) => {
    if (trial[field] === true) completed++;
  });

  // If response was correct, reinforcer fields are also counted
  if (trial.responseCorrect === true) {
    total += 5; // 5 reinforcer fields
    if (trial.reinforcerImmediate === true) completed++;
    if (trial.reinforcerEffective === true) completed++;
    if (trial.reinforcerDescriptive === true) completed++;
    if (trial.reinforcerIntonation === true) completed++;
    if (trial.reinforcerAffectPlay === true) completed++;
  }

  // If response was incorrect, correction fields are also counted
  if (trial.responseCorrect === false) {
    total += 4; // 4 correction fields
    if (trial.correctionTimely === true) completed++;
    if (trial.correctionAttending === true) completed++;
    if (trial.correctionAsWritten === true) completed++;
    if (trial.correctionIntonation === true) completed++;
  }

  return Math.round((completed / total) * 100);
};

// Check if trial has been started
export const isTrialStarted = (trial: TrialCriteria): boolean => {
  return (
    trial.responseCorrect !== null ||
    Object.values(trial).some((v) => v === true)
  );
};

export interface FidelityScores {
  setupMaterials: number;
  sd: number;
  correction: number;
  reinforcer: number;
  pacing: number;
  extraSR: number;
  attention: number;
  overall: number;
}

// Calculate fidelity scores across all trials
export const calculateScores = (trials: TrialCriteria[]): FidelityScores => {
  const categories = {
    setupMaterials: { correct: 0, total: 0 },
    sd: { correct: 0, total: 0 },
    correction: { correct: 0, total: 0 },
    reinforcer: { correct: 0, total: 0 },
    pacing: { correct: 0, total: 0 },
    extraSR: { correct: 0, total: 0 },
    attention: { correct: 0, total: 0 },
  };

  trials.forEach((trial) => {
    categories.setupMaterials.total++;
    if (trial.setupMaterials) categories.setupMaterials.correct++;

    categories.sd.total += 3;
    if (trial.sdAttending) categories.sd.correct++;
    if (trial.sdAsWritten) categories.sd.correct++;
    if (trial.sdIntonation) categories.sd.correct++;

    if (trial.correctionTimely !== null) {
      categories.correction.total++;
      if (trial.correctionTimely) categories.correction.correct++;
    }
    if (trial.correctionAttending !== null) {
      categories.correction.total++;
      if (trial.correctionAttending) categories.correction.correct++;
    }
    if (trial.correctionAsWritten !== null) {
      categories.correction.total++;
      if (trial.correctionAsWritten) categories.correction.correct++;
    }
    if (trial.correctionIntonation !== null) {
      categories.correction.total++;
      if (trial.correctionIntonation) categories.correction.correct++;
    }

    if (trial.responseCorrect === true) {
      categories.reinforcer.total += 5;
      if (trial.reinforcerImmediate) categories.reinforcer.correct++;
      if (trial.reinforcerEffective) categories.reinforcer.correct++;
      if (trial.reinforcerDescriptive) categories.reinforcer.correct++;
      if (trial.reinforcerIntonation) categories.reinforcer.correct++;
      if (trial.reinforcerAffectPlay) categories.reinforcer.correct++;
    }

    categories.pacing.total++;
    if (trial.pacingAdequate) categories.pacing.correct++;

    categories.extraSR.total++;
    if (trial.extraSR) categories.extraSR.correct++;

    categories.attention.total++;
    if (trial.attentionForDisruptive) categories.attention.correct++;
  });

  const getPercentage = (cat: { correct: number; total: number }) =>
    cat.total > 0 ? Math.round((cat.correct / cat.total) * 100) : 0;

  const totalCorrect =
    categories.setupMaterials.correct +
    categories.sd.correct +
    categories.correction.correct +
    categories.reinforcer.correct +
    categories.pacing.correct +
    categories.extraSR.correct +
    categories.attention.correct;

  const totalPossible =
    categories.setupMaterials.total +
    categories.sd.total +
    categories.correction.total +
    categories.reinforcer.total +
    categories.pacing.total +
    categories.extraSR.total +
    categories.attention.total;

  return {
    setupMaterials: getPercentage(categories.setupMaterials),
    sd: getPercentage(categories.sd),
    correction: getPercentage(categories.correction),
    reinforcer: getPercentage(categories.reinforcer),
    pacing: getPercentage(categories.pacing),
    extraSR: getPercentage(categories.extraSR),
    attention: getPercentage(categories.attention),
    overall: totalPossible > 0 ? Math.round((totalCorrect / totalPossible) * 100) : 0,
  };
};
