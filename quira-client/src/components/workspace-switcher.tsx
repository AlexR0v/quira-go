import {useWorkSpaceList} from "@/app/api/query-hooks/useWorkSpace.tsx";
import {RiAddCircleFill} from "react-icons/ri";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {WorkspaceAvatar} from "@/features/workspace/components/workspace-avatar.tsx";
import {useNavigate, useParams} from "react-router";
import {useCreateWorkspaceModal} from "@/features/workspace/hooks/useCreateWorkspaceModal.tsx";

export const WorkspaceSwitcher = () => {

    const navigate = useNavigate()
    const { id } = useParams()
    const {open} = useCreateWorkspaceModal()

    const { data: workspaces } = useWorkSpaceList({ size: 20, page: 1 })

    const onSelect = (id: string) => {
        navigate(`/workspaces/${id}`)
    }

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">РПроекты</p>
                <RiAddCircleFill onClick={open} className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"/>
            </div>
            <Select onValueChange={onSelect} value={id}>
                <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
                    <SelectValue placeholder="Выберите проект"/>
                </SelectTrigger>
                <SelectContent>
                    {workspaces?.workspaces?.map(item => (
                        <SelectItem
                            key={item.id}
                            value={item.id.toString()}
                        >
                            <div className="flex justify-start items-center gap-3 font-medium">
                                <WorkspaceAvatar
                                    name={item.name}
                                    image={item.image}
                                />
                                <span className="truncate">{item.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}