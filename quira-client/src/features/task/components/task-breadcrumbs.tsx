import { ProjectAvatar } from "@/features/project/components/project-avatar.tsx";
import { useNavigate, useParams } from "react-router";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useTaskDelete } from "@/app/api/query-hooks/useTasks.tsx";
import { useConfirm } from "@/hooks/use-confirm.tsx";

interface Props {
    projectId: string
    projectName: string
    taskName: string
    taskId: string
}

export const TaskBreadcrumbs = ({ projectId, projectName, taskName, taskId }: Props) => {

    const { id: workspaceId } = useParams()
    const navigate = useNavigate()
    const { mutateAsync: deleteTask, isPending: isDeleting } = useTaskDelete()

    const [DeleteModal, confirmDelete] = useConfirm(
        "Удалить задачу?",
        "Это действие нельзя будет отменить. Вы уверены?",
        "destructive",
    )

    const handleDelete = async (id: string) => {
        const ok = await confirmDelete()
        if (!ok) return
        await deleteTask(id)
        navigate(`/workspaces/${workspaceId}/projects/${projectId}`)
    }

    return (
        <div className="w-full flex justify-between">
            <div className="flex items-center gap-x-2">
                <DeleteModal/>
                <ProjectAvatar name={projectName} className="size-6 lg:size-8"/>
                <p
                    onClick={() => navigate(`/workspaces/${workspaceId}/projects/${projectId}`)}
                    className="text-sm text-muted-foreground font-semibold cursor-pointer hover:opacity-75 transition">{projectName}</p>
                <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground"/>
                <p className="text-sm font-semibold">{taskName}</p>
            </div>
            <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(taskId)}
                disabled={isDeleting}
            >
                <TrashIcon className="size-4 lg:mr-2"/>
                <span className="hidden lg:inline">Удалить задачу</span>
            </Button>
        </div>
    )
}