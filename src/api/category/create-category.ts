import {CreateCategory} from "@/types/board";

export const createCategory = async (boardId: string, createCategory: CreateCategory) => {
    const response = await fetch(`/api/boards/${boardId}/categories`, {
        method: "POST",
        body: JSON.stringify(createCategory),
        headers: {"content-type": "application/json"}
    });

    if (!response.ok) throw new Error("Failed to create category");

    return await response.json();
}