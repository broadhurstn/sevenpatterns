# The Seven Patterns — Diagnostic Quiz

A precise diagnostic that identifies the behavioural pattern running underneath every major problem a person carries. Built for Melissa Ambrosini.

---

## What this is

A Next.js app that:
- Delivers a 34-question weighted diagnostic quiz
- Captures name, age, location, and a personal problem statement at intake
- Scores answers across seven patterns using a weighted algorithm
- Sends scores to the Anthropic API and receives a fully personalised result page in Melissa's voice
- Stores every submission to Supabase for data collection

## Stack

- **Next.js 15** — framework and serverless API routes
- **Tailwind CSS** — utility styling
- **Anthropic API** — result page generation (Claude Sonnet)
- **Supabase** — submission data capture
- **Vercel** — deployment

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd seven-patterns
npm install
```

### 2. Set up Supabase

1. Create a new project at supabase.com
2. Go to the SQL Editor in your Supabase dashboard
3. Run the contents of supabase-schema.sql to create the submissions table
4. From your project settings, copy:
   - Project URL (Settings > API > Project URL)
   - Service role key (Settings > API > service_role) — keep this secret

### 3. Get your Anthropic API key

1. Go to console.anthropic.com
2. Create an API key
3. Copy it — you only see it once

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in .env.local:

```
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
```

### 5. Run locally

```bash
npm run dev
```

Open http://localhost:3000

---

## Deploying to Vercel

1. Push your code to GitHub
2. Go to vercel.com and import the repository
3. Add environment variables in Vercel project settings before deploying:
   - ANTHROPIC_API_KEY
   - NEXT_PUBLIC_SUPABASE_URL
   - SUPABASE_SERVICE_KEY
4. Deploy

Every push to main triggers a new deploy automatically.

---

## Project structure

```
seven-patterns/
├── app/
│   ├── globals.css          # Design system
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Full quiz — all six stages
│   └── api/
│       ├── result/route.ts  # Anthropic API — result generation
│       └── submit/route.ts  # Supabase — data capture
├── lib/
│   ├── quiz-data.ts         # All 34 questions with weights
│   └── scoring.ts           # Weighted scoring engine
├── supabase-schema.sql      # Database schema
└── .env.local.example       # Env var template
```

---

## Scoring logic

Section weights: S1=1x, S2=1.5x, S3=2x, S4=2x, S5=2x, S6=3x.
Primary pattern = highest cumulative weighted score.
Secondary pattern = second highest. Teased but not described in the result.
Q34 carries 18 points — the single heaviest data point in the quiz.

---

## Viewing submissions

Supabase dashboard > Table Editor > quiz_submissions.
Exportable to CSV at any time.

---

## Modifying questions

All 34 questions live in lib/quiz-data.ts.
Do not change section weights without re-running QA.

## Modifying the result page

The Claude prompt lives in app/api/result/route.ts in the SYSTEM_PROMPT constant.
Changes to the result structure must be reflected in the ResultData type in app/page.tsx.

---

The Seven Patterns — Melissa Ambrosini — Confidential
