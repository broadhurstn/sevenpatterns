'use client';

import { useState, useEffect, useRef } from 'react';
import { SECTIONS, ALL_QUESTIONS } from '@/lib/quiz-data';
import { calculateScores, type Answers } from '@/lib/scoring';
import { PatternMark } from '@/lib/pattern-marks';

// ─── Types ───────────────────────────────────────────────────────────────────

type IntakeData = {
  name: string;
  age: string;
  gender: string;
  city: string;
  country: string;
  problem: string;
  previousApproach?: string;
};

type ResultData = {
  patternName: string;
  recognition: string;
  pullquote: string;
  cost: string;
  installed: string;
  hard: string;
  dissolution: string;
  mantra: string;
  secondary: string;
  practiceOpening: string;
  practice1: string;
  practice2: string;
  practice3: string;
};

type Stage = 'landing' | 'intake' | 'quiz' | 'closing' | 'email' | 'generating' | 'result';

const totalQuestions = ALL_QUESTIONS.length;

function getSectionForQuestion(questionId: number) {
  return SECTIONS.find(s => s.questions.some(q => q.id === questionId));
}

function getAnswerText(answers: Answers, questionId: number): string | undefined {
  const optionId = answers[questionId];
  if (!optionId) return undefined;
  const q = ALL_QUESTIONS.find(q => q.id === questionId);
  return q?.options.find(o => o.id === optionId)?.text;
}

// ─── Transition screen copy ─────────────────────────────────────────────────

const SECTION_TRANSITIONS: Record<number, { heading: string; subtext: string }> = {
  2: {
    heading: "That took something.",
    subtext: "Answering from what's actually true rather than what looks better is not a small thing.",
  },
  3: {
    heading: "Your body has been tracking this longer than your mind has.",
    subtext: "The next questions are about the people closest to you. Answer for what actually happens, not for who you want to be.",
  },
  4: {
    heading: "The same pattern shows up in all of it.",
    subtext: "Let's see how it moves through your work.",
  },
  5: {
    heading: "You're getting closer to it.",
    subtext: "One of the next two sections will feel harder to answer honestly. You'll know which one.",
  },
  6: {
    heading: "You're closer to it than you've ever been.",
    subtext: "The next questions are the most direct. Don't edit yourself.",
  },
  7: {
    heading: "Last section.",
    subtext: "These questions are the most direct. Be as honest here as you've been throughout.",
  },
};

// ─── Design tokens ───────────────────────────────────────────────────────────

const BG      = '#FAF9F6';
const TEXT     = '#1B1C1A';
const ACCENT   = '#C9A66B';
const MUTED    = '#6C5B4E';
const BORDER   = '#E5E1DA';
const SURFACE  = '#F0EDEA';
const FIELD_BG = '#E8E3DC';
const FIELD_BD = '#D5CEC5';
const SEL_BG   = 'rgba(201,166,107,0.08)';

const FONT_H = "var(--font-newsreader), 'Newsreader', Georgia, serif";
const FONT_B = "var(--font-manrope), 'Manrope', sans-serif";

const TAP_BASE: React.CSSProperties = {
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'manipulation',
  cursor: 'pointer',
};

const SECTION_LABEL: React.CSSProperties = {
  fontSize: '13px',
  letterSpacing: '0.3em',
  textTransform: 'uppercase' as const,
  color: ACCENT,
  marginBottom: '12px',
  fontFamily: FONT_B,
  fontWeight: 600,
};

// ─── Shared primitives ──────────────────────────────────────────────────────

function DotsLogo() {
  const opacities = [0.12, 0.35, 0.65, 1.0, 0.65, 0.35, 0.12];
  const r = 3.75;
  const gap = 10;
  const d = r * 2;
  const w = 7 * d + 6 * gap;
  return (
    <svg width={w} height={d} viewBox={`0 0 ${w} ${d}`} fill="none" aria-hidden="true">
      {opacities.map((op, i) => (
        <circle key={i} cx={r + i * (d + gap)} cy={r} r={r} fill={ACCENT} fillOpacity={op} />
      ))}
    </svg>
  );
}

function LogoMark() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '10px' }}>
      <DotsLogo />
      <span style={{
        fontFamily: FONT_B,
        fontWeight: 600,
        fontSize: '12.5px',
        letterSpacing: '0.4em',
        textTransform: 'uppercase' as const,
        color: ACCENT,
      }}>
        THE SEVEN PATTERNS
      </span>
    </div>
  );
}

function AnimatedDotsLogo() {
  const r = 3.75;
  const gap = 10;
  const d = r * 2;
  const w = 7 * d + 6 * gap;
  const classes = ['dot-1', 'dot-2', 'dot-3', 'dot-4', 'dot-5', 'dot-6', 'dot-7'];
  return (
    <svg width={w} height={d} viewBox={`0 0 ${w} ${d}`} fill="none" aria-hidden="true">
      {classes.map((cls, i) => (
        <circle key={i} cx={r + i * (d + gap)} cy={r} r={r} fill={ACCENT} className={cls} />
      ))}
    </svg>
  );
}

