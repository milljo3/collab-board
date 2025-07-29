import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {AddBoardUser, BoardUser} from "@/types/board";
import { nanoid } from "nanoid";
import {createBoardUser} from "@/api/all-board-users/create-board-user";

export function useCreateBoardUser(boardId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (user: AddBoardUser) => createBoardUser(boardId, user),
        onMutate: async (newUser) => {
            await queryClient.cancelQueries({ queryKey: ["board-users", boardId] });

            const previousBoardUsers = queryClient.getQueryData<BoardUser[]>(["board-users", boardId]);

            const optimisticUser: BoardUser = {
                id: nanoid(),
                role: newUser.role,
                userId: nanoid(),
                boardId: boardId,
                user: {
                    name: "Loading...",
                    email: newUser.email,
                }
            }

            queryClient.setQueryData<BoardUser[]>(["board-users", boardId], (old = []) => [
                ...old,
                optimisticUser
            ]);

            return { previousBoardUsers }
        },
        onError: (error, _variables, context) => {
            console.error(error);

            if (context?.previousBoardUsers) {
                queryClient.setQueryData<BoardUser[]>(["board-users", boardId], context?.previousBoardUsers)
            }

            toast.error("Something went wrong while adding the user to the board.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["board-users", boardId] });
        },
        onSuccess: () => {
            toast.success("User successfully added.");
        },
    });
}