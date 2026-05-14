import { SECTIONS, ALL_QUESTIONS, type PatternCode, type AnswerOption } from './lib/quiz-data';
import { calculateScores, type Answers } from './lib/scoring';

const TARGET_PATTERNS: PatternCode[] = ['IT', 'GC', 'PL', 'MG', 'AD', 'AS', 'OG'];

function contributionToPattern(option: AnswerOption, target: PatternCode): number {
  let score = 0;
  if (option.primary === target) score += option.primaryWeight;
  if (option.secondary === target) score += (option.secondaryWeight ?? 0);
  return score;
}

function buildPersona(target: PatternCode): Answers {
  const answers: Answers = {};

  for (const q of ALL_QUESTIONS) {
    let best: AnswerOption | null = null;
    let bestScore = -1;

    for (const opt of q.options) {
      const c = contributionToPattern(opt, target);
      if (c > bestScore) {
        bestScore = c;
        best = opt;
      }
    }

    // When no option scores for this pattern, pick a neutral to avoid inflating competitors
    if (bestScore === 0) {
      const neutral = q.options.find(o => o.primary === 'neutral');
      if (neutral) best = neutral;
    }

    answers[q.id] = best!.id;
  }

  return answers;
}

// ─── Run ─────────────────────────────────────────────────────────────────────

const PAD = 6;
const COL = 8;

const header = 'Persona'.padEnd(10)
  + TARGET_PATTERNS.map(p => p.padStart(COL)).join('')
  + '  Primary   Result';
const divider = '─'.repeat(header.length);

console.log('\n  Seven Patterns — Persona Scoring Matrix\n');
console.log(`  ${header}`);
console.log(`  ${divider}`);

let passes = 0;
let fails = 0;

for (const target of TARGET_PATTERNS) {
  const answers = buildPersona(target);
  const result = calculateScores(answers);

  const cells = TARGET_PATTERNS.map(p => {
    const score = result.rawScores[p] ?? 0;
    return String(score).padStart(COL);
  }).join('');

  const pass = result.primary === target;
  if (pass) passes++; else fails++;
  const tag = pass ? 'PASS' : 'FAIL';

  const line = `  ${target.padEnd(10)}${cells}  ${result.primary.padEnd(8)}  ${tag}`;
  console.log(line);
}

console.log(`  ${divider}`);
console.log(`\n  ${passes} passed, ${fails} failed out of ${TARGET_PATTERNS.length} personas\n`);

if (fails > 0) process.exit(1);
