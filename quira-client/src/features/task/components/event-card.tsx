import { TaskStatus, TaskStatusBorderColor, TaskStatusRu } from "@/models/task.ts";
import { cn } from "@/lib/utils.ts";
import { MemberAvatar } from "@/features/members/components/member-avatar.tsx";
import { useNavigate, useParams } from "react-router";
import * as React from "react";

interface Props {
    title: string
    assignee_first_name: string
    assignee_last_name: string
    status: TaskStatus
    id: string
}

export const EventCard = ({ title, assignee_last_name, assignee_first_name, status, id }: Props) => {

    const navigate = useNavigate()
    const { id: workspaceId, projectId } = useParams()

    const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        navigate(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${id}`)
    }

    return (
        <div className="px-2">
            <div
                onClick={onClick}
                className={cn(
                "p-1.5 text-sm bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition",
                TaskStatusBorderColor[status]
            )}>
                <p>{title}</p>
                <div className="flex items-center gap-x-1">
                    <MemberAvatar firstName={assignee_first_name} lastName={assignee_last_name}/>
                    <p className="text-xs text-neutral-500">{assignee_first_name} {assignee_last_name}</p>
                </div>
                <div className="flex items-center gap-x-1">
                    <p className="text-xs text-neutral-500">{TaskStatusRu[status]}</p>
                </div>
            </div>
        </div>
    )
}