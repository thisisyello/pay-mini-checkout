import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mini Payment Demo",
    description: "24h Fintech Mini Project",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body className="min-h-screen bg-[radial-gradient(1000px_600px_at_10%_-10%,#fff1e6_0%,transparent_55%),radial-gradient(900px_500px_at_100%_0%,#e6f0ff_0%,transparent_55%),#f7f7fb] font-sans text-slate-900 antialiased">
                <div className="min-h-screen w-full">{children}</div>
            </body>
        </html>
    );
}
