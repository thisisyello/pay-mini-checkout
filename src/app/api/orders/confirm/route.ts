import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { orderId, paymentToken } = await req.json();

  if (!orderId || !paymentToken) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // 🔐 토큰 검증
  if (order.paymentToken !== paymentToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  if (order.status === "PAID") {
    return NextResponse.json({ message: "Already paid" });
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "PAID" },
  });

  return NextResponse.json({ success: true });
}