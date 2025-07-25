import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {RedisUserService} from "@/lib/redis-user-service";
import {prisma} from "@/lib/prisma";
import {deleteTaskCategory} from "@/types/board";

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        const boardId = getBoardId(req);

        const access = await RedisUserService.requireBoardAccess(boardId, session.user.id, "DELETE_CATEGORY");
        if (!access) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        const categoryId = getCategoryId(req);
        const body = await req.json();
        const parsed = deleteTaskCategory.parse(body);

        await prisma.category.delete({
            where: {id: categoryId, version: parsed.version},
        });

        return NextResponse.json("Category deleted successfully.");
    }
    catch(err) {
        console.log(err);
        return NextResponse.json({ error: "Internal Server Error", status: 500 });
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
        throw new Error("Category not found");
    }

    return id;
}