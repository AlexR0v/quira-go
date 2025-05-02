import * as React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm.tsx";
import { useTaskDelete } from "@/app/api/query-hooks/useTasks.tsx";
import { useNavigate, useParams } from "react-router";
import { useEditTaskModal } from "@/features/task/hooks/use-edit-task-modal.tsx";

interface Props {
    id: string
    children: React.ReactNode
}

export const TasksActions = ({ id, children }: Props) => {

    const {id: workspaceId, projectId} = useParams()
    const navigate = useNavigate()
    const {open} = useEditTaskModal()
    const {mutateAsync: deleteTask, isPending: isDeleting} = useTaskDelete()

    const [DeleteModal, confirmDelete] = useConfirm(
        "Удалить задачу?",
        "Это действие нельзя будет отменить. Вы уверены?",
        "destructive",
    )

    const handleDelete = async (id: string) => {
        const ok = await confirmDelete()
        if(!ok) return
        await deleteTask(id)
    }

    const onOpenChange = (id: string) => {
        navigate(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${id}`)
    }

    return (
        <div className="flex justify-end">
            <DeleteModal />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    {children}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                        onClick={() => onOpenChange(id)}
                        disabled={isDeleting}
                        className="font-medium p-[10px]"
                    >
                        <ExternalLinkIcon className="size-4 mr-2 stroke-2"/>
                        Подробнее
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => open(id)}
                        disabled={isDeleting}
                        className="font-medium p-[10px]"
                    >
                        <PencilIcon className="size-4 mr-2 stroke-2"/>
                        Редактировать
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleDelete(id)}
                        disabled={isDeleting}
                        className="text-amber-600 focus:text-amber-700 font-medium p-[10px]"
                    >
                        <TrashIcon className="size-4 mr-2 stroke-2"/>
                        Удалить
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}