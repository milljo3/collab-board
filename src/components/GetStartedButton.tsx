"use client"

import {Button} from "@/components/ui/button";
import Link from "next/link";
import {useSession} from "@/lib/auth-client";

const GetStartedButton = () => {
    const {data: session, isPending} = useSession();

    const href = session ? "/dashboard" : "/auth/login";

    return (
        <Button size="lg" disabled={isPending}>
            <Link href={href}>
                Get Started
            </Link>
        </Button>
    );
};

export default GetStartedButton;