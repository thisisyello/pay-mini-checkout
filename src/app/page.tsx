"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-12">
            <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <div className="text-center">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F3FF]">
                        <svg
                            className="h-7 w-7 text-[#0064FF]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                        </svg>
                    </div>
                    <h1 className="mt-4 text-2xl font-bold text-[#191F28]">
                        Mini Payment
                    </h1>
                    <p className="mt-2 text-sm text-[#6B7684]">
                        간편하고 안전한 결제 테스트
                    </p>
                </div>

                <div className="mt-8 space-y-3">
                    {[
                        {
                            step: "1",
                            title: "주문 생성",
                            desc: "금액을 입력하고 주문을 생성합니다",
                        },
                        {
                            step: "2",
                            title: "결제 진행",
                            desc: "토스 결제창에서 카드를 선택합니다",
                        },
                        {
                            step: "3",
                            title: "결과 확인",
                            desc: "결제 완료 후 결과를 확인합니다",
                        },
                    ].map((item) => (
                        <div
                            key={item.step}
                            className="flex items-start gap-4 rounded-xl border border-[#E5E8EB] p-4"
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0064FF] text-sm font-bold text-white">
                                {item.step}
                            </div>
                            <div>
                                <div className="font-semibold text-[#191F28]">
                                    {item.title}
                                </div>
                                <div className="mt-0.5 text-sm text-[#6B7684]">
                                    {item.desc}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => router.push("/checkout")}
                    className="mt-8 w-full rounded-xl bg-[#0064FF] py-4 text-base font-bold text-white transition-all hover:bg-[#0052D4] active:scale-[0.98]"
                >
                    결제 테스트 시작
                </button>
            </section>
        </main>
    );
}
