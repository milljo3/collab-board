import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function Page() {
    return (
        <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8 h-dvh flex justify-center items-center">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold">Forgot Password</h1>
                <p className="text-muted-foreground">
                    Please enter your email address to receive a password reset link.
                </p>
                <ForgotPasswordForm />
            </div>
        </div>
    );
}