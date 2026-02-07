"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen px-4 py-12">
      <section className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_70px_rgba(19,33,68,0.12),0_2px_8px_rgba(19,33,68,0.06)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 backdrop-blur">
          Mini Payment Demo
        </div>

        <h1 className="mt-4 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
          빠르고 안전한
          <br />
          미니 결제 플로우
        </h1>

        <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
          주문 생성부터 결제 완료까지의 흐름을 간단하게 체험
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => router.push("/checkout")}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            결제 테스트 시작
          </button>
          <button
            onClick={() => router.push("/checkout")}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            플로우 둘러보기
          </button>
        </div>

        <div className="mt-6 grid w-full gap-4 sm:grid-cols-3">
          {[
            {
              title: "주문 생성",
              body: "금액 입력 후 주문 생성 API를 호출합니다.",
            },
            {
              title: "결제 진행",
              body: "결제 완료 처리로 다음 단계로 이동합니다.",
            },
            {
              title: "결과 확인",
              body: "결과 페이지에서 주문 상태를 확인합니다.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm backdrop-blur"
            >
              <div className="text-base font-extrabold text-slate-900">
                {item.title}
              </div>
              <div className="mt-1.5 leading-6">{item.body}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
