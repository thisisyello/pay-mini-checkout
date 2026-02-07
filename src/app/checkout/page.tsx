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

    const createOrder = async () => {
        setError(null);
        setOrderId(null);

        const amountNum = Number(amount);

        if (!Number.isFinite(amountNum) || amountNum <= 0) {
            setError("올바른 금액을 입력해주세요");
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
                setError(data?.error?.message ?? "주문 생성에 실패했습니다");
                return;
            }

            const oid = data?.data?.id;

            if (!oid) {
                setError("주문 ID를 받지 못했습니다");
                return;
            }

            setOrderId(oid);
        } catch (e) {
            console.error(e);
            setError("네트워크 오류가 발생했습니다");
        } finally {
            setLoading(false);
        }
    };

    const requestTossPayment = () => {
        if (!orderId) {
            alert("먼저 주문을 생성하세요");
            return;
        }

        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

        if (!clientKey) {
            alert("클라이언트 키가 설정되지 않았습니다");
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

    const formatAmount = (value: string) => {
        const num = Number(value.replace(/,/g, ""));
        if (isNaN(num)) return value;
        return num.toLocaleString();
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-12">
            <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-1 text-sm text-[#6B7684] hover:text-[#191F28]"
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
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    홈으로
                </button>

                <h1 className="mt-4 text-2xl font-bold text-[#191F28]">
                    결제하기
                </h1>
                <p className="mt-1 text-sm text-[#6B7684]">
                    금액을 입력하고 주문을 생성하세요
                </p>

                <div className="mt-6">
                    <label className="text-sm font-medium text-[#6B7684]">
                        결제 금액
                    </label>
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-[#E5E8EB] bg-[#F4F5F7] px-4 py-3 focus-within:border-[#0064FF] focus-within:bg-white transition-colors">
                        <input
                            value={formatAmount(amount)}
                            onChange={(e) =>
                                setAmount(e.target.value.replace(/,/g, ""))
                            }
                            inputMode="numeric"
                            placeholder="0"
                            className="flex-1 bg-transparent text-xl font-bold text-[#191F28] outline-none placeholder:text-[#8B95A1]"
                        />
                        <span className="text-lg font-medium text-[#6B7684]">
                            원
                        </span>
                    </div>
                </div>


                {error && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#FFEBEE] px-3 py-2 text-sm text-[#F04452]">
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
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        {error}
                    </div>
                )}

                {!orderId && (
                    <button
                        onClick={createOrder}
                        disabled={loading}
                        className="mt-6 w-full rounded-xl bg-[#0064FF] py-4 text-base font-bold text-white transition-all hover:bg-[#0052D4] active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? "주문 생성 중..." : "주문 생성"}
                    </button>
                )}
                {orderId && (
                    <div className="mt-6 space-y-4">
                        <div className="rounded-xl border border-[#E5E8EB] bg-[#F4F5F7] p-4">
                            <div className="text-xs font-medium text-[#6B7684]">
                                주문번호
                            </div>
                            <div className="mt-1 break-all font-mono text-sm text-[#191F28]">
                                {orderId}
                            </div>
                        </div>

                        <button
                            onClick={requestTossPayment}
                            className="w-full rounded-xl bg-[#0064FF] py-4 text-base font-bold text-white transition-all hover:bg-[#0052D4] active:scale-[0.98]"
                        >
                            토스로 결제하기
                        </button>

                        <button
                            onClick={() => {
                                setOrderId(null);
                                setAmount("1000");
                            }}
                            className="w-full rounded-xl border border-[#E5E8EB] py-3 text-sm font-medium text-[#6B7684] transition-colors hover:bg-[#F4F5F7]"
                        >
                            다시 시작
                        </button>
                    </div>
                )}
            </section>

            <Script
                src="https://js.tosspayments.com/v1/payment"
                strategy="afterInteractive"
            />
        </main>
    );
}
