import { TaskStatus, TaskStatusRu } from "@/models/task.ts";
import { statusIconMap } from "@/features/task/components/data-kanban.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "lucide-react";
import { useCreateTaskModal } from "@/features/task/hooks/useCreateTaskModal.tsx";

interface Props {
    board: TaskStatus
    tasksCount: number
}

export const KanbanColumnHeader = ({ board, tasksCount }: Props) => {

    const {open} = useCreateTaskModal()

    return (
        <div className="px-2 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <div>{statusIconMap[board]}</div>
                <p className="text-sm font-medium">
                    {TaskStatusRu[board]}
                </p>
                <div
                    className="flex items-center size-5 justify-center rounded-md bg-neutral-200 text-neutral-600 text-xs">
                    {tasksCount}
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={open}
                className="size-5"
            >
                <PlusIcon className="size-4 text-neutral-500"/>
            </Button>
        </div>
    )
}