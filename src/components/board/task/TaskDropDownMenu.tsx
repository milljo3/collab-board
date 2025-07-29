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
import UpdateTaskDialog from "@/components/board/task/UpdateTaskDialog";
import DeleteTaskDialog from "@/components/board/task/DeleteTaskDialog";

interface TaskDropDownMenuProps {
    boardId: string;
    categoryId: string;
    taskId: string;
    description: string;
    version: number;
    className?: string;
}

const TaskDropDownMenu = ({boardId, categoryId, taskId, description, version, className}: TaskDropDownMenuProps) => {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <>
            <UpdateTaskDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                boardId={boardId}
                categoryId={categoryId}
                taskId={taskId}
                description={description}
                version={version}
            />

            <DeleteTaskDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                boardId={boardId}
                categoryId={categoryId}
                taskId={taskId}
                version={version}
                description={description}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild className={className}>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-transparent hover:text-white size-7 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-0"
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

export default TaskDropDownMenu;