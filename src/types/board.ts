import {z} from "zod";
import {Role} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

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
    position: z.preprocess(val => {
        if (val instanceof Decimal) {
            return val.toNumber();
        }
        if (typeof val === "string" || typeof val === "number") {
            return parseFloat(val as string);
        }
        return val;
    }, z.number()),
    version: z.number(),
    categoryId: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Task = z.infer<typeof taskSchema>;

export const categorySchema = z.object({
    id: z.string(),
    title: z.string(),
    position: z.preprocess(val => {
        if (val instanceof Decimal) {
            return val.toNumber();
        }
        if (typeof val === "string" || typeof val === "number") {
            return parseFloat(val as string);
        }
        return val;
    }, z.number()),
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
    users: z.array(boardUserSchema),
    categories: z.array(categorySchema),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type Board = z.infer<typeof boardSchema>;

export const getAllBoardsSchema = boardSchema.pick({id: true, title: true}).array();
export type GetAllBoards = z.infer<typeof getAllBoardsSchema>;

export const updateBoardSchema = boardSchema.pick({title: true, version: true});
export type UpdateBoard = z.infer<typeof updateBoardSchema>;