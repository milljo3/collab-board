import {UpdateTask} from "@/types/board";

export const updateTask = async (boardId: string, taskId: string, data: UpdateTask) => {
    const response = await fetch(`/api/boards/${boardId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
}