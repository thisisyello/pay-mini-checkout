"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function PayPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";
  const router = useRouter();
  const [msg, setMsg] = useState("");

  async function confirmPay() {
    setMsg("confirming...");
    const res = await fetch("/api/payments/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, token }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(`error: ${data?.error ?? "unknown"}`);
    setMsg("PAID ✅");
    router.push(`/result/${orderId}`);
  }

  return (
    <main className="min-h-screen px-4 py-12 flex items-center justify-center">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_70px_rgba(19,33,68,0.12),0_2px_8px_rgba(19,33,68,0.06)]">
        <div className="text-[13px] font-bold uppercase tracking-[0.2em] text-slate-400">
          PAY
        </div>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
          결제 페이지(모의)
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          주문 정보를 확인한 뒤 결제 완료를 진행하세요.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Order Id
          </div>
          <div className="mt-2 break-all text-base font-bold text-slate-900">
            {orderId}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={confirmPay}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            결제 완료(서버 확인)
          </button>
        </div>

        <pre className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-4 text-xs text-slate-600">
          {msg}
        </pre>
      </section>
    </main>
  );
}
