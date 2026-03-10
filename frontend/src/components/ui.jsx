import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";

/* ════════════════════════════════════════
   TOAST SYSTEM
════════════════════════════════════════ */
const ToastCtx = createContext(null);
let _addToast = null;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800);
  }, []);
  _addToast = add;

  const icons = { success: "✓", error: "✕", warn: "!", info: "·" };
  const colors = {
    success: { bar: "#4a7c6f", bg: "#f0f7f5" },
    error:   { bar: "#9b4444", bg: "#fdf3f3" },
    warn:    { bar: "#b8922a", bg: "#fdf8ef" },
    info:    { bar: "#4a6fa5", bg: "#f0f4fb" },
  };

  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div style={{
        position: "fixed", top: 20, right: 20, zIndex: 9999,
        display: "flex", flexDirection: "column", gap: 8,
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            display: "flex", alignItems: "center", gap: 12,
            background: colors[t.type]?.bg || "#fff",
            borderLeft: `3px solid ${colors[t.type]?.bar || "#4a6fa5"}`,
            borderRadius: 6, padding: "12px 18px",
            boxShadow: "0 4px 20px rgba(26,39,68,0.12)",
            minWidth: 280, maxWidth: 360,
            animation: "toastIn 0.3s ease",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.86rem",
            color: "#1a1a2e",
          }}>
            <span style={{ fontFamily: "monospace", fontSize: "0.9rem", color: colors[t.type]?.bar }}>
              {icons[t.type]}
            </span>
            {t.msg}
          </div>
        ))}
      </div>
      <style>{`@keyframes toastIn { from { transform: translateX(30px); opacity:0; } to { transform:none; opacity:1; } }`}</style>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
export const toast = (msg, type) => _addToast?.(msg, type);

/* ════════════════════════════════════════
   BUTTON
════════════════════════════════════════ */
const BTN_STYLES = {
  primary:  { bg: "#1a2744", color: "#f8f4ed", border: "none" },
  sage:     { bg: "#4a7c6f", color: "#f8f4ed", border: "none" },
  ghost:    { bg: "transparent", color: "#1a2744", border: "1.5px solid #d6cfc2" },
  danger:   { bg: "#9b4444", color: "#f8f4ed", border: "none" },
  gold:     { bg: "#b8922a", color: "#f8f4ed", border: "none" },
  outline:  { bg: "transparent", color: "#4a7c6f", border: "1.5px solid #4a7c6f" },
};

export function Btn({ children, variant = "primary", size = "md", onClick, disabled, style = {}, type = "button" }) {
  const s = BTN_STYLES[variant] || BTN_STYLES.primary;
  const pad = size === "sm" ? "6px 16px" : size === "lg" ? "13px 36px" : "9px 22px";
  const fs  = size === "sm" ? "0.76rem" : "0.82rem";
  const [hov, setHov] = useState(false);

  return (
    <button type={type} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: pad, background: s.bg, color: s.color, border: s.border,
        borderRadius: 2, cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'DM Sans', sans-serif", fontSize: fs,
        letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 400,
        opacity: disabled ? 0.55 : 1,
        transform: hov && !disabled ? "translateY(-1px)" : "none",
        boxShadow: hov && !disabled ? "0 4px 14px rgba(26,39,68,0.14)" : "none",
        transition: "all 0.2s",
        display: "inline-flex", alignItems: "center", gap: 7,
        whiteSpace: "nowrap",
        ...style,
      }}>
      {children}
    </button>
  );
}

/* ════════════════════════════════════════
   BADGE
════════════════════════════════════════ */
const BADGE_MAP = {
  ongoing:            { bg: "#e6f4ea", color: "#2d6a4f" },
  adjourned:          { bg: "#fdf3e1", color: "#8a5a00" },
  judgement_reserved: { bg: "#e8edf8", color: "#1a3a6e" },
  closed:             { bg: "#f0e8e8", color: "#7a2c2c" },
  disposed:           { bg: "#eeeeee", color: "#555555" },
  pending:            { bg: "#fff3e0", color: "#e65100" },
  approved:           { bg: "#e8f5e9", color: "#2e7d32" },
  admin:              { bg: "#ede8f8", color: "#4a148c" },
  advocate:           { bg: "#e3f0fb", color: "#1565c0" },
  judge:              { bg: "#fdf3e1", color: "#7a4800" },
  client:             { bg: "#f0f4f0", color: "#3a5a3a" },
  high:               { bg: "#fce8e8", color: "#9b4444" },
  urgent:             { bg: "#fce8e8", color: "#7a1a1a" },
  medium:             { bg: "#fdf3e1", color: "#8a5a00" },
  low:                { bg: "#e8f5e9", color: "#2e7d32" },
  civil:              { bg: "#e8edf8", color: "#1a3a6e" },
  criminal:           { bg: "#f0e8e8", color: "#7a2c2c" },
  family:             { bg: "#fce8f5", color: "#7a1a5a" },
  property:           { bg: "#e8f4ea", color: "#1a4a2a" },
  commercial:         { bg: "#fdf8ef", color: "#7a5500" },
};

