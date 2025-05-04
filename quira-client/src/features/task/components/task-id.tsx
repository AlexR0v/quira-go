import { TTask } from "@/models/task.ts";
import { TaskBreadcrumbs } from "@/features/task/components/task-breadcrumbs.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { TaskOverview } from "@/features/task/components/task-overview.tsx";
import { TaskDescription } from "@/features/task/components/task-description.tsx";

interface Props {
    data: TTask
}

export const TaskId = ({ data }: Props) => {
    return (
        <div className="flex flex-col">
            <TaskBreadcrumbs
                taskId={data.id.toString()}
                taskName={data.name}
                projectName={data.project_name}
                projectId={data.project_id}
            />
            <Separator className="my-4"/>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TaskOverview data={data}/>
                <TaskDescription data={data}/>
            </div>
        </div>
    )
}