import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../node_modules/@prisma/client";
import {sendEmailAction} from "@/actions/send-email.action";

const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
        autoSignIn: false,
        requireEmailVerification: true,
        sendResetPassword: async ({user, url}) => {
            await sendEmailAction({
                to: user.email,
                subject: "Reset Your Password",
                meta: {
                    description: "Please click the link below to reset your password.",
                    link: url
                }
            });
        }
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({user, url}) => {
            const link = new URL(url);
            link.searchParams.set("callbackURL", "/auth/verify");

            await sendEmailAction({
                to: user.email,
                subject: "Verify Your Email Address",
                meta: {
                    description: "Please verify your email address to complete registration.",
                    link: String(link),
                }
            })
        }
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        }
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";