export function Badge({ label, variant }) {
  const v = variant || label?.toLowerCase().replace(/\s+/g,"_") || "pending";
  const s = BADGE_MAP[v] || { bg: "#eeeeee", color: "#555" };
  const display = label || variant || "";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px", borderRadius: 20,
      fontSize: "0.72rem", fontWeight: 500,
      background: s.bg, color: s.color,
      letterSpacing: "0.03em",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {display.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
    </span>
  );
}

/* ════════════════════════════════════════
   CARD
════════════════════════════════════════ */
export function Card({ children, style = {}, noPad }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #d6cfc2",
      borderRadius: 12, boxShadow: "0 1px 4px rgba(26,39,68,0.06)",
      ...(noPad ? {} : { padding: 0 }),
      ...style,
    }}>
      {children}
    </div>
  );
}

export function CardHeader({ title, action, style = {} }) {
  return (
    <div style={{
      padding: "16px 22px", borderBottom: "1px solid #d6cfc2",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      ...style,
    }}>
      <span style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1rem", fontWeight: 600, color: "#1a2744",
      }}>{title}</span>
      {action}
    </div>
  );
}

export function CardBody({ children, style = {} }) {
  return <div style={{ padding: "20px 22px", ...style }}>{children}</div>;
}

/* ════════════════════════════════════════
   MODAL
════════════════════════════════════════ */
export function Modal({ open, onClose, title, children, footer, size = "md" }) {
  useEffect(() => {
    const esc = e => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  if (!open) return null;
  const maxW = size === "lg" ? 760 : size === "sm" ? 400 : 580;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "rgba(26,39,68,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, animation: "fadeIn 0.2s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#f8f4ed", borderRadius: 14,
        boxShadow: "0 16px 56px rgba(26,39,68,0.2)",
        width: "100%", maxWidth: maxW,
        maxHeight: "90vh", overflowY: "auto",
        animation: "slideUp 0.25s ease",
      }}>
        <div style={{
          padding: "20px 26px", borderBottom: "1px solid #d6cfc2",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, background: "#f8f4ed", zIndex: 1,
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.2rem", fontWeight: 600, color: "#1a2744",
          }}>{title}</span>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#7a7a8a", fontSize: "1.1rem", padding: "4px 8px",
            borderRadius: 5, transition: "color 0.15s",
          }}>✕</button>
        </div>
        <div style={{ padding: "24px 26px" }}>{children}</div>
        {footer && (
          <div style={{
            padding: "16px 26px", borderTop: "1px solid #d6cfc2",
            display: "flex", justifyContent: "flex-end", gap: 10,
          }}>{footer}</div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { transform:translateY(24px);opacity:0 } to { transform:none;opacity:1 } }
      `}</style>
    </div>
  );
}

/* ════════════════════════════════════════
   INPUT / SELECT / TEXTAREA
════════════════════════════════════════ */
const inputBase = {
  width: "100%", padding: "10px 14px",
  background: "#fff", border: "1.5px solid #d6cfc2",
  borderRadius: 6, fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.9rem", color: "#1a1a2e",
  outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
};

export function Input({ label, id, type = "text", value, onChange, placeholder, required, style = {} }) {
  const [foc, setFoc] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label htmlFor={id} style={{
        display: "block", marginBottom: 5,
        fontSize: "0.75rem", fontWeight: 500, color: "#243460",
        letterSpacing: "0.05em", textTransform: "uppercase",
      }}>{label}{required && <span style={{ color: "#9b4444" }}> *</span>}</label>}
      <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
        onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
        style={{
          ...inputBase,
          borderColor: foc ? "#4a7c6f" : "#d6cfc2",
          boxShadow: foc ? "0 0 0 3px rgba(74,124,111,0.1)" : "none",
          ...style,
        }} />
    </div>
  );
}

export function Select({ label, id, value, onChange, children, required, style = {} }) {
  const [foc, setFoc] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label htmlFor={id} style={{
        display: "block", marginBottom: 5,
        fontSize: "0.75rem", fontWeight: 500, color: "#243460",
        letterSpacing: "0.05em", textTransform: "uppercase",
      }}>{label}{required && <span style={{ color: "#9b4444" }}> *</span>}</label>}
      <select id={id} value={value} onChange={onChange} required={required}
        onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
        style={{
          ...inputBase, cursor: "pointer",
          borderColor: foc ? "#4a7c6f" : "#d6cfc2",
          boxShadow: foc ? "0 0 0 3px rgba(74,124,111,0.1)" : "none",
          ...style,
        }}>
        {children}
      </select>
    </div>
  );
}

export function Textarea({ label, id, value, onChange, placeholder, rows = 4, style = {} }) {
  const [foc, setFoc] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label htmlFor={id} style={{
        display: "block", marginBottom: 5,
        fontSize: "0.75rem", fontWeight: 500, color: "#243460",
        letterSpacing: "0.05em", textTransform: "uppercase",
      }}>{label}</label>}
      <textarea id={id} value={value} onChange={onChange} placeholder={placeholder} rows={rows}
        onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
        style={{
          ...inputBase, resize: "vertical", minHeight: rows * 22,
          borderColor: foc ? "#4a7c6f" : "#d6cfc2",
          boxShadow: foc ? "0 0 0 3px rgba(74,124,111,0.1)" : "none",
          ...style,
        }} />
    </div>
  );
}

/* ════════════════════════════════════════
   FORM ROW
════════════════════════════════════════ */
export function FormRow({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{children}</div>;
}

/* ════════════════════════════════════════
   DATA TABLE
════════════════════════════════════════ */
export function DataTable({ columns, rows, onRowClick, empty = "No records found." }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} style={{
                padding: "10px 16px", background: "#f8f4ed",
                borderBottom: "1px solid #d6cfc2",
                textAlign: "left", fontSize: "0.71rem",
                fontWeight: 600, color: "#7a7a8a",
                letterSpacing: "0.08em", textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: "nowrap",
              }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} style={{
              padding: "52px", textAlign: "center",
              color: "#7a7a8a", fontSize: "0.9rem",
              fontFamily: "'DM Sans', sans-serif",
            }}>{empty}</td></tr>
          ) : rows.map((row, ri) => (
            <tr key={ri} onClick={() => onRowClick?.(row)}
              style={{ cursor: onRowClick ? "pointer" : "default", transition: "background 0.15s" }}
              onMouseEnter={e => { if (onRowClick) e.currentTarget.style.background = "rgba(74,124,111,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = ""; }}>
              {columns.map((c, ci) => (
                <td key={ci} style={{
                  padding: "13px 16px",
                  borderBottom: "1px solid #ede8df",
                  fontSize: "0.87rem", color: "#1a1a2e",
                  fontFamily: "'DM Sans', sans-serif",
                  verticalAlign: "middle",
                }}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ════════════════════════════════════════
   PROGRESS BAR
════════════════════════════════════════ */
export function ProgressBar({ value = 0, showLabel = true }) {
  const color = value >= 70 ? "#4a7c6f" : value < 30 ? "#b8922a" : "#4a6fa5";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: "#ede8df", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${value}%`,
          background: color, borderRadius: 3,
          transition: "width 0.6s ease",
        }} />
      </div>
      {showLabel && <span style={{ fontSize: "0.74rem", color: "#7a7a8a", width: 30, textAlign: "right" }}>{value}%</span>}
    </div>
  );
}

