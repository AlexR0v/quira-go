import { useNavigate, useParams } from "react-router";
import { useGetProject } from "@/app/api/query-hooks/useProject.tsx";
import { ProjectAvatar } from "@/features/project/components/project-avatar.tsx";
import { Loader } from "@/components/ui/loader.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PencilIcon } from "lucide-react";
import { TaskViewSwitcher } from "@/features/task/components/task-view-switcher.tsx";

const Project = () => {

    const {id, projectId} = useParams()
    const navigate = useNavigate()

    const {data: project, isLoading: isLoadingProject} = useGetProject(projectId, id)

    if (isLoadingProject) {
        return <Loader/>
    }

    if(project) {
        return (
            <div className="flex flex-col gap-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                        <ProjectAvatar
                            name={project.data.data.name}
                            image={project.data.data.image}
                            className="size-8"
                        />
                        <p className="text-lg font-semibold">{project.data.data.name}</p>
                    </div>
                    <div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(`/workspaces/${id}/projects/${projectId}/settings`)}
                        >
                            <PencilIcon/>
                            Редактировать проект
                        </Button>
                    </div>
                </div>
                <TaskViewSwitcher/>
            </div>
        )
    }

    return null
}

export default Project