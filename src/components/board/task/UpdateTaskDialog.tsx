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
import {
    TaskInput,
    taskInputSchema,
} from "@/types/board";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {useUpdateTask} from "@/hooks/task/useUpdateTask";

interface UpdateTaskDialogProps {
    boardId: string;
    categoryId: string;
    taskId: string;
    description: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    version: number;
}

const UpdateTaskDialog = ({ boardId, categoryId, taskId, description, open, onOpenChange, version }: UpdateTaskDialogProps) => {
    const updateTask = useUpdateTask(boardId, categoryId, taskId);

    const form = useForm<TaskInput>({
        resolver: zodResolver(taskInputSchema),
        defaultValues: {
            description: description,
        }
    });

    const onSubmit = (updatedTask: TaskInput) => {
        updateTask.mutate({
            version,
            description: updatedTask.description,
        });
        form.reset();
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update task</DialogTitle>
                    <DialogDescription>
                        Enter the task description and click save to save the task.
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
                                disabled={updateTask.isPending}
                            >
                                {updateTask.isPending ? "Saving..." : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateTaskDialog;