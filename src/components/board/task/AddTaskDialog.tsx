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
import {TaskTitle, taskTitleSchema} from "@/types/board";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useCreateTask} from "@/hooks/task/useCreateTask";

interface AddTaskDialogProps {
    boardId: string;
    categoryId: string;
    open: boolean;
    onClose: () => void;
}

const AddTaskDialog = ({ boardId, categoryId, open, onClose }: AddTaskDialogProps) => {
    const createTask = useCreateTask(boardId, categoryId);

    const form = useForm<TaskTitle>({
        resolver: zodResolver(taskTitleSchema),
        defaultValues: {
            title: "",
        }
    });

    const onSubmit = (createdTask: TaskTitle) => {
        createTask.mutate({
            ...createdTask,
            categoryId
        });
        form.reset();
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <Button
                    className="w-full justify-start"
                    variant="ghost"
                >
                    + Add a Task
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a new task</DialogTitle>
                    <DialogDescription>
                        Enter the task title and click add to add a new task.
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
                                        <Input placeholder="Task title" {...field} />
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