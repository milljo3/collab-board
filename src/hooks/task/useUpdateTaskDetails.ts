import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {Board, UpdateTask} from "@/types/board";
import {updateTask} from "@/api/task/update-task";

export function useUpdateTaskDetails(boardId: string, taskId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (task: UpdateTask) => updateTask(boardId, taskId, task),
        onMutate: async (newTask) => {
            await queryClient.cancelQueries({ queryKey: ["board", boardId] });

            const previousBoard = queryClient.getQueryData<Board>(["board", boardId]);

            queryClient.setQueryData<Board>(["board", boardId], (old) => {
                if (!old || newTask.details === undefined) return old;

                return {
                    ...old,
                    categories: old.categories.map((category) => ({
                        ...category,
                        tasks: category.tasks.map((task) =>
                            task.id === taskId
                                ? {
                                    ...task,
                                    details: newTask.details!,
                                }
                                : task
                        ),
                    })),
                };
            });

            return { previousBoard };
        },
        onError: (error, _variables, context) => {
            console.error(error);

            if (context?.previousBoard) {
                queryClient.setQueryData<Board>(["board", boardId], context.previousBoard);
            }

            toast.error("Something went wrong while updating the task details.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["board", boardId] });
        },
        onSuccess: () => {
            toast.success("Task details updated.");
        },
    });
}