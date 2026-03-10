import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [cases, setCases] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [casesRes, usersRes] = await Promise.all([
          api.get("/api/cases/"),
          api.get("/api/accounts/users/"),
        ]);
        setCases(casesRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    totalCases: cases.length,
    pending: cases.filter((c) => c.status === "pending").length,
    approved: cases.filter((c) => c.status === "approved").length,
    rejected: cases.filter((c) => c.status === "rejected").length,
    totalUsers: users.length,
    pendingUsers: users.filter((u) => !u.is_approved).length,
  };

  const recentCases = [...cases]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const statusColor = { pending: "#f59e0b", approved: "#10b981", rejected: "#ef4444" };
  const statusBg = { pending: "rgba(245,158,11,0.1)", approved: "rgba(16,185,129,0.1)", rejected: "rgba(239,68,68,0.1)" };

  if (loading) {
    return (
      <div style={{ padding: "32px", fontFamily: "'Cormorant Garamond', serif", textAlign: "center", color: "#7a7a8a", paddingTop: 80 }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{ padding: "32px", fontFamily: "'Cormorant Garamond', serif" }}>
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.9rem", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ color: "#7a7a8a", marginTop: 4, fontSize: "0.95rem" }}>
          Welcome back, {user?.first_name || user?.username} · {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Cases", value: stats.totalCases, color: "#4a6cf7", icon: "📁" },
          { label: "Pending Review", value: stats.pending, color: "#f59e0b", icon: "⏳" },
          { label: "Approved", value: stats.approved, color: "#10b981", icon: "✅" },
          { label: "Rejected", value: stats.rejected, color: "#ef4444", icon: "❌" },
          { label: "Total Users", value: stats.totalUsers, color: "#7c3aed", icon: "👥" },
          { label: "Awaiting Approval", value: stats.pendingUsers, color: "#f59e0b", icon: "🕐" },
        ].map(({ label, value, color, icon }) => (
          <div key={label} style={{
            background: "#fff", borderRadius: 12, padding: "20px 24px",
            border: "1px solid #e8e4de",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{ fontSize: "1.8rem" }}>{icon}</div>
            <div>
              <p style={{ fontSize: "1.8rem", fontWeight: 700, color, margin: 0, lineHeight: 1 }}>{value}</p>
              <p style={{ color: "#7a7a8a", margin: "4px 0 0", fontSize: "0.82rem" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Users Alert */}
      {stats.pendingUsers > 0 && (
        <div style={{
          background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)",
          borderRadius: 12, padding: "16px 20px", marginBottom: 24,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "1.2rem" }}>⏳</span>
            <p style={{ margin: 0, color: "#92400e", fontWeight: 500 }}>
              {stats.pendingUsers} user{stats.pendingUsers !== 1 ? "s" : ""} waiting for approval
            </p>
          </div>
          <span style={{ color: "#92400e", fontSize: "0.85rem" }}>→ Go to User Management</span>
        </div>
      )}

      {/* Recent Cases */}
      <div>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#1a1a2e", marginBottom: 14 }}>
          Recent Cases
        </h2>
        {recentCases.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "40px 0", color: "#7a7a8a",
            background: "#fff", borderRadius: 12, border: "1px solid #e8e4de",
          }}>
            <p>No cases yet. Create the first case from the Cases page.</p>
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8e4de", overflow: "hidden" }}>
            {recentCases.map((c, idx) => (
              <div key={c.id} style={{
                padding: "14px 24px",
                borderBottom: idx < recentCases.length - 1 ? "1px solid #f0ece6" : "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <p style={{ fontWeight: 600, color: "#1a1a2e", margin: 0, fontSize: "0.95rem" }}>{c.title}</p>
                  <p style={{ color: "#7a7a8a", margin: "3px 0 0", fontSize: "0.82rem" }}>
                    Case #{c.id} · {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span style={{
                  padding: "4px 12px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600,
                  color: statusColor[c.status], background: statusBg[c.status],
                  textTransform: "uppercase", letterSpacing: "0.06em",
                }}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}