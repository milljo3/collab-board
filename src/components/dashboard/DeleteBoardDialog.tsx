import {useDeleteBoard} from "@/hooks/board/useDeleteBoard";
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

interface DeleteBoardDialogProps {
    boardId: string;
    title: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DeleteBoardDialog = ({boardId, title, open, onOpenChange}: DeleteBoardDialogProps) => {
    const deleteMeeting = useDeleteBoard(boardId);

    const onClick = () => {
        deleteMeeting.mutate();
        onOpenChange(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure want to delete the board: {title}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this board.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={deleteMeeting.isPending}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onClick}
                        disabled={deleteMeeting.isPending}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
};

export default DeleteBoardDialog;