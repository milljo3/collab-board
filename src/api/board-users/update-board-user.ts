import {UpdateBoardUser} from "@/types/board";

export const updateBoardUser = async (boardId: string, userId: string, updateBoardUser: UpdateBoardUser) => {
    const response = await fetch(`/api/boards/${boardId}/users/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(updateBoardUser),
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to update user's role");

    return await response.json();
}