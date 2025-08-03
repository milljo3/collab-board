import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";
import QueryProvider from "@/app/providers/QueryProvider";
import {ThemeProvider} from "next-themes";
import {SocketProvider} from "@/app/providers/SocketProvider";

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
        <html lang="en" className="h-full overflow-x-hidden">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col`}>
                <QueryProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <SocketProvider>
                            {children}
                        </SocketProvider>
                    </ThemeProvider>
                    <Toaster position="top-center" theme="dark" richColors={true} />
                </QueryProvider>
            </body>
        </html>
    );
}