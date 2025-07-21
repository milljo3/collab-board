import SendVerificationEmailForm from "@/components/auth/SendVerificationEmailForm";
import {redirect} from "next/navigation";

interface PageProps {
    searchParams: Promise<{error: string}>
}

async function Page({searchParams}: PageProps) {
    const error = (await searchParams).error;

    if (!error) redirect("/dashboard");

    return (
        <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8">
            <div className="space-y-8">
                <h1 className="text-3xl font-bold">Verify Email</h1>
            </div>
            <p className="text-destructive">
                {
                    error === "invalid_token" || error === "token_expired"
                        ? "Your token is invalid or expired. Please request a new one."
                        : error === "email_not_verified"
                            ? "Please verify your email, or request a new verification below."
                            : "Oops! Something went wrong. Please try again."
                }
            </p>
            <SendVerificationEmailForm />
        </div>
    );
}

export default Page;