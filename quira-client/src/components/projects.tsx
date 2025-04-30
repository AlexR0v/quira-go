import {RiAddCircleFill} from "react-icons/ri";
import {useLocation, useNavigate, useParams} from "react-router";
import {useCreateProjectModal} from "@/features/project/hooks/useCreateProjectModal.tsx";
import {useProjectList} from "@/app/api/query-hooks/useProject.tsx";
import {cn} from "@/lib/utils.ts";
import {ProjectAvatar} from "@/features/project/components/project-avatar.tsx";

export const Projects = () => {

    const { id } = useParams()
    const {pathname} = useLocation()
    const navigate = useNavigate()
    const {open} = useCreateProjectModal()

    const { data: projects } = useProjectList({ size: 20, page: 1 }, id)


    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">Проекты</p>
                <RiAddCircleFill onClick={open} className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"/>
            </div>
            {projects?.projects?.map(item => {
                const href = `/workspaces/${id}/projects/${item.id}`
                const isActive = pathname === href

                return (
                    <div
                        key={item.id}
                        className={cn(
                            "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                            isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                        )}
                        onClick={() => navigate(href)}
                    >
                        <div className="flex justify-start items-center gap-3 font-medium">
                            <ProjectAvatar name={item.name} image={item.image}/>
                            <span className="truncate">{item.name}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}