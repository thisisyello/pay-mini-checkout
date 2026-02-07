export type ApiOk<T> = { ok: true; data: T };
export type ApiFail = { ok: false; error: { message: string } | string };
export type ApiResponse<T> = ApiOk<T> | ApiFail;

export interface CreateOrderBody {
    amount: number;
}

export interface CreateOrderResponse {
    id: string;
    paymentToken: string;
}

export interface WebhookBody {
    eventType: string;
    status: string;
    orderId: string;
    paymentKey: string;
    data: {
        status: string;
        orderId: string;
        paymentKey?: string;
        amount?: number;
    };
}
