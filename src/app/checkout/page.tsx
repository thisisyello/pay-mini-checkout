"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ApiOk<T> = { ok: true; data: T };
type ApiFail = { ok: false; error: { code?: string; message?: string } | string };
type ApiResponse<T> = ApiOk<T> | ApiFail;

type CreateOrderData = {
  id: string;
  paymentToken: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("1000");
  const [loading, setLoading] = useState(false);

  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentToken, setPaymentToken] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (data: any, fallback: string) => {
    // fail: { ok:false, error:{message} } or { ok:false, error:"..." }
    const msg =
      data?.error?.message ??
      (typeof data?.error === "string" ? data.error : null) ??
      fallback;
    return msg;
  };

  const createOrder = async () => {
    setError(null);
    setOrderId(null);
    setPaymentToken(null);

    const amountNum = Number(amount);

    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      setError("금액을 올바르게 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountNum }),
      });

      const data = (await res.json().catch(() => null)) as ApiResponse<CreateOrderData> | null;

      if (!res.ok || !data || data.ok !== true) {
        setError(getErrorMessage(data, "주문 생성 실패"));
        return;
      }

      const oid = data.data?.id;
      const token = data.data?.paymentToken;

      if (!oid || !token) {
        setError("orderId 또는 paymentToken이 응답에 없습니다.");
        return;
      }

      setOrderId(oid);
      setPaymentToken(token);
    } catch (e) {
      console.log(e);
      setError("네트워크/서버 오류");
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePayment = async (orderId: string) => {
    if (!paymentToken) {
        alert("paymentToken 없음");
        return;
    }

    try {
        const res = await fetch("/api/payments/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentToken }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.ok) {
        alert(data?.error?.message ?? "결제 실패");
        return;
        }

        if (data.data.duplicate) {
        alert("이미 결제된 주문입니다. 중복 결제는 발생하지 않았습니다.");
        } else {
        alert("결제가 정상 처리되었습니다.");
        }

        router.push(`/result/${encodeURIComponent(orderId)}`);
    } catch (e) {
        console.error(e);
        alert("네트워크 오류");
    }
  };

  const handleDuplicateTest = async () => {
    if (!orderId) return;
    // 같은 orderId로 두 번 호출 → 중복 결제 테스트
    await handleCompletePayment(orderId);
    await handleCompletePayment(orderId);
  };

  const handleForceFailTest = async () => {
    if (!orderId) return;

    try {
      const res = await fetch("/api/payments/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentToken: "fake-token",
        }),
      });

      const data = (await res.json().catch(() => null)) as ApiResponse<any> | null;

      if (!res.ok || !data || data.ok !== true) {
        alert(getErrorMessage(data, "실패 응답 확인"));
        return;
      }

      // 혹시 서버가 fake-token도 통과시키면(원래는 안됨) 성공 케이스 메시지
      alert("서버가 fake-token을 성공 처리했습니다(검증 로직 확인 필요).");
    } catch (e) {
      console.log(e);
      alert("네트워크/서버 오류");
    }
  };

  return (
    <main className="min-h-screen px-4 py-12 flex items-center justify-center">
      <section className="w-full max-w-[560px] rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_70px_rgba(19,33,68,0.12),0_2px_8px_rgba(19,33,68,0.06)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[13px] font-bold tracking-[0.08em] text-slate-500">
              MINI CHECKOUT
            </div>
            <h1 className="mt-1.5 text-2xl font-extrabold text-slate-900">
              Checkout
            </h1>
            <p className="mt-1.5 text-sm leading-6 text-slate-500">
              주문 생성 → 결제 진행(모의) → 결과 확인
            </p>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block font-bold text-slate-900">결제 금액</label>
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3">
            <span className="font-bold text-slate-400">₩</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="numeric"
              className="w-full bg-transparent text-lg font-bold text-slate-900 outline-none"
            />
          </div>
          <div className="mt-2 text-xs text-slate-400">숫자만 입력해주세요.</div>
        </div>

        <button
          onClick={createOrder}
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-extrabold tracking-wide text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "주문 생성 중..." : "주문 생성"}
        </button>

        {error && (
          <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2.5 font-bold text-rose-700">
            {error}
          </div>
        )}

        {orderId && (
          <div className="mt-4 rounded-2xl border border-slate-200 p-4">
            <div className="font-extrabold text-slate-900">주문 생성 완료</div>

            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-sm text-slate-600">
              <span>orderId:</span>
              <b className="text-slate-900">{orderId}</b>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-sm text-slate-600">
              <span>paymentToken:</span>
              <b className="text-slate-900 break-all">
                {paymentToken ?? "(없음)"}
              </b>
            </div>

            <button
              onClick={() => handleCompletePayment(orderId)}
              className="mt-3.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
            >
              정상 결제 처리
            </button>

            <button
              onClick={handleDuplicateTest}
              className="mt-3.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
            >
              중복 결제 테스트
            </button>

            <button
              onClick={handleForceFailTest}
              className="mt-3.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
            >
              강제 실패 테스트
            </button>
          </div>
        )}

        <button
          onClick={() => router.push("/")}
          className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
        >
          ← 홈으로
        </button>
      </section>
    </main>
  );
}
