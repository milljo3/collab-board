import {DeleteTaskCategory} from "@/types/board";

export const deleteCategory = async (boardId: string, categoryId: string, deleteCategory: DeleteTaskCategory) => {
    const response = await fetch(`/api/boards/${boardId}/categories/${categoryId}`, {
        method: "DELETE",
        body: JSON.stringify(deleteCategory),
        headers: {"content-type": "application/json"}
    });

    if (!response.ok) throw new Error("Failed to delete category");

    return await response.json();
}