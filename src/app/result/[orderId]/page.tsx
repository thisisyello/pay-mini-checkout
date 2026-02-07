import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const formatKst = (date: Date) =>
    new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
        dateStyle: "medium",
        timeStyle: "medium",
    }).format(date);

type Props = {
    params: Promise<{
        orderId: string;
    }>;
};

export default async function ResultPage({ params }: Props) {
    const { orderId } = await params;

    const order = await prisma.order.findUnique({
        where: { id: orderId },
    });

    if (!order) {
        return (
            <main className="min-h-screen flex items-center justify-center px-4 py-12">
                <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-[#FFEBEE] flex items-center justify-center">
                        <svg
                            className="h-8 w-8 text-[#F04452]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                    <h1 className="mt-4 text-xl font-bold text-[#191F28]">
                        주문을 찾을 수 없습니다
                    </h1>
                    <p className="mt-2 text-sm text-[#6B7684]">
                        존재하지 않는 주문번호입니다
                    </p>
                    <Link
                        href="/"
                        className="mt-6 inline-block rounded-xl bg-[#0064FF] px-6 py-3 text-sm font-bold text-white"
                    >
                        홈으로 돌아가기
                    </Link>
                </section>
            </main>
        );
    }

    const isPaid = order.status === "PAID";

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-12">
            <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <div className="text-center">
                    {isPaid ? (
                        <div className="mx-auto h-16 w-16 rounded-full bg-[#E8FFF4] flex items-center justify-center">
                            <svg
                                className="h-8 w-8 text-[#00C471]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    ) : (
                        <div className="mx-auto h-16 w-16 rounded-full bg-[#FFF4E5] flex items-center justify-center">
                            <svg
                                className="h-8 w-8 text-[#FF9500]"
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
                        </div>
                    )}
                    <h1 className="mt-4 text-2xl font-bold text-[#191F28]">
                        {isPaid ? "결제 완료" : "결제 대기중"}
                    </h1>
                    <p className="mt-1 text-sm text-[#6B7684]">
                        {isPaid
                            ? "결제가 성공적으로 완료되었습니다"
                            : "결제가 아직 완료되지 않았습니다"}
                    </p>
                </div>

                <div className="mt-8 text-center">
                    <div className="text-3xl font-bold text-[#191F28]">
                        {order.amount.toLocaleString()}
                        <span className="ml-1 text-lg font-medium text-[#6B7684]">
                            원
                        </span>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <div className="flex justify-between rounded-xl bg-[#F4F5F7] px-4 py-3">
                        <span className="text-sm text-[#6B7684]">주문번호</span>
                        <span className="text-sm font-medium text-[#191F28] break-all text-right max-w-[200px]">
                            {order.id}
                        </span>
                    </div>
                    <div className="flex justify-between rounded-xl bg-[#F4F5F7] px-4 py-3">
                        <span className="text-sm text-[#6B7684]">상태</span>
                        <span
                            className={`text-sm font-bold ${isPaid ? "text-[#00C471]" : "text-[#FF9500]"}`}
                        >
                            {order.status}
                        </span>
                    </div>
                    {order.paidAt && (
                        <div className="flex justify-between rounded-xl bg-[#F4F5F7] px-4 py-3">
                            <span className="text-sm text-[#6B7684]">
                                결제일시
                            </span>
                            <span className="text-sm font-medium text-[#191F28]">
                                {formatKst(new Date(order.paidAt))}
                            </span>
                        </div>
                    )}
                </div>

                <div className="mt-8 space-y-3">
                    <Link
                        href="/checkout"
                        className="block w-full rounded-xl bg-[#0064FF] py-4 text-center text-base font-bold text-white transition-all hover:bg-[#0052D4]"
                    >
                        새로운 결제
                    </Link>
                    <Link
                        href="/"
                        className="block w-full rounded-xl border border-[#E5E8EB] py-3 text-center text-sm font-medium text-[#6B7684] transition-colors hover:bg-[#F4F5F7]"
                    >
                        홈으로 돌아가기
                    </Link>
                </div>
            </section>
        </main>
    );
}
