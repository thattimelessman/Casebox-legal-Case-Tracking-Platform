/* ═══════════════════════════════════════════════
   CASEBOX — Shared Sketch Illustrations
   All pencil / etching style, same palette
═══════════════════════════════════════════════ */

export const TOKENS = {
  navy:      "#1a2744",
  navyMid:   "#243460",
  cream:     "#f8f4ed",
  creamDark: "#ede8df",
  mint:      "#d9ede8",
  mintMid:   "#b8ddd5",
  sage:      "#4a7c6f",
  sageLt:    "#6aad9c",
  gold:      "#b8922a",
  goldLt:    "#d4aa47",
  rose:      "#9b4444",
  slate:     "#4a6fa5",
  muted:     "#7a7a8a",
  border:    "#d6cfc2",
  ink:       "#1a1a2e",
};

export const SketchScales = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <line x1="60" y1="18" x2="60" y2="95" stroke="#4a7c6f" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2,1.2" />
    <path d="M40 95 Q60 99 80 95" stroke="#4a7c6f" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <line x1="36" y1="100" x2="84" y2="100" stroke="#4a7c6f" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="22" y1="30" x2="98" y2="30" stroke="#4a7c6f" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="28" y1="30" x2="18" y2="56" stroke="#4a7c6f" strokeWidth="1" strokeLinecap="round" strokeDasharray="1.5,1" />
    <line x1="92" y1="30" x2="102" y2="56" stroke="#4a7c6f" strokeWidth="1" strokeLinecap="round" strokeDasharray="1.5,1" />
    <path d="M10 56 Q18 62 26 56" stroke="#4a7c6f" strokeWidth="1.6" fill="rgba(74,124,111,0.07)" strokeLinecap="round" />
    <path d="M94 56 Q102 62 110 56" stroke="#4a7c6f" strokeWidth="1.6" fill="rgba(74,124,111,0.07)" strokeLinecap="round" />
    <polygon points="52,6 60,18 68,6" stroke="#b8922a" strokeWidth="1.1" fill="rgba(184,146,42,0.12)" strokeLinejoin="round" />
  </svg>
);

export const SketchNotepad = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 95 95" fill="none">
    <rect x="12" y="12" width="64" height="72" rx="3" stroke="#243460" strokeWidth="1.4" fill="rgba(248,244,237,0.8)" />
    {[18,26,34,42,50,58,66,74].map((y,i) => (
      <path key={i} d={`M10 ${y} Q14 ${y-3} 18 ${y} Q22 ${y+3} 26 ${y}`} stroke="#4a7c6f" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    ))}
    {[30,38,46,54,62,70].map((y,i) => (
      <line key={i} x1="28" y1={y} x2={i===4?60:68} y2={y} stroke="#4a7c6f" strokeWidth="0.9" strokeOpacity="0.4" strokeLinecap="round" />
    ))}
    <path d="M30 46 L35 51 L44 41" stroke="#4a7c6f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="28" y="18" width="40" height="6" rx="1" fill="rgba(74,124,111,0.12)" stroke="#4a7c6f" strokeWidth="0.7" />
    <path d="M68 12 L68 28 L63 24 L58 28 L58 12" stroke="#9b4444" strokeWidth="1" fill="rgba(155,68,68,0.12)" strokeLinejoin="round" />
  </svg>
);

export const SketchFlower = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path d="M50 78 Q48 88 46 96" stroke="#4a7c6f" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M48 85 Q40 80 36 72 Q44 74 48 85Z" stroke="#4a7c6f" strokeWidth="1.1" fill="rgba(74,124,111,0.1)" strokeLinejoin="round" />
    {[0,45,90,135,180,225,270,315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const cx = 50 + Math.cos(rad) * 18;
      const cy = 40 + Math.sin(rad) * 18;
      return <ellipse key={i} cx={cx} cy={cy} rx="9" ry="14" transform={`rotate(${angle} ${cx} ${cy})`}
        stroke={i%2===0?"#b8922a":"#9b4444"} strokeWidth="1" fill={i%2===0?"rgba(184,146,42,0.1)":"rgba(155,68,68,0.08)"} />;
    })}
    <circle cx="50" cy="40" r="8" stroke="#b8922a" strokeWidth="1.3" fill="rgba(184,146,42,0.15)" />
    <circle cx="50" cy="40" r="3.5" stroke="#b8922a" strokeWidth="0.8" fill="rgba(184,146,42,0.25)" />
  </svg>
);

export const SketchPen = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 90 90" fill="none">
    <path d="M15 72 L18 65 L65 18 L72 25 L25 72 Z" stroke="#243460" strokeWidth="1.3" fill="rgba(36,52,96,0.06)" strokeLinejoin="round" />
    <path d="M65 18 L72 25 L78 16 L68 10 Z" stroke="#4a7c6f" strokeWidth="1.2" fill="rgba(74,124,111,0.12)" strokeLinejoin="round" />
    <path d="M18 65 L15 72 L10 75 L13 70 Z" stroke="#b8922a" strokeWidth="1.1" fill="rgba(184,146,42,0.15)" strokeLinejoin="round" />
    <path d="M6 82 Q14 78 18 82 Q22 86 28 80" stroke="#b8922a" strokeWidth="0.9" strokeLinecap="round" fill="none" strokeDasharray="2,1.5" />
  </svg>
);

