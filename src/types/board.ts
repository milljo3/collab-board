import {z} from "zod";
import {Role} from "@prisma/client";

// Prisma types
export const boardUserSchema = z.object({
    id: z.string(),
    role: z.enum(Role),
    userId: z.string(),
    boardId: z.string(),
});
export type BoardUser = z.infer<typeof boardUserSchema>;

export const taskSchema = z.object({
    id: z.string(),
    description: z.string(),
    position: z.number(),
    version: z.number(),
    categoryId: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Task = z.infer<typeof taskSchema>;

export const categorySchema = z.object({
    id: z.string(),
    title: z.string(),
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
    title: z.string(),
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

export const createCategorySchema = categorySchema.pick({title: true});
export type CreateCategory = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = categorySchema
    .pick({title: true, position: true, version: true})
    .partial({title: true, position: true});
export type UpdateCategory = z.infer<typeof updateCategorySchema>;

export const taskInputSchema = taskSchema.pick({description: true});
export type TaskInput = z.infer<typeof taskInputSchema>;

export const createTaskSchema = taskSchema.pick({description: true, categoryId: true});
export type CreateTask = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = taskSchema
    .pick({description: true, position: true, categoryId: true, version: true})
    .partial({description: true, position: true, categoryId: true});
export type UpdateTask = z.infer<typeof updateTaskSchema>;

export const deleteTaskCategory = taskSchema.pick({version: true});
export type DeleteTaskCategory = z.infer<typeof deleteTaskCategory>;