import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {GenerateBoardPromptSchema, GetAllBoards} from "@/types/board";
import { nanoid } from "nanoid";
import {generateBoard} from "@/api/all-boards/generate-board";

export function useGenerateBoard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (prompt: GenerateBoardPromptSchema) => generateBoard(prompt),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["all-boards"] });

            const previousBoards = queryClient.getQueryData<GetAllBoards[]>(["all-boards"]);

            const optimisticBoard: GetAllBoards & { isOptimistic?: boolean } = {
                id: nanoid(),
                title: "Generating...",
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

            toast.error("Something went wrong while generating the board.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["all-boards"] });
        },
        onSuccess: () => {
            toast.success("Board successfully generated.");
        },
    });
}