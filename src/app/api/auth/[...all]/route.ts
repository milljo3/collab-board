import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextRequest } from "next/server";

const rateLimits: Record<string, { maxAttempts: number; windowSeconds: number }> = {
    'sign-in': { maxAttempts: 5, windowSeconds: 300 },
    'sign-up': { maxAttempts: 3, windowSeconds: 600 },
    'reset-password': { maxAttempts: 3, windowSeconds: 3600 },
    'send-verification-email': { maxAttempts: 2, windowSeconds: 300 },
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
async function rateLimitWrapper(request: NextRequest, handler: Function) {
    const url = new URL(request.url);
    const action = url.pathname.split('/').pop();

    if (action && rateLimits[action]) {
        const rateConfig = rateLimits[action];
        const rateLimitResult = await checkRateLimit(
            request,
            `auth:${action}`,
            rateConfig.maxAttempts,
            rateConfig.windowSeconds
        );

        if (!rateLimitResult.allowed) {
            return new Response(
                JSON.stringify({
                    error: 'Too many attempts. Please try again later.',
                    resetTime: rateLimitResult.resetTime,
                    remaining: rateLimitResult.remaining
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RateLimit-Limit': rateConfig.maxAttempts.toString(),
                        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                        'X-RateLimit-Reset': Math.ceil(rateLimitResult.resetTime / 1000).toString(),
                    }
                }
            );
        }
    }

    return handler(request);
}

const betterAuthHandler = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
    return rateLimitWrapper(request, betterAuthHandler.GET);
}

export async function POST(request: NextRequest) {
    return rateLimitWrapper(request, betterAuthHandler.POST);
}