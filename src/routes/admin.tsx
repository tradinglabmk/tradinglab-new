import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PaymentsView } from "@/components/admin/PaymentsView";

type AdminTab = "applications" | "payments";

interface Application {
  _id: string;
  fullName: string;
  email: string;
  ageGroup: string;
  country: string;
  city: string;
  contactMethod: string;
  additionalContact?: string;
  service: string;
  mentorshipData?: Record<string, unknown>;
  groupCoachingData?: Record<string, unknown>;
  tradingSignalsData?: Record<string, unknown>;
  createdAt: string;
}

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<AdminTab>("applications");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem("adminAuth") === "1");
  }, []);

  const handleAuth = async () => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem("adminAuth", "1");
        setIsAuthenticated(true);
        setAuthError("");
      } else {
        setAuthError("Погрешна лозинка");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => setApplications(data.applications || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const filtered = useMemo(() => {
    setCurrentPage(1);
    return applications.filter((app) => {
      const matchesSearch =
        !search ||
        app.fullName.toLowerCase().includes(search.toLowerCase()) ||
        app.email.toLowerCase().includes(search.toLowerCase()) ||
        app.country.toLowerCase().includes(search.toLowerCase()) ||
        app.city.toLowerCase().includes(search.toLowerCase());
      const matchesService = serviceFilter === "all" || app.service === serviceFilter;
      return matchesSearch && matchesService;
    });
  }, [applications, search, serviceFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stats = useMemo(() => {
    const total = applications.length;
    const mentorship = applications.filter(
      (a) => a.service === "1-на-1 индивидуално Mentorship",
    ).length;
    const group = applications.filter((a) => a.service === "Group Coaching во мала група").length;
    const signals = applications.filter((a) => a.service === "Trading Signals").length;
    return { total, mentorship, group, signals };
  }, [applications]);

  if (isAuthenticated === null) {
    return (
      <div className="bg-[#f7f9fc] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <div className="h-8 w-40 rounded-xl bg-slate-200 animate-pulse mb-2" />
            <div className="h-4 w-56 rounded-lg bg-slate-100 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-[#dfe6ef] bg-white p-5">
                <div className="h-3 w-16 rounded bg-slate-200 animate-pulse mb-3" />
                <div className="h-8 w-10 rounded bg-slate-200 animate-pulse" />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-[#dfe6ef] bg-white px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-36 rounded bg-slate-200 animate-pulse" />
                    <div className="h-3 w-48 rounded bg-slate-100 animate-pulse" />
                  </div>
                  <div className="h-6 w-20 rounded-full bg-slate-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-[#f7f9fc] min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#0b1220] mb-2">Admin Dashboard</h1>
            <p className="text-[#637083] text-sm">Внесете ја лозинката за пристап</p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                placeholder="Лозинка"
                className="w-full rounded-xl border border-[#dfe6ef] bg-white px-4 py-3.5 pr-12 text-[#0b1220] placeholder-[#8a95a6] focus:border-[#1457ff] focus:outline-none transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a95a6] hover:text-[#354158] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
            <button
              onClick={handleAuth}
              disabled={authLoading}
              className="w-full cursor-pointer rounded-xl bg-[#1457ff] px-4 py-3.5 text-white font-medium transition-all duration-300 hover:bg-[#0b42d6] hover:shadow-[0_0_20px_rgba(20,87,255,0.35)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Се проверува...
                </>
              ) : (
                "Најава"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f9fc] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#0b1220]">Админ панел</h1>
          <p className="text-[#637083] mt-1">Преглед на апликации и уплати</p>
        </div>

        {/* Tabs */}
        <div className="mb-8 inline-flex rounded-xl border border-[#dfe6ef] bg-white p-1">
          <button
            onClick={() => setTab("applications")}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              tab === "applications"
                ? "bg-[#1457ff] text-white shadow-[0_0_16px_-4px_rgba(20,87,255,0.6)]"
                : "text-[#637083] hover:text-[#0b1220]"
            }`}
          >
            Апликации
          </button>
          <button
            onClick={() => setTab("payments")}
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              tab === "payments"
                ? "bg-[#1457ff] text-white shadow-[0_0_16px_-4px_rgba(20,87,255,0.6)]"
                : "text-[#637083] hover:text-[#0b1220]"
            }`}
          >
            Уплати
          </button>
        </div>

        {tab === "payments" && <PaymentsView />}

        {tab === "applications" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Вкупно" value={stats.total} color="#1457ff" />
              <StatCard label="Mentorship" value={stats.mentorship} color="#0ea5e9" />
              <StatCard label="Group Coaching" value={stats.group} color="#0891b2" />
              <StatCard label="Trading Signals" value={stats.signals} color="#4f46e5" />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <svg
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a95a6]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Пребарај по име, email, локација..."
                  className="w-full rounded-xl border border-[#dfe6ef] bg-white pl-10 pr-4 py-3 text-sm text-[#0b1220] placeholder-[#8a95a6] focus:border-[#1457ff] focus:outline-none transition-all duration-300"
                />
              </div>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="rounded-xl border border-[#dfe6ef] bg-white px-4 py-3 text-sm text-[#0b1220] focus:border-[#1457ff] focus:outline-none transition-all duration-300"
              >
                <option value="all">Сите услуги</option>
                <option value="1-на-1 индивидуално Mentorship">Mentorship</option>
                <option value="Group Coaching во мала група">Group Coaching</option>
                <option value="Trading Signals">Trading Signals</option>
              </select>
            </div>

            {/* Results count */}
            <p className="text-sm text-[#637083] mb-4">
              {filtered.length} {filtered.length === 1 ? "резултат" : "резултати"}
            </p>

            {/* Applications list */}
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-[#dfe6ef] bg-white px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-36 rounded bg-slate-200 animate-pulse" />
                        <div className="h-3 w-48 rounded bg-slate-100 animate-pulse" />
                      </div>
                      <div className="h-6 w-20 rounded-full bg-slate-200 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-[#dfe6ef] bg-white p-12 text-center">
                <p className="text-[#637083]">Нема пронајдени апликации</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {paginated.map((app) => (
                    <ApplicationCard
                      key={app._id}
                      app={app}
                      isExpanded={expandedId === app._id}
                      onToggle={() => setExpandedId(expandedId === app._id ? null : app._id)}
                      onDelete={() => setDeleteTarget(app)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => goToPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#dfe6ef] bg-white px-4 py-2 text-sm text-[#637083] hover:text-[#0b1220] hover:border-[#c3cedd] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      Назад
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
                        )
                        .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                          if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1)
                            acc.push("...");
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((p, idx) =>
                          p === "..." ? (
                            <span key={`dots-${idx}`} className="px-2 text-[#8a95a6] text-sm">
                              …
                            </span>
                          ) : (
                            <button
                              key={p}
                              onClick={() => goToPage(p as number)}
                              className={`cursor-pointer h-9 w-9 rounded-xl text-sm font-medium transition-all duration-200 ${
                                currentPage === p
                                  ? "bg-[#1457ff] text-white shadow-[0_0_16px_-4px_rgba(20,87,255,0.6)]"
                                  : "border border-[#dfe6ef] bg-white text-[#637083] hover:text-[#0b1220] hover:border-[#c3cedd]"
                              }`}
                            >
                              {p}
                            </button>
                          ),
                        )}
                    </div>

                    <button
                      onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#dfe6ef] bg-white px-4 py-2 text-sm text-[#637083] hover:text-[#0b1220] hover:border-[#c3cedd] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Следно
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.fullName}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            setDeleting(true);
            try {
              const res = await fetch("/api/applications", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: deleteTarget._id }),
              });
              if (res.ok) {
                setApplications((prev) => prev.filter((a) => a._id !== deleteTarget._id));
                setExpandedId(null);
                setDeleteTarget(null);
              }
            } catch (err) {
              console.error("Delete failed:", err);
            } finally {
              setDeleting(false);
            }
          }}
        />
      )}
    </div>
  );
}

