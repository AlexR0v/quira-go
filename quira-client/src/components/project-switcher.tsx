import {RiAddCircleFill} from "react-icons/ri";
import {WorkspaceAvatar} from "@/features/workspace/components/workspace-avatar.tsx";
import {useParams} from "react-router";
import {useCreateProjectModal} from "@/features/project/hooks/useCreateProjectModal.tsx";
import {useProjectDelete, useProjectList} from "@/app/api/query-hooks/useProject.tsx";
import {Button} from "@/components/ui/button.tsx";
import {DeleteIcon} from "lucide-react";

export const ProjectSwitcher = () => {

    const { id } = useParams()
    const {open} = useCreateProjectModal()

    const { data: projects } = useProjectList({ size: 20, page: 1 }, id)

    const {mutate} = useProjectDelete()

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">Проекты</p>
                <RiAddCircleFill onClick={open} className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"/>
            </div>
            {projects?.projects?.map(item => (
                <div
                    key={item.id}
                    className="flex justify-between"
                >
                    <div className="flex justify-start items-center gap-3 font-medium">
                        <WorkspaceAvatar
                            name={item.name}
                            image={item.image}
                        />
                        <span className="truncate">{item.name}</span>
                    </div>
                    <Button variant="secondary" onClick={()=> mutate({id: item.id.toString(), workspace_id: id ?? ""})}>
                        <DeleteIcon/>
                    </Button>
                </div>
            ))}
        </div>
    )
}