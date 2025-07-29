import {AddBoardUser} from "@/types/board";

export const createBoardUser = async (boardId: string, addBoardUser: AddBoardUser) => {
    const response = await fetch(`/api/boards/${boardId}/users`, {
        method: "POST",
        body: JSON.stringify(addBoardUser),
        headers: {"content-type": "application/json"}
    });

    if (!response.ok) throw new Error("Failed to add user");

    return await response.json();
}