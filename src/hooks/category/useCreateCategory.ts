import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {Board, Category, CreateCategory} from "@/types/board";
import {createCategory} from "@/api/category/create-category";
import {nanoid} from "nanoid";
import { POSITION_CONFIG } from "@/consts/position";

export function useCreateCategory(boardId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (category: CreateCategory) => createCategory(boardId, category),
        onMutate: async (newCategory) => {
            await queryClient.cancelQueries({ queryKey: ["board", boardId] });

            const previousBoard = queryClient.getQueryData<Board>(["board", boardId]);

            let tempPosition = POSITION_CONFIG.INITIAL_POSITION;
            if (previousBoard?.categories) {
                tempPosition = (previousBoard.categories.length + 1) * POSITION_CONFIG.GAP;
            }

            const optimisticCategory: Category = {
                id: nanoid(),
                title: newCategory.title,
                boardId,
                tasks: [],
                position: tempPosition,
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            queryClient.setQueryData<Board>(["board", boardId], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    categories: [...old.categories, optimisticCategory],
                };
            });

            return { previousBoard };
        },
        onError: (error, _variables, context) => {
            console.error(error);

            if (context?.previousBoard) {
                queryClient.setQueryData<Board>(["board", boardId], context.previousBoard);
            }

            toast.error("Something went wrong while creating the category.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["board", boardId] });
        },
        onSuccess: () => {
            toast.success("Category successfully created.");
        },
    });
}