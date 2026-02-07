import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const ok = (data: any, status = 200) => NextResponse.json({ ok: true, data }, { status });
const fail = (message: string, status = 400) =>
  NextResponse.json({ ok: false, error: { message } }, { status });

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const amount = body?.amount;

    if (!Number.isInteger(amount) || amount <= 0) {
      return fail("Invalid amount", 400);
    }

    const paymentToken = crypto.randomBytes(16).toString("hex");

    const order = await prisma.order.create({
      data: {
        amount,
        currency: "KRW",
        status: "CREATED",
        paymentToken,
      },
      select: { id: true, paymentToken: true },
    });

    return ok(order, 201);
  } catch (e) {
    console.error(e);
    return fail("Server error", 500);
  }
}