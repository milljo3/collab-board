import {boardUserSchema} from "@/types/board";

export const fetchAllBoardUsers = async (boardId: string) => {
    const response = await fetch(`/api/boards/${boardId}/users`);
    if (!response.ok) throw new Error("Failed to fetch board users");

    const json = await response.json();

    return boardUserSchema.array().parse(json);
}