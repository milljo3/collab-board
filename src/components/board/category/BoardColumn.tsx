import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { TaskCard } from "@/components/board/task/TaskCard";
import { cva } from "class-variance-authority";
import { Category, Task } from "@/types/board";
import AddTaskDialog from "@/components/board/task/AddTaskDialog";
import BoardColumnDropDownMenu from "@/components/board/category/BoardColumnDropDownMenu";

export type ColumnType = "Column";

export interface ColumnDragData {
    type: ColumnType;
    category: Category;
}

interface BoardColumnProps {
    category: Category;
    tasks: Task[];
    isOverlay?: boolean;
    boardId: string;
    disabled: boolean;
    viewer: boolean;
}

export function BoardColumn({ category, tasks, isOverlay, boardId, disabled, viewer }: BoardColumnProps) {
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
        "bg-primary-foreground flex flex-col flex-shrink-0 snap-center",
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
                shrink-0 border-transparent border-1 text-secondary rounded-lg bg-gray-700 w-[250px] h-fit max-h-full
                px-2 items-center gap-2 pb-2
            `}
        >
            <div className="flex justify-between items-center w-full gap-2">
                <h1 {...attributes}
                    {...listeners}
                    className={`w-full text-black p-2 select-none ${viewer ? "" : "cursor-grab"}`}
                >
                    {category.title}
                </h1>
                {!viewer && (
                    <BoardColumnDropDownMenu
                        boardId={boardId}
                        categoryId={category.id}
                        title={category.title}
                        version={category.version}
                    />
                )}
            </div>
            <div className="flex flex-col gap-2 w-full overflow-y-auto">
                <SortableContext items={tasksIds}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            boardId={boardId}
                            disabled={disabled}
                            viewer={viewer}
                        />
                    ))}
                </SortableContext>
            </div>
            {!viewer && (
                <AddTaskDialog boardId={boardId} categoryId={category.id} />
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