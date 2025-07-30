import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {RedisUserService} from "@/lib/redis-user-service";
import {RedisBoardUserService} from "@/lib/redis-board-user-service";
import {addBoardUserSchema} from "@/types/board";
import { prisma } from "@/lib/prisma";
import {RedisAllBoardService} from "@/lib/redis-board-service";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const boardId = getBoardId(req);

        const access = await RedisUserService.requireBoardAccess(boardId, session.user.id, "VIEW_BOARD");
        if (!access) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const boardUsers = await RedisBoardUserService.getBoardUsers(boardId);
        if (!boardUsers) return NextResponse.json({ error: "Error getting board users"}, { status: 404 });

        return NextResponse.json(boardUsers);
    }
    catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Internal Server Error"}, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const boardId = getBoardId(req);

        const access = await RedisUserService.requireBoardAccess(boardId, session.user.id, "MANAGE_USERS");
        if (!access) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const body = await req.json();
        const parsed = addBoardUserSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: {email: parsed.email},
        });

        if (!user) return NextResponse.json({ error: "User not found."}, { status: 404 });

        const existing = await prisma.boardUser.findUnique({
            where: {
                userId_boardId: {
                    userId: user.id,
                    boardId: boardId,
                },
            },
        });

        if (existing) {
            return NextResponse.json({ error: "User already in board."}, { status: 400 });
        }

        const boardUser = await prisma.boardUser.create({
            data: {
                boardId,
                userId: user.id,
                role: parsed.role,
            },
        });

        await RedisBoardUserService.refreshBoardUsersCache(boardId);
        await RedisAllBoardService.refreshAllBoardsCache(user.id);
        await RedisChannelService.updateBoardUsers(boardId);

        return NextResponse.json(boardUser);
    }
    catch (err) {
        console.log(err);
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