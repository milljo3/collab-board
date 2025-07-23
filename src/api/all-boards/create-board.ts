import {CreateBoard} from "@/types/board";

export const createBoard = async (createBoard: CreateBoard) => {
    const response = await fetch("/api/boards", {
        method: "POST",
        body: JSON.stringify(createBoard),
        headers: {"content-type": "application/json"}
    });

    if (!response.ok) throw new Error("Failed to create board");

    return await response.json();
}