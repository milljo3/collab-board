import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { Task } from "@/types/board";
import TaskDropDownMenu from "@/components/board/task/TaskDropDownMenu";

interface TaskCardProps {
    task: Task;
    boardId: string;
    isOverlay?: boolean;
    disabled: boolean;
    viewer: boolean;
}

export type TaskType = "Task";

export interface TaskDragData {
    type: TaskType;
    task: Task;
}

export function TaskCard({ task, boardId, isOverlay, disabled, viewer }: TaskCardProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        } satisfies TaskDragData,
        attributes: {
            roleDescription: "Task",
        },
        disabled: viewer || disabled
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    const variants = cva("", {
        variants: {
            dragging: {
                over: "ring-2 opacity-30",
                overlay: "ring-2 ring-primary text-white",
            },
        },
    });

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${variants({
                dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
            })} 
                    shrink-0 bg-card w-full h-fit min-h-[40px] rounded-md flex flex-col items-center
                    hover:shadow-md transition-shadow px-1
            `}
        >
            <p
                {...attributes}
                {...listeners}
                className={`truncate overflow-hidden whitespace-pre-wrap text-sm w-full p-1 select-none ${viewer || disabled ? "" : "cursor-grab active:cursor-grabbing"}`}
            >
                {task.description}
            </p>
            <div className="flex justify-end w-full">
                {!viewer && (
                    <TaskDropDownMenu
                        boardId={boardId}
                        categoryId={task.categoryId}
                        taskId={task.id}
                        description={task.description}
                        version={task.version}
                    />
                )}
            </div>
        </div>
    );
}