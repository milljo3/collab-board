"use client"

import { useBoardView } from "@/context/BoardViewContext";
import Board from "@/components/board/Board";

export function BoardContent() {
    const { view } = useBoardView();

    switch (view) {
        case "board":
            return <Board />;
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
