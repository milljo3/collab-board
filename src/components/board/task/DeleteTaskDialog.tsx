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

interface DeleteTaskDialogProps {
    boardId: string;
    categoryId: string;
    taskId: string;
    description: string;
    version: number,
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DeleteCategoryDialog = ({boardId, categoryId, taskId, description, version, open, onOpenChange}: DeleteTaskDialogProps) => {
    const deleteTask = useDeleteTask(boardId, categoryId, taskId);

    const onClick = () => {
        deleteTask.mutate({ version });
        onOpenChange(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure want to delete the task: {description}?</AlertDialogTitle>
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

export default DeleteCategoryDialog;