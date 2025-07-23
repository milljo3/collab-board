import {UpdateBoard} from "@/types/board";

export const updateBoard = async (boardId: string, updateBoard: UpdateBoard) => {
    const response = await fetch(`/api/boards/${boardId}`, {
        method: 'PATCH',
        body: JSON.stringify(updateBoard),
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to update board");

    return await response.json();
}