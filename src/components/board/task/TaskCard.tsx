import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import {Category, Task} from "@/types/board";
import TaskDropDownMenu from "@/components/board/task/TaskDropDownMenu";
import {GripVertical} from "lucide-react";

interface TaskCardProps {
    task: Task;
    isOverlay?: boolean;
    disabled: boolean;
    viewer: boolean;
    onOpenDialog: (type: "editCategory" | "deleteCategory" | "addTask" | "deleteTask" | "taskModal", task?: Task, category?: Category) => void;
}

export type TaskType = "Task";

export interface TaskDragData {
    type: TaskType;
    task: Task;
}

export function TaskCard({ task, isOverlay, disabled, viewer, onOpenDialog }: TaskCardProps) {
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
                over: "opacity-30",
                overlay: "ring-2 ring-primary",
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
                    shrink-0 w-full h-fit min-h-[40px] rounded-md flex flex-col items-center
                    hover:shadow-md transition-shadow px-1 bg-primary text-white""
            `}
        >
            <div className="flex w-full items-center">
                <span
                    {...attributes}
                    {...listeners}
                    className={`p-1 cursor-grab active:cursor-grabbing ${viewer || disabled ? "cursor-default" : ""}`}
                >
                    <GripVertical size={16} />
                </span>

                <p
                    className={"text-white truncate overflow-hidden whitespace-pre-wrap text-sm w-full p-1 select-none cursor-pointer"}
                    onClick={() => onOpenDialog("taskModal", task)}
                >
                    {task.title}
                </p>
            </div>
            <div className="flex justify-end w-full">
                {!viewer && (
                    <TaskDropDownMenu
                        task={task}
                        onOpenDialog={onOpenDialog}
                    />
                )}
            </div>
        </div>
    );
}