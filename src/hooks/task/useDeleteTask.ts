import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {Board, DeleteTaskCategory} from "@/types/board";
import {deleteTask} from "@/api/task/delete-task";

export function useDeleteTask(boardId: string, categoryId: string, taskId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (task: DeleteTaskCategory) => deleteTask(boardId, taskId, task),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["board", boardId] });

            const previousBoard = queryClient.getQueryData<Board>(["board", boardId]);

            queryClient.setQueryData<Board>(["board", boardId], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    categories: old.categories.map((c) => c.id === categoryId
                        ? {
                            ...c,
                            tasks: c.tasks.filter((task) => task.id !== taskId),
                        }
                        : c
                    ),
                }
            });

            return { previousBoard };
        },
        onError: (error, _variables, context) => {
            console.error(error);
            if (context?.previousBoard) {
                queryClient.setQueryData<Board>(["board", boardId], context.previousBoard);
            }
            toast.error("Something went wrong while deleting the task.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["board", boardId] });
        },
        onSuccess: () => {
            toast.success("Task successfully deleted.");
        },
    });
}