import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {EllipsisIcon} from "lucide-react";
import {Category, Task} from "@/types/board";

interface TaskDropDownMenuProps {
    task: Task;
    onOpenDialog: (type: "editCategory" | "deleteCategory" | "addTask" | "deleteTask" | "taskModal", task?: Task, category?: Category) => void;
}

const TaskDropDownMenu = ({task, onOpenDialog}: TaskDropDownMenuProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-transparent hover:text-white text-white  size-7 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-0"
                >
                    <EllipsisIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[40px]" align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={() => onOpenDialog("deleteTask", task)}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default TaskDropDownMenu;