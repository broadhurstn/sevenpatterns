import { PatternCode, SECTIONS, getSectionWeight } from './quiz-data';

export type Answers = Record<number, string>; // questionId -> optionId

export interface PatternScore {
  pattern: PatternCode;
  score: number;
}

export interface ScoreResult {
  primary: PatternCode;
  secondary: PatternCode;
  scores: PatternScore[];
  rawScores: Record<PatternCode, number>;
}

const PATTERN_CODES: PatternCode[] = ['IT', 'GC', 'PL', 'MG', 'AD', 'AS', 'OG'];

export function calculateScores(answers: Answers): ScoreResult {
  const totals: Record<PatternCode, number> = {
    IT: 0, GC: 0, PL: 0, MG: 0, AD: 0, AS: 0, OG: 0, neutral: 0
  };

  for (const section of SECTIONS) {
    const sectionWeight = getSectionWeight(section.number);

    for (const question of section.questions) {
      const selectedOptionId = answers[question.id];
      if (!selectedOptionId) continue;

      const option = question.options.find(o => o.id === selectedOptionId);
      if (!option) continue;

      const effectiveWeight = question.weightOverride ?? sectionWeight;

      if (option.primary !== 'neutral') {
        totals[option.primary] += option.primaryWeight * effectiveWeight;
      }

      if (option.secondary && option.secondaryWeight) {
        totals[option.secondary] += option.secondaryWeight * effectiveWeight;
      }
    }
  }

  const scores: PatternScore[] = PATTERN_CODES
    .map(p => ({ pattern: p, score: totals[p] }))
    .sort((a, b) => b.score - a.score);

  const primary = scores[0].pattern;
  const secondary = scores[1].pattern;

  return { primary, secondary, scores, rawScores: totals };
}

// QA helper — run a synthetic persona through the scorer
export function runPersona(personaAnswers: Answers): ScoreResult {
  return calculateScores(personaAnswers);
}
