import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {BoardUser} from "@/types/board";
import {deleteBoardUser} from "@/api/board-users/delete-board-user";

export function useDeleteBoardUser(boardId: string, userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteBoardUser(boardId, userId),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["board-users", boardId] });

            const previousBoardUsers = queryClient.getQueryData<BoardUser[]>(["board-users", boardId]);

            queryClient.setQueryData<BoardUser[]>(["board-users", boardId], (old = []) => {
                if (!old) return old;
                return old.filter((user) => user.id !== userId);
            });

            return { previousBoardUsers }
        },
        onError: (error, _variables, context) => {
            console.error(error);

            if (context?.previousBoardUsers) {
                queryClient.setQueryData<BoardUser[]>(["board-users", boardId], context?.previousBoardUsers)
            }

            toast.error("Something went wrong while deleting the user.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["board-users", boardId] });
        },
        onSuccess: () => {
            toast.success("User successfully deleted.");
        },
    });
}