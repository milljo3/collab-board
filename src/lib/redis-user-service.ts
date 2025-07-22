import {RedisCacheKeys} from "@/consts/redis";
import {prisma} from "@/lib/prisma";
import {getRedisClient} from "@/lib/redis";
import { Role } from "@prisma/client";

const CACHE_TTL = 600;

export class RedisUserService {
    private static readonly ROLE_HIERARCHY = {
        [Role.OWNER]: 3,
        [Role.EDITOR]: 2,
        [Role.VIEWER]: 1
    };

    private static readonly PERMISSIONS = {
        VIEW_BOARD: Role.VIEWER,
        EDIT_BOARD: Role.EDITOR,
        DELETE_BOARD: Role.OWNER,
        MANAGE_USERS: Role.OWNER,
        CREATE_CATEGORY: Role.EDITOR,
        EDIT_CATEGORY: Role.EDITOR,
        DELETE_CATEGORY: Role.EDITOR,
        CREATE_TASK: Role.EDITOR,
        EDIT_TASK: Role.EDITOR,
        DELETE_TASK: Role.EDITOR
    } as const;

    static getUsersCacheKey(boardId: string, userId: string) {
        return `${RedisCacheKeys.USERS}:${boardId}:${userId}`;
    }

    private static async getUserRole(boardId: string, userId: string): Promise<Role> {
        const redis = await getRedisClient();
        const cacheKey = this.getUsersCacheKey(boardId, userId);

        const cached = await redis.get(cacheKey) as Role;
        if (cached) {
            return cached;
        }

        const boardUser = await prisma.boardUser.findUnique({
            where: {
                userId_boardId: { userId, boardId }
            }
        });

        if (!boardUser) {
            await redis.setEx(cacheKey, CACHE_TTL, 'NO_ACCESS');
            throw new Error("User not found on board");
        }

        await redis.setEx(cacheKey, CACHE_TTL, boardUser.role);
        return boardUser.role;
    }

    static async requireBoardAccess(boardId: string, userId: string, requiredPermission: keyof typeof RedisUserService.PERMISSIONS) {
        const userRole = await this.getUserRole(boardId, userId);
        const requiredRole = this.PERMISSIONS[requiredPermission];

        if (this.ROLE_HIERARCHY[userRole] < this.ROLE_HIERARCHY[requiredRole]) {
            throw new Error("Insufficient permissions");
        }

        return true;
    }

    // Call in user routes (updated role / deleting a user)
    static async invalidateUserRole(boardId: string, userId: string) {
        const redis = await getRedisClient();
        await redis.del(this.getUsersCacheKey(boardId, userId));
    }
}