import Header from "@/components/Header";

export default function MainLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex flex-col h-full">
            <Header />
            <main className="flex-1 min-h-0">{children}</main>
        </div>
    )
}