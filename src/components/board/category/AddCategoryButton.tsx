import React, {useEffect, useRef, useState} from "react";
import {useCreateCategory} from "@/hooks/category/useCreateCategory";
import {useForm} from "react-hook-form";
import {CreateCategory, createCategorySchema} from "@/types/board";
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

interface AddCategoryButtonProps {
    boardId: string;
}

const AddCategoryButton = ({boardId}: AddCategoryButtonProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const createCategory = useCreateCategory(boardId);


    const form = useForm<CreateCategory>({
        resolver: zodResolver(createCategorySchema),
        defaultValues: {
            title: "",
        }
    });

    const onSubmit = (createdCategory: CreateCategory) => {
        setIsEditing(false);
        createCategory.mutate(createdCategory);
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
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="shrink-0 opacity-75 border-transparent border-1 border-dashed
                          bg-card text-secondary rounded-md
                          w-[250px] h-[150px]
                          flex flex-col justify-around px-2"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter title"
                                            {...field}
                                            ref={(e) => {
                                                field.ref(e);
                                                inputRef.current = e;
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    form.handleSubmit(onSubmit)();
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
                            <Button disabled={createCategory.isPending} onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="secondary" disabled={createCategory.isPending}>
                                {createCategory.isPending ? "Adding..." : "Add"}
                            </Button>
                        </div>
                    </form>
                </Form>
            ) : (
                <Button
                    className="shrink-0 opacity-75 border-transparent border-1 border-dashed
                    hover:border-card-foreground hover:cursor-pointer
                    w-[250px] h-[150px]"
                    onClick={() => setIsEditing(true)}
                >
                    <p className="text-secondary">Add Category</p>
                </Button>
            )}
        </>
    );
};

export default AddCategoryButton;