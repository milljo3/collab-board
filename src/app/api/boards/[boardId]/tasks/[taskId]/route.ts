import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {RedisUserService} from "@/lib/redis-user-service";
import {prisma} from "@/lib/prisma";
import {deleteTaskCategory, updateTaskSchema} from "@/types/board";
import {RedisBoardService} from "@/lib/redis-board-service";
import {RedisChannelService} from "@/lib/redis-channel-service";

interface UpdateTaskData {
    version: {
        increment: number;
    };
    title?: string;
    details?: string | null;
    position?: number;
    categoryId?: string;
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const boardId = getBoardId(req);

        const access = await RedisUserService.requireBoardAccess(boardId, session.user.id, "EDIT_TASK");
        if (!access) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const taskId = getTaskId(req);
        const body = await req.json();
        const parsed = updateTaskSchema.parse(body);

        const existingTask = await prisma.task.findFirst({
            where: {
                id: taskId,
                category: {
                    boardId
                }
            },
            include: {
                category: true
            }
        });

        if (!existingTask) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        if (parsed.categoryId && parsed.categoryId !== existingTask.categoryId) {
            const targetCategory = await prisma.category.findFirst({
                where: {
                    id: parsed.categoryId,
                    boardId: boardId
                }
            });

            if (!targetCategory) {
                return NextResponse.json({
                    error: "Target category not found or doesn't belong to this board"
                }, { status: 400 });
            }
        }

        const updateData: UpdateTaskData = {
            version: {
                increment: 1
            },
        };

        if (parsed.title !== undefined) {
            updateData.title = parsed.title;
        }

        if (parsed.details !== undefined) {
            updateData.details = parsed.details;
        }

        if (parsed.position !== undefined) {
            updateData.position = parsed.position;
        }

        if (parsed.categoryId !== undefined) {
            updateData.categoryId = parsed.categoryId;
        }

        const updatedTask = await prisma.task.update({
            where: {
                id: taskId,
                version: parsed.version
            },
            data: updateData
        });

        await RedisBoardService.refreshBoardCache(boardId);
        await RedisChannelService.updateBoard(boardId);

        return NextResponse.json(updatedTask);
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

        const access = await RedisUserService.requireBoardAccess(boardId, session.user.id, "DELETE_TASK");
        if (!access) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const taskId = getTaskId(req);
        const body = await req.json();
        const parsed = deleteTaskCategory.parse(body);

        await prisma.task.delete({
            where: {id: taskId, version: parsed.version},
        });

        await RedisBoardService.refreshBoardCache(boardId);
        await RedisChannelService.updateBoard(boardId);

        return NextResponse.json("Task deleted successfully.");
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

function getTaskId(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
        throw new Error("Task not found");
    }

    return id;
}