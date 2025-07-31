import {headers} from "next/headers";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import Dashboard from "@/components/dashboard/Dashboard";

const Page = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/auth/login");
    }

    return (
        <Dashboard username={session.user.name} />
    );
};

export default Page;