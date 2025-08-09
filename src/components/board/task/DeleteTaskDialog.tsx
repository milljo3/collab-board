import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {useDeleteTask} from "@/hooks/task/useDeleteTask";
import {Task} from "@/types/board";

interface DeleteTaskDialogProps {
    boardId: string;
    task: Task;
    open: boolean;
    onClose: () => void;
}

const DeleteTaskDialog = ({boardId, task, open, onClose}: DeleteTaskDialogProps) => {
    const deleteTask = useDeleteTask(boardId, task.categoryId, task.id);

    const onClick = () => {
        deleteTask.mutate({version: task.version});
        onClose();
    }

    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure want to delete the task: {task.title}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this task.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={deleteTask.isPending}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onClick}
                        disabled={deleteTask.isPending}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
};

export default DeleteTaskDialog;