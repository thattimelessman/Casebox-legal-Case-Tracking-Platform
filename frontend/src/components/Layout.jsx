import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Badge, Btn } from "./ui";
import {
  SketchScales, SketchNotepad, SketchFlower,
  SketchPen, SketchGavel, SketchFolder,
  SketchUser, SketchDoc, SketchBell, Tri,
} from "../illustrations/Sketches";

/* ── NAV TREE ─────────────────────────────────────────────── */
const NAV = {
  admin: [
    { id:"dashboard",    label:"Dashboard",        icon:<SketchScales size={18} />,  href:"dashboard" },
    { id:"cases",        label:"All Cases",         icon:<SketchNotepad size={18} />, href:"cases" },
    { id:"users",        label:"User Management",   icon:<SketchUser size={18} />,    href:"users" },
    { id:"pending",      label:"Pending Approvals", icon:<SketchBell size={18} />,    href:"pending", badge:"pending" },
    { id:"audit",        label:"Audit Log",         icon:<SketchDoc size={18} />,     href:"audit" },
  ],
  advocate: [
    { id:"cases",        label:"My Cases",          icon:<SketchNotepad size={18} />, href:"cases" },
    { id:"documents",    label:"Documents",         icon:<SketchFolder size={18} />,  href:"documents" },
  ],
  judge: [
    { id:"cases",        label:"Assigned Cases",    icon:<SketchScales size={18} />,  href:"cases" },
  ],
  client: [
    { id:"cases",        label:"My Case",           icon:<SketchNotepad size={18} />, href:"cases" },
    { id:"documents",    label:"My Documents",      icon:<SketchFolder size={18} />,  href:"documents" },
  ],
};

const ROLE_COLORS = {
  admin:    "#4a148c",
  advocate: "#1565c0",
  judge:    "#7a4800",
  client:   "#3a5a3a",
};

