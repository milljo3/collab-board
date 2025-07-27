import React, {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {TaskInput, taskInputSchema} from "@/types/board";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {useCreateTask} from "@/hooks/task/useCreateTask";

interface AddTaskButtonProps {
    boardId: string;
    categoryId: string;
}

const AddTaskButton = ({boardId, categoryId}: AddTaskButtonProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const createTask = useCreateTask(boardId, categoryId);

    const form = useForm<TaskInput>({
        resolver: zodResolver(taskInputSchema),
        defaultValues: {
            description: "",
        }
    });

    const onSubmit = (createdTask: TaskInput) => {
        console.log("Submit");
        setIsEditing(false);
        createTask.mutate({
            ...createdTask,
            categoryId
        });
        form.reset();
    }

    const handleCancel = () => {
        setIsEditing(false);
        form.reset();
    }

    useEffect(() => {
        if (isEditing) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }, [isEditing]);

    return (
        <>
            {isEditing ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                          className="shrink-0 opacity-75 border-transparent border-1 border-dashed
                          bg-card text-secondary rounded-md
                          w-[210px] h-[110px]
                          flex flex-col justify-around px-2"
                    >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Task Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter description"
                                            {...field}
                                            ref={(e) => {
                                                field.ref(e);
                                                inputRef.current = e;
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    form.handleSubmit(onSubmit)();
                                                    console.log("Enter");
                                                }
                                                else if (e.key === "Escape") {
                                                    e.preventDefault();
                                                    handleCancel();
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2">
                            <Button disabled={createTask.isPending} onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="secondary" disabled={createTask.isPending}>
                                {createTask.isPending ? "Adding..." : "Add"}
                            </Button>
                        </div>
                    </form>
                </Form>
            ) : (
                <Button
                    className="shrink-0 opacity-75 border-transparent border-1 border-dashed
                    hover:border-card-foreground hover:cursor-pointer
                    w-[210px] h-[110px]"
                    onClick={() => setIsEditing(true)}
                >
                    <p className="text-secondary">Add Task</p>
                </Button>
            )}
        </>
    );
};

export default AddTaskButton;