/* ════════════════════════════════════════
   SEARCH BAR
════════════════════════════════════════ */
export function SearchBar({ value, onChange, placeholder = "Search…", style = {} }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "#fff", border: "1.5px solid #d6cfc2",
      borderRadius: 6, padding: "8px 14px",
      transition: "border-color 0.2s",
      ...style,
    }}
      onFocusCapture={e => e.currentTarget.style.borderColor = "#4a7c6f"}
      onBlurCapture={e => e.currentTarget.style.borderColor = "#d6cfc2"}>
      <span style={{ color: "#7a7a8a", fontSize: "0.9rem" }}>⌕</span>
      <input value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          border: "none", outline: "none", background: "none",
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem",
          color: "#1a1a2e", width: "100%",
        }} />
    </div>
  );
}

/* ════════════════════════════════════════
   STAT CARD
════════════════════════════════════════ */
export function StatCard({ icon, label, value, sub, accent = "#4a7c6f" }) {
  return (
    <Card style={{ padding: "20px 22px", transition: "box-shadow 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(26,39,68,0.1)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(26,39,68,0.06)"}>
      <div style={{ marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "#7a7a8a", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 600, color: "#1a2744", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: "0.74rem", color: "#7a7a8a", marginTop: 5 }}>{sub}</div>}
    </Card>
  );
}

