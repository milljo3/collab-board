import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {Board, UpdateTask} from "@/types/board";
import {updateTask} from "@/api/task/update-task";

export function useUpdateTaskTitle(boardId: string, categoryId: string, taskId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (task: UpdateTask) => updateTask(boardId, taskId, task),
        onMutate: async (newTask) => {
            await queryClient.cancelQueries({ queryKey: ["board", boardId] });

            const previousBoard = queryClient.getQueryData<Board>(["board", boardId]);

            queryClient.setQueryData<Board>(["board", boardId], (old) => {
                if (!old || !newTask.title) return old;
                return {
                    ...old,
                    categories: old.categories.map((category) => {
                        if (category.id !== categoryId) return category;

                        return {
                            ...category,
                            tasks: category.tasks.map((task) =>
                                task.id === taskId
                                    ? { ...task, title: newTask.title! }
                                    : task
                            ),
                        };
                    }),
                };
            });

            return { previousBoard };
        },
        onError: (error, _variables, context) => {
            console.error(error);

            if (context?.previousBoard) {
                queryClient.setQueryData<Board>(["board", boardId], context.previousBoard);
            }

            toast.error("Something went wrong while updating the task title.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["board", boardId] });
        },
        onSuccess: () => {

        },
    });
}