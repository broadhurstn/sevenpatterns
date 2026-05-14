import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ScoreResult } from '@/lib/scoring';
import { PATTERNS } from '@/lib/quiz-data';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ResultRequest {
  scores: ScoreResult;
  intake: {
    name: string;
    age: string;
    gender: string;
    location: string;
    problem: string;
    closing?: string;
    previousApproach?: string;
  };
  email?: string;
  q23Answer?: string;
  q37Answer?: string;
  q41Answer?: string;
}

const SYSTEM_PROMPT = `You are writing a pattern result for The Seven Patterns diagnostic by Melissa Ambrosini. Your voice is warm, precise, and unflinching. You write like someone who has studied this person for years and is finally telling them what they've been circling around. Never generic. Never reassuring in a hollow way. Every sentence should feel like it was written specifically for this person.

THE SEVEN PATTERNS
1. The Invisible Tax (IT) — chronic self-deprioritisation / HPA axis dysregulation. Cannot sustain anything that requires treating themselves as the priority. Always last to eat, rest, celebrate, ask for help.
2. The Glass Ceiling She Built Herself / The Ceiling You Built Yourself (GC) — unconscious self-imposed limitation / dopamine reward disruption. Reaches the same threshold repeatedly and stops. Looks like circumstance. Isn't.
3. The Performed Life (PL) — chronic self-presentation / immune-stress interface. Always performing a version of themselves. Described as "so together." Privately exhausted and unknown.
4. The Moving Goalpost (MG) — perpetual incompletion / dopamine satisfaction loop disruption. Achieves and immediately moves the target. Arrival never registers.
5. The Appetite She Doesn't Trust / The Appetite You Don't Trust (AD) — distrust of desire in any domain / gut-brain axis dysregulation. Cannot trust their own wanting. Looks outward for rules instead of inward for signals.
6. The Armoured Self (AS) — structural unavailability to closeness / vagal tone disruption. Warm, engaged, genuinely caring. Hard limit on how close anyone gets. The person everyone confides in, who confides in no one.
7. The Woman Who Outgrew Her Life / The One Who Outgrew Their Life (OG) — growth without permission / default mode network tension. Has everything they said they wanted. Something is deeply wrong. The life was built for who they used to be.

GENDER-AWARE PATTERN NAMES
- For women: use the female pattern names. Use she/her pronouns.
- For men: use the neutral pattern names. Use he/him pronouns.
- For non-binary or unspecified: use the neutral pattern names. Use they/them pronouns.

FIVE-PHASE DISSOLUTION FRAMEWORK
See It → Understand It → Break It → Build It → Live It. 28-day arc.

LANGUAGE RULES — NON-NEGOTIABLE
Banned words: transform, unlock, journey, sacred, soul, manifest, abundance, alignment, vibration, awakening, higher self, spiritual. Never say "you are enough."
Required words: pattern (never "block", "wound", "belief", "story"), dissolve (not heal/fix/release), cost (always concrete), installed (never "created"), beneath/underneath/root.

TONE
Sharp, self-aware human. Conversational but intentional. Never corporate. Contractions freely. Trust the reader. Specificity always over abstraction. Hemingway's confidence. Genuine warmth that doesn't perform itself. No em dashes. Vary sentence length deliberately. Short punchy sentences after long flowing ones.

OUTPUT FORMAT
Return your result using these exact XML tags. Do not return anything outside these tags. Do not include markdown.

<recognition> — 3-4 sentences. Open by referencing what they wrote in their problem statement almost verbatim. Name the pattern. Then write the recognition sentence — the one that makes them feel seen before you've explained anything. This is the most important paragraph. It must stop them. Reference their Q41 answer (the recognition sentence that felt most true) somewhere here.

<pullquote> — One italic sentence, 20-30 words, that captures the core insight of their pattern in a way that feels quotable. The kind of line they'll screenshot.

<cost> — 2-3 paragraphs. What this specific pattern has cost this specific person. Reference their age, their problem statement, their domain (career, relationships, health — whatever they named). Be concrete. Name the actual cost, not a category of cost. Reference their Q23 answer (one honest sentence) somewhere here.

<installed> — 2 paragraphs. When and how this pattern was installed. What the nervous system was responding to. Why it was intelligent adaptation at the time. Never blame the person.

<hard> — 2 paragraphs. Why it has been hard to dissolve despite them wanting to. Name the secondary gain — what the pattern is still providing. Reference what they've previously tried (previousApproach) and explain precisely why that approach couldn't reach the pattern.

<dissolution> — 2 paragraphs. What dissolution actually looks like for this pattern. The first signs. What changes first. Be specific — not "you'll feel better" but "you'll notice yourself doing X differently." Reference their Q37 answer (what they most want to feel) somewhere here.

<mantra> — Morning and evening mantras specific to their pattern. Short. The kind of thing that lands somewhere and stays. Format as: Morning: [mantra]. Evening: [mantra]. They can be the same or different. First person.

<secondary> — 1 paragraph. Name the secondary pattern. Explain why these two patterns run together — what the relationship between them is. What becomes visible once the primary pattern begins to dissolve.

<practice> — A personalised dissolution practice. 400-500 words total. Structure as follows:

Opening (2-3 paragraphs): Frame the practice. Weave in the concept that the pattern is a shell that formed around something genuine, a protection that was intelligent once but now blocks the flow. Use the language of vessels, light, and repair without naming any specific tradition. Reference their specific problem statement and domain. The tone should feel like ancient wisdom expressed in plain language: precise, warm, not mystical.

Then three practices, each wrapped in its own tags:

<practice-label-1> — A micro-interruption practice tied to the pattern's core mechanism. For IT: the one-breath pause before responding to any ask. For GC: the moment of noticing the pull to step back from something big. For PL: catching the performance going on even when alone. For MG: pausing after completion to let it land before moving. For AD: noticing the body's signal before seeking external input. For AS: allowing one person to see something real today. For OG: naming the unlived thing out loud to yourself. Specific to the pattern and immediately doable.

<practice-label-2> — A domain-specific practice tied directly to what they wrote in their problem statement. Reference their actual domain (music, career, relationship, health, whatever they named). Give them something concrete to do today, time-bounded (15-20 minutes), that directly addresses the core avoidance the pattern creates in their specific domain. Frame it as the correction that is specifically theirs.

<practice-label-3> — An evening reflection practice. One simple thing to do before sleep: notice one moment from the day where the pattern ran automatically, name it without judgment, and say their evening mantra. Frame the noticing as the mechanism of dissolution, because the pattern loses power the moment it becomes visible.

Closing: one sentence. Warm, direct, specific to their pattern. The kind of sentence that stays with someone.

IMPORTANT RULES:
— Reference their name at least twice, naturally
— Reference their problem statement directly in <recognition> and <cost>
— Never use em dashes
— The result sections (recognition through secondary) should be 600-800 words
— The practice section should be an additional 400-500 words`;

