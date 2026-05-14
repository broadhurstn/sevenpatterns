export type PatternCode = 'IT' | 'GC' | 'PL' | 'MG' | 'AD' | 'AS' | 'OG' | 'neutral';

export interface AnswerOption {
  id: string;
  text: string;
  primary: PatternCode;
  primaryWeight: number;
  secondary?: PatternCode;
  secondaryWeight?: number;
}

export interface Question {
  id: number;
  section: number;
  text: string;
  label?: string;
  weightOverride?: number;
  options: AnswerOption[];
}

export interface Section {
  number: number;
  title: string;
  subtitle: string;
  weight: number;
  questions: Question[];
}

export const PATTERNS: Record<PatternCode, { name: string; shortName: string; nameNeutral?: string; shortNameNeutral?: string }> = {
  IT: { name: 'The Invisible Tax', shortName: 'Invisible Tax' },
  GC: { name: 'The Glass Ceiling She Built Herself', shortName: 'Glass Ceiling', nameNeutral: 'The Ceiling You Built Yourself', shortNameNeutral: 'Ceiling You Built' },
  PL: { name: 'The Performed Life', shortName: 'Performed Life' },
  MG: { name: 'The Moving Goalpost', shortName: 'Moving Goalpost' },
  AD: { name: "The Appetite She Doesn't Trust", shortName: "Appetite She Doesn't Trust", nameNeutral: "The Appetite You Don't Trust", shortNameNeutral: "Appetite You Don't Trust" },
  AS: { name: 'The Armoured Self', shortName: 'Armoured Self' },
  OG: { name: 'The Woman Who Outgrew Her Life', shortName: 'Woman Who Outgrew Her Life', nameNeutral: 'The One Who Outgrew Their Life', shortNameNeutral: 'One Who Outgrew Their Life' },
  neutral: { name: 'Neutral', shortName: 'Neutral' },
};

