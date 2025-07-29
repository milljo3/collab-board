export const deleteBoardUser = async (boardId: string, userId: string) => {
    const response = await fetch(`/api/boards/${boardId}/users/${userId}`, {
        method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete user");

    return await response.json();
}