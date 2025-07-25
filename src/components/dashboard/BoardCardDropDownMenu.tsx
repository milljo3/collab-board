import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {MoreVertical} from "lucide-react";
import UpdateBoardDialog from "@/components/dashboard/UpdateBoardDialog";
import DeleteBoardDialog from "@/components/dashboard/DeleteBoardDialog";
import {useState} from "react";

interface BoardCardDropDownMenuProps {
    boardId: string;
    title: string;
    version: number;
    className?: string;
}

const BoardCardDropDownMenu = ({boardId, title, version, className}: BoardCardDropDownMenuProps) => {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <>
            <UpdateBoardDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                boardId={boardId}
                version={version}
            />

            <DeleteBoardDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                boardId={boardId}
                title={title}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild className={className}>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-transparent hover:text-white size-7 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-0"
                    >
                        <MoreVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[40px]" align="end">
                    <DropdownMenuGroup>
                        <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setDeleteOpen(true)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default BoardCardDropDownMenu;