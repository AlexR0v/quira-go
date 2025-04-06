import {useWorkSpaceList} from "@/app/api/query-hooks/useWorkSpace.tsx";
import {CreateWorkspaceForm} from "@/features/workspace/components/create-workspace-form.tsx";

export const Dashboard = () => {

    useWorkSpaceList({size: 20, page: 1})

    return (
        <div className="bg-neutral-500 p-7">
            <CreateWorkspaceForm onCancel={() => {
            }}/>
        </div>
    )
}