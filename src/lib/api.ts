import { NextResponse } from "next/server";

export type ApiErrorCode =
    | "BAD_REQUEST"
    | "INVALID_AMOUNT"
    | "NOT_FOUND"
    | "CONFLICT"
    | "ALREADY_PAID"
    | "PAYMENT_TOKEN_USED"
    | "UNAUTHORIZED"
    | "INTERNAL";

export function ok<T>(data: T, status = 200) {
    return NextResponse.json({ ok: true, data }, { status });
}

export function fail(code: ApiErrorCode, message: string, status = 400) {
    return NextResponse.json(
        { ok: false, error: { code, message } },
        { status },
    );
}
