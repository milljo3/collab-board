import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {Board, UpdateCategory} from "@/types/board";
import {updateCategory} from "@/api/category/update-category";

export function useUpdateCategory(boardId: string, categoryId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (category: UpdateCategory) => updateCategory(boardId, categoryId, category),
        onMutate: async (newCategory) => {
            await queryClient.cancelQueries({ queryKey: ["board", boardId] });

            const previousBoard = queryClient.getQueryData<Board>(["board", boardId]);

            queryClient.setQueryData<Board>(["board", boardId], (old) => {
                if (!old || !newCategory.title) return old;
                return {
                    ...old,
                    categories: old.categories.map((category) =>
                        category.id === categoryId ?
                            {...category, title: newCategory.title!}
                            : category),
                }
            });

            return { previousBoard };
        },
        onError: (error, _variables, context) => {
            console.error(error);

            if (context?.previousBoard) {
                queryClient.setQueryData<Board>(["board", boardId], context.previousBoard);
            }

            toast.error("Something went wrong while updating the category.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["board", boardId] });
        },
        onSuccess: () => {
        },
    });
}