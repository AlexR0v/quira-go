import { TaskViewSwitcher } from "@/features/task/components/task-view-switcher.tsx";
import { useGetCurrentUser } from "@/app/api/query-hooks/useUser.tsx";
import { Loader } from "@/components/ui/loader.tsx";
import { Navigate } from "react-router";

const TasksPage = () => {

    const {data, isLoading} = useGetCurrentUser()

    if (isLoading) {
        return <Loader/>
    }

    if (!data) {
        return <Navigate to="/"/>
    }
    return (
        <div className="h-full">
            <TaskViewSwitcher userIdProps={data.id.toString()}/>
        </div>
    )
}

export default TasksPage