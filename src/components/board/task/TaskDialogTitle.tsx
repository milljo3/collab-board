import {
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import {EditIcon} from "lucide-react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Task, TaskTitle, taskTitleSchema} from "@/types/board";
import {useEffect, useState} from "react";
import {useUpdateTaskTitle} from "@/hooks/task/useUpdateTaskTitle";
import {Textarea} from "@/components/ui/textarea";

interface TaskDialogTitleProps {
    boardId: string;
    task: Task;
    viewer: boolean;
}

const TaskDialogTitle = ({boardId, task, viewer}: TaskDialogTitleProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const updateTaskTitle = useUpdateTaskTitle(boardId, task.categoryId, task.id);

    const form = useForm<TaskTitle>({
        resolver: zodResolver(taskTitleSchema),
        defaultValues: {
            title: task.title
        }
    });

    useEffect(() => {
        form.reset({ title: task.title });
    }, [task.title, form]);

    const handleSave = (data: TaskTitle) => {
        if (task.title !== data.title) {
            updateTaskTitle.mutate({
                version: task.version,
                title: data.title,
            });
            form.reset();
        }
        setIsEditing(false);
    }

    const handleCancel = () => {
        form.reset({title: task.title});
        setIsEditing(false);
    }

    return (
        <DialogHeader>
            {isEditing ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Task Title</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Task title"
                                            className="resize-none h-20"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Edit the task title.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                className="w-[90px]"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={updateTaskTitle.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="w-[90px]"
                                disabled={updateTaskTitle.isPending}>
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            ) : (
                <div className="flex gap-2 px-2">
                    <DialogTitle className="self-center">{task.title}</DialogTitle>
                    {!viewer && (
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setIsEditing(true)}
                        >
                            <EditIcon />
                        </Button>
                    )}
                </div>
            )}
        </DialogHeader>
    );
};

export default TaskDialogTitle;