import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { WebhookBody } from "@/lib/types";

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const body = JSON.parse(rawBody) as WebhookBody;
        const { status, orderId, data } = body;

        if (status === "DONE") {
            const targetOrderId = orderId || data?.orderId;

            if (targetOrderId) {
                await prisma.order.update({
                    where: { id: targetOrderId },
                    data: {
                        status: "PAID",
                        paidAt: new Date(),
                    },
                });
            }
        }

        return NextResponse.json({ ok: true });
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        console.error("Webhook Error:", errorMessage);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
