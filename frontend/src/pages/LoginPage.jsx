import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Input, Btn } from "../components/ui";
import { SketchScales, SketchFlower, SketchPen, SketchNotepad, Tri } from "../illustrations/Sketches";

export default function LoginPage({ onRegister, onHome }) {
  const { login } = useAuth();
  const [form, setForm]       = useState({ username:"", password:"" });
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await login(form.username, form.password);
    } catch (error) {
      const msg = error?.response?.data?.detail || "Invalid username or password.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  const demos = [
    { label:"Admin",    user:"admin",   hint:"Full access" },
    { label:"Advocate", user:"priya",   hint:"Case manager" },
    { label:"Judge",    user:"justice", hint:"Read-only" },
    { label:"Client",   user:"raj",     hint:"Own cases" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'DM Sans',sans-serif; background:#ede8df; -webkit-font-smoothing:antialiased; }
        input,button { font-family:inherit; }
      `}</style>

      <div style={{
        minHeight:"100vh", display:"grid", gridTemplateColumns:"1fr 1fr",
        background:"#f8f4ed",
      }}>
        {/* LEFT — illustration panel */}
        <div style={{
          background:"#1a2744", display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          padding:"60px 56px", position:"relative", overflow:"hidden",
        }}>
          <div style={{
            position:"absolute", inset:0,
            background:"radial-gradient(ellipse at 30% 60%, rgba(74,124,111,0.18) 0%, transparent 65%)",
            pointerEvents:"none",
          }} />
          <div style={{ position:"absolute", top:"12%", left:"10%" }}><Tri size={20} color="#6aad9c" opacity={0.3} rotation={15} /></div>
          <div style={{ position:"absolute", top:"25%", right:"14%" }}><Tri size={13} color="#b8922a" opacity={0.28} rotation={-12} filled /></div>
          <div style={{ position:"absolute", bottom:"18%", left:"8%" }}><Tri size={16} color="#6aad9c" opacity={0.22} rotation={30} /></div>
          <div style={{ position:"absolute", bottom:"12%", right:"9%" }}><Tri size={11} color="#9b4444" opacity={0.2} rotation={-20} filled /></div>

          <div style={{ position:"absolute", top:"18%", right:"12%", animation:"float1 6s ease-in-out infinite", opacity:0.7 }}>
            <SketchFlower size={56} />
          </div>
          <div style={{ position:"absolute", bottom:"22%", left:"9%", animation:"float2 7s ease-in-out infinite", opacity:0.65 }}>
            <SketchPen size={50} />
          </div>
          <div style={{ position:"absolute", bottom:"30%", right:"8%", animation:"float1 8s ease-in-out infinite 1s", opacity:0.55 }}>
            <SketchNotepad size={50} />
          </div>

          <div style={{ position:"relative", zIndex:2, textAlign:"center", animation:"float2 5s ease-in-out infinite" }}>
            <SketchScales size={90} />
          </div>

          <div style={{ position:"relative", zIndex:2, textAlign:"center", marginTop:32 }}>
            <div style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:"2.4rem", fontWeight:300, color:"#f8f4ed",
              lineHeight:1.2, marginBottom:14,
            }}>
              Your case,<br /><em style={{ color:"#6aad9c" }}>clearly</em> managed.
            </div>
            <p style={{
              fontSize:"0.88rem", color:"rgba(248,244,237,0.45)",
              lineHeight:1.8, maxWidth:320, fontWeight:300,
            }}>
              Secure access for advocates, clients, and judges.
              Every hearing, every document — in one place.
            </p>
          </div>

          <div style={{
            position:"absolute", bottom:28,
            display:"flex", alignItems:"center", gap:12,
          }}>
            <div style={{ width:24, height:1, background:"rgba(106,173,156,0.4)" }} />
            <span style={{ fontSize:"0.68rem", color:"rgba(248,244,237,0.2)", letterSpacing:"0.14em", textTransform:"uppercase" }}>
              Trusted · Secure · Transparent
            </span>
            <div style={{ width:24, height:1, background:"rgba(106,173,156,0.4)" }} />
          </div>

          <style>{`
            @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
            @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
          `}</style>
        </div>

        {/* RIGHT — login form */}
        <div style={{
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          padding:"60px 64px",
        }}>
          <div style={{ width:"100%", maxWidth:380 }}>
            <div style={{
              fontFamily:"'Cormorant Garamond',serif",
              fontSize:"1.6rem", fontWeight:600, color:"#1a2744", marginBottom:8,
            }}>
              Case<span style={{ color:"#4a7c6f", fontStyle:"italic" }}>Box</span>
            </div>
            <div style={{
              fontSize:"0.72rem", letterSpacing:"0.14em", textTransform:"uppercase",
              color:"#7a7a8a", marginBottom:40,
              display:"flex", alignItems:"center", gap:10,
            }}>
              <span style={{ width:20, height:1, background:"#d6cfc2", display:"inline-block" }} />
              Sign in to your account
            </div>

            <form onSubmit={submit}>
              <Input label="Username" id="username" value={form.username}
                onChange={set("username")} placeholder="Enter username" required />
              <Input label="Password" id="password" type="password" value={form.password}
                onChange={set("password")} placeholder="Enter password" required />

              {err && (
                <div style={{
                  padding:"10px 14px", background:"#fdf3f3",
                  border:"1px solid rgba(155,68,68,0.25)", borderRadius:6,
                  fontSize:"0.84rem", color:"#9b4444", marginBottom:16,
                }}>{err}</div>
              )}

              <Btn type="submit" variant="primary" size="lg" disabled={loading}
                style={{ width:"100%", justifyContent:"center" }}>
                {loading ? "Signing in…" : "Sign In"}
              </Btn>
            </form>

            <div style={{ marginTop:20, textAlign:"center" }}>
              <span style={{ fontSize:"0.84rem", color:"#7a7a8a" }}>New client?{" "}</span>
              <button onClick={onRegister} style={{
                background:"none", border:"none", cursor:"pointer",
                fontSize:"0.84rem", color:"#4a7c6f", fontWeight:500,
                textDecoration:"underline", textUnderlineOffset:2,
              }}>Request access</button>
            </div>

            {/* demo accounts — only admin exists by default */}
            <div style={{ marginTop:40 }}>
              <div style={{
                fontSize:"0.68rem", textTransform:"uppercase", letterSpacing:"0.1em",
                color:"#b0a898", marginBottom:12, textAlign:"center",
              }}>Demo — password: <code style={{ fontFamily:"'JetBrains Mono',monospace" }}>admin123</code></div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                {demos.map(d => (
                  <button key={d.user}
                    onClick={() => setForm({ username: d.user, password: "admin123" })}
                    style={{
                      padding:"9px 12px", border:"1px solid #d6cfc2",
                      borderRadius:7, background:"#fff", cursor:"pointer",
                      textAlign:"left", transition:"all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor="#4a7c6f"; e.currentTarget.style.background="#f0f7f5"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="#d6cfc2"; e.currentTarget.style.background="#fff"; }}>
                    <div style={{ fontSize:"0.78rem", fontWeight:500, color:"#1a2744" }}>{d.label}</div>
                    <div style={{ fontSize:"0.7rem", color:"#7a7a8a" }}>{d.user} · {d.hint}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}