import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import UpdateUserForm from "@/components/auth/UpdateUserForm";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import ReturnButton from "@/components/ReturnButton";

const Page = async () => {
    const headersList = await headers()

    const session = await auth.api.getSession({
        headers: headersList
    });

    if (!session) {
        redirect("/auth/login");
    }

    return (
        <div className="px-8 md:pt-32 pt-20 pb-10 container mx-auto max-w-screen-lg space-y-8">
            <div className="space-y-8">
                <h1 className="text-3xl font-bold">Profile</h1>
            </div>

            <div className="space-y-4 p-4 rounded-md border">
                <h2 className="text-2xl font-bold">Update User</h2>
                <UpdateUserForm
                    name={session.user.name}
                />
            </div>

            <div className="space-y-4 p-4 rounded-md border">
                <h2 className="text-2xl font-bold">Change Password</h2>
                <ChangePasswordForm />
            </div>

            <ReturnButton
                href="/dashboard"
                className="absolute md:top-12 lg:left-40 md:left-20 w-[120px] p-0 hidden md:block"
            />
        </div>
    );
};

export default Page;