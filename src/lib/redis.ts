import { createClient } from 'redis';

let redis: ReturnType<typeof createClient> | null = null;

export const getRedisClient = async () => {
    if (!redis) {
        if (!process.env.REDIS_URL) {
            throw new Error('REDIS_URL environment variable is not set');
        }

        redis = createClient({
            url: process.env.REDIS_URL,
        });

        redis.on('error', (err) => {
            console.error('Redis Client Error', err);
        });

        redis.on('connect', () => {
            console.log('Redis Client Connected');
        });

        await redis.connect();
    }

    return redis;
};