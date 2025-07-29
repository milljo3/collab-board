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
import {useDeleteCategory} from "@/hooks/category/useDeleteCategory";

interface DeleteCategoryDialogProps {
    boardId: string;
    categoryId: string;
    title: string;
    version: number,
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DeleteCategoryDialog = ({boardId, categoryId, title, version, open, onOpenChange}: DeleteCategoryDialogProps) => {
    const deleteCategory = useDeleteCategory(boardId, categoryId);

    const onClick = () => {
        deleteCategory.mutate({ version });
        onOpenChange(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure want to delete the category: {title}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this category.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={deleteCategory.isPending}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onClick}
                        disabled={deleteCategory.isPending}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
};

export default DeleteCategoryDialog;