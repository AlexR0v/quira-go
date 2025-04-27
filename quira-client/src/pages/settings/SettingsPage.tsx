import {StandaloneLayout} from "@/components/standalone-layout.tsx";
import {EditWorkspaceForm} from "@/features/workspace/components/edit-workspace-form.tsx";
import {Navigate, useNavigate, useParams} from "react-router";
import {useGetWorkSpace} from "@/app/api/query-hooks/useWorkSpace.tsx";

const SettingsPage = () => {

    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading } = useGetWorkSpace(id)

    if (isLoading) {
        return <div>Loading...</div>
    }

    if(!data?.data.data){
        return <Navigate to="/"/>
    }

    return (
        <div className="w-full">
            <StandaloneLayout>
                <div className="max-w-xl">
                    <EditWorkspaceForm onCancel={() => navigate("/")} initialValues={data.data.data}/>
                </div>
            </StandaloneLayout>
        </div>
    )
}

export default SettingsPage