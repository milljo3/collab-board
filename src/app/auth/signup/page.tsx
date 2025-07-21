import Link from "next/link";
import SignUpForm from "@/components/auth/SignUpForm";

function Page() {
    return (
        <div className="flex items-center justify-center h-dvh">
            <div className="px-8 py-16 container mx-auto max-w-screen-lg space-y-8 flex items-center justify-center w-full">
                <div className="space-y-8 w-full self-center">
                    <div className="space-y-6 text-center">
                        <h1 className="text-6xl font-bold">Collab Board</h1>
                        <h1 className="text-3xl font-bold">Sign Up</h1>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-4">
                        <SignUpForm />
                        <p className="text-sm text-center">
                            Already have an account?{" "}
                            <Link href="/auth/login">
                                Login
                            </Link>
                        </p>
                        <hr className="max-w-sm" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;