export default function Layout({ page, setPage, children }) {
  const { user, logout, getPendingClients } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navItems = NAV[user?.role] || [];
  const pendingCount = getPendingClients?.()?.length || 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
        body { font-family:'DM Sans',sans-serif; background:#ede8df; color:#1a1a2e; -webkit-font-smoothing:antialiased; overflow-x:hidden; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:#ede8df; }
        ::-webkit-scrollbar-thumb { background:#b8ddd5; border-radius:2px; }
        input,select,textarea,button { font-family:inherit; }
      `}</style>

      <div style={{ display:"flex", minHeight:"100vh" }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: collapsed ? 64 : 224,
          background: "#1a2744",
          display: "flex", flexDirection: "column",
          position: "fixed", top:0, left:0, bottom:0, zIndex:50,
          transition: "width 0.3s cubic-bezier(.4,0,.2,1)",
          overflow: "hidden",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}>
          {/* logo */}
          <div style={{
            padding: collapsed ? "20px 16px" : "22px 22px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between",
          }}>
            {!collapsed && (
              <div style={{
                fontFamily:"'Cormorant Garamond',serif",
                fontSize:"1.3rem", fontWeight:600, color:"#f8f4ed",
              }}>
                Case<span style={{ color:"#6aad9c", fontStyle:"italic" }}>Box</span>
              </div>
            )}
            <button onClick={() => setCollapsed(c => !c)} style={{
              background:"none", border:"none", cursor:"pointer",
              color:"rgba(248,244,237,0.4)", fontSize:"1rem", padding:4,
              transition:"color 0.15s",
            }}
              onMouseEnter={e => e.target.style.color="rgba(248,244,237,0.8)"}
              onMouseLeave={e => e.target.style.color="rgba(248,244,237,0.4)"}>
              {collapsed ? "→" : "←"}
            </button>
          </div>

          {/* nav items */}
          <nav style={{ flex:1, padding:"14px 0", overflowY:"auto" }}>
            {navItems.map(item => {
              const active = page === item.href;
              const showBadge = item.badge === "pending" && pendingCount > 0;
              return (
                <button key={item.id} onClick={() => setPage(item.href)}
                  title={collapsed ? item.label : ""}
                  style={{
                    width:"100%", display:"flex", alignItems:"center",
                    gap: collapsed ? 0 : 11,
                    padding: collapsed ? "11px 0" : "11px 20px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    background: active ? "rgba(106,173,156,0.15)" : "none",
                    borderLeft: active ? "2px solid #6aad9c" : "2px solid transparent",
                    border:"none", cursor:"pointer",
                    transition:"all 0.18s",
                    position:"relative",
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background="none"; }}>
                  <span style={{ opacity: active ? 1 : 0.5, transition:"opacity 0.15s", flexShrink:0 }}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span style={{
                      fontSize:"0.82rem", color: active ? "#6aad9c" : "rgba(248,244,237,0.55)",
                      fontWeight: active ? 500 : 400,
                      letterSpacing:"0.02em", transition:"color 0.15s",
                      whiteSpace:"nowrap",
                    }}>
                      {item.label}
                    </span>
                  )}
                  {showBadge && !collapsed && (
                    <span style={{
                      marginLeft:"auto", background:"#b8922a",
                      color:"#fff", borderRadius:20, fontSize:"0.65rem",
                      padding:"2px 7px", fontWeight:600,
                    }}>{pendingCount}</span>
                  )}
                  {showBadge && collapsed && (
                    <span style={{
                      position:"absolute", top:6, right:6, width:7, height:7,
                      borderRadius:"50%", background:"#b8922a",
                    }} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* user panel */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: collapsed ? "14px 0" : "14px 18px",
            display:"flex", alignItems:"center",
            gap: collapsed ? 0 : 10,
            justifyContent: collapsed ? "center" : "flex-start",
          }}>
            <div style={{
              width:32, height:32, borderRadius:"50%",
              background:"rgba(106,173,156,0.2)",
              border:"1px solid rgba(106,173,156,0.3)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:"0.9rem", color:"#6aad9c", fontWeight:600,
              flexShrink:0,
            }}>
              {user?.first_name?.[0] || "?"}
            </div>
            {!collapsed && (
              <div style={{ minWidth:0, flex:1 }}>
                <div style={{ fontSize:"0.82rem", color:"rgba(248,244,237,0.85)", fontWeight:500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                  {user?.first_name} {user?.last_name}
                </div>
                <div style={{ fontSize:"0.68rem", color:ROLE_COLORS[user?.role] || "#7a7a8a",
                  textTransform:"uppercase", letterSpacing:"0.06em", filter:"brightness(2) saturate(0.7)" }}>
                  {user?.role}
                </div>
              </div>
            )}
            {!collapsed && (
              <button onClick={logout} title="Logout" style={{
                background:"none", border:"none", cursor:"pointer",
                color:"rgba(248,244,237,0.3)", fontSize:"0.9rem",
                transition:"color 0.15s", padding:4, flexShrink:0,
              }}
                onMouseEnter={e => e.target.style.color="#9b4444"}
                onMouseLeave={e => e.target.style.color="rgba(248,244,237,0.3)"}>
                ⏻
              </button>
            )}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{
          marginLeft: collapsed ? 64 : 224,
          flex:1, display:"flex", flexDirection:"column",
          transition:"margin-left 0.3s cubic-bezier(.4,0,.2,1)",
          minHeight:"100vh",
        }}>
          {/* topbar */}
          <header style={{
            height:58, background:"rgba(248,244,237,0.96)",
            backdropFilter:"blur(12px)",
            borderBottom:"1px solid #d6cfc2",
            display:"flex", alignItems:"center",
            padding:"0 30px",
            position:"sticky", top:0, zIndex:40,
            justifyContent:"space-between",
          }}>
            <div style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:"1rem", fontWeight:300, color:"#7a7a8a",
              textTransform:"capitalize", letterSpacing:"0.05em",
            }}>
              <span style={{ color:"#d6cfc2" }}>CaseBox /</span>{" "}
              <span style={{ color:"#1a2744", fontWeight:600 }}>
                {(page || "").replace(/-/g," ").replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              {/* decorative triangles */}
              <div style={{ display:"flex", gap:4, opacity:0.3 }}>
                <Tri size={10} color="#4a7c6f" opacity={1} rotation={0} />
                <Tri size={10} color="#b8922a" opacity={1} rotation={15} filled />
              </div>
              <Badge label={user?.role} variant={user?.role} />
              <span style={{ fontSize:"0.82rem", color:"#7a7a8a" }}>
                {user?.first_name} {user?.last_name}
              </span>
            </div>
          </header>

          {/* page content */}
          <main style={{
            flex:1, padding:"28px 30px",
            background:"#f0ece4",
            minHeight:"calc(100vh - 58px)",
          }}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
