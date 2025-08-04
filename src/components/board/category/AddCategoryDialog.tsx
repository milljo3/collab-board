import React, {useState} from 'react';
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {CreateCategory, createCategorySchema} from "@/types/board";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useCreateCategory} from "@/hooks/category/useCreateCategory";

interface AddCategoryDialogProps {
    boardId: string;
}

const AddCategoryDialog = ({ boardId }: AddCategoryDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const createCategory = useCreateCategory(boardId);

    const form = useForm<CreateCategory>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            title: "",
        }
    });

    const onSubmit = (createdCategory: CreateCategory) => {
        createCategory.mutate(createdCategory);
        form.reset();
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    + Add a Category
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a new category</DialogTitle>
                    <DialogDescription>
                        Enter the category title and click add to add a new category.
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
                                    <FormMessage />
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
                                disabled={createCategory.isPending}
                            >
                                {createCategory.isPending ? "Adding..." : "Add"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddCategoryDialog;