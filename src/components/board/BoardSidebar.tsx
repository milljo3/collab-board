"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader, useSidebar,
} from "@/components/ui/sidebar"
import {useBoardView} from "@/context/BoardViewContext";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight, CornerDownLeft, LayoutDashboard, Users} from "lucide-react";
import {cn} from "@/lib/utils";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {useRouter} from "next/navigation";

const sidebarItems = [
    { key: "board", label: "Board", icon: LayoutDashboard },
    { key: "users", label: "Users", icon: Users },
] as const;

export function BoardSidebar() {
    const { view, setView } = useBoardView();
    const { open, toggleSidebar } = useSidebar();
    const router = useRouter();

    const dashboardButton = (
        <Button
            size={open ? "default" : "icon"}
            className={cn("justify-start gap-2", !open && "items-center justify-center")}
            onClick={() => router.push("/dashboard")}
            >
            <CornerDownLeft className="h-5 w-5" />
            {open && "Return to Dashboard"}
        </Button>
    );

    return (
        <Sidebar collapsible="icon">
            {open && (
                <SidebarHeader className="flex flex-row px-4 py-2 items-center">
                    <h2 className="font-bold text-lg flex-1 text-center">Navigation</h2>
                    <Button
                        onClick={toggleSidebar}
                        size="icon"
                        variant="ghost"
                        className={cn("transition-transform mx-auto items-center justify-center")}
                    >
                        <ChevronLeft />
                    </Button>
                </SidebarHeader>
            )}

            <SidebarContent>
                {!open && (
                    <SidebarGroup className="flex flex-col gap-1 px-1">
                        <Button
                            onClick={toggleSidebar}
                            size="icon"
                            variant="ghost"
                            className={cn("transition-transform mx-auto items-center justify-center")}
                        >
                            <ChevronRight />
                        </Button>
                    </SidebarGroup>
                )}
                <SidebarGroup className="flex flex-col gap-1 px-1">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = view === item.key;

                        const button = (
                            <Button
                                key={item.key}
                                onClick={() => setView(item.key)}
                                size={open ? "default" : "icon"}
                                variant={isActive ? "default" : "ghost"}
                                className={cn("justify-start gap-2", !open && "items-center justify-center")}
                            >
                                <Icon className="h-5 w-5" />
                                {open && item.label}
                            </Button>
                        );

                        return open ? button : (
                            <Tooltip key={item.key}>
                                <TooltipTrigger asChild>{button}</TooltipTrigger>
                                <TooltipContent side="right">{item.label}</TooltipContent>
                            </Tooltip>
                        )
                    })}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {open ? dashboardButton : (
                    <Tooltip>
                        <TooltipTrigger asChild>{dashboardButton}</TooltipTrigger>
                        <TooltipContent side="right">{"Return to dashboard"}</TooltipContent>
                    </Tooltip>
                )}
            </SidebarFooter>
        </Sidebar>
    )
}