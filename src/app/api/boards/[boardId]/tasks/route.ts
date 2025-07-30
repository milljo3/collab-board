import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {RedisUserService} from "@/lib/redis-user-service";
import {createTaskSchema} from "@/types/board";
import {RedisBoardService} from "@/lib/redis-board-service";
import {prisma} from "@/lib/prisma";
import {POSITION_CONFIG} from "@/consts/position";
import {RedisChannelService} from "@/lib/redis-channel-service";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const boardId = getBoardId(req);

        const access = await RedisUserService.requireBoardAccess(boardId, session.user.id, "CREATE_TASK");
        if (!access) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const body = await req.json();
        const parsed = createTaskSchema.parse(body);


        const lastTask = await prisma.task.findFirst({
            where: { categoryId: parsed.categoryId },
            orderBy: { position: 'desc' },
            select: { position: true }
        });

        const newPosition = lastTask
            ? lastTask.position + POSITION_CONFIG.GAP
            : POSITION_CONFIG.INITIAL_POSITION;

        const task = await prisma.task.create({
            data: {
                description: parsed.description,
                position: newPosition,
                categoryId: parsed.categoryId,
            }
        });

        await RedisBoardService.refreshBoardCache(boardId);
        await RedisChannelService.updateBoard(boardId);

        return NextResponse.json(task);
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