function AnimatedLogoMark() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '10px' }}>
      <AnimatedDotsLogo />
      <span style={{
        fontFamily: FONT_B,
        fontWeight: 600,
        fontSize: '12.5px',
        letterSpacing: '0.4em',
        textTransform: 'uppercase' as const,
        color: ACCENT,
      }}>
        THE SEVEN PATTERNS
      </span>
    </div>
  );
}

function BackBtn({ onClick, color = MUTED }: { onClick: () => void; color?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label="Go back"
      style={{
        ...TAP_BASE,
        background: 'none', border: 'none', padding: '12px',
        display: 'flex', alignItems: 'center', color, outline: 'none',
        minWidth: '44px', minHeight: '44px', justifyContent: 'center',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function QuizHeader({ onBack, current, total }: { onBack?: () => void; current: number; total: number }) {
  const pct = (current / total) * 100;
  return (
    <div style={{ position: 'fixed' as const, top: 0, left: 0, right: 0, zIndex: 100, background: BG }}>
      <div style={{
        position: 'relative' as const,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '28px 0 16px',
      }}>
        {onBack && (
          <div style={{ position: 'absolute' as const, left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
            <BackBtn onClick={onBack} />
          </div>
        )}
        <LogoMark />
      </div>
      <div style={{ height: '2px', background: BORDER }}>
        <div style={{ height: '100%', width: `${pct}%`, background: ACCENT, borderRadius: '1px', transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}

// ─── Landing ─────────────────────────────────────────────────────────────────

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-fade-in" style={{
      minHeight: '100vh', background: BG,
      display: 'flex', flexDirection: 'column' as const,
    }}>
      <div style={{
        flex: 1,
        display: 'flex', flexDirection: 'column' as const,
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 32px',
      }}>
        <div style={{ maxWidth: '520px', width: '100%', display: 'flex', flexDirection: 'column' as const, alignItems: 'center' }}>
          <AnimatedLogoMark />
          <div style={{ height: '64px' }} />
          <h1 style={{
            fontFamily: FONT_H, fontStyle: 'italic', fontWeight: 400,
            fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: 1.2,
            color: TEXT, textAlign: 'center' as const, marginBottom: '24px',
          }}>
            Something is running underneath your life that you haven't been able to name yet.
          </h1>
          <p style={{
            fontFamily: FONT_B, fontWeight: 300, fontSize: '18px', lineHeight: 1.75,
            color: MUTED, textAlign: 'left' as const, marginBottom: '56px',
          }}>
            It's why the weight comes back. Why the money arrives and disappears. Why the relationship keeps breaking the same way. Why you hit the same ceiling at work and can't seem to cross it. Why you're exhausted in a way that rest doesn't fix.
          </p>
          <button
            onClick={onStart}
            onTouchEnd={(e) => { e.preventDefault(); onStart(); }}
            type="button"
            style={{
              ...TAP_BASE, width: '100%', padding: '18px 16px', minHeight: '56px',
              background: TEXT, color: BG, fontSize: '12px', letterSpacing: '0.2em',
              textTransform: 'uppercase' as const, fontFamily: FONT_B, fontWeight: 500,
              border: 'none', borderRadius: 0, outline: 'none',
              position: 'relative' as const, zIndex: 10,
            }}
          >
            FIND YOUR PATTERN
          </button>
        </div>
      </div>
      <div style={{ padding: '0 24px 36px', textAlign: 'center' as const }}>
        <p style={{ fontSize: '11px', color: MUTED, opacity: 0.5, letterSpacing: '0.03em' }}>
          <a href="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
          <span style={{ margin: '0 8px' }}>·</span>
          <a href="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Use</a>
        </p>
      </div>
    </div>
  );
}

// ─── Intake ──────────────────────────────────────────────────────────────────

function Intake({ onComplete, onBack, initialData }: { onComplete: (data: IntakeData) => void; onBack: () => void; initialData?: IntakeData }) {
  const [data, setData] = useState<IntakeData>(initialData ?? { name: '', age: '', gender: '', city: '', country: '', problem: '' });
  const [errors, setErrors] = useState<Partial<IntakeData>>({});
  const locationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY;
    if (!apiKey || typeof window === 'undefined') return;
    const initAutocomplete = () => {
      if (!locationInputRef.current) return;
      const google = (window as any).google;
      if (!google?.maps?.places) return;
      const ac = new google.maps.places.Autocomplete(locationInputRef.current, { types: ['(cities)'], fields: ['address_components'] });
      ac.addListener('place_changed', () => {
        const place = ac.getPlace();
        let city = '', country = '';
        for (const component of place.address_components ?? []) {
          if (!city && (component.types.includes('locality') || component.types.includes('postal_town'))) city = component.long_name;
          if (!city && component.types.includes('administrative_area_level_1')) city = component.long_name;
          if (component.types.includes('country')) country = component.long_name;
        }
        setData(d => ({ ...d, city, country }));
      });
    };
    const scriptId = 'google-places-js';
    if ((window as any).google?.maps?.places) { initAutocomplete(); return; }
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (existing) { existing.addEventListener('load', initAutocomplete); return () => existing.removeEventListener('load', initAutocomplete); }
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true; script.defer = true;
    script.addEventListener('load', initAutocomplete);
    document.head.appendChild(script);
    return () => script.removeEventListener('load', initAutocomplete);
  }, []);

  const validate = () => {
    const e: Partial<IntakeData> = {};
    if (!data.name.trim()) e.name = 'Required';
    if (!data.age.trim() || isNaN(Number(data.age))) e.age = 'Required';
    if (!data.city.trim()) e.city = 'Required';
    if (!data.problem.trim()) e.problem = 'Required';
    return e;
  };
  const handleSubmit = () => { const e = validate(); if (Object.keys(e).length) { setErrors(e); return; } onComplete(data); };

  const fieldStyle = (hasError?: string): React.CSSProperties => ({
    width: '100%', padding: '13px 14px', background: FIELD_BG,
    border: `1px solid ${hasError ? ACCENT : FIELD_BD}`, borderRadius: 0,
    fontSize: '16px', color: TEXT, fontFamily: FONT_B, fontWeight: 300,
    outline: 'none', boxSizing: 'border-box' as const,
  });

  const labelSt: React.CSSProperties = {
    display: 'block', fontSize: '13px', letterSpacing: '0.15em',
    textTransform: 'uppercase' as const, color: MUTED, marginBottom: '8px',
    fontFamily: FONT_B, fontWeight: 600,
  };

  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', background: BG, display: 'flex', flexDirection: 'column' as const }}>
      <div style={{ position: 'relative' as const, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px 24px' }}>
        <div style={{ position: 'absolute' as const, left: '20px', top: '50%', transform: 'translateY(-50%)' }}>
          <BackBtn onClick={onBack} />
        </div>
        <LogoMark />
      </div>
      <div style={{ flex: 1, overflowY: 'auto' as const }}>
        <div className="animate-fade-up" style={{ maxWidth: '480px', margin: '0 auto', padding: '8px 24px 32px' }}>
          <h2 className="intake-heading" style={{ fontFamily: FONT_H, fontStyle: 'italic', fontWeight: 400, fontSize: '28px', color: TEXT, marginBottom: '8px', lineHeight: 1.35 }}>
            Before we begin
          </h2>
          <p className="intake-subheading" style={{ fontFamily: FONT_B, fontSize: '14px', color: MUTED, lineHeight: 1.65, marginBottom: '32px', fontWeight: 300 }}>
            Your answers stay private. The last question is what makes your result specific to you.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '20px' }}>
            <div className="intake-name-age" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelSt}>First name</label>
                <input type="text" value={data.name} onChange={e => setData(d => ({ ...d, name: e.target.value }))} style={fieldStyle(errors.name)} placeholder="Your name" />
              </div>
              <div>
                <label style={labelSt}>Age</label>
                <input type="number" value={data.age} onChange={e => setData(d => ({ ...d, age: e.target.value }))} style={fieldStyle(errors.age)} placeholder="Your age" />
              </div>
            </div>
            <div>
              <label style={labelSt}>Gender — I identify as</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {['Man', 'Woman', 'Non-binary', 'Prefer not to say'].map(opt => (
                  <button key={opt} type="button" onClick={() => setData(d => ({ ...d, gender: opt }))} style={{
                    ...TAP_BASE, padding: '13px 14px', minHeight: '44px',
                    background: data.gender === opt ? SEL_BG : FIELD_BG,
                    border: data.gender === opt ? `2px solid ${ACCENT}` : `1px solid ${FIELD_BD}`,
                    borderRadius: 0, fontSize: '16px', color: data.gender === opt ? TEXT : MUTED,
                    fontFamily: FONT_B, fontWeight: 300, textAlign: 'left' as const, outline: 'none',
                  }}>{opt}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelSt}>Location</label>
              <input ref={locationInputRef} type="text" defaultValue={data.city ? `${data.city}${data.country ? `, ${data.country}` : ''}` : ''} onChange={() => setData(d => ({ ...d, city: '', country: '' }))} style={fieldStyle(errors.city)} placeholder="City, country" autoComplete="off" />
            </div>
            <div>
              <label style={labelSt}>What is the one problem you most want to solve?</label>
              <p style={{ fontFamily: FONT_B, fontSize: '14px', color: MUTED, opacity: 0.65, marginBottom: '10px', lineHeight: 1.55, fontWeight: 300 }}>
                Don't edit yourself. The more detail you give — specific situations, how long this has been running, what you've already tried — the more precisely your result will be written for you. This is the most important field.
              </p>
              <textarea
                value={data.problem}
                onChange={e => setData(d => ({ ...d, problem: e.target.value }))}
                rows={6}
                style={{ ...fieldStyle(errors.problem), resize: 'none' as const, lineHeight: 1.6, minHeight: '160px' }}
                placeholder="Write as much as you want. Specifics make your result more accurate."
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '16px 24px 44px', background: BG }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <button onClick={handleSubmit} type="button" style={{
            ...TAP_BASE, width: '100%', padding: '16px', minHeight: '48px',
            background: TEXT, color: BG, fontSize: '12px', letterSpacing: '0.2em',
            textTransform: 'uppercase' as const, fontFamily: FONT_B, fontWeight: 500,
            border: 'none', borderRadius: 0, outline: 'none',
          }}>BEGIN</button>
        </div>
      </div>
    </div>
  );
}

// ─── Section transition ─────────────────────────────────────────────────────

function SectionTransition({ sectionNumber, onContinue, onBack, current, total }: {
  sectionNumber: number; onContinue: () => void; onBack?: () => void; current: number; total: number;
}) {
  const t = SECTION_TRANSITIONS[sectionNumber];
  if (!t) return null;
  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', width: '100%', background: BG, display: 'flex', flexDirection: 'column' as const }}>
      <QuizHeader onBack={onBack} current={current} total={total} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, justifyContent: 'center', paddingTop: '80px' }}>
        <div className="animate-fade-up" style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px', width: '100%' }}>
          <div style={{ width: '32px', height: '1px', background: ACCENT, marginBottom: '28px' }} />
          <p className="transition-heading" style={{ fontFamily: FONT_H, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(28px, 4vw, 40px)', lineHeight: 1.2, color: TEXT, marginBottom: '20px' }}>
            {t.heading}
          </p>
          <p style={{ fontFamily: FONT_B, fontWeight: 300, fontSize: '17px', lineHeight: 1.7, color: MUTED }}>
            {t.subtext}
          </p>
          <div style={{ marginTop: '64px' }}>
            <button onClick={onContinue} type="button" style={{
              ...TAP_BASE, width: '100%', padding: '16px', minHeight: '48px',
              background: 'transparent', color: ACCENT, fontSize: '12px', letterSpacing: '0.2em',
              textTransform: 'uppercase' as const, fontFamily: FONT_B, fontWeight: 500,
              border: `1px solid ${ACCENT}`, borderRadius: 0, outline: 'none',
            }}>CONTINUE</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Quiz ────────────────────────────────────────────────────────────────────

const IS_DEV = process.env.NODE_ENV === 'development';

function Quiz({ initialIdx, initialAnswers, onComplete, onBack }: {
  initialIdx: number;
  initialAnswers: Answers;
  onComplete: (answers: Answers) => void;
  onBack: (idx: number, answers: Answers) => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(initialIdx);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [selected, setSelected] = useState<string | null>(() => {
    const q = ALL_QUESTIONS[initialIdx];
    return initialAnswers[q?.id] || null;
  });
  const [animating, setAnimating] = useState(false);
  const [pendingTransition, setPendingTransition] = useState<number | null>(null);

  const question = ALL_QUESTIONS[currentIdx];
  const isLast = currentIdx === ALL_QUESTIONS.length - 1;

  const answersRef = useRef(answers);
  answersRef.current = answers;
  const currentIdxRef = useRef(currentIdx);
  currentIdxRef.current = currentIdx;

  useEffect(() => {
    if (!IS_DEV) return;
    const handler = (e: KeyboardEvent) => {
      if (!e.shiftKey) return;
      if (e.key === 'S' || e.key === 's') {
        e.preventDefault();
        const q = ALL_QUESTIONS[currentIdxRef.current];
        const firstOpt = q.options[0].id;
        const updated = { ...answersRef.current, [q.id]: firstOpt };
        if (currentIdxRef.current + 1 >= ALL_QUESTIONS.length) { onComplete(updated); }
        else { setAnswers(updated); setCurrentIdx(currentIdxRef.current + 1); setSelected(null); setPendingTransition(null); }
      }
      if (e.key === 'F' || e.key === 'f') {
        e.preventDefault();
        const allAnswers = { ...answersRef.current };
        for (let i = currentIdxRef.current; i < ALL_QUESTIONS.length; i++) {
          const q = ALL_QUESTIONS[i];
          if (!allAnswers[q.id]) allAnswers[q.id] = q.options[0].id;
        }
        onComplete(allAnswers);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onComplete]);

  const handleSelect = (optionId: string) => { if (!animating) setSelected(optionId); };

  const handleNext = () => {
    if (!selected || animating) return;
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);
    if (isLast) { onComplete(newAnswers); return; }
    const nextIdx = currentIdx + 1;
    const nextQ = ALL_QUESTIONS[nextIdx];
    const currentSection = getSectionForQuestion(question.id);
    const nextSection = getSectionForQuestion(nextQ.id);
    if (nextSection?.number !== currentSection?.number) {
      setPendingTransition(nextSection!.number);
    } else {
      setAnimating(true);
      setTimeout(() => { setCurrentIdx(nextIdx); setSelected(newAnswers[nextQ.id] || null); setAnimating(false); }, 300);
    }
  };

  const handleTransitionContinue = () => {
    setAnimating(true);
    setTimeout(() => {
      const nextIdx = currentIdx + 1;
      const nextQ = ALL_QUESTIONS[nextIdx];
      setCurrentIdx(nextIdx);
      setSelected(answers[nextQ.id] || null);
      setAnimating(false);
      setPendingTransition(null);
    }, 300);
  };

  const handleBack = () => {
    if (pendingTransition !== null) {
      const q = ALL_QUESTIONS[currentIdx];
      setSelected(answers[q.id] || null);
      setPendingTransition(null);
      return;
    }
    if (currentIdx === 0) { onBack(currentIdx, answers); return; }
    if (animating) return;

    const currentQ = ALL_QUESTIONS[currentIdx];
    const prevIdx = currentIdx - 1;
    const prevQ = ALL_QUESTIONS[prevIdx];
    const currentSection = getSectionForQuestion(currentQ.id);
    const prevSection = getSectionForQuestion(prevQ.id);

    if (currentSection?.number !== prevSection?.number && currentSection?.number && SECTION_TRANSITIONS[currentSection.number]) {
      setCurrentIdx(prevIdx);
      setSelected(answers[prevQ.id] || null);
      setPendingTransition(currentSection.number);
      return;
    }

    setAnimating(true);
    setTimeout(() => {
      setCurrentIdx(prevIdx);
      setSelected(answers[prevQ.id] || null);
      setAnimating(false);
    }, 200);
  };

  if (pendingTransition !== null) {
    return <SectionTransition
      sectionNumber={pendingTransition}
      onContinue={handleTransitionContinue}
      onBack={handleBack}
      current={currentIdx + 1}
      total={totalQuestions}
    />;
  }

  return (
    <div style={{ minHeight: '100vh', background: BG }}>
      {IS_DEV && (
        <div style={{ position: 'fixed', bottom: '12px', right: '16px', zIndex: 200, fontSize: '10px', color: MUTED, opacity: 0.5, fontFamily: FONT_B }}>
          DEV: ⇧S skip · ⇧F finish
        </div>
      )}
      <QuizHeader onBack={handleBack} current={currentIdx + 1} total={totalQuestions} />
      <div style={{ padding: '100px 24px 80px' }}>
        <div key={question.id} className="animate-fade-up" style={{ maxWidth: '560px', margin: '0 auto', opacity: animating ? 0 : 1, transition: 'opacity 0.3s ease' }}>
          {question.label && (
            <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: ACCENT, marginBottom: '14px', fontWeight: 400, fontFamily: FONT_B }}>{question.label}</p>
          )}
          <h2 className="quiz-question-text" style={{ fontFamily: FONT_H, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: 1.3, color: TEXT, marginBottom: '32px' }}>
            {question.text}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '2px' }}>
            {question.options.map((option) => {
              const isSel = selected === option.id;
              return (
                <button key={option.id} onClick={() => handleSelect(option.id)} type="button" style={{
                  ...TAP_BASE, width: '100%', padding: '14px 20px', minHeight: '48px',
                  background: isSel ? SEL_BG : 'transparent', border: 'none',
                  borderLeft: isSel ? `2px solid ${ACCENT}` : '1px solid transparent',
                  textAlign: 'left' as const, transition: 'all 0.15s ease', fontFamily: FONT_B, outline: 'none',
                }}>
                  <span style={{ fontSize: '17px', lineHeight: 1.55, color: isSel ? TEXT : MUTED, fontWeight: 400, transition: 'color 0.15s ease', display: 'block' }}>
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: '40px' }}>
            <button onClick={handleNext} disabled={!selected} type="button" style={{
              ...TAP_BASE, width: '100%', padding: '16px', minHeight: '48px',
              background: selected ? TEXT : BORDER, color: selected ? BG : MUTED,
              fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase' as const,
              fontFamily: FONT_B, fontWeight: 500, border: 'none', borderRadius: 0,
              cursor: selected ? 'pointer' : 'not-allowed', transition: 'background 0.2s ease', outline: 'none',
            }}>{isLast ? 'COMPLETE' : 'NEXT'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Closing ─────────────────────────────────────────────────────────────────

function Closing({ name, onSubmit, onBack }: { name: string; onSubmit: (closing: string) => void; onBack: () => void }) {
  const [text, setText] = useState('');
  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', background: BG, display: 'flex', flexDirection: 'column' as const }}>
      <div style={{ padding: '28px 24px 20px' }}>
        <BackBtn onClick={onBack} />
      </div>
      <div style={{ flex: 1 }}>
        <div className="animate-fade-up" style={{ maxWidth: '480px', margin: '0 auto', padding: '8px 24px 32px' }}>
          <h2 style={{
            fontFamily: FONT_H, fontStyle: 'italic', fontWeight: 400,
            fontSize: 'clamp(24px, 3vw, 32px)', color: TEXT, marginBottom: '14px', lineHeight: 1.3,
          }}>
            One last thing, {name}.
          </h2>
          <p style={{ fontFamily: FONT_B, fontSize: '14px', color: MUTED, lineHeight: 1.7, marginBottom: '24px', fontWeight: 300 }}>
            Is there anything else you want me to know? Something the questions didn't quite reach. This is optional, but anything you share goes directly into your result.
          </p>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={5} style={{
            width: '100%', padding: '14px', background: FIELD_BG, border: `1px solid ${FIELD_BD}`,
            borderRadius: 0, fontSize: '16px', color: TEXT, fontFamily: FONT_B, fontWeight: 300,
            outline: 'none', resize: 'none' as const, lineHeight: 1.6, boxSizing: 'border-box' as const,
          }} placeholder="Anything else you want to add..." />
          <div style={{ marginTop: '40px' }}>
            <button onClick={() => onSubmit(text)} type="button" style={{
              ...TAP_BASE, width: '100%', padding: '16px', minHeight: '48px',
              background: TEXT, color: BG, fontSize: '12px', letterSpacing: '0.2em',
              textTransform: 'uppercase' as const, fontFamily: FONT_B, fontWeight: 500,
              border: 'none', borderRadius: 0, outline: 'none',
            }}>SEE MY RESULT</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Email gate ──────────────────────────────────────────────────────────────

function EmailGate({ onSubmit }: { onSubmit: (email: string) => void }) {
  const [email, setEmail] = useState('');
  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', background: BG, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '56px' }}><LogoMark /></div>
        <h2 style={{ fontFamily: FONT_H, fontStyle: 'italic', fontWeight: 400, fontSize: '28px', color: TEXT, marginBottom: '12px', lineHeight: 1.3, textAlign: 'center' as const }}>
          Your pattern is being identified.
        </h2>
        <p style={{ fontFamily: FONT_B, fontWeight: 300, fontSize: '16px', color: MUTED, lineHeight: 1.65, marginBottom: '36px', textAlign: 'center' as const }}>
          Enter your email and we'll send you the full result once it's written — along with what to do next.
        </p>
        <label style={{ display: 'block', fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: MUTED, marginBottom: '8px', fontFamily: FONT_B, fontWeight: 400 }}>
          Your email
        </label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{
          width: '100%', padding: '13px 14px', background: FIELD_BG, border: `1px solid ${FIELD_BD}`,
          borderRadius: 0, fontSize: '16px', color: TEXT, fontFamily: FONT_B, fontWeight: 300,
          outline: 'none', boxSizing: 'border-box' as const, marginBottom: '16px',
        }} />
        <button onClick={() => { if (email.trim()) onSubmit(email); }} type="button" style={{
          ...TAP_BASE, width: '100%', padding: '16px', minHeight: '48px',
          background: TEXT, color: BG, fontSize: '12px', letterSpacing: '0.2em',
          textTransform: 'uppercase' as const, fontFamily: FONT_B, fontWeight: 500,
          border: 'none', borderRadius: 0, outline: 'none', marginBottom: '10px',
        }}>IDENTIFY MY PATTERN</button>
        <p style={{ fontFamily: FONT_B, fontSize: '11px', color: MUTED, opacity: 0.6, textAlign: 'center' as const }}>Takes about 30 seconds. No spam.</p>
      </div>
    </div>
  );
}

// ─── Generating ──────────────────────────────────────────────────────────────

function Generating({ name }: { name: string }) {
  const [dots, setDots] = useState('');
  useEffect(() => { const i = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500); return () => clearInterval(i); }, []);
  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', background: BG, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' as const }}>
      <div style={{ maxWidth: '360px' }}>
        <LogoMark />
        <div style={{ height: '48px' }} />
        <p style={{ fontFamily: FONT_H, fontStyle: 'italic', fontWeight: 400, fontSize: '22px', color: TEXT, marginBottom: '16px', lineHeight: 1.4 }}>
          Reading your pattern{dots}
        </p>
        <p style={{ fontFamily: FONT_B, fontSize: '14px', color: MUTED, lineHeight: 1.65, fontWeight: 300 }}>
          Your result is being written for you specifically, {name}. This takes about 30 seconds.
        </p>
      </div>
    </div>
  );
}

// ─── Result ──────────────────────────────────────────────────────────────────

function parseMantra(raw: string): { morning: string; evening: string } | null {
  if (!raw) return null;
  const mMatch = raw.match(/Morning:\s*(.+?)(?:\.|$)/i);
  const eMatch = raw.match(/Evening:\s*(.+?)(?:\.|$)/i);
  if (mMatch && eMatch) return { morning: mMatch[1].trim(), evening: eMatch[1].trim() };
  return null;
}

function SectionNum({ n }: { n: string }) {
  return <span style={{ fontFamily: FONT_B, fontWeight: 500, fontSize: '11px', color: ACCENT, marginRight: '12px' }}>{n}</span>;
}

function SmallDots() {
  const opacities = [0.12, 0.35, 0.65, 1.0, 0.65, 0.35, 0.12];
  const r = 2.5;
  const gap = 7;
  const d = r * 2;
  const w = 7 * d + 6 * gap;
  return (
    <svg width={w} height={d} viewBox={`0 0 ${w} ${d}`} fill="none" aria-hidden="true">
      {opacities.map((op, i) => (
        <circle key={i} cx={r + i * (d + gap)} cy={r} r={r} fill={ACCENT} fillOpacity={op} />
      ))}
    </svg>
  );
}

function DropCap({ text }: { text: string }) {
  if (!text) return null;
  const first = text[0];
  const rest = text.slice(1);
  return (
    <p style={{ fontFamily: FONT_B, fontWeight: 300, fontSize: '17px', lineHeight: 1.75, color: TEXT, marginBottom: '0', whiteSpace: 'pre-line' as const }}>
      <span style={{
        fontFamily: FONT_H, fontSize: '3.5em', float: 'left' as const,
        lineHeight: 0.8, marginRight: '4px', marginTop: '4px', color: TEXT,
      }}>{first}</span>{rest}
    </p>
  );
}

function Result({ result, primaryCode }: { result: ResultData; primaryCode: string }) {
  const mantra = parseMantra(result.mantra);

  const leftSections = [
    { num: '02', label: 'What this has cost you', content: result.cost },
    { num: '03', label: 'Why it was installed', content: result.installed },
    { num: '04', label: 'Why it has been hard to dissolve', content: result.hard },
    { num: '05', label: 'What dissolution looks like', content: result.dissolution },
  ];

  const practices = [
    { num: '01', content: result.practice1 },
    { num: '02', content: result.practice2 },
    { num: '03', content: result.practice3 },
  ];

  return (
    <div className="animate-fade-in" style={{ background: BG }}>
      {/* Header: mark, label, name, rule */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '80px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}><LogoMark /></div>
        <div style={{ display: 'flex', flexDirection: 'column' as const, alignItems: 'center', marginTop: '32px', marginBottom: '32px' }}>
          <PatternMark pattern={primaryCode} size={160} />
        </div>
        <p style={{ ...SECTION_LABEL, letterSpacing: '0.4em', marginBottom: '20px', textAlign: 'center' as const }}>YOUR PATTERN</p>
        <h1 style={{ fontFamily: FONT_H, fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(48px, 6vw, 80px)', lineHeight: 1.05, color: TEXT, textAlign: 'center' as const, marginBottom: '32px' }}>
          {result.patternName}
        </h1>
        <div style={{ height: '1px', background: ACCENT, marginBottom: '56px' }} />
      </div>

      {/* Two-column grid: left narrative, right pullquote + mantra */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>
        <div className="result-grid" style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '64px' }}>
          <div>
            {/* 01 Recognition with drop cap */}
            <p style={SECTION_LABEL}><SectionNum n="01" />Recognition</p>
            <DropCap text={result.recognition} />

            {leftSections.map((s) => (
              <div key={s.label}>
                <div style={{ height: '1px', background: BORDER, margin: '36px 0' }} />
                <p style={SECTION_LABEL}><SectionNum n={s.num} />{s.label}</p>
                <p style={{ fontFamily: FONT_B, fontSize: '17px', lineHeight: 1.75, color: TEXT, fontWeight: 300, whiteSpace: 'pre-line' as const }}>{s.content}</p>
              </div>
            ))}
          </div>

          <div>
            {/* Pull quote */}
            <div style={{ borderLeft: `1px solid ${BORDER}`, paddingLeft: '24px', marginBottom: '48px' }}>
              <p style={{ fontFamily: FONT_H, fontStyle: 'italic', fontWeight: 400, fontSize: '22px', lineHeight: 1.65, color: MUTED }}>{result.pullquote}</p>
            </div>

            {/* 05 Mantra */}
            {mantra && (
              <div style={{ background: SURFACE, padding: '32px' }}>
                <p style={{ ...SECTION_LABEL, marginBottom: '20px' }}><SectionNum n="05" />Your mantra</p>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ ...SECTION_LABEL, fontSize: '10px', letterSpacing: '0.2em', marginBottom: '6px' }}>Morning</p>
                  <p style={{ fontFamily: FONT_H, fontStyle: 'italic', fontSize: '20px', lineHeight: 1.5, color: TEXT }}>{mantra.morning}</p>
                </div>
                <div>
                  <p style={{ ...SECTION_LABEL, fontSize: '10px', letterSpacing: '0.2em', marginBottom: '6px' }}>Evening</p>
                  <p style={{ fontFamily: FONT_H, fontStyle: 'italic', fontSize: '20px', lineHeight: 1.5, color: TEXT }}>{mantra.evening}</p>
                </div>
              </div>
            )}
            {!mantra && result.mantra && (
              <div style={{ background: SURFACE, padding: '32px' }}>
                <p style={{ ...SECTION_LABEL, marginBottom: '16px' }}><SectionNum n="05" />Your mantra</p>
                <p style={{ fontFamily: FONT_H, fontStyle: 'italic', fontSize: '20px', lineHeight: 1.5, color: TEXT }}>{result.mantra}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Brand mark divider */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '56px 0' }}>
        <SmallDots />
      </div>

      {/* 06 Practice section — full width, warm background */}
      {(result.practice1 || result.practice2 || result.practice3) && (
        <div style={{ background: SURFACE, padding: 'clamp(32px, 4vw, 48px) 0' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>
            <p style={{ ...SECTION_LABEL, marginBottom: '24px' }}><SectionNum n="06" />Your practice</p>

            {result.practiceOpening && (
              <p style={{ fontFamily: FONT_B, fontSize: '17px', lineHeight: 1.75, color: TEXT, fontWeight: 300, whiteSpace: 'pre-line' as const, marginBottom: '36px' }}>
                {result.practiceOpening}
              </p>
            )}

            {practices.map((p, i) => p.content && (
              <div key={i}>
                {i > 0 && <div style={{ height: '1px', background: BORDER, margin: '32px 0' }} />}
                <p style={{ fontFamily: FONT_B, fontWeight: 500, fontSize: '10px', letterSpacing: '0.3em', color: ACCENT, marginBottom: '12px', textTransform: 'uppercase' as const }}>
                  PRACTICE {p.num}
                </p>
                <p style={{ fontFamily: FONT_B, fontSize: '17px', lineHeight: 1.75, color: TEXT, fontWeight: 300, whiteSpace: 'pre-line' as const }}>
                  {p.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 07 Secondary pattern — full width, white bordered container */}
      {result.secondary && (
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '56px 24px 80px' }}>
          <div style={{ border: `1px solid ${BORDER}`, padding: '32px', background: '#FFFFFF' }}>
            <p style={SECTION_LABEL}><SectionNum n="07" />Your secondary pattern</p>
            <p style={{ fontFamily: FONT_B, fontSize: '17px', lineHeight: 1.75, color: TEXT, fontWeight: 300, whiteSpace: 'pre-line' as const }}>{result.secondary}</p>
          </div>
        </div>
      )}

      {!result.secondary && <div style={{ height: '80px' }} />}
    </div>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function Home() {
  const [stage, setStage] = useState<Stage>('landing');
  const [intake, setIntake] = useState<IntakeData | null>(null);
  const [closing, setClosing] = useState('');
  const [answers, setAnswers] = useState<Answers>({});
  const [quizIdx, setQuizIdx] = useState(0);
  const [result, setResult] = useState<ResultData | null>(null);
  const [primaryCode, setPrimaryCode] = useState<string>('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleIntakeComplete = (data: IntakeData) => { setIntake(data); setStage('quiz'); };

  const handleQuizComplete = (completedAnswers: Answers) => {
    setAnswers(completedAnswers);
    setQuizIdx(ALL_QUESTIONS.length - 1);
    const q20Id = completedAnswers[20];
    const q20 = ALL_QUESTIONS.find(q => q.id === 20);
    const q20Opt = q20?.options.find(o => o.id === q20Id);
    if (q20Opt && intake) {
      setIntake({ ...intake, previousApproach: q20Opt.text });
    }
    setStage('closing');
  };

  const handleQuizBack = (idx: number, quizAnswers: Answers) => {
    setQuizIdx(idx);
    setAnswers(quizAnswers);
    setStage('intake');
  };

  const handleClosingSubmit = (closingText: string) => {
    setClosing(closingText);
    setStage('email');
  };

  const handleEmailSubmit = async (submittedEmail: string) => {
    setEmail(submittedEmail);
    console.log('Email captured:', submittedEmail);
    if (!intake) return;
    setStage('generating');
    const scores = calculateScores(answers);
    setPrimaryCode(scores.primary);

    const fullIntake = { ...intake, closing, previousApproach: intake.previousApproach };
    const q23Answer = getAnswerText(answers, 23);
    const q37Answer = getAnswerText(answers, 37);
    const q41Answer = getAnswerText(answers, 41);

    fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intake: fullIntake, answers, scores }),
    }).catch(console.error);

    try {
      const res = await fetch('/api/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores, intake: fullIntake, email: submittedEmail, q23Answer, q37Answer, q41Answer }),
      });
      const data = await res.json();
      if (!data.success) throw new Error('Generation failed');
      setResult(data.result);
      setStage('result');
    } catch {
      setError('Something went wrong generating your result. Please refresh and try again.');
    }
  };

  if (error) return (
    <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' as const }}>
      <p style={{ fontFamily: FONT_B, fontSize: '14px', color: MUTED, lineHeight: 1.6, maxWidth: '400px' }}>{error}</p>
    </div>
  );

  return (
    <main style={{ minHeight: '100vh', width: '100%', background: BG }}>
      {stage === 'landing'    && <Landing onStart={() => setStage('intake')} />}
      {stage === 'intake'     && <Intake onComplete={handleIntakeComplete} onBack={() => setStage('landing')} initialData={intake ?? undefined} />}
      {stage === 'quiz'       && <Quiz initialIdx={quizIdx} initialAnswers={answers} onComplete={handleQuizComplete} onBack={handleQuizBack} />}
      {stage === 'closing'    && intake && <Closing name={intake.name} onSubmit={handleClosingSubmit} onBack={() => { setStage('quiz'); }} />}
      {stage === 'email'      && <EmailGate onSubmit={handleEmailSubmit} />}
      {stage === 'generating' && intake && <Generating name={intake.name} />}
      {stage === 'result'     && result && <Result result={result} primaryCode={primaryCode} />}
    </main>
  );
}
