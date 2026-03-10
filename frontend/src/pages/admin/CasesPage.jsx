import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

export default function CasesPage() {
  const { user } = useContext(AuthContext);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/cases/");
      setCases(res.data);
    } catch (err) {
      setError("Failed to load cases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const filteredCases =
    filter === "all" ? cases : cases.filter((c) => c.status === filter);

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      await api.post("/api/cases/", form);
      setForm({ title: "", description: "" });
      setShowForm(false);
      fetchCases();
    } catch (err) {
      setError("Failed to create case.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (caseId, newStatus) => {
    try {
      await api.patch(`/api/cases/${caseId}/`, { status: newStatus });
      fetchCases();
    } catch (err) {
      setError("Failed to update case status.");
    }
  };

  const statusColor = {
    pending: "#f59e0b",
    approved: "#10b981",
    rejected: "#ef4444",
  };

  const statusBg = {
    pending: "rgba(245,158,11,0.1)",
    approved: "rgba(16,185,129,0.1)",
    rejected: "rgba(239,68,68,0.1)",
  };

  if (selectedCase) {
    return (
      <div style={{ padding: "32px", fontFamily: "'Cormorant Garamond', serif" }}>
        <button
          onClick={() => setSelectedCase(null)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#7a7a8a", fontSize: "0.85rem", letterSpacing: "0.08em",
            textTransform: "uppercase", marginBottom: 24, padding: 0,
          }}
        >
          ← Back to Cases
        </button>
        <div style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #e8e4de" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 600, color: "#1a1a2e", margin: 0 }}>
                {selectedCase.title}
              </h2>
              <p style={{ color: "#7a7a8a", marginTop: 4, fontSize: "0.9rem" }}>
                Case #{selectedCase.id} · Created {new Date(selectedCase.created_at).toLocaleDateString()}
              </p>
            </div>
            <span style={{
              padding: "6px 14px", borderRadius: 20, fontSize: "0.8rem", fontWeight: 600,
              color: statusColor[selectedCase.status], background: statusBg[selectedCase.status],
              textTransform: "uppercase", letterSpacing: "0.06em",
            }}>
              {selectedCase.status}
            </span>
          </div>
          <div style={{ marginBottom: 24 }}>
            <p style={{ color: "#4a4a5a", lineHeight: 1.7, fontSize: "1rem" }}>
              {selectedCase.description || "No description provided."}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, borderTop: "1px solid #e8e4de", paddingTop: 20 }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#7a7a8a", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Created By</p>
              <p style={{ color: "#1a1a2e", fontWeight: 500 }}>{selectedCase.created_by_name || selectedCase.created_by || "—"}</p>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#7a7a8a", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Assigned Judge</p>
              <p style={{ color: "#1a1a2e", fontWeight: 500 }}>{selectedCase.assigned_judge_name || selectedCase.assigned_judge || "Unassigned"}</p>
            </div>
          </div>
          {user?.role === "admin" && selectedCase.status === "pending" && (
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button
                onClick={() => { handleStatusChange(selectedCase.id, "approved"); setSelectedCase(null); }}
                style={{
                  padding: "10px 24px", background: "#10b981", color: "#fff",
                  border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600,
                  fontFamily: "inherit",
                }}
              >
                Approve Case
              </button>
              <button
                onClick={() => { handleStatusChange(selectedCase.id, "rejected"); setSelectedCase(null); }}
                style={{
                  padding: "10px 24px", background: "#ef4444", color: "#fff",
                  border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600,
                  fontFamily: "inherit",
                }}
              >
                Reject Case
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", fontFamily: "'Cormorant Garamond', serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Cases</h1>
          <p style={{ color: "#7a7a8a", marginTop: 4, fontSize: "0.95rem" }}>
            {cases.length} total case{cases.length !== 1 ? "s" : ""}
          </p>
        </div>
        {(user?.role === "admin" || user?.role === "advocate") && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: "10px 22px", background: "#4a6cf7", color: "#fff",
              border: "none", borderRadius: 8, cursor: "pointer",
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "0.95rem",
            }}
          >
            + New Case
          </button>
        )}
      </div>

      {/* New Case Form */}
      {showForm && (
        <div style={{
          background: "#fff", borderRadius: 12, padding: 24, marginBottom: 24,
          border: "1px solid #e8e4de", boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1a1a2e", marginBottom: 16 }}>
            Create New Case
          </h3>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", color: "#7a7a8a", fontSize: "0.85rem", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Case Title *
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter case title"
              style={{
                width: "100%", padding: "10px 14px", border: "1px solid #ddd",
                borderRadius: 8, fontSize: "1rem", fontFamily: "inherit",
                boxSizing: "border-box", outline: "none",
              }}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", color: "#7a7a8a", fontSize: "0.85rem", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief case description..."
              rows={3}
              style={{
                width: "100%", padding: "10px 14px", border: "1px solid #ddd",
                borderRadius: 8, fontSize: "1rem", fontFamily: "inherit",
                boxSizing: "border-box", resize: "vertical", outline: "none",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleCreate}
              disabled={submitting || !form.title.trim()}
              style={{
                padding: "10px 22px", background: submitting ? "#ccc" : "#4a6cf7",
                color: "#fff", border: "none", borderRadius: 8, cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "inherit", fontWeight: 600,
              }}
            >
              {submitting ? "Creating..." : "Create Case"}
            </button>
            <button
              onClick={() => { setShowForm(false); setForm({ title: "", description: "" }); }}
              style={{
                padding: "10px 22px", background: "none", border: "1px solid #ddd",
                borderRadius: 8, cursor: "pointer", fontFamily: "inherit", color: "#7a7a8a",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "7px 16px", borderRadius: 20, border: "1px solid",
              borderColor: filter === f ? "#4a6cf7" : "#e8e4de",
              background: filter === f ? "#4a6cf7" : "#fff",
              color: filter === f ? "#fff" : "#7a7a8a",
              cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem",
              textTransform: "capitalize", fontWeight: filter === f ? 600 : 400,
            }}
          >
            {f === "all" ? `All (${cases.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${cases.filter((c) => c.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      {/* Cases List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#7a7a8a" }}>
          Loading cases...
        </div>
      ) : filteredCases.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 0", color: "#7a7a8a",
          background: "#fff", borderRadius: 12, border: "1px solid #e8e4de",
        }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>📁</div>
          <p style={{ fontSize: "1.1rem" }}>No {filter !== "all" ? filter : ""} cases found.</p>
          {(user?.role === "admin" || user?.role === "advocate") && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                marginTop: 16, padding: "10px 22px", background: "#4a6cf7",
                color: "#fff", border: "none", borderRadius: 8, cursor: "pointer",
                fontFamily: "inherit", fontWeight: 600,
              }}
            >
              Create First Case
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filteredCases.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCase(c)}
              style={{
                background: "#fff", borderRadius: 12, padding: "20px 24px",
                border: "1px solid #e8e4de", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1a1a2e", margin: 0 }}>
                  {c.title}
                </h3>
                <p style={{ color: "#7a7a8a", fontSize: "0.88rem", marginTop: 4, marginBottom: 0 }}>
                  Case #{c.id} · {new Date(c.created_at).toLocaleDateString()}
                  {c.created_by_name ? ` · By ${c.created_by_name}` : ""}
                </p>
                {c.description && (
                  <p style={{ color: "#4a4a5a", fontSize: "0.9rem", marginTop: 6, marginBottom: 0, maxWidth: 500 }}>
                    {c.description.length > 100 ? c.description.slice(0, 100) + "…" : c.description}
                  </p>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 600,
                  color: statusColor[c.status], background: statusBg[c.status],
                  textTransform: "uppercase", letterSpacing: "0.06em",
                }}>
                  {c.status}
                </span>
                <span style={{ color: "#ccc", fontSize: "1.2rem" }}>›</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}