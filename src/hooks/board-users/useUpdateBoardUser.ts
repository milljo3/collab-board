import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {BoardUser, UpdateBoardUser} from "@/types/board";
import {updateBoardUser} from "@/api/board-users/update-board-user";

export function useUpdateBoardUser(boardId: string, userId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (user: UpdateBoardUser) => updateBoardUser(boardId, userId, user),
        onMutate: async (newUser) => {
            await queryClient.cancelQueries({ queryKey: ["board-users", boardId] });

            const previousBoardUsers = queryClient.getQueryData<BoardUser[]>(["board-users", boardId]);

            queryClient.setQueryData<BoardUser[]>(["board-users", boardId], (old = []) => {
                return old.map(user =>
                    user.id === userId
                        ? {
                            ...user,
                            role: newUser.role,
                        }
                        : user
                );
            });

            return { previousBoardUsers }
        },
        onError: (error, _variables, context) => {
            console.error(error);

            if (context?.previousBoardUsers) {
                queryClient.setQueryData<BoardUser[]>(["board-users", boardId], context?.previousBoardUsers)
            }

            toast.error("Something went wrong while updating the user's role.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["board-users", boardId] });
        },
        onSuccess: () => {
            toast.success("Role successfully updated.");
        },
    });
}