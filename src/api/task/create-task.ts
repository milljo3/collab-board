import {CreateTask} from "@/types/board";

export const createTask = async (boardId: string, createTask: CreateTask) => {
    const response = await fetch(`/api/boards/${boardId}/tasks`, {
        method: "POST",
        body: JSON.stringify(createTask),
        headers: {"content-type": "application/json"}
    });

    if (!response.ok) throw new Error("Failed to create task");

    return await response.json();
}