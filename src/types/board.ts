import {z} from "zod";
import {Role} from "@prisma/client";

// Prisma types
export const boardUserSchema = z.object({
    id: z.string(),
    role: z.enum(Role),
    userId: z.string(),
    boardId: z.string(),
    user: z.object({
        name: z.string(),
        email: z.email(),
    }),
});
export type BoardUser = z.infer<typeof boardUserSchema>;

export const taskSchema = z.object({
    id: z.string(),
    title: z.string()
        .min(1, "Title should be at least 1 character")
        .max(600, "Title should be at most 600 character"),
    details: z.string()
        .max(5000, "Details should be at most 5000 character").nullable(),
    position: z.number(),
    version: z.number(),
    categoryId: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Task = z.infer<typeof taskSchema>;

export const categorySchema = z.object({
    id: z.string(),
    title: z.string()
        .min(1, "Title should be at least 1 character")
        .max(125, "Title should be at most 125 character"),
    position: z.number(),
    version: z.number(),
    boardId: z.string(),
    tasks: z.array(taskSchema),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Category = z.infer<typeof categorySchema>;

export const boardSchema = z.object({
    id: z.string(),
    title: z.string()
        .min(1, "Title should be at least 1 character")
        .max(150, "Title should be at most 150 character"),
    userRole: z.enum(Role).optional(),
    version: z.number(),
    categories: z.array(categorySchema),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Board = z.infer<typeof boardSchema>;

export const getAllBoardsSchema = boardSchema.pick({id: true, title: true, version: true, createdAt: true});
export type GetAllBoards = z.infer<typeof getAllBoardsSchema>;

export const createBoardSchema = boardSchema.pick({title: true});
export type CreateBoard = z.infer<typeof createBoardSchema>;

export const updateBoardSchema = boardSchema.pick({title: true, version: true});
export type UpdateBoard = z.infer<typeof updateBoardSchema>;

export const categoryInputSchema = categorySchema.pick({title: true});
export type CategoryInput = z.infer<typeof categoryInputSchema>;

export const createCategorySchema = categorySchema.pick({title: true});
export type CreateCategory = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = categorySchema
    .pick({title: true, position: true, version: true})
    .partial({title: true, position: true});
export type UpdateCategory = z.infer<typeof updateCategorySchema>;

export const createTaskSchema = taskSchema.pick({title: true, categoryId: true});
export type CreateTask = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = taskSchema
    .pick({title: true, details: true, position: true, categoryId: true, version: true})
    .partial({title: true, details: true, position: true, categoryId: true});
export type UpdateTask = z.infer<typeof updateTaskSchema>;

export const taskTitleSchema = taskSchema.pick({title: true});
export type TaskTitle = z.infer<typeof taskTitleSchema>;

export const taskDetailsSchema = taskSchema.pick({details: true})
    .extend({details: z.string()
            .max(5000, "Details should be at most 5000 character")});
export type TaskDetails = z.infer<typeof taskDetailsSchema>;

export const deleteTaskCategory = taskSchema.pick({version: true});
export type DeleteTaskCategory = z.infer<typeof deleteTaskCategory>;

export const addBoardUserSchema = z.object({
    email: z.email(),
    role: z.enum(Role),
});
export type AddBoardUser = z.infer<typeof addBoardUserSchema>;

export const updateBoardUserSchema = addBoardUserSchema.pick({role: true});
export type UpdateBoardUser = z.infer<typeof updateBoardUserSchema>;


// Open Router AI prompt

export const generateBoardPromptSchema = z.object({
    prompt: z.string()
        .min(30, "Prompt must be at least 30 characters")
        .max(500, "Prompt must not exceed 500 characters"),
    includeTasks: z.boolean(),
});
export type GenerateBoardPromptSchema = z.infer<typeof generateBoardPromptSchema>;

export const generateTaskSchema = taskSchema.pick({title: true, details: true});

export const generateCategorySchema = categorySchema.pick({title: true, tasks: true})
    .extend({tasks: z.array(generateTaskSchema)});

export const generateBoardSchema = boardSchema.pick({title: true})
    .extend({categories: z.array(generateCategorySchema),});
export type GenerateBoard = z.infer<typeof generateBoardSchema>;