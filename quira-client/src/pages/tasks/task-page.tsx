import { Loader } from "@/components/ui/loader.tsx";
import { Navigate, useParams } from "react-router";
import { useGetTask } from "@/app/api/query-hooks/useTasks.tsx";
import { TaskId } from "@/features/task/components/task-id.tsx";

const TaskPage = () => {

    const { taskId } = useParams()

    const { data, isLoading } = useGetTask(taskId)

    if (isLoading) {
        return <Loader/>
    }

    if (!data) {
        return <Navigate to="/"/>
    }
    return <TaskId data={data.data.data}/>
}

export default TaskPage