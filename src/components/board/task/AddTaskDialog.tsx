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
import {TaskInput, taskInputSchema} from "@/types/board";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {useCreateTask} from "@/hooks/task/useCreateTask";

interface AddTaskDialogProps {
    boardId: string;
    categoryId: string;
}

const AddTaskDialog = ({ boardId, categoryId }: AddTaskDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const createTask = useCreateTask(boardId, categoryId);

    const form = useForm<TaskInput>({
        resolver: zodResolver(taskInputSchema),
        defaultValues: {
            description: "",
        }
    });

    const onSubmit = (createdTask: TaskInput) => {
        createTask.mutate({
            ...createdTask,
            categoryId
        });
        form.reset();
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-full text-black justify-start"
                    variant="ghost"
                >
                    + Add a Task
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a new task</DialogTitle>
                    <DialogDescription>
                        Enter the task description and click add to add a new task.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Task description" {...field} />
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
                                disabled={createTask.isPending}
                            >
                                {createTask.isPending ? "Adding..." : "Add"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddTaskDialog;