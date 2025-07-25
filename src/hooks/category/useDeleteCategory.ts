import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {Board, DeleteTaskCategory} from "@/types/board";
import {deleteCategory} from "@/api/category/delete-category";

export function useDeleteCategory(boardId: string, categoryId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (category: DeleteTaskCategory) => deleteCategory(boardId, categoryId, category),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["board", boardId] });

            const previousBoard = queryClient.getQueryData<Board>(["board", boardId]);

            queryClient.setQueryData<Board>(["board", boardId], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    categories: old.categories.filter((c) => c.id !== categoryId),
                }
            });

            return { previousBoard };
        },
        onError: (error, _variables, context) => {
            console.error(error);

            if (context?.previousBoard) {
                queryClient.setQueryData<Board>(["board", boardId], context.previousBoard);
            }

            toast.error("Something went wrong while deleting the category.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["board", boardId] });
        },
        onSuccess: () => {
            toast.success("Category successfully deleted.");
        },
    });
}