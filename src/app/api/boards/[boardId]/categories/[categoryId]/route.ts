import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {RedisUserService} from "@/lib/redis-user-service";
import {prisma} from "@/lib/prisma";
import {deleteTaskCategory, updateCategorySchema} from "@/types/board";
import {RedisBoardService} from "@/lib/redis-board-service";
import {RedisChannelService} from "@/lib/redis-channel-service";

interface UpdateCategoryData {
    version: {
        increment: number;
    };
    title?: string;
    position?: number;
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const boardId = getBoardId(req);

        const access = await RedisUserService.requireBoardAccess(boardId, session.user.id, "EDIT_CATEGORY");
        if (!access) {
            return NextResponse.json({ error: "Unauthorized"}, {status: 401 });
        }

        const categoryId = getCategoryId(req);
        const body = await req.json();
        const parsed = updateCategorySchema.parse(body);

        const updateData: UpdateCategoryData = {
            version: {
                increment: 1
            },
        };

        if (parsed.title !== undefined) {
            updateData.title = parsed.title;
        }

        if (parsed.position !== undefined) {
            updateData.position = parsed.position;
        }

        const updatedCategory = await prisma.category.update({
            where: {
                id: categoryId,
                version: parsed.version,
                boardId
            },
            data: updateData,
            include: {
                tasks: {
                    orderBy: {
                        position: 'asc'
                    }
                }
            }
        });

        await RedisBoardService.refreshBoardCache(boardId);
        await RedisChannelService.updateBoard(boardId);

        return NextResponse.json(updatedCategory);
    }
    catch (err) {
        console.log(err);
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

        const access = await RedisUserService.requireBoardAccess(boardId, session.user.id, "DELETE_CATEGORY");
        if (!access) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const categoryId = getCategoryId(req);
        const body = await req.json();
        const parsed = deleteTaskCategory.parse(body);

        await prisma.category.delete({
            where: {id: categoryId, version: parsed.version, boardId},
        });

        await RedisBoardService.refreshBoardCache(boardId);
        await RedisChannelService.updateBoard(boardId);

        return NextResponse.json("category deleted successfully.");
    }
    catch(err) {
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

function getCategoryId(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
        throw new Error("category not found");
    }

    return id;
}