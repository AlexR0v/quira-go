import { TaskStatus, TaskStatusColor, TTask } from "@/models/task.ts";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { KanbanColumnHeader } from "@/features/task/components/kanban-column-header.tsx";
import { CircleCheckIcon, CircleDashedIcon, CircleDotDashedIcon, CircleDotIcon, CircleIcon } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { KanbanCard } from "@/features/task/components/kanban-card.tsx";

const boards: TaskStatus[] = [
    TaskStatus.BACKLOG,
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_REVIEW,
    TaskStatus.DONE,
]

type TasksState = {
    [key in TaskStatus]: TTask[]
}

export const statusIconMap: Record<TaskStatus, React.ReactNode> = {
    [TaskStatus.BACKLOG]: <CircleDashedIcon className={cn("size-[18px]", TaskStatusColor[TaskStatus.BACKLOG])}/>,
    [TaskStatus.TODO]: <CircleIcon className={cn("size-[18px]", TaskStatusColor[TaskStatus.TODO])}/>,
    [TaskStatus.IN_PROGRESS]: <CircleDotDashedIcon
        className={cn("size-[18px]", TaskStatusColor[TaskStatus.IN_PROGRESS])}/>,
    [TaskStatus.IN_REVIEW]: <CircleDotIcon className={cn("size-[18px]", TaskStatusColor[TaskStatus.IN_REVIEW])}/>,
    [TaskStatus.DONE]: <CircleCheckIcon className={cn("size-[18px]", TaskStatusColor[TaskStatus.DONE])}/>,
}

interface Props {
    data: TTask[]
    onChange: (tasks: TTask[]) => void
}

export const DataKanban = ({ data, onChange }: Props) => {

    const [tasks, setTasks] = useState<TasksState>(() => {
        const initialTasks: TasksState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEW]: [],
            [TaskStatus.DONE]: [],
        }

        data.forEach(task => {
            initialTasks[task.status].push(task)
        })
        Object.keys(initialTasks).forEach(key => {
            initialTasks[key as TaskStatus].sort((a, b) => a.position - b.position)
        })

        return initialTasks
    })

    useEffect(() => {
        const initialTasks: TasksState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEW]: [],
            [TaskStatus.DONE]: [],
        }

        data.forEach(task => {
            initialTasks[task.status].push(task)
        })
        Object.keys(initialTasks).forEach(key => {
            initialTasks[key as TaskStatus].sort((a, b) => a.position - b.position)
        })

        setTasks(initialTasks)
    }, [data]);

    const onDragEnd = useCallback((res: DropResult) => {
        if (!res.destination) return
        const { source, destination } = res
        const sourceStatus = source.droppableId as TaskStatus
        const destinationStatus = destination.droppableId as TaskStatus

        let updatePayload: TTask[]

        setTasks(prevTask => {
            const newTask = { ...prevTask }
            const sourceColumn = [...newTask[sourceStatus]]
            const [movedTask] = sourceColumn.splice(source.index, 1)
            if (!movedTask) {
                return prevTask
            }
            const updatedTask = sourceStatus !== destinationStatus
                ? { ...movedTask, status: destinationStatus }
                : movedTask

            newTask[sourceStatus] = sourceColumn
            const destinationColumn = [...newTask[destinationStatus]]
            destinationColumn.splice(destination.index, 0, updatedTask)
            newTask[destinationStatus] = destinationColumn

            updatePayload = []
            updatePayload.push({
                ...updatedTask,
                id: updatedTask.id.toString(),
                status: destinationStatus,
                position: Math.min((destination?.index + 1) * 1000, 1_000_000)
            })
            newTask[destinationStatus].forEach((task, index) => {
                if (task && task.id !== updatedTask.id) {
                    const position = Math.min((index + 1) * 1000, 1_000_000)
                    if (task.position !== position) {
                        updatePayload.push({
                            ...task,
                            id: task.id.toString(),
                            status: destinationStatus,
                            position
                        })
                    }
                }
            })

            if (sourceStatus !== destinationStatus) {
                newTask[sourceStatus].forEach((task, index) => {
                    if (task) {
                        const position = Math.min((index + 1) * 1000, 1_000_000)
                        if (task.position !== position) {
                            updatePayload.push({
                                ...task,
                                id: task.id.toString(),
                                status: sourceStatus,
                                position
                            })
                        }
                    }
                })
            }
            return newTask
        })
        // @ts-ignore
        onChange(updatePayload)
    }, [onChange])

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto">
                {boards.map((board) => (
                    <div key={board} className="min-w-[200px] flex-1 mx-2 bg-muted p-1.5 rounded-md">
                        <KanbanColumnHeader
                            board={board}
                            tasksCount={tasks[board].length}
                        />
                        <Droppable droppableId={board}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="min-h-[200px] py-1.5"
                                >
                                    {tasks[board].map((task, index) => (
                                        <Draggable draggableId={task.id.toString()} key={task.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                    className="bg-muted p-1.5 rounded-md mb-2"
                                                >
                                                    <KanbanCard task={task}/>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    )
}