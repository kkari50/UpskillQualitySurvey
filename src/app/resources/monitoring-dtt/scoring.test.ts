import { describe, it, expect } from "vitest";
import {
  type TrialCriteria,
  createEmptyTrial,
  getTrialCompletion,
  isTrialStarted,
  calculateScores,
} from "./scoring";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a trial with specific overrides on top of defaults. */
function makeTrial(overrides: Partial<TrialCriteria> = {}): TrialCriteria {
  return { ...createEmptyTrial(), ...overrides };
}

/** A trial where every field is "met" and response is correct. */
function perfectCorrectTrial(): TrialCriteria {
  return {
    setupMaterials: true,
    sdAttending: true,
    sdAsWritten: true,
    sdIntonation: true,
    responseCorrect: true,
    correctionTimely: null,
    correctionAttending: null,
    correctionAsWritten: null,
    correctionIntonation: null,
    reinforcerImmediate: true,
    reinforcerEffective: true,
    reinforcerDescriptive: true,
    reinforcerIntonation: true,
    reinforcerAffectPlay: true,
    pacingAdequate: true,
    extraSR: true,
    attentionForDisruptive: true,
  };
}

/** A trial where response is incorrect and all correction + base fields met. */
function perfectIncorrectTrial(): TrialCriteria {
  return {
    setupMaterials: true,
    sdAttending: true,
    sdAsWritten: true,
    sdIntonation: true,
    responseCorrect: false,
    correctionTimely: true,
    correctionAttending: true,
    correctionAsWritten: true,
    correctionIntonation: true,
    reinforcerImmediate: false,
    reinforcerEffective: false,
    reinforcerDescriptive: false,
    reinforcerIntonation: false,
    reinforcerAffectPlay: false,
    pacingAdequate: true,
    extraSR: true,
    attentionForDisruptive: true,
  };
}

// ===========================================================================
// createEmptyTrial
// ===========================================================================

