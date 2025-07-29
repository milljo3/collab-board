import {useMutation, useQueryClient} from "@tanstack/react-query";
import {UpdateTask} from "@/types/board";
import {toast} from "sonner";
import {updateTask} from "@/api/task/update-task";

export function useMoveTask(boardId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({taskId, data}: {taskId: string, data: UpdateTask}) => updateTask(boardId, taskId, data),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["board", boardId] });
        },
        onError: (error) => {
            console.error("Move task error:", error);
            toast.error("Failed to move task");
        }
    });
}