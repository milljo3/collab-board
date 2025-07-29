import {useMutation, useQueryClient} from "@tanstack/react-query";
import {UpdateCategory} from "@/types/board";
import {toast} from "sonner";
import {updateCategory} from "@/api/category/update-category";

export function useMoveCategory(boardId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({categoryId, data}: {categoryId: string, data: UpdateCategory}) => updateCategory(boardId, categoryId, data),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["board", boardId] });
        },
        onError: (error) => {
            console.error("Move category error:", error);
            toast.error("Failed to move category");
        }
    });
}