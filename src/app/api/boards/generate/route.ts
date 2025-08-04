import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import {generateBoardPromptSchema} from "@/types/board";
import {RedisAllBoardService} from "@/lib/redis-board-service";
import {generateBoard} from "@/lib/open-router";
import {prisma} from "@/lib/prisma";
import {POSITION_CONFIG} from "@/consts/position";

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
        }

        const body = await req.json();
        const parsed = generateBoardPromptSchema.parse(body);

        const generatedBoard = await generateBoard(parsed.prompt, parsed.includeTasks);

        await prisma.board.create({
            data: {
                title: generatedBoard.title || "Untitled Board",
                users: {
                    create: {
                        userId: session.user.id,
                        role: "OWNER"
                    }
                },
                categories: {
                    create: generatedBoard.categories.map((category, categoryIndex) => ({
                        title: category.title,
                        position: (categoryIndex + 1) * POSITION_CONFIG.GAP,
                        tasks: {
                            create: category.tasks.map((task, taskIndex) => ({
                                description: task.description,
                                position: (taskIndex + 1) * POSITION_CONFIG.GAP
                            }))
                        }
                    }))
                }
            }
        });

        await RedisAllBoardService.refreshAllBoardsCache(session.user.id);

        return NextResponse.json("Board created successfully.");
    }
    catch(err) {
        console.log(err);
        return NextResponse.json({ error: "Internal Server Error"}, { status: 500 });
    }
}