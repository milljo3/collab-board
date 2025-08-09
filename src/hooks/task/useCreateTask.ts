import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {Board, CreateTask, Task} from "@/types/board";
import {nanoid} from "nanoid";
import { POSITION_CONFIG } from "@/consts/position";
import {createTask} from "@/api/task/create-task";

export function useCreateTask(boardId: string, categoryId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (task: CreateTask) => createTask(boardId, task),
        onMutate: async (newTask) => {
            await queryClient.cancelQueries({ queryKey: ["board", boardId] });

            const previousBoard = queryClient.getQueryData<Board>(["board", boardId]);

            const currentCategory = previousBoard?.categories.find((c) => c.id === categoryId);
            let tempPosition = POSITION_CONFIG.INITIAL_POSITION;

            if (currentCategory?.tasks.length) {
                tempPosition = (currentCategory.tasks.length + 1) * POSITION_CONFIG.GAP;
            }

            const optimisticTask: Task = {
                id: nanoid(),
                title: newTask.title,
                details: null,
                categoryId,
                position: tempPosition,
                version: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            queryClient.setQueryData<Board>(["board", boardId], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    categories: old.categories.map((c) => c.id === categoryId
                        ? {
                            ...c,
                            tasks: [...c.tasks, optimisticTask],
                        }
                        : c
                    ),
                };
            });

            return { previousBoard };
        },
        onError: (error, _variables, context) => {
            console.error(error);
            queryClient.setQueryData<Board>(["board", boardId], context?.previousBoard);
            toast.error("Something went wrong while creating the task.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["board", boardId] });
        },
        onSuccess: () => {
            toast.success("Task successfully created.");
        },
    });
}