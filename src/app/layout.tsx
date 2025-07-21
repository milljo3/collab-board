import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";
import QueryProvider from "@/app/providers/QueryProvider";
import Link from "next/link";
import {OptionsDropDownMenu} from "@/components/auth/OptionsDropDownMenu";

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
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <div className="flex justify-between items-center absolute top-0 left-0 w-full p-4">
            <Link
                href="/"
                className="text-lg"
            >
                Collab Board
            </Link>
            <OptionsDropDownMenu />
        </div>
        <QueryProvider>
            {children}
        </QueryProvider>
        <Toaster position="top-center" theme="dark" richColors={true} />
        </body>
        </html>
    );
}