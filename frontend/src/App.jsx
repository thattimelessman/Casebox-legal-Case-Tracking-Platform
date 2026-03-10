import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./components/ui";
import Layout from "./components/Layout";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import { RegisterPage, PendingPage } from "./pages/AuthPages";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminCasesPage from "./pages/admin/CasesPage";
import { UsersPage, PendingApprovalsPage, AuditLogPage } from "./pages/admin/AdminPages";

import CaseDetail from "./pages/shared/CaseDetail";
import {
  AdvocateCasesPage, AdvocateDocumentsPage,
  JudgeCasesPage,
  ClientCasesPage, ClientDocumentsPage,
} from "./pages/RolePages";

/* ════════════════════════════════════════
   INNER APP — uses auth context
════════════════════════════════════════ */
function InnerApp() {
  const { user, loading } = useAuth();
  const [authView, setAuthView]     = useState("landing"); // landing | login | register
  const [page, setPage]             = useState(null);
  const [detailCase, setDetailCase] = useState(null);

  if (loading) return (
    <div style={{
      minHeight:"100vh", background:"#f8f4ed",
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.4rem", color:"#7a7a8a", fontStyle:"italic" }}>
        Loading…
      </div>
    </div>
  );

  /* ── NOT LOGGED IN ── */
  if (!user) {
    if (authView === "register") return <RegisterPage onLogin={() => setAuthView("login")} />;
    if (authView === "login")    return <LoginPage onRegister={() => setAuthView("register")} onHome={() => setAuthView("landing")} />;
    return <LandingPage onLogin={() => setAuthView("login")} />;
  }

  /* ── PENDING CLIENT ── */
  if (user.role === "client" && !user.is_approved) return <PendingPage />;

  /* ── DEFAULT PAGE per role ── */
  const defaultPage = {
    admin:    "dashboard",
    advocate: "cases",
    judge:    "cases",
    client:   "cases",
  }[user.role] || "cases";

  const activePage = page || defaultPage;

  /* ── PAGE RENDERER ── */
  const renderPage = () => {
    if (activePage === "case-detail" && detailCase) {
      return (
        <CaseDetail
          caseId={detailCase}
          onBack={() => setPage("cases")}
        />
      );
    }

    if (user.role === "admin") {
      switch (activePage) {
        case "dashboard": return <AdminDashboard setPage={setPage} />;
        case "cases":     return <AdminCasesPage setPage={setPage} setDetailCase={setDetailCase} />;
        case "users":     return <UsersPage />;
        case "pending":   return <PendingApprovalsPage />;
        case "audit":     return <AuditLogPage />;
        default:          return <AdminDashboard setPage={setPage} />;
      }
    }

    if (user.role === "advocate") {
      switch (activePage) {
        case "cases":     return <AdvocateCasesPage setPage={setPage} setDetailCase={setDetailCase} />;
        case "documents": return <AdvocateDocumentsPage setPage={setPage} setDetailCase={setDetailCase} />;
        default:          return <AdvocateCasesPage setPage={setPage} setDetailCase={setDetailCase} />;
      }
    }

    if (user.role === "judge") {
      return <JudgeCasesPage setPage={setPage} setDetailCase={setDetailCase} />;
    }

    if (user.role === "client") {
      switch (activePage) {
        case "cases":     return <ClientCasesPage setPage={setPage} setDetailCase={setDetailCase} />;
        case "documents": return <ClientDocumentsPage setPage={setPage} setDetailCase={setDetailCase} />;
        default:          return <ClientCasesPage setPage={setPage} setDetailCase={setDetailCase} />;
      }
    }

    return null;
  };

  return (
    <Layout page={activePage} setPage={p => { setPage(p); if (p !== "case-detail") setDetailCase(null); }}>
      {renderPage()}
    </Layout>
  );
}

/* ════════════════════════════════════════
   ROOT — providers wrap everything
════════════════════════════════════════ */
export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <InnerApp />
      </ToastProvider>
    </AuthProvider>
  );
}