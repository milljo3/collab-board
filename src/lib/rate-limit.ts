import { BetterAuthRedisUtils } from '@/lib/redis-better-auth';
import { NextRequest } from 'next/server';

export async function checkRateLimit(
    request: NextRequest,
    action: string,
    maxAttempts: number = 5,
    windowSeconds: number = 300
) {
    const ip =
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'anonymous';

    return await BetterAuthRedisUtils.checkRateLimit(
        ip,
        action,
        maxAttempts,
        windowSeconds
    );
}