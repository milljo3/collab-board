"use server"

import {APIError} from "better-auth/api";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";

export async function changePasswordAction(formData: FormData) {
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");

    if (typeof currentPassword !== "string" || !currentPassword.trim()) {
        return { error: "Please enter your current password" };
    }

    if (typeof newPassword !== "string" || !newPassword.trim()) {
        return { error: "Please enter your new password" };
    }

    try {
        await auth.api.changePassword({
            headers: await headers(),
            body: {
                currentPassword,
                newPassword
            }
        });
        return {
            error: null
        }
    }
    catch (err) {
        if (err instanceof APIError) {
            return {
                error: err.message
            }
        }

        return {
            error: "Internal Server Error"
        }
    }
}