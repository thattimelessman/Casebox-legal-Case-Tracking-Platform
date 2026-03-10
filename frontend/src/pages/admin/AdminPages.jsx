import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

// ─── User Management ────────────────────────────────────────────────
export function UsersPage() {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/accounts/users/");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (userId) => {
    setActionLoading(userId + "_approve");
    try {
      await api.patch(`/api/accounts/users/${userId}/approve/`);
      fetchUsers();
    } catch {
      setError("Failed to approve user.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setActionLoading(userId + "_role");
    try {
      await api.patch(`/api/accounts/users/${userId}/`, { role: newRole });
      fetchUsers();
    } catch {
      setError("Failed to update role.");
    } finally {
      setActionLoading(null);
    }
  };

  const roleColors = {
    admin: { color: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
    advocate: { color: "#2563eb", bg: "rgba(37,99,235,0.1)" },
    judge: { color: "#0891b2", bg: "rgba(8,145,178,0.1)" },
    client: { color: "#7a7a8a", bg: "rgba(122,122,138,0.1)" },
  };

  const filteredUsers =
    filter === "all"
      ? users
      : filter === "pending"
      ? users.filter((u) => !u.is_approved)
      : users.filter((u) => u.role === filter);

  return (
    <div style={{ padding: "32px", fontFamily: "'Cormorant Garamond', serif" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
          User Management
        </h1>
        <p style={{ color: "#7a7a8a", marginTop: 4, fontSize: "0.95rem" }}>
          {users.length} registered user{users.length !== 1 ? "s" : ""} ·{" "}
          {users.filter((u) => !u.is_approved).length} pending approval
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { key: "all", label: `All (${users.length})` },
          { key: "pending", label: `Pending (${users.filter((u) => !u.is_approved).length})` },
          { key: "admin", label: "Admins" },
          { key: "advocate", label: "Advocates" },
          { key: "judge", label: "Judges" },
          { key: "client", label: "Clients" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: "7px 16px", borderRadius: 20, border: "1px solid",
              borderColor: filter === key ? "#4a6cf7" : "#e8e4de",
              background: filter === key ? "#4a6cf7" : "#fff",
              color: filter === key ? "#fff" : "#7a7a8a",
              cursor: "pointer", fontFamily: "inherit", fontSize: "0.85rem",
              fontWeight: filter === key ? 600 : 400,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#7a7a8a" }}>
          Loading users...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 0", color: "#7a7a8a",
          background: "#fff", borderRadius: 12, border: "1px solid #e8e4de",
        }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>👥</div>
          <p style={{ fontSize: "1.1rem" }}>No users found.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              style={{
                background: "#fff", borderRadius: 12, padding: "18px 24px",
                border: `1px solid ${!u.is_approved ? "rgba(245,158,11,0.3)" : "#e8e4de"}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: roleColors[u.role]?.bg || "rgba(122,122,138,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: roleColors[u.role]?.color || "#7a7a8a",
                  fontWeight: 700, fontSize: "1rem",
                  flexShrink: 0,
                }}>
                  {(u.first_name?.[0] || u.username?.[0] || "?").toUpperCase()}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <p style={{ fontWeight: 600, color: "#1a1a2e", margin: 0, fontSize: "1rem" }}>
                      {u.first_name || u.last_name
                        ? `${u.first_name} ${u.last_name}`.trim()
                        : u.username}
                    </p>
                    {u.id === currentUser?.id && (
                      <span style={{ fontSize: "0.7rem", color: "#7a7a8a", background: "#f0f0f0", padding: "2px 8px", borderRadius: 10 }}>
                        You
                      </span>
                    )}
                  </div>
                  <p style={{ color: "#7a7a8a", margin: 0, fontSize: "0.85rem" }}>
                    @{u.username} · {u.email}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Role badge */}
                <span style={{
                  padding: "4px 12px", borderRadius: 20, fontSize: "0.78rem", fontWeight: 600,
                  color: roleColors[u.role]?.color, background: roleColors[u.role]?.bg,
                  textTransform: "capitalize",
                }}>
                  {u.role}
                </span>

                {/* Approval status */}
                {!u.is_approved ? (
                  <button
                    onClick={() => handleApprove(u.id)}
                    disabled={actionLoading === u.id + "_approve"}
                    style={{
                      padding: "6px 14px", background: "#10b981", color: "#fff",
                      border: "none", borderRadius: 8, cursor: "pointer",
                      fontFamily: "inherit", fontWeight: 600, fontSize: "0.85rem",
                    }}
                  >
                    {actionLoading === u.id + "_approve" ? "Approving..." : "Approve"}
                  </button>
                ) : (
                  <span style={{ color: "#10b981", fontSize: "0.82rem", fontWeight: 600 }}>✓ Approved</span>
                )}

                {/* Role change (only for non-self users) */}
                {u.id !== currentUser?.id && (
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    disabled={actionLoading === u.id + "_role"}
                    style={{
                      padding: "6px 10px", border: "1px solid #ddd", borderRadius: 8,
                      fontFamily: "inherit", fontSize: "0.85rem", cursor: "pointer",
                      color: "#4a4a5a", background: "#fff",
                    }}
                  >
                    <option value="client">Client</option>
                    <option value="advocate">Advocate</option>
                    <option value="judge">Judge</option>
                    <option value="admin">Admin</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Pending Approvals ────────────────────────────────────────────────
export function PendingApprovalsPage() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/accounts/users/");
      setPending(res.data.filter((u) => !u.is_approved));
    } catch {
      setError("Failed to load pending approvals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (userId) => {
    setActionLoading(userId);
    try {
      await api.patch(`/api/accounts/users/${userId}/approve/`);
      fetchPending();
    } catch {
      setError("Failed to approve user.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={{ padding: "32px", fontFamily: "'Cormorant Garamond', serif" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
          Pending Approvals
        </h1>
        <p style={{ color: "#7a7a8a", marginTop: 4, fontSize: "0.95rem" }}>
          {pending.length} user{pending.length !== 1 ? "s" : ""} awaiting approval
        </p>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#7a7a8a" }}>Loading...</div>
      ) : pending.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 0", color: "#7a7a8a",
          background: "#fff", borderRadius: 12, border: "1px solid #e8e4de",
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>✅</div>
          <p style={{ fontSize: "1.2rem", fontWeight: 600, color: "#1a1a2e" }}>All caught up!</p>
          <p style={{ fontSize: "0.95rem" }}>No users pending approval.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {pending.map((u) => (
            <div
              key={u.id}
              style={{
                background: "#fff", borderRadius: 12, padding: "20px 24px",
                border: "1px solid rgba(245,158,11,0.3)",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontWeight: 600, color: "#1a1a2e", margin: 0, fontSize: "1rem" }}>
                  {u.first_name || u.last_name ? `${u.first_name} ${u.last_name}`.trim() : u.username}
                </p>
                <p style={{ color: "#7a7a8a", margin: "4px 0 0", fontSize: "0.88rem" }}>
                  @{u.username} · {u.email} · Role: {u.role}
                </p>
              </div>
              <button
                onClick={() => handleApprove(u.id)}
                disabled={actionLoading === u.id}
                style={{
                  padding: "9px 20px", background: "#10b981", color: "#fff",
                  border: "none", borderRadius: 8, cursor: actionLoading === u.id ? "not-allowed" : "pointer",
                  fontFamily: "inherit", fontWeight: 600, fontSize: "0.9rem",
                }}
              >
                {actionLoading === u.id ? "Approving..." : "Approve Access"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Audit Log ────────────────────────────────────────────────────────
export function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/api/logs/");
        setLogs(res.data);
      } catch {
        setError("Failed to load audit logs.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const actionColor = (action) => {
    if (action?.toLowerCase().includes("login")) return { color: "#2563eb", bg: "rgba(37,99,235,0.08)" };
    if (action?.toLowerCase().includes("create")) return { color: "#10b981", bg: "rgba(16,185,129,0.08)" };
    if (action?.toLowerCase().includes("delete")) return { color: "#ef4444", bg: "rgba(239,68,68,0.08)" };
    if (action?.toLowerCase().includes("approve")) return { color: "#7c3aed", bg: "rgba(124,58,237,0.08)" };
    return { color: "#7a7a8a", bg: "rgba(122,122,138,0.08)" };
  };

  return (
    <div style={{ padding: "32px", fontFamily: "'Cormorant Garamond', serif" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#1a1a2e", margin: 0 }}>
          Audit Log
        </h1>
        <p style={{ color: "#7a7a8a", marginTop: 4, fontSize: "0.95rem" }}>
          {logs.length} recorded action{logs.length !== 1 ? "s" : ""}
        </p>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#7a7a8a" }}>Loading logs...</div>
      ) : logs.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 0", color: "#7a7a8a",
          background: "#fff", borderRadius: 12, border: "1px solid #e8e4de",
        }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>📋</div>
          <p style={{ fontSize: "1.1rem" }}>No activity logged yet.</p>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8e4de", overflow: "hidden" }}>
          {logs.map((log, idx) => {
            const ac = actionColor(log.action);
            return (
              <div
                key={log.id || idx}
                style={{
                  padding: "14px 24px",
                  borderBottom: idx < logs.length - 1 ? "1px solid #f0ece6" : "none",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{
                    padding: "4px 10px", borderRadius: 6, fontSize: "0.78rem", fontWeight: 600,
                    color: ac.color, background: ac.bg, textTransform: "uppercase", letterSpacing: "0.04em",
                    flexShrink: 0,
                  }}>
                    {log.action || "Action"}
                  </span>
                  <p style={{ color: "#4a4a5a", margin: 0, fontSize: "0.92rem" }}>
                    <span style={{ fontWeight: 600, color: "#1a1a2e" }}>
                      {log.user_name || log.user || "System"}
                    </span>
                    {log.detail && ` — ${log.detail}`}
                  </p>
                </div>
                <p style={{ color: "#7a7a8a", margin: 0, fontSize: "0.82rem", flexShrink: 0 }}>
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}