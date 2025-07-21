"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";

import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import SignInOAuthButton from "@/components/auth/SignInOAuthButton";

const signUpSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
    const router = useRouter();

    const form = useForm<SignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (data: SignUpSchema) => {
        const name = data.email.split("@")[0];

        await signUp.email(
            {
                name,
                email: data.email,
                password: data.password,
            },
            {
                onRequest: () => {},
                onResponse: () => {},
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
                onSuccess: () => {
                    toast.success("Sign up complete. Please verify your email.");
                    router.push("/auth/signup/success");
                },
            }
        );
    };

    return (
        <div className="flex flex-col gap-4 w-full justify-center items-center">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    noValidate
                    className="max-w-sm space-y-4 px-4 w-full"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="you@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Signing up..." : "Sign up"}
                    </Button>
                </form>
            </Form>

            <hr className="max-w-sm w-full" />

            <div className="max-w-sm space-y-3 px-4 w-full flex flex-col">
                <SignInOAuthButton provider="google" signUp />
                <SignInOAuthButton provider="github" signUp />
            </div>
        </div>
    );
};

export default SignUpForm;