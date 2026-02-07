import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    if (!paymentKey || !orderId || !amount) {
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=missing_params`,
        );
    }

    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=order_not_found`,
            );
        }

        if (order.amount !== Number(amount)) {
            console.error(
                `[Payment Security] Amount mismatch! Order: ${order.amount}, Request: ${amount}`,
            );
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=amount_mismatch`,
            );
        }

        const secretKey = process.env.TOSS_SECRET_KEY!;
        const encodedKey = Buffer.from(`${secretKey}:`).toString("base64");

        const response = await fetch(
            "https://api.tosspayments.com/v1/payments/confirm",
            {
                method: "POST",
                headers: {
                    Authorization: `Basic ${encodedKey}`,
                    "Content-Type": "application/json",
                    "Idempotency-Key": crypto.randomUUID(),
                },
                body: JSON.stringify({
                    paymentKey,
                    orderId,
                    amount: Number(amount),
                }),
            },
        );

        const data = await response.json();

        if (!response.ok) {
            console.error(data);
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=confirm_failed`,
            );
        }

        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: "PAID",
                paidAt: new Date(),
            },
        });

        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/result/${orderId}`,
        );
    } catch (err) {
        console.error(err);
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=server_error`,
        );
    }
}
