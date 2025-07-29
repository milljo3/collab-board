import {UpdateCategory} from "@/types/board";

export const updateCategory = async (boardId: string, categoryId: string, data: UpdateCategory) => {
    const response = await fetch(`/api/boards/${boardId}/categories/${categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
}