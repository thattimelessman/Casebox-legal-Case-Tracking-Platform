import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

const statusColor = { pending: "#f59e0b", approved: "#10b981", rejected: "#ef4444" };
const statusBg    = { pending: "rgba(245,158,11,0.1)", approved: "rgba(16,185,129,0.1)", rejected: "rgba(239,68,68,0.1)" };

function CasesList({ cases, loading, onSelect }) {
  if (loading) return <div style={{ textAlign:"center", padding:"40px 0", color:"#7a7a8a" }}>Loading cases…</div>;
  if (!cases.length) return (
    <div style={{ textAlign:"center", padding:"60px 0", color:"#7a7a8a", background:"#fff", borderRadius:12, border:"1px solid #e8e4de" }}>
      <div style={{ fontSize:"2rem", marginBottom:12 }}>📁</div>
      <p style={{ fontSize:"1.1rem" }}>No cases found.</p>
    </div>
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {cases.map(c => (
        <div key={c.id} onClick={() => onSelect && onSelect(c.id)}
          style={{ background:"#fff", borderRadius:12, padding:"18px 24px", border:"1px solid #e8e4de",
            display:"flex", justifyContent:"space-between", alignItems:"center",
            cursor: onSelect ? "pointer" : "default" }}
          onMouseEnter={e => onSelect && (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
        >
          <div>
            <h3 style={{ fontSize:"1.05rem", fontWeight:600, color:"#1a1a2e", margin:0 }}>{c.title}</h3>
            <p style={{ color:"#7a7a8a", fontSize:"0.85rem", marginTop:4, marginBottom:0 }}>
              Case #{c.id} · {new Date(c.created_at).toLocaleDateString()}
            </p>
          </div>
          <span style={{ padding:"5px 12px", borderRadius:20, fontSize:"0.78rem", fontWeight:600,
            color:statusColor[c.status], background:statusBg[c.status],
            textTransform:"uppercase", letterSpacing:"0.06em" }}>
            {c.status}
          </span>
        </div>
      ))}
    </div>
  );
}

export function AdvocateCasesPage({ setPage, setDetailCase }) {
  const { user } = useContext(AuthContext);
  const [cases, setCases]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ title:"", description:"" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState("");

  const fetchCases = async () => {
    try { const r = await api.get("/api/cases/"); setCases(r.data); }
    catch { setError("Failed to load cases."); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchCases(); }, []);

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setSubmitting(true);
    try { await api.post("/api/cases/", form); setForm({ title:"", description:"" }); setShowForm(false); fetchCases(); }
    catch { setError("Failed to create case."); }
    finally { setSubmitting(false); }
  };

  const handleSelect = (id) => { setDetailCase(id); setPage("case-detail"); };

  return (
    <div style={{ padding:"32px", fontFamily:"'Cormorant Garamond', serif" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
        <div>
          <h1 style={{ fontSize:"1.8rem", fontWeight:700, color:"#1a1a2e", margin:0 }}>My Cases</h1>
          <p style={{ color:"#7a7a8a", marginTop:4, fontSize:"0.95rem" }}>Welcome, {user?.first_name || user?.username}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding:"10px 22px", background:"#4a6cf7", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>
          + File New Case
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:28 }}>
        {[
          { label:"Total Filed", value:cases.length, color:"#4a6cf7" },
          { label:"Pending",     value:cases.filter(c=>c.status==="pending").length, color:"#f59e0b" },
          { label:"Approved",    value:cases.filter(c=>c.status==="approved").length, color:"#10b981" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background:"#fff", borderRadius:12, padding:"20px 24px", border:"1px solid #e8e4de", textAlign:"center" }}>
            <p style={{ fontSize:"2rem", fontWeight:700, color, margin:0 }}>{value}</p>
            <p style={{ color:"#7a7a8a", margin:"4px 0 0", fontSize:"0.88rem" }}>{label}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ background:"#fff", borderRadius:12, padding:24, marginBottom:24, border:"1px solid #e8e4de" }}>
          <h3 style={{ fontSize:"1.1rem", fontWeight:600, color:"#1a1a2e", marginBottom:16 }}>File New Case</h3>
          <input value={form.title} onChange={e => setForm({...form, title:e.target.value})} placeholder="Case title *"
            style={{ width:"100%", padding:"10px 14px", border:"1px solid #ddd", borderRadius:8, fontSize:"1rem", fontFamily:"inherit", boxSizing:"border-box", marginBottom:12, outline:"none" }} />
          <textarea value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="Description…" rows={3}
            style={{ width:"100%", padding:"10px 14px", border:"1px solid #ddd", borderRadius:8, fontSize:"1rem", fontFamily:"inherit", boxSizing:"border-box", resize:"vertical", marginBottom:14, outline:"none" }} />
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={handleCreate} disabled={submitting || !form.title.trim()}
              style={{ padding:"10px 22px", background:submitting?"#ccc":"#4a6cf7", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>
              {submitting ? "Filing…" : "File Case"}
            </button>
            <button onClick={() => setShowForm(false)}
              style={{ padding:"10px 22px", background:"none", border:"1px solid #ddd", borderRadius:8, cursor:"pointer", fontFamily:"inherit", color:"#7a7a8a" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <div style={{ color:"#ef4444", marginBottom:16 }}>{error}</div>}
      <CasesList cases={cases} loading={loading} onSelect={handleSelect} />
    </div>
  );
}

export function AdvocateDocumentsPage() {
  return (
    <div style={{ padding:"32px", fontFamily:"'Cormorant Garamond', serif" }}>
      <h1 style={{ fontSize:"1.8rem", fontWeight:700, color:"#1a1a2e" }}>Documents</h1>
      <p style={{ color:"#7a7a8a" }}>Document management coming soon.</p>
    </div>
  );
}

export function JudgeCasesPage({ setPage, setDetailCase }) {
  const { user } = useContext(AuthContext);
  const [cases, setCases]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("pending");
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError]     = useState("");

  const fetchCases = async () => {
    try { const r = await api.get("/api/cases/"); setCases(r.data); }
    catch { setError("Failed to load cases."); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchCases(); }, []);

  const handleDecision = async (caseId, decision) => {
    setActionLoading(caseId + "_" + decision);
    try { await api.patch(`/api/cases/${caseId}/`, { status: decision }); fetchCases(); }
    catch { setError("Failed to update case."); }
    finally { setActionLoading(null); }
  };

  const handleSelect = (id) => { setDetailCase(id); setPage("case-detail"); };
  const filtered = filter === "all" ? cases : cases.filter(c => c.status === filter);

  return (
    <div style={{ padding:"32px", fontFamily:"'Cormorant Garamond', serif" }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:"1.8rem", fontWeight:700, color:"#1a1a2e", margin:0 }}>Judge's Chamber</h1>
        <p style={{ color:"#7a7a8a", marginTop:4 }}>Welcome, {user?.first_name || "Judge"} · {cases.filter(c=>c.status==="pending").length} pending review</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:28 }}>
        {[
          { label:"Pending", value:cases.filter(c=>c.status==="pending").length, color:"#f59e0b" },
          { label:"Approved", value:cases.filter(c=>c.status==="approved").length, color:"#10b981" },
          { label:"Rejected", value:cases.filter(c=>c.status==="rejected").length, color:"#ef4444" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background:"#fff", borderRadius:12, padding:"20px 24px", border:"1px solid #e8e4de", textAlign:"center" }}>
            <p style={{ fontSize:"2rem", fontWeight:700, color, margin:0 }}>{value}</p>
            <p style={{ color:"#7a7a8a", margin:"4px 0 0", fontSize:"0.88rem" }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {["pending","all","approved","rejected"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:"7px 16px", borderRadius:20, border:"1px solid",
            borderColor: filter===f ? "#4a6cf7" : "#e8e4de",
            background: filter===f ? "#4a6cf7" : "#fff",
            color: filter===f ? "#fff" : "#7a7a8a",
            cursor:"pointer", fontFamily:"inherit", fontSize:"0.85rem", textTransform:"capitalize",
          }}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
      </div>

      {error && <div style={{ color:"#ef4444", marginBottom:16 }}>{error}</div>}

      {loading ? <div style={{ textAlign:"center", padding:"40px 0", color:"#7a7a8a" }}>Loading…</div>
      : filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 0", color:"#7a7a8a", background:"#fff", borderRadius:12, border:"1px solid #e8e4de" }}>
          <div style={{ fontSize:"2rem", marginBottom:12 }}>⚖️</div>
          <p>No {filter !== "all" ? filter : ""} cases.</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {filtered.map(c => (
            <div key={c.id} style={{ background:"#fff", borderRadius:12, padding:"20px 24px",
              border:`1px solid ${c.status==="pending" ? "rgba(245,158,11,0.3)" : "#e8e4de"}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div style={{ cursor:"pointer" }} onClick={() => handleSelect(c.id)}>
                  <h3 style={{ fontSize:"1.1rem", fontWeight:600, color:"#1a1a2e", margin:0 }}>{c.title}</h3>
                  <p style={{ color:"#7a7a8a", fontSize:"0.85rem", margin:"4px 0 0" }}>
                    Case #{c.id} · {new Date(c.created_at).toLocaleDateString()}{c.created_by_name && ` · By ${c.created_by_name}`}
                  </p>
                </div>
                <span style={{ padding:"5px 12px", borderRadius:20, fontSize:"0.78rem", fontWeight:600,
                  color:statusColor[c.status], background:statusBg[c.status],
                  textTransform:"uppercase", letterSpacing:"0.06em", flexShrink:0 }}>
                  {c.status}
                </span>
              </div>
              {c.status === "pending" && (
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={() => handleDecision(c.id,"approved")} disabled={actionLoading===c.id+"_approved"}
                    style={{ padding:"8px 18px", background:"#10b981", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>
                    {actionLoading===c.id+"_approved" ? "…" : "✓ Approve"}
                  </button>
                  <button onClick={() => handleDecision(c.id,"rejected")} disabled={actionLoading===c.id+"_rejected"}
                    style={{ padding:"8px 18px", background:"#ef4444", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>
                    {actionLoading===c.id+"_rejected" ? "…" : "✗ Reject"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ClientCasesPage({ setPage, setDetailCase }) {
  const { user } = useContext(AuthContext);
  const [cases, setCases]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    api.get("/api/cases/")
      .then(r => setCases(r.data))
      .catch(() => setError("Failed to load cases."))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (id) => { setDetailCase(id); setPage("case-detail"); };

  return (
    <div style={{ padding:"32px", fontFamily:"'Cormorant Garamond', serif" }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:"1.8rem", fontWeight:700, color:"#1a1a2e", margin:0 }}>My Portal</h1>
        <p style={{ color:"#7a7a8a", marginTop:4 }}>Welcome, {user?.first_name || user?.username}</p>
      </div>

      {!user?.is_approved && (
        <div style={{ background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:12, padding:"16px 20px", marginBottom:24 }}>
          <p style={{ fontWeight:600, color:"#92400e", margin:0 }}>⏳ Account Pending Approval</p>
          <p style={{ color:"#92400e", margin:"4px 0 0", fontSize:"0.9rem" }}>Your account is awaiting admin approval.</p>
        </div>
      )}

      {error && <div style={{ color:"#ef4444", marginBottom:16 }}>{error}</div>}
      <CasesList cases={cases} loading={loading} onSelect={handleSelect} />
    </div>
  );
}

export function ClientDocumentsPage() {
  return (
    <div style={{ padding:"32px", fontFamily:"'Cormorant Garamond', serif" }}>
      <h1 style={{ fontSize:"1.8rem", fontWeight:700, color:"#1a1a2e" }}>My Documents</h1>
      <p style={{ color:"#7a7a8a" }}>Document management coming soon.</p>
    </div>
  );
}