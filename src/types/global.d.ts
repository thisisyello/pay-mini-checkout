export {};

declare global {
    interface Window {
        TossPayments: (clientKey: string) => TossPaymentsInstance;
    }
}

interface TossPaymentsInstance {
    requestPayment: (method: string, options: PaymentOptions) => Promise<void>;
}

interface PaymentOptions {
    amount: number;
    orderId: string;
    orderName: string;
    successUrl: string;
    failUrl: string;
    customerName?: string;
    customerEmail?: string;
}
