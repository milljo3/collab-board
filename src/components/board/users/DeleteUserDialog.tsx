import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {useDeleteBoardUser} from "@/hooks/board-users/useDeleteBoardUser";
import {Button} from "@/components/ui/button";
import {TrashIcon} from "lucide-react";
import {Role} from "@prisma/client";

interface DeleteUserDialogProps {
    boardId: string;
    userId: string;
    username: string;
    role: Role;
    isOwner: boolean;
}

const DeleteUserDialog = ({boardId, userId, username, role, isOwner}: DeleteUserDialogProps) => {
    const deleteUser = useDeleteBoardUser(boardId, userId);

    const onClick = () => {
        deleteUser.mutate();
    }

    const disabled = deleteUser.isPending || !isOwner || role === Role.OWNER;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="icon" className="size-7" disabled={disabled}>
                    <TrashIcon />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure want to remove {username} from the board?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={deleteUser.isPending}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onClick}
                        disabled={disabled}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
};

export default DeleteUserDialog;