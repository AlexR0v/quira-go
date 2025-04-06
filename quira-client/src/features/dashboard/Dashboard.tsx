import {useWorkSpaceList} from "@/app/api/query-hooks/useWorkSpace.tsx";
import {CreateWorkspace} from "@/features/dashboard/workspace-create.tsx";

export const Dashboard = () => {

    useWorkSpaceList({size: 20, page: 1})

    return (
        <div>
            <CreateWorkspace/>
        </div>
    )
}