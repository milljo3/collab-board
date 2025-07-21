"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendVerificationEmail } from "@/lib/auth-client";

const emailSchema = z.object({
    email: z.email("Invalid email address"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const SendVerificationEmailForm = () => {
    const router = useRouter();

    const form = useForm<EmailFormValues>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: "",
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async ({ email }: EmailFormValues) => {
        await sendVerificationEmail({
            email,
            callbackURL: "/auth/verify",
            fetchOptions: {
                onRequest: () => {},
                onResponse: () => {},
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
                onSuccess: () => {
                    toast.success("Verification email successfully sent.");
                    router.push("/auth/verify/success");
                },
            },
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
                className="max-w-sm w-full space-y-4"
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
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Resend Verification Email"}
                </Button>
            </form>
        </Form>
    );
};

export default SendVerificationEmailForm;