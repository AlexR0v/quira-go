import { TaskStatus, TaskStatusRu, TTask } from "@/models/task"
import { Button } from "@/components/ui/button.tsx";
import { PencilIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator.tsx";
import { OverviewProperty } from "@/features/task/components/overview-property.tsx";
import { MemberAvatar } from "@/features/members/components/member-avatar.tsx";
import { differenceInCalendarDays, format, formatDistanceToNow, set } from "date-fns";
import { cn } from "@/lib/utils.ts";
import { ru } from "date-fns/locale";
import { Badge } from "@/components/ui/badge.tsx";
import { useEditTaskModal } from "@/features/task/hooks/use-edit-task-modal.tsx";
import { EditTaskModal } from "@/features/task/components/edit-task-modal.tsx";

interface Props {
    data: TTask
}

export const TaskOverview = ({ data }: Props) => {

    const { open } = useEditTaskModal()

    const dueDate = new Date(data.due_date)
    const dueAt18 = set(dueDate, { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 })
    const diffInDays = differenceInCalendarDays(data.due_date, new Date())

    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-muted rounded-lg p-4">
                <EditTaskModal tasks={data}/>
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                        Данные задачи
                    </p>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => open(data.id.toString())}
                    >
                        <PencilIcon className="size-4 mr-2"/>
                        Редактировать
                    </Button>
                </div>
                <Separator className="my-4"/>
                <div className="flex flex-col gap-y-2">
                    <OverviewProperty label="Ответственный:">
                        <MemberAvatar firstName={data.assignee_first_name} lastName={data.assignee_last_name}
                                      className="size-6"/>
                        <p className="text-sm font-medium">{data.assignee_first_name} {data.assignee_last_name}</p>
                    </OverviewProperty>
                    <OverviewProperty label="Дата создания:">
                        <p className="text-sm font-medium">{format(data.created_at, 'dd.MM.yyyy')}</p>
                    </OverviewProperty>
                    <OverviewProperty label="Дата завершения:">
                        <p className="text-sm font-medium">{format(data.due_date, 'dd.MM.yyyy')}</p>
                    </OverviewProperty>
                    <OverviewProperty label="Оставшееся время:">
                        <p className={cn("text-sm font-medium",
                            diffInDays < 0 && data.status !== TaskStatus.DONE && "text-red-600",
                            diffInDays === 0 && data.status !== TaskStatus.DONE && "text-yellow-600",
                            diffInDays > 0 && "text-green-600"
                        )}>{formatDistanceToNow(dueAt18, { addSuffix: true, locale: ru })}</p>
                    </OverviewProperty>
                    <OverviewProperty label="Cтатус:">
                        <Badge variant={TaskStatus[data.status]}>{TaskStatusRu[data.status]}</Badge>
                    </OverviewProperty>
                </div>
            </div>

        </div>
    )
}