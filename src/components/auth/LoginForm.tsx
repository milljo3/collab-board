"use client";

import { signIn } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {useState} from "react";
import {useRouter} from "next/navigation";
import SignInOAuthButton from "@/components/auth/SignInOAuthButton";
import Link from "next/link";

export const LoginForm = () => {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault();

        const formData = new FormData(evt.currentTarget);

        const email = String(formData.get("email"));
        if (!email) return toast.error("Please enter your email");

        const password = String(formData.get("password"));
        if (!password) return toast.error("Please enter your password");

        await signIn.email(
            {
                email,
                password,
            },
            {
                onRequest: () => {
                    setIsPending(true);
                },
                onResponse: () => {
                    setIsPending(false);
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
                onSuccess: () => {
                    toast.success("Successfully signed in");
                    router.push("/dashboard");
                },
            }
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full justify-center items-center">
            <form onSubmit={handleSubmit} className="max-w-sm space-y-3 px-4 w-full">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" name="email" />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Link
                            href="/auth/forgot-password"
                            className="text-sm italic text-muted-foreground hover:text-foreground"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <Input type="password" id="password" name="password" />
                </div>

                <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
                    Login
                </Button>
            </form>

            <hr className="max-w-sm w-full" />

            <div className="max-w-sm space-y-3 px-4 w-full flex flex-col">
                <SignInOAuthButton provider={"google"} />
                <SignInOAuthButton provider={"github"} />
            </div>
        </div>

    );
};