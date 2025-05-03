import { TaskStatus, TTask } from "@/models/task.ts";
import { TasksActions } from "@/features/task/components/tasks-actions.tsx";
import { MoreHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator.tsx";
import { MemberAvatar } from "@/features/members/components/member-avatar.tsx";
import { differenceInCalendarDays, format, formatDistanceToNow, set } from "date-fns";
import { cn } from "@/lib/utils.ts";
import { ru } from "date-fns/locale";

interface Props {
    task: TTask
}

export const KanbanCard = ({ task }: Props) => {

    const dueDate = new Date(task.due_date)
    const dueAt18 = set(dueDate, { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 })
    const diffInDays = differenceInCalendarDays(task.due_date, new Date())

    return <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-x-2">
            <p className="taxt-sm line-clamp-2">{task.name}</p>
            <TasksActions id={task.id.toString()}>
                <MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition"/>
            </TasksActions>
        </div>
        <Separator/>
        <div className="flex items-center gap-x-1.5">
            <MemberAvatar
                firstName={task.assignee_first_name}
                lastName={task.assignee_last_name}
                fallbackClassName="text-[10px]"
            />
            <p className="text-sm text-neutral-600">{task.assignee_first_name} {task.assignee_last_name}</p>

        </div>
        <div className="flex items-center gap-x-1.5">
            <p className="text-xs text-neutral-400">Дата создания:</p>
            <p className="text-xs text-neutral-500">{format(task.created_at, 'dd.MM.yyyy')}</p>
        </div>
        {task.status !== TaskStatus.DONE && (
            <>
                <div className="flex items-center gap-x-1.5">
                    <p className="text-xs text-neutral-400">Дата выполнения:</p>
                    <p className="text-xs text-neutral-500">{format(task.due_date, 'dd.MM.yyyy')}</p>
                </div>
                <div className="flex items-center gap-x-1.5">
                    <p className="text-xs text-neutral-400">Срок выполнения:</p>
                    <p className={cn("text-xs",
                        diffInDays < 0 && "text-red-600",
                        diffInDays === 0 && "text-yellow-600",
                        diffInDays > 0 && "text-green-600"
                    )}>{formatDistanceToNow(dueAt18, { addSuffix: true, locale: ru })}</p>
                </div>
            </>
        )}
    </div>
}
