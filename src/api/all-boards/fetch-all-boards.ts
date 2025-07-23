import {getAllBoardsSchema} from "@/types/board";

export const fetchAllBoards = async () => {
    const response = await fetch("/api/boards");
    if (!response.ok) throw new Error("Failed to fetch boards");

    const json = await response.json();

    return getAllBoardsSchema.array().parse(json);
}