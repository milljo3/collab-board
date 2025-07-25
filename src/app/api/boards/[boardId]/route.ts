import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {RedisBoardService} from "@/lib/redis-board-service";
import {RedisUserService} from "@/lib/redis-user-service";
import {updateBoardSchema} from "@/types/board";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        const id = getBoardId(req);

        const access = await RedisUserService.requireBoardAccess(id, session.user.id, "VIEW_BOARD");
        if (!access) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        const board = await RedisBoardService.getBoard(id);
        if (!board) return NextResponse.json({ error: "Error getting board", status: 404 });

        return NextResponse.json(board);
    }
    catch(err) {
        console.log(err);
        return NextResponse.json({ error: "Internal Server Error", status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        const id = getBoardId(req);

        const access = await RedisUserService.requireBoardAccess(id, session.user.id, "EDIT_BOARD_TITLE");
        if (!access) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        const body = await req.json();
        const parsed = updateBoardSchema.parse(body);
        await RedisBoardService.updateBoard(id, parsed)

        return NextResponse.json("Board title updated successfully.");
    }
    catch(err) {
        console.log(err);
        return NextResponse.json({ error: "Internal Server Error", status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        const id = getBoardId(req);

        const access = await RedisUserService.requireBoardAccess(id, session.user.id, "DELETE_BOARD");
        if (!access) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        await RedisBoardService.deleteBoard(id);

        return NextResponse.json("Board deleted successfully.");
    }
    catch(err) {
        console.log(err);
        return NextResponse.json({ error: "Internal Server Error", status: 500 });
    }
}

function getBoardId(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
        throw new Error("Board not found");
    }

    return id;
}