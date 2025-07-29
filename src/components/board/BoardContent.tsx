"use client"

import { useBoardView } from "@/context/BoardViewContext";
import {KanbanBoard} from "@/components/board/KanbanBoard";
import {useParams} from "next/navigation";

export function BoardContent() {
    const params = useParams();
    const id = params.id as string;

    const { view } = useBoardView();

    switch (view) {
        case "board":
            return <KanbanBoard boardId={id} />;
        case "users":
            return (
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Users</h1>
                    <p>Users content goes here...</p>
                </div>
            );
        default:
            return (
                <div className="p-6">
                    <p>Unknown view</p>
                </div>
            );
    }
}
