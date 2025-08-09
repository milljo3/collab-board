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

interface BoardCardDropDownMenuProps {
    category: Category;
    onOpenDialog: (type: "editCategory" | "deleteCategory" | "addTask" | "deleteTask" | "taskModal", task?: Task, category?: Category) => void;
    className?: string;
}

const BoardColumnDropDownMenu = ({category, onOpenDialog, className}: BoardCardDropDownMenuProps) => {
    return (
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
                    <DropdownMenuItem onSelect={() => {
                        onOpenDialog("editCategory", undefined, category);
                    }}>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onOpenDialog("deleteCategory", undefined, category)}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default BoardColumnDropDownMenu;