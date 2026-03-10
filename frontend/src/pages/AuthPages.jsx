import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Input, Btn, FormRow } from "../components/ui";
import { SketchNotepad, SketchFlower, Tri } from "../illustrations/Sketches";

/* ════════════════════════════════════════
   REGISTER PAGE
════════════════════════════════════════ */
export function RegisterPage({ onLogin }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    first_name:"", last_name:"", username:"", email:"", phone:"", password:"", confirm:"",
  });
  const [err, setErr]       = useState("");
  const [done, setDone]     = useState(false);
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setErr("");
    if (form.password !== form.confirm) { setErr("Passwords do not match."); return; }
    if (form.password.length < 8) { setErr("Password must be at least 8 characters."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const res = register({ first_name:form.first_name, last_name:form.last_name,
      username:form.username, email:form.email, phone:form.phone, password:form.password });
    if (!res.ok) setErr(res.msg);
    else setDone(true);
    setLoading(false);
  };

  return (
    <div style={{
      minHeight:"100vh", background:"#f8f4ed",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"40px 20px",
    }}>
      <div style={{ width:"100%", maxWidth:520 }}>
        {/* header */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
            <SketchNotepad size={56} />
          </div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.6rem", fontWeight:300, color:"#1a2744", marginBottom:6 }}>
            Request <em style={{ fontStyle:"italic", color:"#4a7c6f" }}>Access</em>
          </div>
          <p style={{ fontSize:"0.84rem", color:"#7a7a8a", fontWeight:300 }}>
            Create a client account — your advocate will link you to your case.
          </p>
        </div>

        {done ? (
          <div style={{
            background:"#f0f7f5", border:"1px solid rgba(74,124,111,0.3)",
            borderRadius:12, padding:"40px 32px", textAlign:"center",
          }}>
            <div style={{ fontSize:"2rem", marginBottom:14 }}>✓</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.3rem", fontWeight:600, color:"#1a2744", marginBottom:10 }}>
              Registration received
            </div>
            <p style={{ fontSize:"0.86rem", color:"#7a7a8a", lineHeight:1.8, marginBottom:24, fontWeight:300 }}>
              Your account is pending admin approval. You'll receive access once verified.
            </p>
            <Btn variant="sage" onClick={onLogin}>Back to Sign In</Btn>
          </div>
        ) : (
          <div style={{ background:"#fff", border:"1px solid #d6cfc2", borderRadius:12, padding:"32px 36px" }}>
            <form onSubmit={submit}>
              <FormRow>
                <Input label="First Name" id="fname" value={form.first_name} onChange={set("first_name")} required />
                <Input label="Last Name"  id="lname" value={form.last_name}  onChange={set("last_name")}  required />
              </FormRow>
              <Input label="Username" id="uname" value={form.username} onChange={set("username")} required />
              <Input label="Email" id="email" type="email" value={form.email} onChange={set("email")} required />
              <Input label="Phone" id="phone" value={form.phone} onChange={set("phone")} placeholder="+91 XXXXX XXXXX" />
              <FormRow>
                <Input label="Password" id="pwd" type="password" value={form.password} onChange={set("password")} required />
                <Input label="Confirm Password" id="cpwd" type="password" value={form.confirm} onChange={set("confirm")} required />
              </FormRow>

              {err && (
                <div style={{
                  padding:"10px 14px", background:"#fdf3f3",
                  border:"1px solid rgba(155,68,68,0.25)", borderRadius:6,
                  fontSize:"0.84rem", color:"#9b4444", marginBottom:16,
                }}>{err}</div>
              )}

              <Btn type="submit" variant="sage" size="lg" disabled={loading}
                style={{ width:"100%", justifyContent:"center" }}>
                {loading ? "Submitting…" : "Submit Registration"}
              </Btn>
            </form>

            <div style={{ marginTop:18, textAlign:"center" }}>
              <button onClick={onLogin} style={{
                background:"none", border:"none", cursor:"pointer",
                fontSize:"0.84rem", color:"#4a7c6f", fontWeight:500,
              }}>← Back to Sign In</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   PENDING APPROVAL PAGE
════════════════════════════════════════ */
export function PendingPage() {
  const { user, logout } = useAuth();
  return (
    <div style={{
      minHeight:"100vh", background:"#f8f4ed",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:40, textAlign:"center", position:"relative", overflow:"hidden",
    }}>
      {/* deco */}
      <div style={{ position:"absolute", top:"12%", left:"8%", opacity:0.15 }}><Tri size={28} color="#4a7c6f" opacity={1} rotation={15} /></div>
      <div style={{ position:"absolute", bottom:"15%", right:"9%", opacity:0.12 }}><Tri size={20} color="#b8922a" opacity={1} rotation={-18} filled /></div>
      <div style={{ position:"absolute", top:"20%", right:"10%" }}><SketchFlower size={70} style={{ opacity:0.2 }} /></div>

      <div style={{ position:"relative", zIndex:1, maxWidth:440 }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:24, opacity:0.5 }}>
          <SketchNotepad size={70} />
        </div>

        <div style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:"1.6rem", fontWeight:300, color:"#1a2744", marginBottom:12,
        }}>
          Your account is<br /><em style={{ color:"#b8922a" }}>awaiting approval</em>
        </div>

        <p style={{
          fontSize:"0.88rem", color:"#7a7a8a", lineHeight:1.85,
          fontWeight:300, marginBottom:32,
        }}>
          Hello <strong style={{ color:"#1a2744" }}>{user?.first_name}</strong>, your registration has been received.
          Our team is reviewing your account — you'll have full access once approved.
          This typically takes one business day.
        </p>

        <div style={{
          background:"#d9ede8", border:"1px solid rgba(74,124,111,0.25)",
          borderRadius:10, padding:"18px 24px", marginBottom:32,
          fontSize:"0.84rem", color:"#2d6a4f",
        }}>
          In the meantime, feel free to contact your advocate to let them know you've registered.
        </div>

        <Btn variant="ghost" onClick={logout}>Sign Out</Btn>
      </div>
    </div>
  );
}
