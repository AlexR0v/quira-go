import {useWorkSpaceDelete, useWorkSpaceList} from "@/app/api/query-hooks/useWorkSpace.tsx";
import {CreateWorkspaceForm} from "@/features/workspace/components/create-workspace-form.tsx";
import {Button} from "@/components/ui/button.tsx";

export const Dashboard = () => {

    const {data} = useWorkSpaceList({size: 20, page: 1})

    const {mutate} = useWorkSpaceDelete()

    return (
        <div>
            <div className="bg-neutral-500 p-7">
                <CreateWorkspaceForm onCancel={() => {
                }}/>
            </div>
            {data?.workspaces?.map(item => (
                <div key={item.id}>
                    {item.name}
                    <div className="size-[72px] relative rounded-md overflow-hidden">
                        <img
                            className="object-cover w-full"
                            src={item.image}
                            alt="img"
                        />
                    </div>
                    <Button onClick={() => mutate(item.id)}>X</Button>
                </div>
            ))}
        </div>
    )
}