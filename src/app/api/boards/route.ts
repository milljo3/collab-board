import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {RedisAllBoardService} from "@/lib/redis-board-service";
import {createBoardSchema} from "@/types/board";

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const boards = await RedisAllBoardService.getAllBoards(session.user.id);
        if (!boards) return NextResponse.json({ error: "Error getting boards"}, { status: 404 });

        return NextResponse.json(boards);
    }
    catch(err) {
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

        const body = await req.json();
        const parsed = createBoardSchema.parse(body);

        await RedisAllBoardService.createBoard(session.user.id, parsed.title);

        return NextResponse.json("Board created successfully.");
    }
    catch(err) {
        console.log(err);
        return NextResponse.json({ error: "Internal Server Error"}, { status: 500 });
    }
}