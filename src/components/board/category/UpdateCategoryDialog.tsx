import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {CategoryInput, categoryInputSchema} from "@/types/board";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {useUpdateCategory} from "@/hooks/category/useUpdateCategory";

interface UpdateCategoryDialogProps {
    boardId: string;
    categoryId: string;
    title: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    version: number;
}

const UpdateCategoryDialog = ({ boardId, categoryId, title, open, onOpenChange, version }: UpdateCategoryDialogProps) => {
    const updateCategory = useUpdateCategory(boardId, categoryId);

    const form = useForm<CategoryInput>({
        resolver: zodResolver(categoryInputSchema),
        defaultValues: {
            title: title,
        }
    });

    const onSubmit = (updatedCategory: CategoryInput) => {
        updateCategory.mutate({
            version,
            title: updatedCategory.title
        });
        form.reset();
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update category</DialogTitle>
                    <DialogDescription>
                        Enter the category title and click save to save the category.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Category title" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={updateCategory.isPending}
                            >
                                {updateCategory.isPending ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateCategoryDialog;