import {useQuery} from "@tanstack/react-query";
import {Board} from "@/types/board";
import {fetchBoard} from "@/api/board/fetch-board";

export const useBoardQuery = (id?: string) => {
    return useQuery<Board>({
        queryKey: ["board", id],
        queryFn: () => fetchBoard(id!),
        enabled: !!id
    });
}