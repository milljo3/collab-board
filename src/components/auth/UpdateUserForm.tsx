"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/lib/auth-client";

interface UpdateUserFormProps {
    name: string;
}

const updateUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
});

type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

const UpdateUserForm = ({ name }: UpdateUserFormProps) => {
    const router = useRouter();

    const form = useForm<UpdateUserFormValues>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            name,
        },
    });

    const isPending = form.formState.isSubmitting;

    async function onSubmit(data: UpdateUserFormValues) {
        if (name === data.name) {
            return;
        }

        await updateUser({
            name: data.name,
            fetchOptions: {
                onRequest: () => {},
                onResponse: () => {},
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
                onSuccess: () => {
                    toast.success("User updated successfully");
                    router.refresh();
                },
            },
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-sm w-full space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}>
                    Update User
                </Button>
            </form>
        </Form>
    );
};

export default UpdateUserForm;
