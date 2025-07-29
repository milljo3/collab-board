import { Active, DataRef, Over } from "@dnd-kit/core";
import { ColumnDragData } from "@/components/board/category/BoardColumn";
import { TaskDragData } from "@/components/board/task/TaskCard";

type DraggableData = ColumnDragData | TaskDragData;

export function hasDraggableData<T extends Active | Over>(
    entry: T | null | undefined
): entry is T & {
    data: DataRef<DraggableData>;
} {
    if (!entry) {
        return false;
    }

    const data = entry.data.current;

    return data?.type === "Column" || data?.type === "Task";
}