import {StandaloneLayout} from "@/components/standalone-layout.tsx";
import {Navigate, useNavigate, useParams} from "react-router";
import {useGetProject} from "@/app/api/query-hooks/useProject.tsx";
import {Loader} from "@/components/ui/loader.tsx";
import {EditProjectForm} from "@/features/project/components/edit-project-form.tsx";

const SettingsProjectPage = () => {

    const { id, projectId } = useParams()
    const navigate = useNavigate()

    const { data, isLoading } = useGetProject(projectId, id)

    if (isLoading) {
        return <Loader/>
    }

    if(!data?.data.data){
        return <Navigate to="/"/>
    }

    return (
        <div className="w-full">
            <StandaloneLayout>
                <div className="max-w-xl">
                    <EditProjectForm
                        onCancel={() => navigate(`/workspaces/${id}/projects/${projectId}`)}
                        initialValues={data.data.data}
                    />
                </div>
            </StandaloneLayout>
        </div>
    )
}

export default SettingsProjectPage