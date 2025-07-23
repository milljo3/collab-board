export const deleteBoard = async (boardId: string) => {
    const response = await fetch(`/api/boards/${boardId}`, {
        method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete board");

    return await response.json();
}