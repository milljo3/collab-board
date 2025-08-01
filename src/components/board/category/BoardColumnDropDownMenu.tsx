import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {EllipsisIcon} from "lucide-react";
import {useState} from "react";
import UpdateCategoryDialog from "@/components/board/category/UpdateCategoryDialog";
import DeleteCategoryDialog from "@/components/board/category/DeleteCategoryDialog";

interface BoardCardDropDownMenuProps {
    boardId: string;
    categoryId: string;
    title: string;
    version: number;
    className?: string;
}

const BoardColumnDropDownMenu = ({boardId, categoryId, title, version, className}: BoardCardDropDownMenuProps) => {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <>
            <UpdateCategoryDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                boardId={boardId}
                title={title}
                categoryId={categoryId}
                version={version}
            />

            <DeleteCategoryDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                boardId={boardId}
                categoryId={categoryId}
                title={title}
                version={version}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild className={className}>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-transparent  size-7 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-0 "
                    >
                        <EllipsisIcon />
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

export default BoardColumnDropDownMenu;