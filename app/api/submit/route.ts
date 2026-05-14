import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ScoreResult } from '@/lib/scoring';

interface SubmitRequest {
  intake: {
    name: string;
    age: string;
    gender: string;
    location: string;
    problem: string;
    closing?: string;
  };
  answers: Record<number, string>;
  scores: ScoreResult;
}

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase env vars not set — skipping data capture');
      return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body: SubmitRequest = await req.json();
    const { intake, answers, scores } = body;

    const { error } = await supabase.from('quiz_submissions').insert({
      name: intake.name,
      age: parseInt(intake.age),
      gender: intake.gender || null,
      location: intake.location,
      problem: intake.problem,
      closing: intake.closing || null,
      answers,
      primary_pattern: scores.primary,
      secondary_pattern: scores.secondary,
      raw_scores: scores.rawScores,
      submitted_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
