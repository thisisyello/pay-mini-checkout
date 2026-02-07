export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const orderId = body?.orderId;

  if (typeof orderId !== "string") {
    return NextResponse.json({ error: "Invalid orderId" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status !== "CREATED") {
    return NextResponse.json({ error: "Order is not payable" }, { status: 409 });
  }

  // 예측 불가능 토큰
  const token = crypto.randomBytes(24).toString("hex");

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentToken: token, paymentUsedAt: null },
  });

  // 실제 PG라면 여기서 결제창 URL을 내려줌
  return NextResponse.json({
    paymentUrl: `/pay/${orderId}?token=${token}`,
  });
}