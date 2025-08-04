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
import {CreateBoard, createBoardSchema, generateBoardPromptSchema, GenerateBoardPromptSchema} from "@/types/board";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useCreateBoard} from "@/hooks/all-boards/useCreateBoard";
import {useGenerateBoard} from "@/hooks/all-boards/useGenerateBoard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {CircleQuestionMark} from "lucide-react";

const CreateBoardDialog = () => {
    const [isOpen, setIsOpen] = useState(false);

    const createBoard = useCreateBoard();
    const emptyForm = useForm<CreateBoard>({
        resolver: zodResolver(createBoardSchema),
        defaultValues: {
            title: "",
        }
    });

    const generateBoard = useGenerateBoard();
    const aiForm = useForm<GenerateBoardPromptSchema>({
        resolver: zodResolver(generateBoardPromptSchema),
        defaultValues: {
            prompt: "",
            includeTasks: false
        }
    });

    const onSubmitEmpty = (data: CreateBoard) => {
        createBoard.mutate(data);
        emptyForm.reset();
        setIsOpen(false);
    };

    const onSubmitAI = (data: GenerateBoardPromptSchema) => {
        generateBoard.mutate(data);
        aiForm.reset();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="m-2">+ New Board</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create a new board</DialogTitle>
                    <DialogDescription>
                        Choose between creating an empty board or generating one with AI.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="empty">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="empty">Empty</TabsTrigger>
                        <TabsTrigger value="ai">AI Generated</TabsTrigger>
                    </TabsList>

                    <TabsContent value="empty">
                        <Form {...emptyForm}>
                            <form onSubmit={emptyForm.handleSubmit(onSubmitEmpty)} className="grid gap-4">
                                <FormField
                                    control={emptyForm.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Board title" {...field} />
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
                                        disabled={createBoard.isPending}
                                    >
                                        Create
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </TabsContent>

                    <TabsContent value="ai">
                        <Form {...aiForm}>
                            <form onSubmit={aiForm.handleSubmit(onSubmitAI)} noValidate className="grid gap-4">
                                <FormField
                                    control={aiForm.control}
                                    name="prompt"
                                    render={({ field }) => {
                                        const charCount = field.value?.length || 0;
                                        const maxChars = 500;

                                        return (
                                            <FormItem>
                                                <FormLabel>Prompt</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe your board..."
                                                        className="resize-none h-40"
                                                        {...field}
                                                    />
                                                </FormControl>

                                                <div className="flex justify-between text-sm mt-1">
                                                    <div className="min-h-[1.25rem]">
                                                        <FormMessage />
                                                    </div>
                                                    <span className={charCount > maxChars ? "text-red-500" : ""}>
                                                        {charCount}/{maxChars}
                                                    </span>
                                                </div>

                                            </FormItem>
                                        );
                                    }}
                                />

                                <FormField
                                    control={aiForm.control}
                                    name="includeTasks"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="flex items-center gap-1">
                                                <FormLabel>Include Tasks</FormLabel>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <CircleQuestionMark className="h-4 w-4" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Whether you want tasks to be generated as well or just categories.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
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
                                    <Button type="submit" disabled={generateBoard.isPending}>
                                        Generate
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default CreateBoardDialog;