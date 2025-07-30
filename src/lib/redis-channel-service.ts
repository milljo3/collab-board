import {RedisCacheKeys} from "@/consts/redis";
import {getRedisClient} from "@/lib/redis";

export class RedisChannelService {
    private static getBoardCacheKey(boardId: string) {
        return `${RedisCacheKeys.BOARD}:update:${boardId}`;
    }

    private static getAllBoardsCacheKey(boardId: string) {
        return `${RedisCacheKeys.BOARDS}:update:${boardId}`;
    }

    private static getBoardUsersCacheKey(boardId: string) {
        return `${RedisCacheKeys.USERS}:update:${boardId}`;
    }

    static async updateBoard(boardId: string) {
        const redis = await getRedisClient();
        await redis.publish(this.getBoardCacheKey(boardId), "updated");
    }

    static async updateAllBoards(boardId: string) {
        const redis = await getRedisClient();
        await redis.publish(this.getAllBoardsCacheKey(boardId), "updated");
    }

    static async updateBoardUsers(boardId: string) {
        const redis = await getRedisClient();
        await redis.publish(this.getBoardUsersCacheKey(boardId), "updated");
    }
}