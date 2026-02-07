import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ok = (data: any, status = 200) =>
  NextResponse.json({ ok: true, data }, { status });

const fail = (message: string, status = 400) =>
  NextResponse.json({ ok: false, error: { message } }, { status });

const formatKst = (date: Date) =>
  new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(date);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const orderId = body?.orderId;
    const paymentToken = body?.paymentToken;

    if (!orderId || typeof orderId !== "string")
      return fail("Invalid orderId", 400);

    if (!paymentToken || typeof paymentToken !== "string")
      return fail("Invalid paymentToken", 400);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        paymentToken: true,
        status: true,
        paidAt: true,
      },
    });

    if (!order) return fail("Order not found", 404);

    // 토큰 위조 방지
    if (order.paymentToken !== paymentToken)
      return fail("Payment token mismatch", 401);

    // 이미 결제된 경우
    if (order.status === "PAID") {
      return ok({
        id: order.id,
        status: order.status,
        paidAt: order.paidAt,
        duplicate: true,
      });
    }

    // 정상 상태 전이
    const now = new Date();
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        paidAt: new Date(),
        paidAtKst: formatKst(now),
      },
      select: { id: true, status: true, paidAt: true },
    });

    return ok({
      ...updated,
      duplicate: false,
    });
  } catch (e) {
    console.error(e);
    return fail("Server error", 500);
  }
}
