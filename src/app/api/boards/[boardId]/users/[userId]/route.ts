import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"
import { updateBoardUserSchema } from "@/types/board";
import { RedisUserService } from "@/lib/redis-user-service";
import {RedisBoardUserService} from "@/lib/redis-board-user-service";
import {Role} from "@prisma/client";
import {RedisAllBoardService} from "@/lib/redis-board-service";

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const boardId = getBoardId(req);
        const targetUserId = getUserId(req);

        if (session.user.id === targetUserId) {
            return NextResponse.json({ error: "You cannot modify your own role."}, { status: 403 });
        }

        const access = await RedisUserService.requireBoardAccess(boardId, session.user.id, "MANAGE_USERS");
        if (!access) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const body = await req.json();
        const parsed = updateBoardUserSchema.parse(body);

        if (parsed.role === Role.OWNER) {
            return NextResponse.json({ error: "Can't add another owner"}, { status: 401 });
        }

        const updated = await prisma.boardUser.update({
            where: {
                userId_boardId: {
                    userId: targetUserId,
                    boardId: boardId,
                },
            },
            data: {
                role: parsed.role,
            },
        });

        await RedisBoardUserService.refreshBoardUsersCache(boardId);
        await RedisUserService.invalidateUserRole(boardId, targetUserId);
        await RedisChannelService.updateBoardUsers(boardId);

        return NextResponse.json({ success: true, boardUser: updated });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error"}, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const boardId = getBoardId(req);
        const targetUserId = getUserId(req);

        if (session.user.id === targetUserId) {
            return NextResponse.json({ error: "You cannot remove yourself."}, { status: 403 });
        }

        const access = await RedisUserService.requireBoardAccess(boardId, session.user.id, "MANAGE_USERS");
        if (!access) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        await prisma.boardUser.delete({
            where: {
                userId_boardId: {
                    userId: targetUserId,
                    boardId: boardId,
                },
            },
        });

        await RedisBoardUserService.refreshBoardUsersCache(boardId);
        await RedisAllBoardService.refreshAllBoardsCache(targetUserId);
        await RedisUserService.invalidateUserRole(boardId, targetUserId);
        await RedisChannelService.updateBoardUsers(boardId);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error"}, { status: 500 });
    }
}

function getBoardId(req: NextRequest) {
    const url = new URL(req.url);
    const split = url.pathname.split("/");

    const id = split[3];
    if (!id) {
        throw new Error("Board not found");
    }

    return id;
}

function getUserId(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
        throw new Error("User not found");
    }

    return id;
}