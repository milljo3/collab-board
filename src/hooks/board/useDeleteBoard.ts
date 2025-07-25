import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {GetAllBoards} from "@/types/board";
import {deleteBoard} from "@/api/board/delete-board";

export function useDeleteBoard(boardId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deleteBoard(boardId),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["all-boards"] });

            const previousBoards = queryClient.getQueryData<GetAllBoards[]>(["all-boards"]);

            queryClient.setQueryData<GetAllBoards[]>(["all-boards"], (old = []) => {
                if (!old) return old;
                return old.filter((board) => board.id !== boardId);
            });

            return { previousBoards }
        },
        onError: (error, _variables, context) => {
            console.error(error);

            if (context?.previousBoards) {
                queryClient.setQueryData<GetAllBoards[]>(["all-boards"], context.previousBoards)
            }

            toast.error("Something went wrong while deleting the board.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["all-boards"] });
            queryClient.invalidateQueries({ queryKey: ["board", boardId] });
        },
        onSuccess: () => {
            toast.success("Board successfully deleted.");
        },
    });
}