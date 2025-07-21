import { getRedisClient } from './redis';

export class BetterAuthRedisUtils {
    private static getRateLimitKey(identifier: string, action: string): string {
        return `rate_limit:${action}:${identifier}`;
    }

    static async checkRateLimit(
        identifier: string,
        action: string,
        maxAttempts: number = 5,
        windowSeconds: number = 300
    ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
        try {
            const redis = await getRedisClient();
            const key = this.getRateLimitKey(identifier, action);

            const wasSet = await redis.set(key, "1", { NX: true, EX: windowSeconds });
            let attempts = 1;

            if (!wasSet) {
                attempts = await redis.incr(key);
            }

            const ttl = await redis.ttl(key);

            if (attempts > maxAttempts) {
                return {
                    allowed: false,
                    remaining: 0,
                    resetTime: Date.now() + ttl * 1000
                };
            }

            return {
                allowed: true,
                remaining: maxAttempts - attempts,
                resetTime: Date.now() + ttl * 1000
            };
        }
        catch (error) {
            console.error('Error checking rate limit:', error);
            return { allowed: true, remaining: 0, resetTime: 0 };
        }
    }
}