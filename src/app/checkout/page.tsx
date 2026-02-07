"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function CheckoutPage() {
    const router = useRouter();
    const [amount, setAmount] = useState("1000");
    const [loading, setLoading] = useState(false);

    const [orderId, setOrderId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 주문 생성
    const createOrder = async () => {
        setError(null);
        setOrderId(null);

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

            const data = await res.json().catch(() => null);

            if (!res.ok || !data?.ok) {
                setError(data?.error?.message ?? "주문 생성 실패");
                return;
            }

            const oid = data?.data?.id;

            if (!oid) {
                setError("orderId가 응답에 없습니다.");
                return;
            }

            setOrderId(oid);
        } catch (e) {
            console.error(e);
            setError("네트워크/서버 오류");
        } finally {
            setLoading(false);
        }
    };

    // 토스 결제 요청
    const requestTossPayment = () => {
        if (!orderId) {
            alert("먼저 주문을 생성하세요.");
            return;
        }

        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

        if (!clientKey) {
            alert("클라이언트 키가 설정되지 않았습니다.");
            return;
        }

        const tossPayments = window.TossPayments(clientKey);

        tossPayments.requestPayment("카드", {
            amount: Number(amount),
            orderId: orderId,
            orderName: "Mini Payment Demo",
            successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/confirm`,
            failUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?fail=true`,
        });
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
            <section className="w-full max-w-[520px] rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
                <h1 className="text-2xl font-extrabold text-slate-900">
                    Mini Payment Demo
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    주문 생성 → 토스 결제 → 승인 → 결과 확인
                </p>

                {/* 금액 입력 */}
                <div className="mt-6">
                    <label className="block text-sm font-bold text-slate-800 mb-2">
                        결제 금액
                    </label>
                    <input
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        inputMode="numeric"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg font-semibold"
                    />
                </div>

                {/* 주문 생성 버튼 */}
                <button
                    onClick={createOrder}
                    disabled={loading}
                    className="mt-4 w-full rounded-xl bg-black py-3 font-bold text-white disabled:opacity-60"
                >
                    {loading ? "주문 생성 중..." : "주문 생성"}
                </button>

                {error && (
                    <div className="mt-3 text-sm font-bold text-red-600">
                        {error}
                    </div>
                )}

                {/* 주문 생성 후 */}
                {orderId && (
                    <div className="mt-6 rounded-xl border border-slate-200 p-4">
                        <div className="text-sm text-slate-600">
                            orderId:
                            <div className="font-mono text-slate-900 break-all mt-1">
                                {orderId}
                            </div>
                        </div>

                        <button
                            onClick={requestTossPayment}
                            className="mt-4 w-full rounded-xl bg-indigo-600 py-3 font-bold text-white"
                        >
                            토스 실제 결제 진행
                        </button>
                    </div>
                )}

                <button
                    onClick={() => router.push("/")}
                    className="mt-6 w-full rounded-xl border border-slate-300 py-2 text-sm font-semibold"
                >
                    ← 홈으로
                </button>
            </section>

            {/* 토스 SDK */}
            <Script
                src="https://js.tosspayments.com/v1/payment"
                strategy="afterInteractive"
            />
        </main>
    );
}
