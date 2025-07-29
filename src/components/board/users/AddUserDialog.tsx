import React, {useState} from 'react';
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {AddBoardUser, addBoardUserSchema} from "@/types/board";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {useCreateBoardUser} from "@/hooks/board-users/useCreateBoardUser";
import {Role} from "@prisma/client";

interface AddUserDialogProps {
    boardId: string;
}

const AddUserDialog = ({ boardId }: AddUserDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const addUser = useCreateBoardUser(boardId);

    const form = useForm<AddBoardUser>({
        resolver: zodResolver(addBoardUserSchema),
        defaultValues: {
            email: "",
            role: Role.VIEWER
        }
    });

    const onSubmit = (addedUser: AddBoardUser) => {
        addUser.mutate(addedUser);
        form.reset();
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    + Add a User
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add a user to the board</DialogTitle>
                    <DialogDescription>
                        Enter the user&#39;s email and click add to add the user to the board.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@example.com" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-[180px] text-black">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="EDITOR">{Role.EDITOR}</SelectItem>
                                            <SelectItem value="VIEWER">{Role.VIEWER}</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                disabled={addUser.isPending}
                            >
                                {addUser.isPending ? "Adding..." : "Add"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddUserDialog;