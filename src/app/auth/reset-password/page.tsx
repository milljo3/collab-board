import {redirect} from "next/navigation";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

interface PageProps {
    searchParams: Promise<{token: string}>
}

async function Page({ searchParams }: PageProps) {
    const token = (await searchParams).token;

    if (!token) {
        redirect("/auth/login");
    }

    return (
        <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8 h-dvh flex flex-col justify-center items-center">
            <div className="flex flex-col gap-4">
                <div className="space-y-8">
                    <h1 className="text-3xl font-bold">Reset Password</h1>
                </div>
                <p className="text-muted-foreground">
                    Please enter your new password. Make sure it is at least 6 characters.
                </p>
                <ResetPasswordForm token={token} />
            </div>
        </div>
    );
}

export default Page;