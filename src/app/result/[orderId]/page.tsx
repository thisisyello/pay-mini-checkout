import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const formatKst = (date: Date) =>
  new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);

export default async function ResultPage({ params }: any) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return (
      <main className="min-h-screen px-4 py-12">
        <section className="mx-auto w-full max-w-2xl rounded-3xl border border-rose-200 bg-white/90 p-6 text-rose-700 shadow-[0_24px_70px_rgba(19,33,68,0.12),0_2px_8px_rgba(19,33,68,0.06)] text-center">
          Order not found
        </section>
      </main>
    );
  }

  const isPaid = order.status === "PAID";

  return (
    <main className="min-h-screen px-4 py-12 flex items-center justify-center">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_70px_rgba(19,33,68,0.12),0_2px_8px_rgba(19,33,68,0.06)]">
        <div className="text-[13px] font-bold uppercase tracking-[0.2em] text-slate-400">
          PAYMENT RESULT
        </div>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
          결제 결과
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          주문 상태와 결제 정보를 확인하세요.
        </p>

        {/* 상태 배지 */}
        {isPaid ? (
          <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-700 font-bold">
            결제 완료
          </div>
        ) : (
          <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-rose-700 font-bold">
            결제 미완료
          </div>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Order Id
            </div>
            <div className="mt-2 break-all text-base font-bold text-slate-900">
              {order.id}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Amount
            </div>
            <div className="mt-2 text-base font-bold text-slate-900">
              {order.amount} {order.currency}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Status
            </div>
            <div className="mt-2 text-base font-bold text-slate-900">
              {order.status}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Paid At
            </div>
            <div className="mt-2 text-base font-bold text-slate-900">
              {order.paidAt ? formatKst(new Date(order.paidAt)) : "-"}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            ← 메인으로
          </Link>
          <a
            href="/checkout"
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            다시 결제하기
          </a>
        </div>
      </section>
    </main>
  );
}
