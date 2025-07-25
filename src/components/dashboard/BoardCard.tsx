import React from 'react';
import {GetAllBoards} from "@/types/board";
import Link from "next/link";
import BoardCardDropDownMenu from "@/components/dashboard/BoardCardDropDownMenu";

interface BoardCardProps {
    allBoard: GetAllBoards & { isOptimistic?: boolean };
}

const BoardCard = ({allBoard}: BoardCardProps) => {

    return (
        <div
            className="
            bg-card text-card-foreground
            flex flex-col w-[200px] h-32 rounded-xl relative
            "
        >
            <Link
                href={`/boards/${allBoard.id}`}
                className="w-full h-full flex justify-center items-center hover:bg-primary/90 rounded-lg"
                onClick={(e) => {
                    if (allBoard.isOptimistic) e.preventDefault();
                }}
            >
                <p
                    className="text-center truncate overflow-hidden whitespace-pre-wrap text-sm w-full"
                >
                    {allBoard.title}
                </p>
            </Link>
            <BoardCardDropDownMenu
                boardId={allBoard.id}
                title={allBoard.title}
                version={allBoard.version}
                className="absolute top-0 right-0"
            />
        </div>
    );
};

export default BoardCard;