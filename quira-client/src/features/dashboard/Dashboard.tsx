import { useWorkSpaceList } from "@/app/api/query-hooks/useWorkSpace.tsx";
import { Navigate } from "react-router";

export const Dashboard = () => {

    const { data: workspaces } = useWorkSpaceList({ size: 20, page: 1 })

    if(workspaces?.total_count === 0) {
        return <Navigate to="/workspaces/create"/>
    } else {
        return <Navigate to={`/workspaces/${workspaces?.workspaces?.[0]?.id}`}/>
    }
}