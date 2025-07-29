import {useQuery} from "@tanstack/react-query";
import {fetchAllBoardUsers} from "@/api/all-board-users/fetch-all-board-users";
import {BoardUser} from "@/types/board";

export const useBoardUsersQuery = (id?: string) => {
    return useQuery<BoardUser[]>({
        queryKey: ["board-users", id],
        queryFn: () => fetchAllBoardUsers(id!),
        enabled: !!id
    });
}