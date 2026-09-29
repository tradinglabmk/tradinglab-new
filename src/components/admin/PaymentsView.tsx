import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";

export interface Payment {
  _id: string;
  stripeSessionId: string;
  stripeCustomerId?: string | null;
  stripePaymentIntentId?: string | null;
  stripeSubscriptionId?: string | null;
  planId: string | null;
  planTitle: string | null;
  amount: number;
  currency: string;
  mode: "subscription" | "payment";
  status: "paid" | "canceled" | "failed";
  customerName: string;
  customerEmail: string;
  linkedApplicationId?: string | null;
  invoicePdfUrl?: string | null;
  hostedInvoiceUrl?: string | null;
  invoiceNumber?: string | null;
  createdAt: string;
  lastRenewedAt?: string;
}

const PAGE_SIZE = 10;

function formatAmount(cents: number, currency: string): string {
  return `${currency} ${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("mk-MK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const PaymentsView = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPayments = useCallback(async (showSkeleton = false) => {
    if (showSkeleton) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    try {
      const response = await fetch("/api/admin/payments", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to fetch payments");
      const data = await response.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments(true);

    const intervalId = window.setInterval(() => fetchPayments(), 15_000);
    const refreshOnFocus = () => fetchPayments();
    window.addEventListener("focus", refreshOnFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, [fetchPayments]);

  const filtered = useMemo(() => {
    setCurrentPage(1);
    return payments.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        p.customerName.toLowerCase().includes(q) ||
        p.customerEmail.toLowerCase().includes(q) ||
        (p.planTitle ?? "").toLowerCase().includes(q);
      const matchesPlan = planFilter === "all" || p.planId === planFilter;
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [payments, search, planFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = useMemo(() => {
    const paid = payments.filter((p) => p.status === "paid");
    const revenueCents = paid.reduce((sum, p) => sum + (p.amount || 0), 0);
    const currency = paid[0]?.currency ?? "EUR";
    return {
      total: payments.length,
      revenue: formatAmount(revenueCents, currency),
      subs: payments.filter((p) => p.mode === "subscription").length,
      oneTime: payments.filter((p) => p.mode === "payment").length,
    };
  }, [payments]);

  const uniquePlans = useMemo(() => {
    const set = new Map<string, string>();
    payments.forEach((p) => {
      if (p.planId && p.planTitle) set.set(p.planId, p.planTitle);
    });
    return Array.from(set.entries());
  }, [payments]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget._id }),
      });
      if (res.ok) {
        setPayments((prev) => prev.filter((p) => p._id !== deleteTarget._id));
        setDeleteTarget(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => fetchPayments()}
          disabled={refreshing}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#dfe6ef] bg-white px-3 py-2 text-sm text-[#637083] transition-colors hover:border-[#c3cedd] hover:text-[#0b1220] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Освежи
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Вкупно уплати" value={String(stats.total)} color="#1457ff" />
        <StatCard label="Приход" value={stats.revenue} color="#22c55e" />
        <StatCard label="Претплати" value={String(stats.subs)} color="#0891b2" />
        <StatCard label="Еднократни" value={String(stats.oneTime)} color="#4f46e5" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Пребарај по име, email, план..."
            className="w-full rounded-xl border border-[#dfe6ef] bg-white px-4 py-3 text-sm text-[#0b1220] placeholder-[#8a95a6] focus:border-[#1457ff] focus:outline-none transition-all duration-300"
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="rounded-xl border border-[#dfe6ef] bg-white px-4 py-3 text-sm text-[#0b1220] focus:border-[#1457ff] focus:outline-none"
        >
          <option value="all">Сите планови</option>
          {uniquePlans.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-[#dfe6ef] bg-white px-4 py-3 text-sm text-[#0b1220] focus:border-[#1457ff] focus:outline-none"
        >
          <option value="all">Сите статуси</option>
          <option value="paid">Платено</option>
          <option value="canceled">Откажано</option>
          <option value="failed">Неуспешно</option>
        </select>
      </div>

      <p className="text-sm text-[#637083] mb-4">
        {filtered.length} {filtered.length === 1 ? "резултат" : "резултати"}
      </p>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#dfe6ef] bg-white px-5 py-4 h-[72px] animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#dfe6ef] bg-white p-12 text-center">
          <p className="text-[#637083]">Нема пронајдени уплати</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paginated.map((p) => (
              <PaymentCard key={p._id} payment={p} onDelete={() => setDeleteTarget(p)} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-xl border border-[#dfe6ef] bg-white px-4 py-2 text-sm text-[#637083] hover:text-[#0b1220] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Назад
              </button>
              <span className="px-3 text-sm text-[#637083]">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded-xl border border-[#dfe6ef] bg-white px-4 py-2 text-sm text-[#637083] hover:text-[#0b1220] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Следно
              </button>
            </div>
          )}
        </>
      )}

      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.customerName || deleteTarget.customerEmail}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

function PaymentCard({ payment, onDelete }: { payment: Payment; onDelete: () => void }) {
  const statusColor =
    payment.status === "paid"
      ? "bg-green-50 text-green-700 border-green-200"
      : payment.status === "canceled"
        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
        : "bg-red-50 text-red-700 border-red-200";

  return (
    <div className="rounded-2xl border border-[#dfe6ef] bg-white p-5 shadow-[0_10px_30px_rgba(10,22,48,0.06)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1457ff]/15 to-[#0b42d6]/15 text-[#0b42d6] font-semibold text-sm">
            {(payment.customerName || payment.customerEmail || "?")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-[#0b1220] font-medium text-[15px] truncate">
              {payment.customerName || "—"}
            </p>
            <p className="text-[#637083] text-sm truncate">{payment.customerEmail || "—"}</p>
            {payment.linkedApplicationId && (
              <span className="mt-1 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                Има апликација
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-right">
            <p className="text-[#0b1220] font-semibold text-sm">
              {formatAmount(payment.amount, payment.currency)}
            </p>
            <p className="text-xs text-[#637083]">
              {payment.mode === "subscription" ? "Претплата" : "Еднократно"}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusColor}`}
          >
            {payment.status === "paid"
              ? "Платено"
              : payment.status === "canceled"
                ? "Откажано"
                : "Неуспешно"}
          </span>
          <span className="text-xs text-[#8a95a6] whitespace-nowrap">
            {formatDate(payment.createdAt)}
          </span>
          <button
            onClick={onDelete}
            className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-500 hover:bg-red-100 transition-colors"
            aria-label="Delete"
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
          </button>
        </div>
      </div>
      {payment.planTitle && (
        <p className="mt-3 text-xs text-[#637083]">
          План: <span className="text-[#0b1220]">{payment.planTitle}</span>
        </p>
      )}
      {payment.invoiceNumber && (
        <a
          href={`/api/payments/invoice?session_id=${encodeURIComponent(payment.stripeSessionId)}`}
          className="mt-2 inline-block text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Преземи фактура (PDF)
        </a>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-2xl border border-[#dfe6ef] bg-white p-5 shadow-[0_10px_30px_rgba(10,22,48,0.06)]">
      <p className="text-xs text-[#8a95a6] uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl border border-[#dfe6ef] bg-white p-6 shadow-2xl">
        <h3 className="text-center text-lg font-semibold text-[#0b1220] mb-2">Избриши уплата</h3>
        <p className="text-center text-sm text-[#637083] mb-6">
          Дали сте сигурни дека сакате да ја избришете уплатата на{" "}
          <span className="font-medium text-[#0b1220]">{name}</span>?
          <br />
          <span className="text-red-500">Оваа акција е неповратна.</span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 rounded-xl border border-[#dfe6ef] bg-white px-4 py-2.5 text-sm text-[#354158] hover:bg-slate-50 disabled:opacity-50"
          >
            Откажи
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600 hover:bg-red-100 disabled:opacity-50"
          >
            {deleting ? "Бришење..." : "Избриши"}
          </button>
        </div>
      </div>
    </div>
  );
}