function DeleteModal({
  name,
  deleting,
  onCancel,
  onConfirm,
}: {
  name: string;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-2xl border border-[#dfe6ef] bg-white p-6 shadow-2xl">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 border border-red-200">
          <svg
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <h3 className="text-center text-lg font-semibold text-[#0b1220] mb-1">
          Избриши апликација
        </h3>
        <p className="text-center text-sm text-[#637083] mb-6">
          Дали сте сигурни дека сакате да ја избришете апликацијата на{" "}
          <span className="font-medium text-[#0b1220]">{name}</span>?
          <br />
          <span className="text-red-500">Оваа акција е неповратна.</span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 rounded-xl border border-[#dfe6ef] bg-white px-4 py-2.5 text-sm text-[#354158] hover:bg-slate-50 transition-all duration-200 disabled:opacity-50"
          >
            Откажи
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
                Бришење...
              </>
            ) : (
              "Избриши"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-[#dfe6ef] bg-white p-5 shadow-[0_10px_30px_rgba(10,22,48,0.06)]">
      <p className="text-xs text-[#8a95a6] uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function ApplicationCard({
  app,
  isExpanded,
  onToggle,
  onDelete,
}: {
  app: Application;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const serviceColor =
    app.service === "1-на-1 индивидуално Mentorship"
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : app.service === "Group Coaching во мала група"
        ? "bg-cyan-50 text-cyan-700 border-cyan-200"
        : "bg-indigo-50 text-indigo-700 border-indigo-200";

  const date = new Date(app.createdAt).toLocaleDateString("mk-MK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-2xl border border-[#dfe6ef] bg-white overflow-hidden transition-all duration-300 hover:border-[#c3cedd] shadow-[0_10px_30px_rgba(10,22,48,0.06)]">
      {/* Header row */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1457ff]/15 to-[#0b42d6]/15 text-[#0b42d6] font-semibold text-sm">
            {app.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <p className="text-[#0b1220] font-medium text-[15px]">{app.fullName}</p>
            <p className="text-[#637083] text-sm">{app.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${serviceColor}`}
          >
            {app.service === "1-на-1 индивидуално Mentorship"
              ? "Mentorship"
              : app.service === "Group Coaching во мала група"
                ? "Group"
                : "Signals"}
          </span>
          <span className="text-xs text-[#8a95a6]">{date}</span>
          <svg
            className={`h-4 w-4 text-[#8a95a6] transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="border-t border-[#dfe6ef] px-5 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <DetailItem label="Возрасна група" value={app.ageGroup} />
            <DetailItem label="Држава" value={app.country} />
            <DetailItem label="Град" value={app.city} />
            <DetailItem label="Контакт метод" value={app.contactMethod} />
            <DetailItem label="Дополнителен контакт" value={app.additionalContact || "—"} />
            <DetailItem label="Услуга" value={app.service} />
            <DetailItem label="Датум" value={date} />
          </div>

          {/* Mentorship data */}
          {app.mentorshipData && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-[#0ea5e9] uppercase tracking-wider mb-4">
                Mentorship одговори
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(app.mentorshipData).map(([key, val]) => (
                  <DetailItem key={key} label={formatKey(key)} value={formatValue(val)} />
                ))}
              </div>
            </div>
          )}

          {/* Group Coaching data */}
          {app.groupCoachingData && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-[#0891b2] uppercase tracking-wider mb-4">
                Group Coaching одговори
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(app.groupCoachingData).map(([key, val]) => (
                  <DetailItem key={key} label={formatKey(key)} value={formatValue(val)} />
                ))}
              </div>
            </div>
          )}

          {/* Trading Signals data */}
          {app.tradingSignalsData && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-[#4f46e5] uppercase tracking-wider mb-4">
                Trading Signals одговори
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(app.tradingSignalsData).map(([key, val]) => (
                  <DetailItem key={key} label={formatKey(key)} value={formatValue(val)} />
                ))}
              </div>
            </div>
          )}

          {/* Delete button */}
          <div className="mt-6 pt-4 border-t border-[#dfe6ef] flex justify-end">
            <button
              onClick={onDelete}
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Избриши
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 border border-[#e7ecf3] px-4 py-3">
      <p className="text-[11px] text-[#8a95a6] uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-[#0b1220] whitespace-pre-wrap">{value}</p>
    </div>
  );
}

function formatKey(key: string): string {
  const map: Record<string, string> = {
    tradingDuration: "Искуство со trading",
    knowledgeLevel: "Ниво на знаење",
    markets: "Пазари",
    tradingStyle: "Trading стил",
    accountType: "Тип на сметка",
    concepts: "Концепти",
    tradingPlan: "Trading Plan",
    problems: "Проблеми",
    currentSituation: "Моментална ситуација",
    expectations: "Очекувања",
    importantResult: "Најважен резултат",
    successDefinition: "Успешно менторство",
    progressTime: "Период за напредок",
    weeklyTime: "Неделно време",
    availability: "Достапност",
    commitment: "Посветеност",
    journalReadiness: "Trading Journal",
    responsibilityLevel: "Лична одговорност",
    whyIndividual: "Зошто индивидуално",
    sessionDuration: "Времетраење на сесија",
    sessionFrequency: "Фреквенција",
    format: "Формат",
    investment: "Инвестиција",
    paymentMethod: "Начин на плаќање",
    groupAlternative: "Group алтернатива",
    startTime: "Почеток",
    mentorExpectations: "Очекувања од ментор",
    additionalInfo: "Дополнително",
    confirmRealistic: "Потврда: реални очекувања",
    confirmResponsibility: "Потврда: одговорност",
    confirmContact: "Потврда: контакт",
    whyGroup: "Зошто Group Coaching",
    groupSize: "Големина на група",
    programContent: "Содржина на програма",
    individualFeedbackImportance: "Важност на индивидуален feedback",
    previousSignals: "Претходно користење сигнали",
    previousExperience: "Претходно искуство со сигнали",
    signalType: "Тип на сигнали",
    checkFrequency: "Фреквенција на проверка",
    weeklySignals: "Неделни сигнали",
    signalContent: "Содржина на сигнал",
    signalBenefits: "Очекувања од сигнали",
    analysisDepth: "Длабочина на анализа",
    capital: "Trading капитал",
    deposit: "Планиран депозит",
    affordableCapital: "Достапен капитал",
    riskPerSignal: "Ризик по сигнал",
    maxDrawdown: "Максимален Drawdown",
    positionSize: "Position Size",
    losingStreak: "Реакција на загуби",
    expectedResults: "Очекувани резултати",
    communication: "Комуникација",
    confirmRisk: "Потврда: ризик",
    confirmPastResults: "Потврда: минати резултати",
    confirmAccountManagement: "Потврда: управување сметка",
    confirmAffordableCapital: "Потврда: расположлив капитал",
  };
  return map[key] || key;
}

function formatValue(val: unknown): string {
  if (Array.isArray(val)) return val.join(", ");
  if (typeof val === "boolean") return val ? "Да" : "Не";
  if (typeof val === "number") return `${val}/10`;
  return String(val || "—");
}
