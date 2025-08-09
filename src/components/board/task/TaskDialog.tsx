import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import {Task} from "@/types/board";
import TaskDialogTitle from "@/components/board/task/TaskDialogTitle";
import TaskDialogDetails from "@/components/board/task/TaskDialogDetails";
import {Button} from "@/components/ui/button";
import {useState} from "react";

interface TaskDialogProps {
    boardId: string;
    task: Task;
    open: boolean;
    onClose: () => void;
}

export function TaskDialog({boardId, task, open, onClose}: TaskDialogProps) {
    const [isAddingDetails, setIsAddingDetails] = useState(false);

    const hasDetails = task.details && task.details.trim().length > 0;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] md:max-w-[625px] max-h-[600px] overflow-y-auto">
                <TaskDialogTitle
                    boardId={boardId}
                    task={task}
                />
                {hasDetails || isAddingDetails ? (
                    <TaskDialogDetails
                        boardId={boardId}
                        task={task}
                        initiallyEditing={isAddingDetails}
                        onCancelAdd={() => setIsAddingDetails(false)}
                    />
                ) : (
                    <Button
                        variant="ghost"
                        onClick={() => setIsAddingDetails(true)}
                    >
                        Add details
                    </Button>
                )}
            </DialogContent>
        </Dialog>
    )
}