export const SketchGavel = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <line x1="30" y1="70" x2="72" y2="28" stroke="#4a7c6f" strokeWidth="3.5" strokeLinecap="round" />
    <rect x="58" y="14" width="28" height="16" rx="3" transform="rotate(45 58 14)" stroke="#4a7c6f" strokeWidth="1.5" fill="rgba(74,124,111,0.1)" />
    <rect x="12" y="74" width="36" height="14" rx="2" stroke="#b8922a" strokeWidth="1.3" fill="rgba(184,146,42,0.08)" strokeDasharray="3,1" />
    <line x1="12" y1="81" x2="48" y2="81" stroke="#b8922a" strokeWidth="0.8" strokeOpacity="0.4" />
  </svg>
);

export const SketchCourt = ({ size = 48 }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 140 105" fill="none">
    <rect x="20" y="45" width="100" height="53" stroke="#243460" strokeWidth="1.4" fill="rgba(248,244,237,0.6)" />
    <path d="M15 45 L70 12 L125 45" stroke="#243460" strokeWidth="1.4" fill="rgba(248,244,237,0.5)" strokeLinejoin="round" />
    <path d="M55 12 Q70 2 85 12" stroke="#b8922a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    {[32,48,64,80,96,108].map((x,i) => (
      <line key={i} x1={x} y1="45" x2={x} y2="98" stroke="#4a7c6f" strokeWidth="1.3" strokeLinecap="round" strokeDasharray="1,1" />
    ))}
    <rect x="56" y="70" width="28" height="28" rx="14" stroke="#9b4444" strokeWidth="1.2" fill="rgba(155,68,68,0.06)" />
    <line x1="14" y1="98" x2="126" y2="98" stroke="#243460" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const SketchFolder = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 90 90" fill="none">
    <path d="M8 28 Q8 20 16 20 L34 20 Q38 20 40 24 L44 28 L74 28 Q82 28 82 36 L82 72 Q82 80 74 80 L16 80 Q8 80 8 72 Z"
      stroke="#4a7c6f" strokeWidth="1.4" fill="rgba(74,124,111,0.08)" strokeLinejoin="round" />
    <line x1="20" y1="48" x2="70" y2="48" stroke="#4a7c6f" strokeWidth="0.9" strokeOpacity="0.4" strokeLinecap="round" />
    <line x1="20" y1="56" x2="65" y2="56" stroke="#4a7c6f" strokeWidth="0.9" strokeOpacity="0.4" strokeLinecap="round" />
    <line x1="20" y1="64" x2="60" y2="64" stroke="#4a7c6f" strokeWidth="0.9" strokeOpacity="0.4" strokeLinecap="round" />
  </svg>
);

export const SketchUser = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="26" r="14" stroke="#243460" strokeWidth="1.3" fill="rgba(248,244,237,0.8)" />
    <path d="M12 68 Q12 50 40 50 Q68 50 68 68" stroke="#243460" strokeWidth="1.4" fill="rgba(36,52,96,0.06)" strokeLinecap="round" />
  </svg>
);

export const SketchLock = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <rect x="16" y="38" width="48" height="34" rx="4" stroke="#4a7c6f" strokeWidth="1.4" fill="rgba(74,124,111,0.08)" />
    <path d="M26 38 L26 28 Q26 14 40 14 Q54 14 54 28 L54 38" stroke="#4a7c6f" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    <circle cx="40" cy="56" r="5" stroke="#b8922a" strokeWidth="1.2" fill="rgba(184,146,42,0.15)" />
    <line x1="40" y1="61" x2="40" y2="66" stroke="#b8922a" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const SketchBell = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <path d="M40 12 Q54 12 60 26 Q66 40 66 54 L14 54 Q14 40 20 26 Q26 12 40 12Z"
      stroke="#b8922a" strokeWidth="1.3" fill="rgba(184,146,42,0.1)" strokeLinejoin="round" />
    <path d="M32 54 Q32 62 40 62 Q48 62 48 54" stroke="#b8922a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <line x1="40" y1="8" x2="40" y2="12" stroke="#b8922a" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="14" y1="54" x2="66" y2="54" stroke="#b8922a" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const SketchDoc = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 80 90" fill="none">
    <path d="M10 10 L52 10 L70 28 L70 82 L10 82 Z" stroke="#243460" strokeWidth="1.3" fill="rgba(248,244,237,0.8)" strokeLinejoin="round" />
    <path d="M52 10 L52 28 L70 28" stroke="#243460" strokeWidth="1.2" fill="rgba(36,52,96,0.07)" strokeLinejoin="round" />
    {[38,46,54,62,70].map((y,i) => (
      <line key={i} x1="18" y1={y} x2={i===3?52:60} y2={y} stroke="#4a7c6f" strokeWidth="0.9" strokeOpacity="0.45" strokeLinecap="round" />
    ))}
    <line x1="18" y1="30" x2="46" y2="30" stroke="#4a7c6f" strokeWidth="1.1" strokeOpacity="0.5" strokeLinecap="round" />
  </svg>
);

/* Decorative triangle */
export const Tri = ({ size=18, color="#4a7c6f", opacity=0.28, rotation=0, filled=false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{transform:`rotate(${rotation}deg)`,opacity}}>
    <polygon points="12,3 21,20 3,20" stroke={color} strokeWidth="1.5" fill={filled?`${color}18`:"none"} strokeLinejoin="round" />
  </svg>
);
