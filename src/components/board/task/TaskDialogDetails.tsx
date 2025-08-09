import {EditIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Task, TaskDetails, taskDetailsSchema} from "@/types/board";
import {useUpdateTaskDetails} from "@/hooks/task/useUpdateTaskDetails";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";

interface TaskDialogDetailsProps {
    boardId: string;
    task: Task;
    initiallyEditing?: boolean;
    onCancelAdd?: () => void;
}

const TaskDialogDetails = ({boardId, task, initiallyEditing, onCancelAdd}: TaskDialogDetailsProps) => {
    const [isEditing, setIsEditing] = useState(initiallyEditing);

    const updateTaskDetails = useUpdateTaskDetails(boardId, task.id);

    const form = useForm<TaskDetails>({
        resolver: zodResolver(taskDetailsSchema),
        defaultValues: {
            details: task.details || ""
        }
    });

    useEffect(() => {
        form.reset({ details: task.details || "" });
    }, [task.details, form]);

    useEffect(() => {
        setIsEditing(initiallyEditing);
    }, [initiallyEditing]);

    const handleSave = (data: TaskDetails) => {
        const trimmedDetails = data.details.trim();

        if (!trimmedDetails && initiallyEditing) {
            handleCancel();
            return;
        }

        if (task.details !== trimmedDetails) {
            updateTaskDetails.mutate({
                version: task.version,
                details: trimmedDetails,
            });
            form.reset();
        }
        setIsEditing(false);
    }

    const handleCancel = () => {
        form.reset({details: task.details || ""});
        setIsEditing(false);

        if (initiallyEditing && onCancelAdd) {
            onCancelAdd();
        }
    }

    const hasDetails = task.details && task.details.trim().length > 0;

    return (
        <>
            {isEditing ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="details"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Task Details</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Add task details..."
                                            className="resize-none h-60"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {initiallyEditing ? "Add details to this task." : "Edit the task details."}
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
                                disabled={updateTaskDetails.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="w-[90px]"
                                disabled={updateTaskDetails.isPending}>
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            ) : (
                hasDetails && (
                    <div className="flex gap-2 px-2">
                        <p className="self-center whitespace-pre-wrap">
                            {task.details}
                        </p>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setIsEditing(true)}
                        >
                            <EditIcon />
                        </Button>
                    </div>
                )
            )}
        </>
    );
};

export default TaskDialogDetails;