/* ════════════════════════════════════════
   SECTION LABEL
════════════════════════════════════════ */
export function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "0.68rem", letterSpacing: "0.16em",
      textTransform: "uppercase", color: "#4a7c6f",
      display: "flex", alignItems: "center", gap: 10,
      marginBottom: 8,
    }}>
      <span style={{ width: 20, height: 1, background: "#4a7c6f", display: "inline-block" }} />
      {children}
    </div>
  );
}

/* ════════════════════════════════════════
   EMPTY STATE
════════════════════════════════════════ */
export function EmptyState({ icon, title, desc }) {
  return (
    <div style={{ textAlign: "center", padding: "64px 40px" }}>
      <div style={{ marginBottom: 16, opacity: 0.4 }}>{icon}</div>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1.25rem", fontWeight: 600, color: "#1a2744", marginBottom: 8,
      }}>{title}</div>
      <div style={{ fontSize: "0.86rem", color: "#7a7a8a", fontWeight: 300 }}>{desc}</div>
    </div>
  );
}

/* ════════════════════════════════════════
   TIMELINE
════════════════════════════════════════ */
export function Timeline({ items }) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", gap: 14, paddingBottom: 20, position: "relative" }}>
          {i < items.length - 1 && (
            <div style={{
              position: "absolute", left: 11, top: 24, bottom: 0,
              width: 1, background: "#d6cfc2",
            }} />
          )}
          <div style={{
            width: 24, height: 24, borderRadius: "50%",
            background: "#4a7c6f", border: "3px solid #f8f4ed",
            boxShadow: "0 0 0 1px #d6cfc2",
            flexShrink: 0, marginTop: 2,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.55rem", color: "#fff",
          }}>⚖</div>
          <div>
            <div style={{ fontSize: "0.72rem", color: "#7a7a8a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>
              {item.date}
            </div>
            <div style={{ fontSize: "0.87rem", color: "#1a1a2e", lineHeight: 1.5 }}>{item.text}</div>
            {item.next && (
              <div style={{ fontSize: "0.74rem", color: "#4a7c6f", marginTop: 4 }}>→ Next: {item.next}</div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ════════════════════════════════════════
   FILE ITEM
════════════════════════════════════════ */
export function FileItem({ title, meta, side, visible, onDownload, onToggle }) {
  const icon = title?.toLowerCase().endsWith(".pdf") ? "📕" :
               title?.toLowerCase().match(/\.(doc|docx)$/) ? "📘" : "📄";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "11px 14px", border: "1px solid #d6cfc2",
      borderRadius: 8, background: "#f8f4ed", marginBottom: 8,
      transition: "all 0.15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#4a7c6f"; e.currentTarget.style.background = "#fff"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#d6cfc2"; e.currentTarget.style.background = "#f8f4ed"; }}>
      <div style={{
        width: 36, height: 36, borderRadius: 7, background: "#1a2744",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.9rem", flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.87rem", fontWeight: 500, color: "#1a1a2e", marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: "0.74rem", color: "#7a7a8a" }}>{meta}</div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {side && <Badge label={side} variant={side} />}
        {onToggle && (
          <Badge label={visible ? "Visible" : "Hidden"} variant={visible ? "approved" : "pending"} />
        )}
        <Btn variant="ghost" size="sm" onClick={onDownload}>↓</Btn>
      </div>
    </div>
  );
}
