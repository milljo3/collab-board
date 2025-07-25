import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";
import QueryProvider from "@/app/providers/QueryProvider";
import Header from "@/components/Header";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Collab Board",
    description: "Organize boards, tasks and collab",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh flex flex-col`}
        >
        <QueryProvider>
            <Header />
                <main className="flex-1 flex flex-col">{children}</main>
            <Toaster position="top-center" theme="dark" richColors={true} />
        </QueryProvider>
        </body>
        </html>
    );
}