describe("createEmptyTrial", () => {
  it("returns all boolean fields as false and correction fields as null", () => {
    const trial = createEmptyTrial();
    expect(trial.setupMaterials).toBe(false);
    expect(trial.sdAttending).toBe(false);
    expect(trial.sdAsWritten).toBe(false);
    expect(trial.sdIntonation).toBe(false);
    expect(trial.responseCorrect).toBeNull();
    expect(trial.correctionTimely).toBeNull();
    expect(trial.correctionAttending).toBeNull();
    expect(trial.correctionAsWritten).toBeNull();
    expect(trial.correctionIntonation).toBeNull();
    expect(trial.reinforcerImmediate).toBe(false);
    expect(trial.reinforcerEffective).toBe(false);
    expect(trial.reinforcerDescriptive).toBe(false);
    expect(trial.reinforcerIntonation).toBe(false);
    expect(trial.reinforcerAffectPlay).toBe(false);
    expect(trial.pacingAdequate).toBe(false);
    expect(trial.extraSR).toBe(false);
    expect(trial.attentionForDisruptive).toBe(false);
  });

  it("returns a new object each time (no shared references)", () => {
    const a = createEmptyTrial();
    const b = createEmptyTrial();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
});

// ===========================================================================
// isTrialStarted
// ===========================================================================

describe("isTrialStarted", () => {
  it("returns false for a fresh empty trial", () => {
    expect(isTrialStarted(createEmptyTrial())).toBe(false);
  });

  it("returns true when responseCorrect is set to true", () => {
    expect(isTrialStarted(makeTrial({ responseCorrect: true }))).toBe(true);
  });

  it("returns true when responseCorrect is set to false", () => {
    expect(isTrialStarted(makeTrial({ responseCorrect: false }))).toBe(true);
  });

  it("returns true when any boolean field is true", () => {
    expect(isTrialStarted(makeTrial({ setupMaterials: true }))).toBe(true);
    expect(isTrialStarted(makeTrial({ pacingAdequate: true }))).toBe(true);
    expect(isTrialStarted(makeTrial({ reinforcerImmediate: true }))).toBe(true);
  });

  it("returns false when all booleans are false and responseCorrect is null", () => {
    expect(isTrialStarted(createEmptyTrial())).toBe(false);
  });
});

// ===========================================================================
// getTrialCompletion
// ===========================================================================

describe("getTrialCompletion", () => {
  describe("when responseCorrect is null (no response yet)", () => {
    // Base fields: 7 + 1 (responseCorrect) = 8 total
    it("returns 0% for a fresh empty trial", () => {
      expect(getTrialCompletion(createEmptyTrial())).toBe(0);
    });

    it("counts base fields correctly", () => {
      // 1 of 8 fields completed (setupMaterials true, responseCorrect still null)
      const trial = makeTrial({ setupMaterials: true });
      expect(getTrialCompletion(trial)).toBe(Math.round((1 / 8) * 100)); // 13%
    });

    it("does NOT count reinforcer fields (they are excluded when response is not correct)", () => {
      const trial = makeTrial({
        reinforcerImmediate: true,
        reinforcerEffective: true,
      });
      // reinforcer values exist but are ignored; total is still 8, completed = 0
      expect(getTrialCompletion(trial)).toBe(0);
    });

    it("reaches 88% when all 7 base fields are true but responseCorrect is null", () => {
      const trial = makeTrial({
        setupMaterials: true,
        sdAttending: true,
        sdAsWritten: true,
        sdIntonation: true,
        pacingAdequate: true,
        extraSR: true,
        attentionForDisruptive: true,
      });
      // 7 completed out of 8 total
      expect(getTrialCompletion(trial)).toBe(Math.round((7 / 8) * 100)); // 88%
    });
  });

  describe("when responseCorrect is true", () => {
    // Base 7 + responseCorrect + 5 reinforcer = 13 total
    it("returns correct percentage with only responseCorrect set", () => {
      const trial = makeTrial({ responseCorrect: true });
      // 1 completed (responseCorrect) out of 13 total
      expect(getTrialCompletion(trial)).toBe(Math.round((1 / 13) * 100)); // 8%
    });

    it("returns 100% when all base + reinforcer fields are met", () => {
      expect(getTrialCompletion(perfectCorrectTrial())).toBe(100);
    });

    it("counts reinforcer fields toward completion", () => {
      const trial = makeTrial({
        responseCorrect: true,
        reinforcerImmediate: true,
        reinforcerEffective: true,
      });
      // completed: 1 (responseCorrect) + 2 (reinforcer) = 3 out of 13
      expect(getTrialCompletion(trial)).toBe(Math.round((3 / 13) * 100)); // 23%
    });

    it("does NOT count correction fields even if they are non-null", () => {
      const trial = makeTrial({
        responseCorrect: true,
        correctionTimely: true,
        correctionAttending: true,
      });
      // total stays 13 (not 17), correction values are ignored
      // completed: 1 (responseCorrect) out of 13
      expect(getTrialCompletion(trial)).toBe(Math.round((1 / 13) * 100)); // 8%
    });
  });

  describe("when responseCorrect is false", () => {
    // Base 7 + responseCorrect + 4 correction = 12 total
    it("returns correct percentage with only responseCorrect set", () => {
      const trial = makeTrial({ responseCorrect: false });
      // 1 completed (responseCorrect) out of 12 total
      expect(getTrialCompletion(trial)).toBe(Math.round((1 / 12) * 100)); // 8%
    });

    it("returns 100% when all base + correction fields are met", () => {
      expect(getTrialCompletion(perfectIncorrectTrial())).toBe(100);
    });

    it("counts correction fields toward completion", () => {
      const trial = makeTrial({
        responseCorrect: false,
        correctionTimely: true,
        correctionAsWritten: true,
      });
      // completed: 1 (responseCorrect) + 2 (correction) = 3 out of 12
      expect(getTrialCompletion(trial)).toBe(Math.round((3 / 12) * 100)); // 25%
    });

    it("does NOT count reinforcer fields even if they are true", () => {
      const trial = makeTrial({
        responseCorrect: false,
        reinforcerImmediate: true,
        reinforcerEffective: true,
      });
      // total stays 12, reinforcer values ignored
      // completed: 1 (responseCorrect) out of 12
      expect(getTrialCompletion(trial)).toBe(Math.round((1 / 12) * 100)); // 8%
    });
  });

  describe("total field counts match spec", () => {
    it("null response = 8 total fields", () => {
      // We can verify by checking that 7/8 base fields = 88%
      const trial = makeTrial({
        setupMaterials: true,
        sdAttending: true,
        sdAsWritten: true,
        sdIntonation: true,
        pacingAdequate: true,
        extraSR: true,
        attentionForDisruptive: true,
      });
      // 7/8 = 87.5 → rounds to 88
      expect(getTrialCompletion(trial)).toBe(88);
    });

    it("correct response = 13 total fields", () => {
      // All 13 fields met → 100%
      expect(getTrialCompletion(perfectCorrectTrial())).toBe(100);
      // 12 of 13 → 92%
      const trial = { ...perfectCorrectTrial(), reinforcerAffectPlay: false };
      expect(getTrialCompletion(trial)).toBe(Math.round((12 / 13) * 100)); // 92%
    });

    it("incorrect response = 12 total fields", () => {
      // All 12 fields met → 100%
      expect(getTrialCompletion(perfectIncorrectTrial())).toBe(100);
      // 11 of 12 → 92%
      const trial = { ...perfectIncorrectTrial(), correctionIntonation: false };
      expect(getTrialCompletion(trial)).toBe(Math.round((11 / 12) * 100)); // 92%
    });
  });
});

// ===========================================================================
// calculateScores
// ===========================================================================

describe("calculateScores", () => {
  describe("single trial — all correct response", () => {
    it("returns 100% across all applicable categories for a perfect correct trial", () => {
      const scores = calculateScores([perfectCorrectTrial()]);
      expect(scores.setupMaterials).toBe(100);
      expect(scores.sd).toBe(100);
      expect(scores.reinforcer).toBe(100);
      expect(scores.pacing).toBe(100);
      expect(scores.extraSR).toBe(100);
      expect(scores.attention).toBe(100);
      expect(scores.overall).toBe(100);
    });

    it("returns 0% for correction when response is correct (no correction fields counted)", () => {
      const scores = calculateScores([perfectCorrectTrial()]);
      expect(scores.correction).toBe(0); // 0/0 → 0%
    });
  });

  describe("single trial — incorrect response", () => {
    it("returns 100% for correction when all correction fields are met", () => {
      const scores = calculateScores([perfectIncorrectTrial()]);
      expect(scores.correction).toBe(100);
    });

    it("returns 0% for reinforcer when response is incorrect (excluded from scoring)", () => {
      const scores = calculateScores([perfectIncorrectTrial()]);
      expect(scores.reinforcer).toBe(0); // 0/0 → 0%
    });

    it("returns 100% for base categories that are all met", () => {
      const scores = calculateScores([perfectIncorrectTrial()]);
      expect(scores.setupMaterials).toBe(100);
      expect(scores.sd).toBe(100);
      expect(scores.pacing).toBe(100);
      expect(scores.extraSR).toBe(100);
      expect(scores.attention).toBe(100);
    });
  });

  describe("single trial — null response", () => {
    it("returns 0% across all categories for an empty trial", () => {
      const scores = calculateScores([createEmptyTrial()]);
      expect(scores.setupMaterials).toBe(0);
      expect(scores.sd).toBe(0);
      expect(scores.correction).toBe(0);
      expect(scores.reinforcer).toBe(0);
      expect(scores.pacing).toBe(0);
      expect(scores.extraSR).toBe(0);
      expect(scores.attention).toBe(0);
      expect(scores.overall).toBe(0);
    });

    it("still counts base fields even when response is null", () => {
      const trial = makeTrial({
        setupMaterials: true,
        sdAttending: true,
        sdAsWritten: true,
        sdIntonation: true,
        pacingAdequate: true,
        extraSR: true,
        attentionForDisruptive: true,
      });
      const scores = calculateScores([trial]);
      expect(scores.setupMaterials).toBe(100);
      expect(scores.sd).toBe(100);
      expect(scores.pacing).toBe(100);
      expect(scores.extraSR).toBe(100);
      expect(scores.attention).toBe(100);
    });
  });

  describe("reinforcer scoring — conditional on responseCorrect", () => {
    it("counts reinforcer fields only when responseCorrect === true", () => {
      const trial = makeTrial({
        responseCorrect: true,
        reinforcerImmediate: true,
        reinforcerEffective: true,
        reinforcerDescriptive: false,
        reinforcerIntonation: false,
        reinforcerAffectPlay: false,
      });
      const scores = calculateScores([trial]);
      expect(scores.reinforcer).toBe(Math.round((2 / 5) * 100)); // 40%
    });

    it("excludes reinforcer from scoring when responseCorrect is false", () => {
      const trial = makeTrial({
        responseCorrect: false,
        reinforcerImmediate: true,
        reinforcerEffective: true,
      });
      const scores = calculateScores([trial]);
      expect(scores.reinforcer).toBe(0); // 0/0 → 0%
    });

    it("excludes reinforcer from scoring when responseCorrect is null", () => {
      const trial = makeTrial({
        reinforcerImmediate: true,
        reinforcerEffective: true,
      });
      const scores = calculateScores([trial]);
      expect(scores.reinforcer).toBe(0); // 0/0 → 0%
    });
  });

  describe("correction scoring — based on non-null field values", () => {
    it("counts correction fields when they are non-null", () => {
      const trial = makeTrial({
        responseCorrect: false,
        correctionTimely: true,
        correctionAttending: false,
        correctionAsWritten: true,
        correctionIntonation: true,
      });
      const scores = calculateScores([trial]);
      // 3 correct out of 4 total
      expect(scores.correction).toBe(Math.round((3 / 4) * 100)); // 75%
    });

    it("returns 0% when all correction fields are null (response correct or null)", () => {
      const trial = makeTrial({ responseCorrect: true });
      const scores = calculateScores([trial]);
      expect(scores.correction).toBe(0); // 0/0 → 0%
    });
  });

  describe("SD scoring", () => {
    it("counts each SD sub-field independently (3 per trial)", () => {
      const trial = makeTrial({
        sdAttending: true,
        sdAsWritten: false,
        sdIntonation: true,
      });
      const scores = calculateScores([trial]);
      expect(scores.sd).toBe(Math.round((2 / 3) * 100)); // 67%
    });
  });

  describe("overall score calculation", () => {
    it("computes overall as total correct / total possible across all categories", () => {
      const trial = perfectCorrectTrial();
      const scores = calculateScores([trial]);
      // Perfect correct trial: setup(1/1) + sd(3/3) + reinforcer(5/5) + pacing(1/1) + extraSR(1/1) + attention(1/1) = 12/12
      // correction = 0/0 (excluded)
      expect(scores.overall).toBe(100);
    });

    it("computes overall correctly for a perfect incorrect trial", () => {
      const trial = perfectIncorrectTrial();
      const scores = calculateScores([trial]);
      // setup(1/1) + sd(3/3) + correction(4/4) + pacing(1/1) + extraSR(1/1) + attention(1/1) = 11/11
      // reinforcer = 0/0 (excluded)
      expect(scores.overall).toBe(100);
    });

    it("returns 0% when no trials have any fields set", () => {
      const scores = calculateScores([createEmptyTrial()]);
      expect(scores.overall).toBe(0);
    });
  });

  describe("multi-trial scoring", () => {
    it("aggregates across multiple trials correctly", () => {
      const trial1 = perfectCorrectTrial();
      const trial2 = perfectIncorrectTrial();
      const scores = calculateScores([trial1, trial2]);

      expect(scores.setupMaterials).toBe(100); // 2/2
      expect(scores.sd).toBe(100); // 6/6
      expect(scores.pacing).toBe(100); // 2/2
      expect(scores.extraSR).toBe(100); // 2/2
      expect(scores.attention).toBe(100); // 2/2

      // Reinforcer: only trial1 counts (5/5)
      expect(scores.reinforcer).toBe(100);

      // Correction: only trial2 has non-null correction fields (4/4)
      expect(scores.correction).toBe(100);

      expect(scores.overall).toBe(100); // 23/23
    });

    it("averages partial scores across trials", () => {
      const trial1 = makeTrial({
        responseCorrect: true,
        setupMaterials: true,
        reinforcerImmediate: true,
      });
      const trial2 = makeTrial({
        responseCorrect: true,
        setupMaterials: false,
        reinforcerImmediate: false,
        reinforcerEffective: true,
      });
      const scores = calculateScores([trial1, trial2]);

      // setupMaterials: 1/2 = 50%
      expect(scores.setupMaterials).toBe(50);

      // reinforcer: trial1 has 1/5, trial2 has 1/5 → 2/10 = 20%
      expect(scores.reinforcer).toBe(20);
    });

    it("handles mix of correct, incorrect, and null responses", () => {
      const correctTrial = makeTrial({
        responseCorrect: true,
        setupMaterials: true,
        reinforcerImmediate: true,
        reinforcerEffective: true,
        reinforcerDescriptive: true,
        reinforcerIntonation: true,
        reinforcerAffectPlay: true,
      });
      const incorrectTrial = makeTrial({
        responseCorrect: false,
        setupMaterials: true,
        correctionTimely: true,
        correctionAttending: true,
        correctionAsWritten: true,
        correctionIntonation: true,
      });
      const nullTrial = makeTrial({
        setupMaterials: true,
      });

      const scores = calculateScores([correctTrial, incorrectTrial, nullTrial]);

      // setupMaterials: 3/3 = 100%
      expect(scores.setupMaterials).toBe(100);

      // reinforcer: only correctTrial counts → 5/5 = 100%
      expect(scores.reinforcer).toBe(100);

      // correction: only incorrectTrial has non-null → 4/4 = 100%
      expect(scores.correction).toBe(100);

      // sd: 0/9 = 0% (none set)
      expect(scores.sd).toBe(0);
    });
  });

  describe("edge case: empty trials array", () => {
    it("returns 0% for all scores with no trials", () => {
      const scores = calculateScores([]);
      expect(scores.setupMaterials).toBe(0);
      expect(scores.sd).toBe(0);
      expect(scores.correction).toBe(0);
      expect(scores.reinforcer).toBe(0);
      expect(scores.pacing).toBe(0);
      expect(scores.extraSR).toBe(0);
      expect(scores.attention).toBe(0);
      expect(scores.overall).toBe(0);
    });
  });

  describe("edge case: toggle scenario — values preserved but excluded", () => {
    it("excludes reinforcer from scoring when response toggled from true to false", () => {
      // Simulates: user set reinforcer values while correct, then toggled to incorrect
      const trial = makeTrial({
        responseCorrect: false,
        reinforcerImmediate: true,
        reinforcerEffective: true,
        reinforcerDescriptive: true,
        reinforcerIntonation: true,
        reinforcerAffectPlay: true,
      });
      const scores = calculateScores([trial]);
      // Reinforcer values exist but responseCorrect !== true, so excluded
      expect(scores.reinforcer).toBe(0);
    });

    it("still counts correction fields when toggled from false to true (pre-existing behavior)", () => {
      // Simulates: user set correction values while incorrect, then toggled to correct
      // Note: correction uses !== null check, so non-null values are still counted
      const trial = makeTrial({
        responseCorrect: true,
        correctionTimely: true,
        correctionAttending: true,
        correctionAsWritten: false,
        correctionIntonation: false,
      });
      const scores = calculateScores([trial]);
      // Correction fields are non-null so they get counted (2 correct / 4 total)
      expect(scores.correction).toBe(50);
    });
  });
});
