import type { PatternCode } from './quiz-data';

const A = '#C9A66B';
const S = '#1B1C1A';

function InvisibleTax() {
  const angles = [0, 60, 120, 180, 240, 300];
  const widths = [1.5, 1.2, 1.0, 0.8, 0.6, 0.4];
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <circle cx="40" cy="40" r="12" stroke={S} strokeWidth="1" fill="none" />
      <circle cx="40" cy="40" r="4" fill={S} />
      {angles.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 40 + 16 * Math.cos(rad);
        const y1 = 40 + 16 * Math.sin(rad);
        const x2 = 40 + 32 * Math.cos(rad);
        const y2 = 40 + 32 * Math.sin(rad);
        return (
          <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={A} strokeWidth={widths[i]} />
        );
      })}
    </svg>
  );
}

function GlassCeiling() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <line x1="10" y1="20" x2="70" y2="20" stroke={S} strokeWidth="1" strokeDasharray="4 3" />
      <path d="M20 65 Q30 40 40 30 Q48 24 52 22" stroke={A} strokeWidth="1.2" fill="none" />
      <path d="M52 22 Q54 24 50 30 Q46 38 44 42" stroke={A} strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function PerformedLife() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <circle cx="40" cy="40" r="32" stroke={S} strokeWidth="1" fill="none" />
      <circle cx="44" cy="43" r="18" stroke={A} strokeWidth="1" fill="none" />
    </svg>
  );
}

function MovingGoalpost() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <line x1="14" y1="18" x2="14" y2="62" stroke={S} strokeWidth="1" opacity="0.3" />
      <line x1="6" y1="18" x2="22" y2="18" stroke={S} strokeWidth="1" opacity="0.3" />
      <line x1="40" y1="18" x2="40" y2="62" stroke={S} strokeWidth="1" opacity="0.6" />
      <line x1="32" y1="18" x2="48" y2="18" stroke={S} strokeWidth="1" opacity="0.6" />
      <line x1="66" y1="18" x2="66" y2="62" stroke={S} strokeWidth="1" opacity="1" />
      <line x1="58" y1="18" x2="74" y2="18" stroke={S} strokeWidth="1" opacity="1" />
      <line x1="10" y1="40" x2="60" y2="40" stroke={A} strokeWidth="1" strokeDasharray="3 3" />
      <path d="M56 36 L62 40 L56 44" stroke={A} strokeWidth="1" fill="none" />
    </svg>
  );
}

function Appetite() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <circle cx="40" cy="40" r="28" stroke={S} strokeWidth="1" fill="none" />
      <line x1="40" y1="50" x2="40" y2="18" stroke={A} strokeWidth="1.2" />
      <path d="M35 24 L40 18 L45 24" stroke={A} strokeWidth="1.2" fill="none" />
      <circle cx="40" cy="46" r="3" fill={S} opacity="0.4" />
    </svg>
  );
}

function ArmouredSelf() {
  const startAngle = 15;
  const endAngle = 345;
  const r = 30;
  const cx = 40;
  const cy = 40;
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <circle cx="40" cy="40" r="30" stroke={S} strokeWidth="1" fill="none" opacity="0.8" />
      <path d={`M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x2} ${y2}`} stroke={A} strokeWidth="1.5" fill="none" />
      <circle cx="40" cy="40" r="6" fill={S} />
    </svg>
  );
}

function OutgrewLife() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <rect x="18" y="22" width="36" height="36" stroke={S} strokeWidth="1" strokeDasharray="3 3" fill="none" />
      <circle cx="46" cy="36" r="24" stroke={A} strokeWidth="1.2" fill="none" />
    </svg>
  );
}

const MARK_MAP: Record<string, () => React.JSX.Element> = {
  IT: InvisibleTax,
  GC: GlassCeiling,
  PL: PerformedLife,
  MG: MovingGoalpost,
  AD: Appetite,
  AS: ArmouredSelf,
  OG: OutgrewLife,
};

export function PatternMark({ pattern, size = 48 }: { pattern: PatternCode | string; size?: number }) {
  const Component = MARK_MAP[pattern];
  if (!Component) return null;
  return (
    <div style={{ width: size, height: size }}>
      <Component />
    </div>
  );
}
