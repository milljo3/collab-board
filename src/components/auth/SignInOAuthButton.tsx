"use client"

import {Button} from "@/components/ui/button";
import {useState} from "react";
import {signIn} from "@/lib/auth-client";
import {toast} from "sonner";

interface SignInOauthButtonProps {
    provider: "google" | "github";
    signUp?: boolean;
}


const SignInOauthButton = ({provider, signUp}: SignInOauthButtonProps) => {
    const [isPending, setIsPending] = useState(false);

    async function handleClick() {
        await signIn.social({
            provider,
            callbackURL: "/dashboard",
            errorCallbackURL: "/auth/login/error",
            fetchOptions: {
                onRequest: () => {
                    setIsPending(true);
                },
                onResponse: () => {
                    setIsPending(false);
                },
                onError: () => {
                    toast.error("Something went wrong. Please try again later.");
                }
            }
        })
    }

    const action = signUp ? "Up" : "In";
    const providerName = provider === "google" ? "Google" : "GitHub";

    return (
        <Button onClick={handleClick} disabled={isPending} className="cursor-pointer">
            Sign {action} with {providerName}
        </Button>
    );
};

export default SignInOauthButton;