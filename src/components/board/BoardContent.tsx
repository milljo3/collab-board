"use client"

import { useBoardView } from "@/context/BoardViewContext";
import {KanbanBoard} from "@/components/board/KanbanBoard";
import {useParams} from "next/navigation";
import Users from "@/components/board/users/Users";
import {useBoardSocket} from "@/hooks/web-sockets/useBoardSocket";

interface BoardContentProps {
    userId: string;
}

export function BoardContent({ userId }: BoardContentProps) {
    const params = useParams();
    const id = params.id as string;

    const { view } = useBoardView();

    useBoardSocket(id);

    switch (view) {
        case "board":
            return <KanbanBoard boardId={id} />;
        case "users":
            return (
                <Users userId={userId} boardId={id} />
            );
        default:
            return (
                <div className="p-6">
                    <p>Unknown view</p>
                </div>
            );
    }
}
