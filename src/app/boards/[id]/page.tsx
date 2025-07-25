import React from 'react';
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {BoardSidebar} from "@/components/board/BoardSidebar";
import {BoardViewProvider} from "@/context/BoardViewContext";
import {BoardContent} from "@/components/board/BoardContent";
import Link from "next/link";
import {OptionsDropDownMenu} from "@/components/auth/OptionsDropDownMenu";

const Page = () => {
    return (
        <div className="h-full">
            <SidebarProvider className="h-full">
                <BoardViewProvider>
                    <BoardSidebar />
                    <SidebarInset>
                        <div className="flex h-full flex-col">
                            <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
                                <header className="flex justify-between items-center w-full p-4 shrink-0">
                                    <Link href="/" className="text-lg font-semibold">
                                        Collab Board
                                    </Link>
                                    <OptionsDropDownMenu />
                                </header>
                            </header>
                            <div className="flex-1 overflow-auto">
                                <BoardContent />
                            </div>
                        </div>
                    </SidebarInset>
                </BoardViewProvider>
            </SidebarProvider>
        </div>
    );
};

export default Page;