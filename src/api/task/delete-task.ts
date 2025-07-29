import {DeleteTaskCategory} from "@/types/board";

export const deleteTask = async (boardId: string, taskId: string, deleteTask: DeleteTaskCategory) => {
    const response = await fetch(`/api/boards/${boardId}/tasks/${taskId}`, {
        method: "DELETE",
        body: JSON.stringify(deleteTask),
        headers: {"content-type": "application/json"}
    });

    if (!response.ok) throw new Error("Failed to delete task");

    return await response.json();
}