import { RedisCacheKeys } from "@/consts/redis";
import { BoardUser, boardUserSchema } from "@/types/board";
import { prisma } from "@/lib/prisma";
import { getRedisClient } from "@/lib/redis";
import {z} from "zod";

const CACHE_TTL = 600;

export class RedisBoardUserService {
    static getBoardUsersCacheKey(boardId: string) {
        return `${RedisCacheKeys.USERS}:${boardId}`;
    }

    private static async fetchUsersFromDb(boardId: string): Promise<BoardUser[]> {
        const boardUsers = await prisma.boardUser.findMany({
            where: { boardId },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!boardUsers || boardUsers.length === 0) {
            throw new Error("Board users not found");
        }

        return z.array(boardUserSchema).parse(boardUsers);
    }

    static async getBoardUsers(boardId: string): Promise<BoardUser[]> {
        const redis = await getRedisClient();
        const cacheKey = this.getBoardUsersCacheKey(boardId);

        const cached = await redis.get(cacheKey);
        if (cached) {
            return z.array(boardUserSchema).parse(JSON.parse(cached));
        }

        const parsed = await this.fetchUsersFromDb(boardId);
        await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(parsed));

        return parsed;
    }

    static async refreshBoardUsersCache(boardId: string): Promise<BoardUser[]> {
        const redis = await getRedisClient();
        const cacheKey = this.getBoardUsersCacheKey(boardId);

        const freshData = await this.fetchUsersFromDb(boardId);
        await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(freshData));

        return freshData;
    }

    static async invalidateBoard(boardId: string): Promise<void> {
        const redis = await getRedisClient();
        await redis.del(this.getBoardUsersCacheKey(boardId));
    }
}
