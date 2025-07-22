import { getRedisClient } from './redis';
import { prisma } from './prisma';
import {RedisCacheKeys} from "@/consts/redis";
import {Board, boardSchema, GetAllBoards, getAllBoardsSchema, UpdateBoard} from "@/types/board";
import {Role} from "@prisma/client";

const CACHE_TTL = 600;

export class RedisBoardService {
    static getBoardCacheKey(boardId: string) {
        return `${RedisCacheKeys.BOARD}:${boardId}`;
    }

    private static async fetchBoardFromDb(boardId: string): Promise<Board> {
        const board = await prisma.board.findUnique({
            where: { id: boardId },
            include: {
                categories: {
                    include: { tasks: true },
                },
                users: true
            },
        });

        if (!board) {
            throw new Error("Board not found");
        }

        return boardSchema.parse(board);
    }

    static async getBoard(boardId: string): Promise<Board> {
        const redis = await getRedisClient();
        const cacheKey = this.getBoardCacheKey(boardId);

        const cached = await redis.get(cacheKey);
        if (cached) {
            return boardSchema.parse(JSON.parse(cached));
        }

        const parsed = await this.fetchBoardFromDb(boardId);
        await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(parsed));

        return parsed;
    }

    static async refreshBoardCache(boardId: string) {
        const redis = await getRedisClient();
        const cacheKey = this.getBoardCacheKey(boardId);

        const freshData = await this.fetchBoardFromDb(boardId);
        await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(freshData));

        return freshData;
    }

    static async updateBoard(boardId: string, newData: UpdateBoard): Promise<Board> {
        await prisma.board.update({
            where: { id: boardId },
            data: newData,
        });

        const freshBoard = await this.refreshBoardCache(boardId);

        const userIds = freshBoard.users.map((user) => user.userId);
        await Promise.all(userIds.map(userId =>
            RedisAllBoardService.invalidateAllBoards(userId)
        ));

        return freshBoard;
    }

    static async invalidateBoard(boardId: string) {
        const redis = await getRedisClient();
        await redis.del(this.getBoardCacheKey(boardId));
    }
}

export class RedisAllBoardService {
    static getAllBoardsCacheKey(userId: string) {
        return `${RedisCacheKeys.BOARDS}:${userId}`;
    }

    private static async fetchAllBoardsFromDb(userId: string): Promise<GetAllBoards> {
        const boards = await prisma.boardUser.findMany({
            where: { userId },
            select: {
                board: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            }
        });

        return getAllBoardsSchema.parse(boards.map(entry => entry.board));
    }

    static async getAllBoards(userId: string): Promise<GetAllBoards> {
        const redis = await getRedisClient();
        const cacheKey = this.getAllBoardsCacheKey(userId);

        const cached = await redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const parsed = await this.fetchAllBoardsFromDb(userId);
        await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(parsed));

        return parsed;
    }

    static async refreshAllBoardsCache(userId: string): Promise<void> {
        const redis = await getRedisClient();
        const cacheKey = this.getAllBoardsCacheKey(userId);

        const freshData = await this.fetchAllBoardsFromDb(userId);
        await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(freshData));
    }

    static async createBoard(userId: string, title: string): Promise<void> {
        await prisma.board.create({
            data: {
                title,
                users: {
                    create: {
                        userId,
                        role: Role.OWNER,
                    }
                }
            }
        });

        await this.refreshAllBoardsCache(userId);
    }

    static async invalidateAllBoards(userId: string) {
        const redis = await getRedisClient();
        await redis.del(this.getAllBoardsCacheKey(userId));
    }
}
