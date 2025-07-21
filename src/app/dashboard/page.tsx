import {headers} from "next/headers";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";

const Page = async () => {
    const headersList = await headers()

    const session = await auth.api.getSession({
        headers: headersList
    });

    if (!session) {
        redirect("/auth/login");
    }

    return (
        <div>
            DASHBOARD        
        </div>
    );
};

export default Page;