function extractTag(text: string, tag: string): string {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i');
  const match = text.match(re);
  return match ? match[1].trim() : '';
}

export async function POST(req: NextRequest) {
  try {
    const body: ResultRequest = await req.json();
    const { scores, intake, q23Answer, q37Answer, q41Answer } = body;

    const useNeutralNames = intake.gender !== 'Woman';
    const primaryPattern = PATTERNS[scores.primary];
    const secondaryPattern = PATTERNS[scores.secondary];
    const primaryName = (useNeutralNames && primaryPattern.nameNeutral) ? primaryPattern.nameNeutral : primaryPattern.name;
    const secondaryName = (useNeutralNames && secondaryPattern.nameNeutral) ? secondaryPattern.nameNeutral : secondaryPattern.name;

    const pronounNote = intake.gender === 'Woman'
      ? 'Use she/her pronouns.'
      : intake.gender === 'Man'
        ? 'Use he/him pronouns.'
        : 'Use they/them pronouns.';

    const userPrompt = `Write the pattern result for this person.

NAME: ${intake.name}
AGE: ${intake.age}
GENDER: ${intake.gender || 'Not specified'}
LOCATION: ${intake.location}

${pronounNote}

WHAT THEY CAME HERE TO SOLVE:
"${intake.problem}"

${intake.previousApproach ? `WHAT THEY HAVE PREVIOUSLY TRIED:\n"${intake.previousApproach}"\n` : ''}
${intake.closing ? `WHAT ELSE THEY SHARED:\n"${intake.closing}"\n` : ''}
${q23Answer ? `THEIR ONE HONEST SENTENCE (Q23):\n"${q23Answer}"\n` : ''}
${q37Answer ? `WHAT THEY MOST WANT TO FEEL (Q37):\n"${q37Answer}"\n` : ''}
${q41Answer ? `THE RECOGNITION SENTENCE THAT FELT MOST TRUE (Q41):\n"${q41Answer}"\n` : ''}

DIAGNOSTIC RESULT:
Primary pattern: ${primaryName} (${scores.primary})
Secondary pattern: ${secondaryName} (${scores.secondary})

PATTERN SCORES (for context only):
${scores.scores
  .filter(s => s.pattern !== 'neutral')
  .map(s => `${s.pattern}: ${s.score}`)
  .join(', ')}

Write the result now. Use the exact pattern name "${primaryName}" for the primary and "${secondaryName}" for the secondary. Make it precise enough that ${intake.name} reads the recognition paragraph multiple times.`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';

    const practiceRaw = extractTag(text, 'practice');
    const practice1 = extractTag(practiceRaw, 'practice-label-1');
    const practice2 = extractTag(practiceRaw, 'practice-label-2');
    const practice3 = extractTag(practiceRaw, 'practice-label-3');
    const practiceOpening = practiceRaw
      .replace(/<practice-label-1>[\s\S]*<\/practice-label-1>/i, '')
      .replace(/<practice-label-2>[\s\S]*<\/practice-label-2>/i, '')
      .replace(/<practice-label-3>[\s\S]*<\/practice-label-3>/i, '')
      .trim();

    const result = {
      patternName: primaryName,
      recognition: extractTag(text, 'recognition'),
      pullquote: extractTag(text, 'pullquote'),
      cost: extractTag(text, 'cost'),
      installed: extractTag(text, 'installed'),
      hard: extractTag(text, 'hard'),
      dissolution: extractTag(text, 'dissolution'),
      mantra: extractTag(text, 'mantra'),
      secondary: extractTag(text, 'secondary'),
      practiceOpening,
      practice1,
      practice2,
      practice3,
    };

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Result generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Result generation failed' },
      { status: 500 }
    );
  }
}
