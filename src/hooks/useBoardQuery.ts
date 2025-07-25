import {useQuery} from "@tanstack/react-query";
import {Board} from "@/types/board";
import {fetchBoard} from "@/api/board/fetch-board";

export const useBoardQuery = (id?: string) => {
    return useQuery<Board>({
        queryKey: ["meeting", id],
        queryFn: () => fetchBoard(id!),
        enabled: !!id
    });
}