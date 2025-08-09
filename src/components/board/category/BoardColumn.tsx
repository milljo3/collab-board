import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React, { useMemo } from "react";
import { TaskCard } from "@/components/board/task/TaskCard";
import { cva } from "class-variance-authority";
import { Category, Task } from "@/types/board";
import BoardColumnDropDownMenu from "@/components/board/category/BoardColumnDropDownMenu";
import {Button} from "@/components/ui/button";

export type ColumnType = "Column";

export interface ColumnDragData {
    type: ColumnType;
    category: Category;
}

interface BoardColumnProps {
    category: Category;
    tasks: Task[];
    isOverlay?: boolean;
    disabled: boolean;
    viewer: boolean;
    onOpenDialog: (type: "editCategory" | "deleteCategory" | "addTask" | "deleteTask" | "taskModal", task?: Task, category?: Category) => void;
}

export function BoardColumn({ category, tasks, isOverlay, disabled, viewer, onOpenDialog }: BoardColumnProps) {
    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks]);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: category.id,
        data: {
            type: "Column",
            category,
        } satisfies ColumnDragData,
        attributes: {
            roleDescription: `Column: ${category.title}`,
        },
        disabled: viewer || disabled
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    const variants = cva(
        "flex flex-col flex-shrink-0 snap-center",
        {
            variants: {
                dragging: {
                    default: "border-2 border-transparent",
                    over: "ring-2 opacity-30",
                    overlay: "ring-2 ring-primary",
                },
            },
        }
    );

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${variants({
                dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
            })} 
                shrink-0 border-transparent border-1 rounded-lg w-[250px] h-fit max-h-full
                px-2 items-center gap-2 pb-2 dark:bg-card bg-secondary
            `}
        >
            <div className="flex justify-between items-center w-full gap-2">
                <h1 {...attributes}
                    {...listeners}
                    className={`w-full  p-2 select-none ${viewer || disabled ? "" : "cursor-grab"}`}
                >
                    {category.title}
                </h1>
                {!viewer && (
                    <BoardColumnDropDownMenu
                        category={category}
                        onOpenDialog={onOpenDialog}
                    />
                )}
            </div>
            <div className="flex flex-col gap-2 w-full overflow-y-auto">
                <SortableContext items={tasksIds}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            disabled={disabled}
                            viewer={viewer}
                            onOpenDialog={onOpenDialog}
                        />
                    ))}
                </SortableContext>
            </div>
            {!viewer && (
                <Button
                    className="w-full justify-start"
                    variant="ghost"
                    onClick={() => onOpenDialog("addTask", undefined, category)}
                >
                    + Add a Task
                </Button>
            )}
        </div>
    );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
    const dndContext = useDndContext();

    const variations = cva("px-2 flex py-4 h-full overflow-x-auto", {
        variants: {
            dragging: {
                default: "snap-x snap-mandatory",
                active: "snap-none",
            },
        },
    });

    return (
        <div
            className={`${variations({
                dragging: dndContext.active ? "active" : "default",
            })}
                flex gap-4 flex-row h-full`}
        >
            {children}
        </div>
    );
}