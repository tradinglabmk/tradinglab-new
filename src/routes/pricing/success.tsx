import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

const searchSchema = z.object({
  session_id: z.string().optional(),
});

export const Route = createFileRoute("/pricing/success")({
  validateSearch: searchSchema,
  component: SuccessPage,
});

interface SessionInfo {
  planTitle: string | null;
  amount: number;
  currency: string;
  email: string;
  name: string;
  status: string;
  mode: string;
  invoicePdfUrl: string | null;
  hostedInvoiceUrl: string | null;
}

function SuccessPage() {
  const { session_id: sessionId } = Route.useSearch();
  const [info, setInfo] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const downloadTriggered = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setError("Недостасува session_id");
      setLoading(false);
      return;
    }
    fetch(`/api/payments/session?session_id=${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setInfo(data);
      })
      .catch((err) => setError(err.message || "Настана грешка"))
      .finally(() => setLoading(false));
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || downloadTriggered.current) return;
    if (!info || info.status !== "paid") return;
    downloadTriggered.current = true;
    const link = document.createElement("a");
    link.href = `/api/payments/invoice?session_id=${encodeURIComponent(sessionId)}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, [sessionId, info]);

  return (
    <div className="bg-[#0F0F14] min-h-screen pt-[120px] pb-16 px-4">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30">
          <svg
            className="h-8 w-8 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="mb-3 text-3xl font-bold text-white">
          Ви благодариме за уплатата!
        </h1>

        {loading && <p className="text-gray-400">Се потврдува вашата уплата...</p>}

        {error && (
          <p className="text-red-400 text-sm">
            {error}. Ако веднаш сте платиле, проверете ја вашата е-пошта.
          </p>
        )}

        {info && (
          <>
            <p className="text-gray-300">
              {info.planTitle ? (
                <>
                  Успешно се претплативте на{" "}
                  <span className="font-semibold text-white">{info.planTitle}</span>.
                </>
              ) : (
                "Успешно ја завршивте уплатата."
              )}
            </p>

            <div className="mt-6 rounded-xl border border-gray-700/50 bg-white/[0.02] p-5 text-left text-sm">
              {info.name && (
                <p className="text-gray-400">
                  Име: <span className="text-white">{info.name}</span>
                </p>
              )}
              {info.email && (
                <p className="mt-2 text-gray-400">
                  Е-пошта: <span className="text-white">{info.email}</span>
                </p>
              )}
              {info.amount > 0 && (
                <p className="mt-2 text-gray-400">
                  Износ:{" "}
                  <span className="text-white">
                    {info.currency} {(info.amount / 100).toFixed(2)}
                  </span>
                </p>
              )}
              {info.mode === "subscription" && (
                <p className="mt-2 text-gray-400">
                  Оваа претплата автоматски ќе се обновува додека не ја откажете.
                </p>
              )}
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Вашата фактура автоматски се презема.
            </p>

            {sessionId && (
              <div className="mt-4">
                <a
                  href={`/api/payments/invoice?session_id=${encodeURIComponent(sessionId)}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#9F62F8] hover:text-[#BF94FF] transition-colors"
                >
                  Преземи фактура (PDF)
                </a>
              </div>
            )}
          </>
        )}

        <Link
          to="/"
          className="mt-6 inline-block cursor-pointer rounded-xl bg-gradient-to-r from-[#BF94FF] to-[#863DE9] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(159,98,248,0.5)]"
        >
          Назад кон почетна
        </Link>
      </div>
    </div>
  );
}