export const SECTIONS: Section[] = [
  // ─── Section 1: How You Move Through the World (weight 1x) ──────────────────
  {
    number: 1,
    title: 'How You Move Through the World',
    subtitle: 'There are no right answers here. Choose the one that fits closest.',
    weight: 1,
    questions: [
      {
        id: 1,
        section: 1,
        text: "When someone asks you for help and you genuinely don't have the capacity, what most often happens?",
        options: [
          { id: '1A', text: "I say yes anyway. I'll find the capacity somewhere.", primary: 'IT', primaryWeight: 3 },
          { id: '1B', text: "I say yes, feel resentful about it later, then feel guilty for the resentment.", primary: 'IT', primaryWeight: 3 },
          { id: '1C', text: "I manage to say no, but I spend time feeling bad about it.", primary: 'AS', primaryWeight: 3, secondary: 'IT', secondaryWeight: 1 },
          { id: '1D', text: "I say yes, then work hard to make sure nobody can see what it actually cost me.", primary: 'PL', primaryWeight: 3 },
          { id: '1E', text: "I say no fairly easily. My time is mine to manage.", primary: 'MG', primaryWeight: 2, secondary: 'OG', secondaryWeight: 1 },
        ],
      },
      {
        id: 2,
        section: 1,
        text: "At the end of a day when you've accomplished a lot, what arrives first?",
        options: [
          { id: '2A', text: "Genuine satisfaction. I can actually feel it land.", primary: 'neutral', primaryWeight: 0 },
          { id: '2B', text: "A mental inventory of what didn't get done.", primary: 'MG', primaryWeight: 3 },
          { id: '2C', text: "Brief relief, then almost immediately: what's next?", primary: 'MG', primaryWeight: 3 },
          { id: '2D', text: "A quiet flatness. Something should feel better than this.", primary: 'MG', primaryWeight: 3 },
          { id: '2E', text: "I get through the day performing well. But alone at the end of it, there's a version of me that's been waiting to exist.", primary: 'PL', primaryWeight: 3 },
        ],
      },
      {
        id: 3,
        section: 1,
        text: "When you walk into a room full of people you don't know, the version of you that shows up is...",
        options: [
          { id: '3A', text: "Warm, capable, engaged — and slightly exhausting to maintain.", primary: 'PL', primaryWeight: 3 },
          { id: '3B', text: "Quiet until I've read the room and know where I fit.", primary: 'AS', primaryWeight: 3 },
          { id: '3C', text: "Someone who finds the person who needs looking after.", primary: 'IT', primaryWeight: 3 },
          { id: '3D', text: "Confident in most rooms, but there are specific rooms where I shrink.", primary: 'GC', primaryWeight: 3 },
          { id: '3E', text: "Genuinely comfortable. I like meeting people.", primary: 'neutral', primaryWeight: 0 },
        ],
      },
      {
        id: 4,
        section: 1,
        text: "When you have something important you've been meaning to do for yourself — not for anyone else — it most often...",
        options: [
          { id: '4A', text: "Gets done. I prioritise myself as much as anyone else.", primary: 'neutral', primaryWeight: 0 },
          { id: '4B', text: "Slides to the bottom. Other people's needs keep landing above it.", primary: 'IT', primaryWeight: 3 },
          { id: '4C', text: "Gets done eventually, but only after everything else is handled.", primary: 'IT', primaryWeight: 3 },
          { id: '4D', text: "Sits on the list as a quiet reminder of what I haven't done for myself yet.", primary: 'IT', primaryWeight: 3 },
          { id: '4E', text: "I've stopped adding things like that to the list. It started to feel pointless.", primary: 'IT', primaryWeight: 3, secondary: 'AS', secondaryWeight: 1 },
        ],
      },
      {
        id: 5,
        section: 1,
        text: "When something goes genuinely well for you — a win, a compliment, good news — your first internal response is...",
        options: [
          { id: '5A', text: "Pleasure, followed quickly by wondering when the other shoe will drop.", primary: 'AS', primaryWeight: 3, secondary: 'GC', secondaryWeight: 1 },
          { id: '5B', text: "I immediately think of all the reasons it might not last or might not be as good as it seems.", primary: 'GC', primaryWeight: 3 },
          { id: '5C', text: "I deflect or minimise it, especially in front of others.", primary: 'PL', primaryWeight: 3, secondary: 'IT', secondaryWeight: 1 },
          { id: '5D', text: "I feel it briefly, then move straight to what's next.", primary: 'MG', primaryWeight: 3 },
          { id: '5E', text: "I sit with it. I let it land.", primary: 'neutral', primaryWeight: 0 },
        ],
      },
      {
        id: 6,
        section: 1,
        text: "Your relationship with rest is...",
        options: [
          { id: '6A', text: "I rest when everything is done. Which means I rarely rest.", primary: 'IT', primaryWeight: 3, secondary: 'MG', secondaryWeight: 1 },
          { id: '6B', text: "I can lie down, but my mind is already somewhere else. Rest doesn't quite reach me.", primary: 'MG', primaryWeight: 3 },
          { id: '6C', text: "Rest is fine but I feel I need to have earned it first.", primary: 'IT', primaryWeight: 3 },
          { id: '6D', text: "I can rest. What I can't do is shake the feeling that something is quietly wrong, even when nothing specific is.", primary: 'OG', primaryWeight: 3 },
          { id: '6E', text: "I rest well. It doesn't feel like a problem.", primary: 'neutral', primaryWeight: 0 },
        ],
      },
    ],
  },

  // ─── Section 2: Your Body and Energy (weight 1.5x) ──────────────────────────
  {
    number: 2,
    title: 'Your Body and Energy',
    subtitle: 'Your body carries the pattern before your mind can name it. Answer from what you actually notice, not what you think you should.',
    weight: 1.5,
    questions: [
      {
        id: 7,
        section: 2,
        text: "When you are stressed, your body most reliably...",
        options: [
          { id: '7A', text: "Holds it in my chest and shoulders. I stay functional but tight.", primary: 'AS', primaryWeight: 3 },
          { id: '7B', text: "Gets exhausted in a way that sleep doesn't fix.", primary: 'IT', primaryWeight: 3 },
          { id: '7C', text: "Shuts down my appetite or makes me eat in a way I later regret.", primary: 'AD', primaryWeight: 3 },
          { id: '7D', text: "Speeds up. I get more productive, not less — until I crash.", primary: 'MG', primaryWeight: 3 },
          { id: '7E', text: "Gets sick. My immune system goes first.", primary: 'PL', primaryWeight: 3, secondary: 'IT', secondaryWeight: 1 },
        ],
      },
      {
        id: 8,
        section: 2,
        text: "Your energy through the day is most accurately described as...",
        options: [
          { id: '8A', text: "Depleted. I start behind and never catch up.", primary: 'IT', primaryWeight: 3 },
          { id: '8B', text: "High until I crash, then very low — and the crash always surprises me.", primary: 'MG', primaryWeight: 3 },
          { id: '8C', text: "Steady, but it's effort. I'm managing my presentation of energy more than the energy itself.", primary: 'PL', primaryWeight: 3 },
          { id: '8D', text: "Inconsistent in ways I can't predict or control.", primary: 'AD', primaryWeight: 3 },
          { id: '8E', text: "Dependent on who I'm with. Some people drain me completely; others restore me.", primary: 'AS', primaryWeight: 3, secondary: 'IT', secondaryWeight: 1 },
        ],
      },
      {
        id: 9,
        section: 2,
        text: "When someone offers to take care of you — cook for you, help you, give you time to rest — you most often feel...",
        options: [
          { id: '9A', text: "Genuinely grateful and able to receive it.", primary: 'neutral', primaryWeight: 0 },
          { id: '9B', text: "Uncomfortable. I'd rather be the one giving.", primary: 'IT', primaryWeight: 3 },
          { id: '9C', text: "Grateful but guilty — like I need to immediately do something for them in return.", primary: 'IT', primaryWeight: 3 },
          { id: '9D', text: "Slightly suspicious of what they might need from me later.", primary: 'AS', primaryWeight: 3 },
          { id: '9E', text: "Visible in a way that feels exposing. I'd rather manage myself privately.", primary: 'PL', primaryWeight: 3, secondary: 'AS', secondaryWeight: 1 },
        ],
      },
      {
        id: 10,
        section: 2,
        text: "Your relationship with physical hunger is...",
        options: [
          { id: '10A', text: "Straightforward. I eat when I'm hungry.", primary: 'neutral', primaryWeight: 0 },
          { id: '10B', text: "Complicated. There are rules involved, even if I made them myself.", primary: 'AD', primaryWeight: 3 },
          { id: '10C', text: "I often don't notice hunger until I'm well past it.", primary: 'IT', primaryWeight: 3 },
          { id: '10D', text: "I use food as a signal about how I'm doing — eating more or less depending on stress.", primary: 'AD', primaryWeight: 3 },
          { id: '10E', text: "Fine mostly, but I eat in a way I'm not entirely proud of when I'm alone.", primary: 'AD', primaryWeight: 3, secondary: 'PL', secondaryWeight: 1 },
        ],
      },
      {
        id: 11,
        section: 2,
        text: "When you lie down to rest, what arrives most consistently?",
        options: [
          { id: '11A', text: "Sleep, fairly easily.", primary: 'neutral', primaryWeight: 0 },
          { id: '11B', text: "A list. All the things I should be doing instead.", primary: 'IT', primaryWeight: 3, secondary: 'MG', secondaryWeight: 1 },
          { id: '11C', text: "A low-grade anxiety that doesn't have a specific cause.", primary: 'OG', primaryWeight: 3, secondary: 'AS', secondaryWeight: 1 },
          { id: '11D', text: "The feeling that this is earned, but I need to get back up soon.", primary: 'IT', primaryWeight: 3 },
          { id: '11E', text: "Nothing particularly difficult. I'm good at switching off.", primary: 'neutral', primaryWeight: 0 },
        ],
      },
      {
        id: 12,
        section: 2,
        text: "The physical symptom that follows you most consistently is...",
        options: [
          { id: '12A', text: "Exhaustion that doesn't resolve with sleep or rest.", primary: 'IT', primaryWeight: 3 },
          { id: '12B', text: "Tension — chest, jaw, shoulders — that never fully releases.", primary: 'AS', primaryWeight: 3 },
          { id: '12C', text: "Gut issues. Digestion that's unpredictable or uncomfortable.", primary: 'AD', primaryWeight: 3 },
          { id: '12D', text: "A kind of flatness — not depressed, but not quite fully alive either.", primary: 'MG', primaryWeight: 3, secondary: 'OG', secondaryWeight: 1 },
          { id: '12E', text: "Skin, immune, or autoimmune issues that seem connected to stress.", primary: 'PL', primaryWeight: 3 },
        ],
      },
    ],
  },

  // ─── Section 3: Relationships and Closeness (weight 2x) ─────────────────────
  {
    number: 3,
    title: 'Relationships and Closeness',
    subtitle: 'These questions are about what actually happens, not what you wish happened.',
    weight: 2,
    questions: [
      {
        id: 13,
        section: 3,
        text: "When someone you love is struggling, your role is most naturally...",
        options: [
          { id: '13A', text: "The one who knows what to do and does it. I move toward the problem.", primary: 'IT', primaryWeight: 3 },
          { id: '13B', text: "The one who listens and holds space, without necessarily sharing my own response to it.", primary: 'AS', primaryWeight: 3 },
          { id: '13C', text: "The one who stays strong so they don't have to worry about me too.", primary: 'PL', primaryWeight: 3, secondary: 'IT', secondaryWeight: 1 },
          { id: '13D', text: "Present, but aware that this is taking from a tank that wasn't full.", primary: 'IT', primaryWeight: 3 },
          { id: '13E', text: "There with them. I don't manage it — I just feel it with them.", primary: 'neutral', primaryWeight: 0 },
        ],
      },
      {
        id: 14,
        section: 3,
        text: "The last time someone tried to take care of you, you...",
        options: [
          { id: '14A', text: "Accepted it and it felt good.", primary: 'neutral', primaryWeight: 0 },
          { id: '14B', text: "Redirected the conversation back to them fairly quickly.", primary: 'AS', primaryWeight: 3 },
          { id: '14C', text: "Said thank you but felt the need to minimise what they were taking care of.", primary: 'IT', primaryWeight: 3, secondary: 'PL', secondaryWeight: 1 },
          { id: '14D', text: "Felt seen and slightly exposed at the same time.", primary: 'AS', primaryWeight: 3 },
          { id: '14E', text: "Performed being okay with it while feeling quietly uncomfortable.", primary: 'PL', primaryWeight: 3 },
        ],
      },
      {
        id: 15,
        section: 3,
        text: "In your closest relationships, the person who knows you most completely is...",
        options: [
          { id: '15A', text: "My partner or closest friend — they know me well.", primary: 'neutral', primaryWeight: 0 },
          { id: '15B', text: "No one, really. I know them well. They know a version of me.", primary: 'AS', primaryWeight: 3 },
          { id: '15C', text: "Probably no one. I'm not sure I've let anyone fully in.", primary: 'AS', primaryWeight: 3 },
          { id: '15D', text: "Me. I process privately and share selectively.", primary: 'AS', primaryWeight: 3, secondary: 'PL', secondaryWeight: 1 },
          { id: '15E', text: "Different people know different pieces, but no one has the whole picture.", primary: 'PL', primaryWeight: 3, secondary: 'AS', secondaryWeight: 1 },
        ],
      },
      {
        id: 16,
        section: 3,
        text: "When a relationship feels very close — genuinely intimate — what arrives alongside the warmth?",
        options: [
          { id: '16A', text: "Nothing. I like closeness.", primary: 'neutral', primaryWeight: 0 },
          { id: '16B', text: "A faint anxiety. Like it could be taken away.", primary: 'AS', primaryWeight: 3 },
          { id: '16C', text: "The urge to do something useful for them, to earn my place.", primary: 'IT', primaryWeight: 3 },
          { id: '16D', text: "A sense that I need to be careful what I show next.", primary: 'AS', primaryWeight: 3, secondary: 'PL', secondaryWeight: 1 },
          { id: '16E', text: "A quiet monitoring of whether I'm being too much.", primary: 'IT', primaryWeight: 3, secondary: 'AD', secondaryWeight: 1 },
        ],
      },
      {
        id: 17,
        section: 3,
        text: "Your closest friends would say you're always there for them. When you're struggling, you...",
        options: [
          { id: '17A', text: "Tell them. They know how I'm doing.", primary: 'neutral', primaryWeight: 0 },
          { id: '17B', text: "Give them enough to not worry, not enough to actually know.", primary: 'PL', primaryWeight: 3, secondary: 'AS', secondaryWeight: 1 },
          { id: '17C', text: "Handle it privately. I don't want to be a burden.", primary: 'IT', primaryWeight: 3 },
          { id: '17D', text: "Wait until I've resolved it, then mention it in past tense.", primary: 'AS', primaryWeight: 3 },
          { id: '17E', text: "Tell them I'm fine. Then feel very alone in the middle of the night.", primary: 'PL', primaryWeight: 3, secondary: 'AS', secondaryWeight: 1 },
        ],
      },
      {
        id: 18,
        section: 3,
        text: "When someone gets close enough to see something you didn't intend to show, your first response is...",
        options: [
          { id: '18A', text: "Relief. It's tiring holding it.", primary: 'neutral', primaryWeight: 0 },
          { id: '18B', text: "A quick move to manage how they're interpreting it.", primary: 'PL', primaryWeight: 3 },
          { id: '18C', text: "Pull back. Not dramatically — just enough to reestablish distance.", primary: 'AS', primaryWeight: 3 },
          { id: '18D', text: "Make it smaller than it is, or frame it as something I've already dealt with.", primary: 'IT', primaryWeight: 3, secondary: 'PL', secondaryWeight: 1 },
          { id: '18E', text: "Stay with it, even if it's uncomfortable.", primary: 'neutral', primaryWeight: 0 },
        ],
      },
    ],
  },

  // ─── Section 4: History and Attempts (weight 1.5x) ──────────────────────────
  {
    number: 4,
    title: 'History and Attempts',
    subtitle: "What you've already tried matters. It tells us exactly what hasn't reached the root — and why.",
    weight: 1.5,
    questions: [
      {
        id: 19,
        section: 4,
        text: "The problem you described at the beginning — have you tried to solve it before?",
        options: [
          { id: '19A', text: "Many times. With significant time, money, and effort.", primary: 'neutral', primaryWeight: 0 },
          { id: '19B', text: "A few times. It helped but never fully shifted.", primary: 'neutral', primaryWeight: 0 },
          { id: '19C', text: "Some reflection, but nothing formal or sustained.", primary: 'neutral', primaryWeight: 0 },
          { id: '19D', text: "Not much. I haven't known where to start.", primary: 'neutral', primaryWeight: 0 },
          { id: '19E', text: "I've tried things, but framed it as managing the symptoms rather than solving the root.", primary: 'IT', primaryWeight: 3, secondary: 'PL', secondaryWeight: 1 },
        ],
      },
      {
        id: 20,
        section: 4,
        text: "Which of these have you genuinely tried, expecting it to shift something at the root? Choose the one that comes closest.",
        options: [
          { id: '20A', text: "Therapy or counselling — traditional, CBT, or psychodynamic.", primary: 'neutral', primaryWeight: 0 },
          { id: '20B', text: "Coaching — life, executive, or business.", primary: 'neutral', primaryWeight: 0 },
          { id: '20C', text: "Self-help books, online courses, or structured programmes.", primary: 'neutral', primaryWeight: 0 },
          { id: '20D', text: "Retreats — silent, wellness, or personal development.", primary: 'neutral', primaryWeight: 0 },
          { id: '20E', text: "Mindfulness, meditation, or breathwork practices.", primary: 'neutral', primaryWeight: 0 },
        ],
      },
      {
        id: 21,
        section: 4,
        text: "When you reflect on what you've tried, the honest answer about why it hasn't produced lasting change is...",
        options: [
          { id: '21A', text: "I understood myself better but couldn't stop the same patterns from running.", primary: 'neutral', primaryWeight: 0 },
          { id: '21B', text: "It helped in the moment. The same things kept coming back.", primary: 'neutral', primaryWeight: 0 },
          { id: '21C', text: "I felt clearer for a while, but nothing in my actual life changed.", primary: 'neutral', primaryWeight: 0 },
          { id: '21D', text: "I wasn't ready then. I'm more ready now.", primary: 'neutral', primaryWeight: 0 },
          { id: '21E', text: "I'm not sure. That's part of what I'm trying to understand.", primary: 'neutral', primaryWeight: 0 },
        ],
      },
      {
        id: 22,
        section: 4,
        text: "The person who knows you best — partner, closest friend, therapist — would say the thing that most needs to change is...",
        options: [
          { id: '22A', text: "How I treat myself. I'm the last person I take care of.", primary: 'IT', primaryWeight: 3 },
          { id: '22B', text: "My relationship with achievement. I can't seem to let myself have it.", primary: 'MG', primaryWeight: 3, secondary: 'GC', secondaryWeight: 1 },
          { id: '22C', text: "How closed off I am, even with the people closest to me.", primary: 'AS', primaryWeight: 3 },
          { id: '22D', text: "My relationship with my own instincts. I don't trust what I know.", primary: 'AD', primaryWeight: 3 },
          { id: '22E', text: "That I'm performing instead of actually living.", primary: 'PL', primaryWeight: 3 },
          { id: '22F', text: "That I've grown past the life I'm in and won't let myself say so.", primary: 'OG', primaryWeight: 3 },
          { id: '22G', text: "They wouldn't say anything is wrong. That's part of the problem.", primary: 'PL', primaryWeight: 3, secondary: 'AS', secondaryWeight: 1 },
        ],
      },
      {
        id: 23,
        section: 4,
        text: "If you dropped the edited version and told a stranger the true thing, it would sound most like...",
        options: [
          { id: '23A', text: '"I do everything for everyone and I\'m running on empty."', primary: 'IT', primaryWeight: 3 },
          { id: '23B', text: '"I keep getting close to where I want to be and something always happens."', primary: 'GC', primaryWeight: 3 },
          { id: '23C', text: '"I\'ve achieved a lot but I can\'t seem to feel like I\'ve made it."', primary: 'MG', primaryWeight: 3 },
          { id: '23D', text: '"I present well but privately I feel like a ghost of myself."', primary: 'PL', primaryWeight: 3 },
          { id: '23E', text: '"I can\'t trust my own instincts. I don\'t know what I actually want."', primary: 'AD', primaryWeight: 3 },
          { id: '23F', text: '"I love my life but something feels deeply wrong and I can\'t explain it."', primary: 'OG', primaryWeight: 3 },
          { id: '23G', text: '"I have walls up and I know it, and I can\'t seem to take them down."', primary: 'AS', primaryWeight: 3 },
        ],
      },
    ],
  },

  // ─── Section 5: Work, Money, and Ambition (weight 2x) ───────────────────────
  {
    number: 5,
    title: 'Work, Money, and Ambition',
    subtitle: "These questions go to the places most people don't look. Answer from what's actually true.",
    weight: 2,
    questions: [
      {
        id: 24,
        section: 5,
        text: "There is a specific level — of income, visibility, or achievement — that you consistently approach and then...",
        options: [
          { id: '24A', text: "Cross. I keep growing.", primary: 'neutral', primaryWeight: 0 },
          { id: '24B', text: "Something happens. An expense, a crisis, a reason to restructure.", primary: 'GC', primaryWeight: 3 },
          { id: '24C', text: "Find a reason it's not quite the right time.", primary: 'GC', primaryWeight: 3 },
          { id: '24D', text: "Hit, feel briefly satisfied, then immediately reset the target higher.", primary: 'MG', primaryWeight: 3 },
          { id: '24E', text: "Approach but don't quite reach. I'm not sure why.", primary: 'GC', primaryWeight: 3 },
        ],
      },
      {
        id: 25,
        section: 5,
        text: "When you charge for your work — quote a rate, set a price, ask for what you're worth — what most often happens?",
        options: [
          { id: '25A', text: "I charge what I'm worth and stand by it.", primary: 'neutral', primaryWeight: 0 },
          { id: '25B', text: "I quote less than I planned to. The number that comes out is lower than the one in my head.", primary: 'GC', primaryWeight: 3 },
          { id: '25C', text: "I charge appropriately but then over-deliver by so much it doesn't matter.", primary: 'IT', primaryWeight: 3, secondary: 'GC', secondaryWeight: 1 },
          { id: '25D', text: "I avoid conversations about money where I can.", primary: 'GC', primaryWeight: 3 },
          { id: '25E', text: "I negotiate against myself before the other person has said a word.", primary: 'GC', primaryWeight: 3 },
        ],
      },
      {
        id: 26,
        section: 5,
        text: "When you complete something significant — a project, a launch, a goal — the feeling that arrives most quickly is...",
        options: [
          { id: '26A', text: "Satisfaction. I let it land.", primary: 'neutral', primaryWeight: 0 },
          { id: '26B', text: 'Flatness. A hollow "is that it?"', primary: 'MG', primaryWeight: 3 },
          { id: '26C', text: "Relief, immediately followed by: what's next?", primary: 'MG', primaryWeight: 3 },
          { id: '26D', text: "A scan for everything that wasn't quite right about it.", primary: 'MG', primaryWeight: 3, secondary: 'GC', secondaryWeight: 1 },
          { id: '26E', text: "Pride, but I downplay it in case it looks like I'm making too much of myself.", primary: 'PL', primaryWeight: 3, secondary: 'IT', secondaryWeight: 1 },
        ],
      },
      {
        id: 27,
        section: 5,
        text: "The version of success you're working toward — when you imagine actually achieving it, you feel...",
        options: [
          { id: '27A', text: "Excited. I can picture it clearly and it feels good.", primary: 'neutral', primaryWeight: 0 },
          { id: '27B', text: "Strangely flat. Like the imagined version doesn't quite land either.", primary: 'MG', primaryWeight: 3 },
          { id: '27C', text: "Anxious. What if I get there and it doesn't fix anything?", primary: 'MG', primaryWeight: 3, secondary: 'OG', secondaryWeight: 1 },
          { id: '27D', text: "Like I'd have to become a different person.", primary: 'OG', primaryWeight: 3, secondary: 'GC', secondaryWeight: 1 },
          { id: '27E', text: "Like I'd lose something I'm not ready to lose.", primary: 'GC', primaryWeight: 3, secondary: 'OG', secondaryWeight: 1 },
        ],
      },
      {
        id: 28,
        section: 5,
        text: "When you have unstructured time — a weekend with no obligations — the feeling that arrives is...",
        options: [
          { id: '28A', text: "Relief and genuine enjoyment.", primary: 'neutral', primaryWeight: 0 },
          { id: '28B', text: "A low-grade anxiety. I should be doing something.", primary: 'MG', primaryWeight: 3, secondary: 'IT', secondaryWeight: 1 },
          { id: '28C', text: "Productivity guilt. I can't fully rest until I've earned it.", primary: 'IT', primaryWeight: 3, secondary: 'MG', secondaryWeight: 1 },
          { id: '28D', text: "Discomfort that I can't quite name.", primary: 'OG', primaryWeight: 3 },
          { id: '28E', text: "Fine initially, then restless. I create structure when there isn't any.", primary: 'MG', primaryWeight: 3 },
        ],
      },
      {
        id: 29,
        section: 5,
        text: "The work you procrastinate on most is...",
        options: [
          { id: '29A', text: "Admin, things I find boring.", primary: 'neutral', primaryWeight: 0 },
          { id: '29B', text: "The highest-leverage thing — the one that would actually move me past where I am.", primary: 'GC', primaryWeight: 3 },
          { id: '29C', text: "Creative work that requires me to trust my own instincts.", primary: 'AD', primaryWeight: 3 },
          { id: '29D', text: "Anything where the outcome depends entirely on how I'm perceived.", primary: 'PL', primaryWeight: 3 },
          { id: '29E', text: "Things that would require me to be visibly more successful than I currently am.", primary: 'GC', primaryWeight: 3 },
        ],
      },
      {
        id: 30,
        section: 5,
        text: "When you are close to a significant achievement, the thing that most reliably happens is...",
        options: [
          { id: '30A', text: "I push through and reach it.", primary: 'neutral', primaryWeight: 0 },
          { id: '30B', text: "Something external derails it at the last moment.", primary: 'GC', primaryWeight: 3 },
          { id: '30C', text: "I find a reason it isn't quite right and pull back.", primary: 'GC', primaryWeight: 3 },
          { id: '30D', text: "I get there, feel nothing, and immediately move the target.", primary: 'MG', primaryWeight: 3 },
          { id: '30E', text: "I sabotage it in a way I only recognise afterwards.", primary: 'GC', primaryWeight: 3 },
        ],
      },
    ],
  },

  // ─── Section 6: How You See Yourself (weight 2x) ────────────────────────────
  {
    number: 6,
    title: 'How You See Yourself',
    subtitle: 'Take your time with these. Some of them will need a moment.',
    weight: 2,
    questions: [
      {
        id: 31,
        section: 6,
        text: "The gap between who you are in public and who you are in private is...",
        options: [
          { id: '31A', text: "Small. I'm mostly the same person.", primary: 'neutral', primaryWeight: 0 },
          { id: '31B', text: "Significant. The private version is quieter, less certain, more tired.", primary: 'PL', primaryWeight: 3 },
          { id: '31C', text: "Significant. The private version is angrier, or sadder, than anyone would guess.", primary: 'PL', primaryWeight: 3, secondary: 'AS', secondaryWeight: 1 },
          { id: '31D', text: "Larger than I can fully see. The performance has been running so long I'm not sure what's underneath it anymore.", primary: 'PL', primaryWeight: 3 },
          { id: '31E', text: "Something I've thought about but can't quite articulate.", primary: 'OG', primaryWeight: 3, secondary: 'PL', secondaryWeight: 1 },
        ],
      },
      {
        id: 32,
        section: 6,
        text: "There is a version of your life that you privately imagine but rarely describe to others. That version feels...",
        options: [
          { id: '32A', text: "Like the direction I'm actually moving in.", primary: 'neutral', primaryWeight: 0 },
          { id: '32B', text: "Irresponsible to want. Too much.", primary: 'OG', primaryWeight: 3, secondary: 'AD', secondaryWeight: 1 },
          { id: '32C', text: "Like something I'll get to eventually, when the timing is right.", primary: 'OG', primaryWeight: 3, secondary: 'GC', secondaryWeight: 1 },
          { id: '32D', text: "Like it would require becoming someone my people wouldn't recognise.", primary: 'OG', primaryWeight: 3 },
          { id: '32E', text: "So different that naming it feels like a betrayal — of my partner, my family, the version of me they've built their life around.", primary: 'OG', primaryWeight: 3 },
        ],
      },
      {
        id: 33,
        section: 6,
        text: "The feeling that you are somehow in the wrong life — or that you've outgrown the life you're in — is something you...",
        options: [
          { id: '33A', text: "Don't really relate to. I'm in the right place.", primary: 'neutral', primaryWeight: 0 },
          { id: '33B', text: "Feel occasionally and push down quickly.", primary: 'OG', primaryWeight: 3 },
          { id: '33C', text: "Feel consistently, but don't know what to do with it.", primary: 'OG', primaryWeight: 3 },
          { id: '33D', text: "Feel, but interpret as ingratitude. I have so much.", primary: 'OG', primaryWeight: 3 },
          { id: '33E', text: "Have felt so long it's become background noise.", primary: 'OG', primaryWeight: 3 },
        ],
      },
      {
        id: 34,
        section: 6,
        text: "When you make a decision entirely from your own instinct — without consulting anyone else — you feel...",
        options: [
          { id: '34A', text: "Confident. I trust myself.", primary: 'neutral', primaryWeight: 0 },
          { id: '34B', text: "Exposed. Like I've skipped a step.", primary: 'AD', primaryWeight: 3 },
          { id: '34C', text: "Anxious until external validation confirms I got it right.", primary: 'AD', primaryWeight: 3 },
          { id: '34D', text: "Like I've done something slightly reckless.", primary: 'AD', primaryWeight: 3 },
          { id: '34E', text: "Fine in the moment, then second-guessing it afterwards.", primary: 'AD', primaryWeight: 3, secondary: 'GC', secondaryWeight: 1 },
        ],
      },
      {
        id: 35,
        section: 6,
        text: "The person your closest friends think you are and the person you experience yourself to be are...",
        options: [
          { id: '35A', text: "Basically the same.", primary: 'neutral', primaryWeight: 0 },
          { id: '35B', text: "Similar, but they think I'm more together than I feel.", primary: 'PL', primaryWeight: 3 },
          { id: '35C', text: "Different enough that their confidence in me sometimes feels misplaced.", primary: 'PL', primaryWeight: 3, secondary: 'AS', secondaryWeight: 1 },
          { id: '35D', text: "Not quite aligned — they see the version I show, not the version I live with.", primary: 'PL', primaryWeight: 3 },
          { id: '35E', text: "Quite different. I've built something very convincing.", primary: 'PL', primaryWeight: 3 },
        ],
      },
      {
        id: 36,
        section: 6,
        text: "If you're honest about why your pattern hasn't shifted yet — despite you wanting it to — the truest answer is probably...",
        options: [
          { id: '36A', text: "I'm not sure who I'd be without it. It's woven into how I understand myself.", primary: 'IT', primaryWeight: 3, secondary: 'PL', secondaryWeight: 1 },
          { id: '36B', text: "The moving keeps me from having to answer the question I'm most afraid of: what if I get everything I want and it still isn't enough?", primary: 'MG', primaryWeight: 3 },
          { id: '36C', text: "As long as I don't fully try, I can't fully fail. The potential stays safe — untested, but alive.", primary: 'GC', primaryWeight: 3 },
          { id: '36D', text: "Staying guarded means staying in control. If I let the armour down, I lose the one thing that's kept me safe.", primary: 'AS', primaryWeight: 3 },
          { id: '36E', text: "If I started listening to my own instincts, I'd have to do something about what they're telling me. That's the part I'm avoiding.", primary: 'AD', primaryWeight: 3, secondary: 'OG', secondaryWeight: 1 },
        ],
      },
      {
        id: 37,
        section: 6,
        text: "The thing I most want to feel — that I haven't felt consistently, or perhaps ever — is...",
        options: [
          { id: '37A', text: "Rested. Not tired in a way that has nothing to do with sleep.", primary: 'IT', primaryWeight: 3 },
          { id: '37B', text: "Like I've arrived. Like what I've built is actually enough.", primary: 'MG', primaryWeight: 3 },
          { id: '37C', text: "Genuinely known. Not loved for my usefulness or my performance — actually known.", primary: 'PL', primaryWeight: 3, secondary: 'AS', secondaryWeight: 1 },
          { id: '37D', text: "Like my own instincts are a source of truth I can trust.", primary: 'AD', primaryWeight: 3 },
          { id: '37E', text: "Like my life fits who I've become.", primary: 'OG', primaryWeight: 3 },
          { id: '37F', text: "Like I'm allowed to take up the space I'm actually capable of.", primary: 'GC', primaryWeight: 3 },
        ],
      },
    ],
  },

  // ─── Section 7: Direct Recognition (weight 3x, Q40 uses weightOverride: 2) ──
  {
    number: 7,
    title: 'Direct Recognition',
    subtitle: 'The final questions. Be as honest here as you have been throughout.',
    weight: 3,
    questions: [
      {
        id: 38,
        section: 7,
        label: 'The Cost Question',
        text: "Of all the things your pattern has cost you, the one that sits heaviest is...",
        options: [
          { id: '38A', text: "Energy and health — the exhaustion is in my body now.", primary: 'IT', primaryWeight: 5 },
          { id: '38B', text: "Opportunity — I've watched things I was ready for pass me by.", primary: 'GC', primaryWeight: 5 },
          { id: '38C', text: "Genuine closeness — people love me, but almost no one really knows me.", primary: 'AS', primaryWeight: 5 },
          { id: '38D', text: "Arrival — I've achieved a lot and never once felt like I'd made it.", primary: 'MG', primaryWeight: 5 },
          { id: '38E', text: "My own instincts — I've spent so long not trusting myself I'm not sure what I actually want.", primary: 'AD', primaryWeight: 5 },
          { id: '38F', text: "Authenticity — I've been performing for so long I'm not sure which version is real.", primary: 'PL', primaryWeight: 5 },
          { id: '38G', text: "My life's fit — what I'm living and who I've become are no longer the same shape.", primary: 'OG', primaryWeight: 5 },
        ],
      },
      {
        id: 39,
        section: 7,
        label: 'The Body Question',
        text: "The place in your body where you carry this most — where it lives, where it tightens, where it goes quiet — is...",
        options: [
          { id: '39A', text: "My adrenals and my sleep. Wired at night, exhausted in the morning.", primary: 'IT', primaryWeight: 5 },
          { id: '39B', text: "My stomach, just before the moment I should say yes to something big.", primary: 'GC', primaryWeight: 5 },
          { id: '39C', text: "My chest. A low-level guard that doesn't fully release even when I'm safe.", primary: 'AS', primaryWeight: 5 },
          { id: '39D', text: "In my chest, in the moment after I finish something. The flatness where satisfaction should be.", primary: 'MG', primaryWeight: 5 },
          { id: '39E', text: "My gut — it tells me things I've learned not to listen to.", primary: 'AD', primaryWeight: 5 },
          { id: '39F', text: "Somewhere behind my sternum. A tiredness that has nothing to do with sleep.", primary: 'PL', primaryWeight: 5 },
          { id: '39G', text: "A low hum through my whole body. A persistent sense of wrongness that has no specific cause.", primary: 'OG', primaryWeight: 5 },
        ],
      },
      {
        id: 40,
        section: 7,
        label: 'The History Question',
        weightOverride: 2,
        text: "When you think about how long this has been running — how many years it has been operating beneath your decisions — what arrives?",
        options: [
          { id: '40A', text: "Grief, mostly. For the years I spent giving everything to everyone except myself.", primary: 'IT', primaryWeight: 3 },
          { id: '40B', text: "That I've been the architect of my own ceiling and never quite saw the blueprint.", primary: 'GC', primaryWeight: 3, secondary: 'MG', secondaryWeight: 1 },
          { id: '40C', text: "That the performance has been so good, for so long, that I'm not sure I know what's underneath it anymore.", primary: 'PL', primaryWeight: 3, secondary: 'AS', secondaryWeight: 1 },
          { id: '40D', text: "That I've been running toward something that keeps moving — and the running has cost me the ability to arrive.", primary: 'MG', primaryWeight: 3 },
          { id: '40E', text: "That the life I'm living made complete sense once, and somewhere it stopped being mine.", primary: 'OG', primaryWeight: 3 },
        ],
      },
      {
        id: 41,
        section: 7,
        label: 'The Recognition Question',
        text: "Which of these sounds most like someone who knows you deeply describing you?",
        options: [
          { id: '41A', text: "You are the most dependable person in every room you enter — and the most privately exhausted.", primary: 'IT', primaryWeight: 6 },
          { id: '41B', text: "You keep approaching the same threshold and finding a reason not to cross it — and the reason always seems legitimate.", primary: 'GC', primaryWeight: 6 },
          { id: '41C', text: "You are warm, present, and genuinely caring — and there is a line no one gets past.", primary: 'AS', primaryWeight: 6 },
          { id: '41D', text: "You have achieved more than most — and you've never once been able to let it land.", primary: 'MG', primaryWeight: 6 },
          { id: '41E', text: "You know what you want. You've spent years learning not to trust that knowing.", primary: 'AD', primaryWeight: 6 },
          { id: '41F', text: "You are performing a version of yourself that is very good — and quietly exhausted by the performance.", primary: 'PL', primaryWeight: 6 },
          { id: '41G', text: "The life you're living was built for a version of you that no longer exists.", primary: 'OG', primaryWeight: 6 },
        ],
      },
    ],
  },
];

export const ALL_QUESTIONS: Question[] = SECTIONS.flatMap(s => s.questions);

export function getSectionWeight(sectionNumber: number): number {
  return SECTIONS.find(s => s.number === sectionNumber)?.weight ?? 1;
}
