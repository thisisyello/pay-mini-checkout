import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mini Payment Demo",
    description: "Toss-style Payment Demo",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body className="min-h-screen">
                <div className="min-h-screen w-full">{children}</div>
            </body>
        </html>
    );
}
