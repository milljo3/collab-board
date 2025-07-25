import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createBoard } from "@/api/all-boards/create-board";
import {CreateBoard, GetAllBoards} from "@/types/board";
import { nanoid } from "nanoid";

export function useCreateBoard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (board: CreateBoard) => createBoard(board),
        onMutate: async (newBoard) => {
            await queryClient.cancelQueries({ queryKey: ["all-boards"] });

            const previousBoards = queryClient.getQueryData<GetAllBoards[]>(["all-boards"]);

            const optimisticBoard: GetAllBoards & { isOptimistic?: boolean } = {
                id: nanoid(),
                title: newBoard.title,
                version: 1,
                createdAt: new Date(),
                isOptimistic: true,
            }

            queryClient.setQueryData<GetAllBoards[]>(["all-boards"], (old = []) => [
                ...old,
                optimisticBoard
            ]);

            return { previousBoards }
        },
        onError: (error, _variables, context) => {
            console.error(error);

            if (context?.previousBoards) {
                queryClient.setQueryData<GetAllBoards[]>(["all-boards"], context?.previousBoards)
            }

            toast.error("Something went wrong while creating board.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["all-boards"] });
        },
        onSuccess: () => {
            toast.success("Board successfully created.");
        },
    });
}