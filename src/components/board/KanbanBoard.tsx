import React, {useEffect, useMemo, useRef, useState, useCallback} from "react";
import { createPortal } from "react-dom";
import { useDebouncedCallback } from 'use-debounce';

import { BoardColumn, BoardContainer } from "@/components/board/category/BoardColumn";
import {
    DndContext,
    type DragEndEvent,
    type DragOverEvent,
    DragOverlay,
    type DragStartEvent,
    useSensor,
    useSensors,
    KeyboardSensor,
    Announcements,
    TouchSensor,
    MouseSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { TaskCard } from "@/components/board/task/TaskCard";
import { hasDraggableData } from "@/components/board/utils";
import { coordinateGetter } from "@/components/board/multipleContainersKeyboardPreset";
import {Task, Category} from "@/types/board";
import {POSITION_CONFIG} from "@/consts/position";
import {useBoardQuery} from "@/hooks/useBoardQuery";
import {Loader2} from "lucide-react";
import {useMoveTask} from "@/hooks/task/useMoveTask";
import {useMoveCategory} from "@/hooks/category/useMoveCategory";
import AddCategoryDialog from "@/components/board/category/AddCategoryDialog";
import {Role} from "@prisma/client";
import Presence from "@/components/board/Presence";
import {ConnectionStatus} from "@/components/ConnectionStatus";
import UpdateCategoryDialog from "@/components/board/category/UpdateCategoryDialog";
import DeleteCategoryDialog from "./category/DeleteCategoryDialog";
import AddTaskDialog from "@/components/board/task/AddTaskDialog";
import DeleteTaskDialog from "@/components/board/task/DeleteTaskDialog";
import {TaskDialog} from "@/components/board/task/TaskDialog";

interface KanbanBoardProps {
    boardId: string,
}


export function KanbanBoard({ boardId }: KanbanBoardProps) {
    const { data, isLoading, error } = useBoardQuery(boardId);

    const moveTask = useMoveTask(boardId);
    const moveCategory = useMoveCategory(boardId);

    const [dragStartState, setDragStartState] = useState<{
        taskId: string;
        originalCategoryId: string;
        originalPosition: number;
    } | null>(null);
    const [columns, setColumns] = useState<Category[]>([]);
    const pickedUpTaskColumn = useRef<string | null>(null);
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

    const [tasks, setTasks] = useState<Task[]>([]);

    const [activeColumn, setActiveColumn] = useState<Category | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const [activeDialog, setActiveDialog] = useState<"editCategory" | "deleteCategory" | "addTask" | "deleteTask" | "taskModal" | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    useEffect(() => {
        if (!data || !selectedTask) return;

        const updatedTask = data.categories
            .flatMap(category => category.tasks)
            .find(task => task.id === selectedTask.id);

        if (updatedTask && (updatedTask.title !== selectedTask.title || updatedTask.details !== selectedTask.details)) {
            setSelectedTask(updatedTask);
        }
    }, [data, selectedTask]);

    const handleOpenDialog =
        (type: "editCategory" | "deleteCategory" | "addTask" | "deleteTask" | "taskModal", task?: Task, category?: Category) => {

        if (!task && !category) {
            return;
        }

        if (task) {
            setSelectedCategory(null)
            setSelectedTask(task);
        }

        if (category) {
            setSelectedTask(null);
            setSelectedCategory(category);
        }

        setActiveDialog(type);
    }

    const handleCloseDialog = () => {
        setActiveDialog(null);
        setSelectedTask(null);
        setSelectedCategory(null);
    }

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: coordinateGetter,
        })
    );

    const taskMap = useMemo(() => {
        return new Map(tasks.map(task => [task.id, task]));
    }, [tasks]);

    const getTasksByColumnId = useMemo(() => {
        const cache = new Map<string, Task[]>();
        return (columnId: string) => {
            if (!cache.has(columnId)) {
                const filtered = tasks.filter(task => task.categoryId === columnId)
                    .sort((a, b) => a.position - b.position);
                cache.set(columnId, filtered);
            }
            return cache.get(columnId)!;
        };
    }, [tasks]);

    const getColumnById = useCallback((columnId: string) => {
        return columns.find(col => col.id === columnId);
    }, [columns]);

    const calculateNewPosition = useCallback((prevPosition?: number, nextPosition?: number): number => {
        if (prevPosition === undefined && nextPosition === undefined) {
            return POSITION_CONFIG.INITIAL_POSITION;
        }
        if (prevPosition === undefined) return nextPosition! - POSITION_CONFIG.GAP;
        if (nextPosition === undefined) return prevPosition + POSITION_CONFIG.GAP;
        return (prevPosition + nextPosition) / 2;
    }, []);

    const updatePositionsAfterMove = useCallback(<T extends { id: string; position: number }>(
        items: T[],
        movedId: string,
        newIndex: number
    ): T[] => {
        const sortedItems = [...items].sort((a, b) => a.position - b.position);
        const movedItem = sortedItems.find(item => item.id === movedId);
        if (!movedItem) return items;

        const withoutMoved = sortedItems.filter(item => item.id !== movedId);
        const prevItem = withoutMoved[newIndex - 1];
        const nextItem = withoutMoved[newIndex];
        const newPosition = calculateNewPosition(prevItem?.position, nextItem?.position);

        return items.map(item =>
            item.id === movedId ? { ...item, position: newPosition } : item
        );
    }, [calculateNewPosition]);

    const updateTaskPositions = useCallback((
        tasks: Task[],
        activeTaskId: string,
        targetCategoryId: string,
        newIndex: number
    ): Task[] => {
        const activeTask = taskMap.get(activeTaskId);
        if (!activeTask) return tasks;

        const tasksInTargetColumn = getTasksByColumnId(targetCategoryId)
            .filter(task => task.id !== activeTaskId);

        const prevTask = tasksInTargetColumn[newIndex - 1];
        const nextTask = tasksInTargetColumn[newIndex];
        const newPosition = calculateNewPosition(prevTask?.position, nextTask?.position);

        return tasks.map(task =>
            task.id === activeTaskId
                ? { ...task, categoryId: targetCategoryId, position: newPosition }
                : task
        );
    }, [taskMap, getTasksByColumnId, calculateNewPosition]);

    const handleSameColumnMove = useCallback((tasks: Task[], activeId: string, overId: string) => {
        const activeTask = taskMap.get(activeId);
        if (!activeTask) return tasks;

        const tasksInColumn = getTasksByColumnId(activeTask.categoryId);
        const activeIndex = tasksInColumn.findIndex(t => t.id === activeId);
        const overIndex = tasksInColumn.findIndex(t => t.id === overId);

        if (activeIndex === overIndex) return tasks;

        const reordered = arrayMove(tasksInColumn, activeIndex, overIndex);
        const updated = updatePositionsAfterMove(reordered, activeId, overIndex);

        return tasks.map(task => updated.find(t => t.id === task.id) || task);
    }, [taskMap, getTasksByColumnId, updatePositionsAfterMove]);

    const debouncedSetTasks = useDebouncedCallback((updateFn: (prevTasks: Task[]) => Task[]) => {
        setTasks(updateFn);
    }, 36);

    useEffect(() => {
        if (!data) return;

        setColumns([...data.categories].sort((a, b) => a.position - b.position));
        setTasks(
            data.categories
                .flatMap((cat) => cat.tasks)
                .sort((a, b) => a.position - b.position)
        );
    }, [data]);

    function getDraggingTaskData(taskId: string, columnId: string) {
        const tasksInColumn = getTasksByColumnId(columnId);
        const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
        const column = getColumnById(columnId);
        return {
            tasksInColumn,
            taskPosition,
            column,
        };
    }

    const announcements: Announcements = {
        onDragStart({ active }) {
            if (!hasDraggableData(active)) return;
            if (active.data.current?.type === "Column") {
                const startColumnIdx = columnsId.findIndex((id) => id === active.id);
                const startColumn = columns[startColumnIdx];
                return `Picked up Column ${startColumn?.title} at position: ${
                    startColumnIdx + 1
                } of ${columnsId.length}`;
            } else if (active.data.current?.type === "Task") {
                pickedUpTaskColumn.current = active.data.current.task.categoryId;
                const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
                    active.id as string,
                    pickedUpTaskColumn.current!
                );
                return `Picked up Task ${
                    active.data.current.task.title
                } at position: ${taskPosition + 1} of ${
                    tasksInColumn.length
                } in column ${column?.title}`;
            }
        },
        onDragOver({ active, over }) {
            if (!hasDraggableData(active) || !hasDraggableData(over)) return;

            if (
                active.data.current?.type === "Column" &&
                over.data.current?.type === "Column"
            ) {
                const overColumnIdx = columnsId.findIndex((id) => id === over.id);
                return `Column ${active.data.current.category.title} was moved over ${
                    over.data.current.category.title
                } at position ${overColumnIdx + 1} of ${columnsId.length}`;
            } else if (
                active.data.current?.type === "Task" &&
                over.data.current?.type === "Task"
            ) {
                const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
                    over.id as string,
                    over.data.current.task.categoryId
                );
                if (over.data.current.task.categoryId !== pickedUpTaskColumn.current) {
                    return `Task ${
                        active.data.current.task.title
                    } was moved over column ${column?.title} in position ${
                        taskPosition + 1
                    } of ${tasksInColumn.length}`;
                }
                return `Task was moved over position ${taskPosition + 1} of ${
                    tasksInColumn.length
                } in column ${column?.title}`;
            }
        },
        onDragEnd({ active, over }) {
            if (!hasDraggableData(active) || !hasDraggableData(over)) {
                pickedUpTaskColumn.current = null;
                return;
            }
            if (
                active.data.current?.type === "Column" &&
                over.data.current?.type === "Column"
            ) {
                const overColumnPosition = columnsId.findIndex((id) => id === over.id);

                return `Column ${
                    active.data.current.category.title
                } was dropped into position ${overColumnPosition + 1} of ${
                    columnsId.length
                }`;
            } else if (
                active.data.current?.type === "Task" &&
                over.data.current?.type === "Task"
            ) {
                const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
                    over.id as string,
                    over.data.current.task.categoryId
                );
                if (over.data.current.task.categoryId !== pickedUpTaskColumn.current) {
                    return `Task was dropped into column ${column?.title} in position ${
                        taskPosition + 1
                    } of ${tasksInColumn.length}`;
                }
                return `Task was dropped into position ${taskPosition + 1} of ${
                    tasksInColumn.length
                } in column ${column?.title}`;
            }
            pickedUpTaskColumn.current = null;
        },
        onDragCancel({ active }) {
            pickedUpTaskColumn.current = null;
            if (!hasDraggableData(active)) return;
            return `Dragging ${active.data.current?.type} cancelled.`;
        },
    };

    const onDragCancel = useCallback(() => {
        setActiveColumn(null);
        setActiveTask(null);
        setDragStartState(null);
        pickedUpTaskColumn.current = null;
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center h-dvh justify-center">
                <p>Fetching board...</p>
                <Loader2 className="animate-spin h-6 w-6" />
            </div>
        )
    }
    if (error || !data) {
        if (!data) {
            return <p>NO DATA</p>
        }
        return <p>Error</p>
    }

    const viewer = data.userRole === Role.VIEWER;

    return (
        <DndContext
            accessibility={{
                announcements,
            }}
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDragCancel={onDragCancel}
        >
            <div className="p-2 pl-4 justify-between flex">
                <h1>{data.title}</h1>
                <div className="flex justify-between gap-4">
                    <ConnectionStatus />
                    <Presence maxVisible={5} />
                    {!viewer && (
                        <AddCategoryDialog boardId={boardId} />
                    )}
                </div>
            </div>
            <BoardContainer>
                <SortableContext items={columnsId}>
                    {columns.map((col) => (
                        <BoardColumn
                            key={col.id}
                            category={col}
                            tasks={getTasksByColumnId(col.id)}
                            disabled={moveTask.isPending || moveCategory.isPending}
                            viewer={viewer}
                            onOpenDialog={handleOpenDialog}
                        />
                    ))}
                </SortableContext>
            </BoardContainer>

            {"document" in window &&
                createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <BoardColumn
                                isOverlay
                                category={activeColumn}
                                tasks={getTasksByColumnId(activeColumn.id)}
                                disabled={moveTask.isPending || moveCategory.isPending}
                                viewer={viewer}
                                onOpenDialog={handleOpenDialog}
                            />
                        )}
                        {activeTask &&
                            <TaskCard
                                task={activeTask}
                                isOverlay
                                disabled={moveTask.isPending || moveCategory.isPending}
                                viewer={viewer}
                                onOpenDialog={handleOpenDialog}
                            />
                        }
                    </DragOverlay>,
                    document.body
                )}

            {activeDialog === "editCategory" && selectedCategory && (
                <UpdateCategoryDialog
                    boardId={boardId}
                    categoryId={selectedCategory.id}
                    title={selectedCategory.title}
                    version={selectedCategory.version}
                    open={activeDialog !== null}
                    onClose={handleCloseDialog}
                />
            )}

            {activeDialog === "deleteCategory" && selectedCategory && (
                <DeleteCategoryDialog
                    boardId={boardId}
                    categoryId={selectedCategory.id}
                    title={selectedCategory.title}
                    version={selectedCategory.version}
                    open={activeDialog !== null}
                    onClose={handleCloseDialog}
                />
            )}

            {activeDialog === "addTask" && selectedCategory && (
                <AddTaskDialog
                    boardId={boardId}
                    categoryId={selectedCategory.id}
                    open={activeDialog !== null}
                    onClose={handleCloseDialog}
                />
            )}

            {activeDialog === "deleteTask" && selectedTask && (
                <DeleteTaskDialog
                    boardId={boardId}
                    task={selectedTask}
                    open={activeDialog !== null}
                    onClose={handleCloseDialog}
                />
            )}

            {activeDialog === "taskModal" && selectedTask && (
                <TaskDialog
                    boardId={boardId}
                    task={selectedTask}
                    open={activeDialog !== null}
                    onClose={handleCloseDialog}
                />
            )}

        </DndContext>
    );

    function onDragStart(event: DragStartEvent) {
        if (!hasDraggableData(event.active)) return;
        const data = event.active.data.current;
        if (data?.type === "Column") {
            setActiveColumn(data.category);
            return;
        }

        if (data?.type === "Task") {
            setActiveTask(data.task);
            pickedUpTaskColumn.current = data.task.categoryId;

            setDragStartState({
                taskId: data.task.id,
                originalCategoryId: data.task.categoryId,
                originalPosition: data.task.position
            });
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;

        if (dragStartState && active.data.current?.type === "Task") {
            const currentTask = taskMap.get(dragStartState.taskId);

            if (currentTask) {
                const hasChanged =
                    currentTask.categoryId !== dragStartState.originalCategoryId ||
                    Math.abs(currentTask.position - dragStartState.originalPosition) > 0.001;

                if (hasChanged) {
                    moveTask.mutate({
                        taskId: currentTask.id,
                        data: {
                            version: currentTask.version,
                            categoryId: currentTask.categoryId,
                            position: currentTask.position
                        }
                    });
                }
            }

            setDragStartState(null);
        }

        if (!over || !hasDraggableData(active) || active.id === over.id) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        if (activeData?.type === "Column") {
            const activeIndex = columns.findIndex(col => col.id === active.id);
            const overIndex = columns.findIndex(col => col.id === over.id);
            const reordered = arrayMove(columns, activeIndex, overIndex);
            const updatedColumns = updatePositionsAfterMove(reordered, active.id as string, overIndex);

            const updatedColumn = updatedColumns.find(col => col.id === active.id);

            setColumns(updatedColumns);

            if (updatedColumn) {
                moveCategory.mutate({
                    categoryId: updatedColumn.id,
                    data: {
                        version: updatedColumn.version,
                        position: updatedColumn.position
                    }
                });
            }

            return;
        }

        if (activeData?.type === "Task" && hasDraggableData(over)) {
            debouncedSetTasks(prevTasks => {
                const activeTask = taskMap.get(active.id as string);
                if (!activeTask) return prevTasks;

                if (overData?.type === "Task") {
                    const overTask = taskMap.get(over.id as string);
                    if (!overTask) return prevTasks;

                    const tasksInTargetColumn = getTasksByColumnId(overTask.categoryId);
                    const overIndex = tasksInTargetColumn.findIndex(t => t.id === over.id);

                    return activeTask.categoryId !== overTask.categoryId
                        ? updateTaskPositions(prevTasks, active.id as string, overTask.categoryId, overIndex)
                        : handleSameColumnMove(prevTasks, active.id as string, over.id as string);
                }

                if (overData?.type === "Column" && activeTask.categoryId !== over.id) {
                    const tasksInTargetColumn = getTasksByColumnId(over.id as string);
                    return updateTaskPositions(prevTasks, active.id as string, over.id as string, tasksInTargetColumn.length);
                }

                return prevTasks;
            });
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        if (!hasDraggableData(active) || !hasDraggableData(over)) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        const isActiveATask = activeData?.type === "Task";
        const isOverATask = overData?.type === "Task";

        if (!isActiveATask) return;

        if (isActiveATask && isOverATask) {
            debouncedSetTasks(prevTasks => {
                const activeTask = taskMap.get(activeId as string);
                const overTask = taskMap.get(overId as string);

                if (!activeTask || !overTask) return prevTasks;

                if (activeTask.categoryId !== overTask.categoryId) {
                    const tasksInTargetColumn = getTasksByColumnId(overTask.categoryId);
                    const overTaskIndex = tasksInTargetColumn.findIndex(task => task.id === overId);
                    return updateTaskPositions(prevTasks, activeId as string, overTask.categoryId, overTaskIndex);
                } else {
                    return handleSameColumnMove(prevTasks, activeId as string, overId as string);
                }
            });
        }

        const isOverAColumn = overData?.type === "Column";

        if (isActiveATask && isOverAColumn) {
            debouncedSetTasks(prevTasks => {
                const activeTask = taskMap.get(activeId as string);
                if (!activeTask || activeTask.categoryId === overId) return prevTasks;

                const tasksInTargetColumn = getTasksByColumnId(over.id as string);

                return updateTaskPositions(prevTasks, activeId as string, over.id as string, tasksInTargetColumn.length);
            });
        }
    }
}