import {useQuery} from "@tanstack/react-query";
import {fetchAllBoards} from "@/api/all-boards/fetch-all-boards";
import {GetAllBoards} from "@/types/board";

export const useAllBoardsQuery = () => {
    return useQuery<GetAllBoards[]>({
        queryKey: ["all-boards"],
        queryFn: () => fetchAllBoards(),
    });
}