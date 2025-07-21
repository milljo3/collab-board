"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {SettingsIcon} from "lucide-react";
import {signOut, useSession} from "@/lib/auth-client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

export function OptionsDropDownMenu() {
    const {data: session} = useSession();
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onRequest: () => {
                    setIsPending(true);
                },
                onResponse: () => {
                    setIsPending(false);
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message)
                },
                onSuccess: () => {
                    toast.success("You've logged out. See you soon!");
                    router.push("/auth/login");
                }
            }
        });
    }

    const handleProfile = () => {
        router.push("/profile");
    }

    if (!session) {
        return (
            <></>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <SettingsIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleProfile}>
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleSignOut} disabled={isPending}>
                        Sign Out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
