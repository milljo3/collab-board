import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Task} from "@/types/board";

interface TaskDialogProps {
    boardId: string;
    task: Task;
    open: boolean;
    onClose: () => void;
}

export function TaskDialog({task, open, onClose}: TaskDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] md:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Task Title</DialogTitle>
                    <DialogDescription>
                        {task.title}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
