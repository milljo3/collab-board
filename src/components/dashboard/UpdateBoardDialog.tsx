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
import {CreateBoard, createBoardSchema} from "@/types/board";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {useUpdateBoard} from "@/hooks/board/useUpdateBoard";
import {useEffect} from "react";

interface UpdateBoardDialogProps {
    boardId: string;
    version: number;
    title: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const UpdateBoardDialog = ({boardId, version, title, open, onOpenChange}: UpdateBoardDialogProps) => {
    const updateBoard = useUpdateBoard(boardId);

    const form = useForm<CreateBoard>({
        resolver: zodResolver(createBoardSchema),
        defaultValues: {
            title
        }
    });

    const onSubmit = (data: CreateBoard) => {
        form.reset();
        updateBoard.mutate({title: data.title, version});
        onOpenChange(false);
    }

    useEffect(() => {
        form.reset({ title });
    }, [title, form]);


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update the board title</DialogTitle>
                    <DialogDescription>
                        Enter the board title and click save to update the board title.
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
                                        <Input placeholder="Board title" {...field} />
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
                                disabled={updateBoard.isPending}
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateBoardDialog;