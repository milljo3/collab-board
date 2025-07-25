import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {Board, GetAllBoards, UpdateBoard} from "@/types/board";
import {updateBoard} from "@/api/board/update-board";

export function useUpdateBoard(boardId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (board: UpdateBoard) => updateBoard(boardId, board),
        onMutate: async (newBoard) => {
            await queryClient.cancelQueries({ queryKey: ["board", boardId] });

            const previousBoards = queryClient.getQueryData<GetAllBoards[]>(["all-boards"]);
            const previousBoard = queryClient.getQueryData<Board>(["board", boardId]);

            queryClient.setQueryData<GetAllBoards[]>(["all-boards"], (old = []) => {
                return old.map(board =>
                    board.id === boardId
                        ? {
                            ...board,
                            title: newBoard.title,
                            version: newBoard.version,
                        }
                        : board
                );
            });

            queryClient.setQueryData<Board>(["board", boardId], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    title: newBoard.title,
                    version: newBoard.version,
                    updatedAt: new Date()
                }
            });

            return { previousBoard, previousBoards };
        },
        onError: (error, _variables, context) => {
            console.error(error);

            if (context?.previousBoards) {
                queryClient.setQueryData<GetAllBoards[]>(["all-boards"], context.previousBoards);
            }
            if (context?.previousBoard) {
                queryClient.setQueryData<Board>(["board", boardId], context.previousBoard);
            }

            toast.error("Something went wrong while updating the board.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["board", boardId] });
            queryClient.invalidateQueries({ queryKey: ["all-boards"] });
        },
        onSuccess: () => {
            toast.success("Board title successfully updated.");
        },
    });
}