export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const orderId = body?.orderId;
  const token = body?.token;

  if (typeof orderId !== "string" || typeof token !== "string") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // 토큰 일치 + 아직 사용 안 됨 + CREATED 상태일 때만 PAID로 전이
  const updated = await prisma.order.updateMany({
    where: {
      id: orderId,
      status: "CREATED",
      paymentToken: token,
      paymentUsedAt: null,
    },
    data: {
      status: "PAID",
      paidAt: new Date(),
      paymentUsedAt: new Date(),
    },
  });

  if (updated.count === 0) {
    // 위조/재시도/이미 결제됨/토큰 불일치
    return NextResponse.json({ error: "Payment not valid" }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}