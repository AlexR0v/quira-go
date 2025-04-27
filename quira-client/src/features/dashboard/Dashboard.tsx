import {useWorkSpaceList} from "@/app/api/query-hooks/useWorkSpace.tsx";
import {Navigate} from "react-router";
import {Loader} from "@/components/ui/loader.tsx";

export const Dashboard = () => {

    const { data: workspaces, isLoading } = useWorkSpaceList({ size: 20, page: 1 })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-full">
                <Loader/>
            </div>
        )
    }

    if(workspaces?.total_count === 0) {
        return <Navigate to="/workspaces/create"/>
    } else {
        return <Navigate to={`/workspaces/${workspaces?.workspaces?.[0]?.id}`}/>
    }
}