import {boardSchema} from "@/types/board";

export const fetchBoard = async (boardId: string) => {
    const response = await fetch(`/api/boards/${boardId}`);
    if (!response.ok) throw new Error("Failed to fetch board");

    const json = await response.json();

    return boardSchema.parse(json);
}