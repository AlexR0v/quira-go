import { StandaloneLayout } from "@/components/standalone-layout.tsx";
import { CreateWorkspaceForm } from "@/features/workspace/components/create-workspace-form.tsx";
import { useToast } from "@/hooks/use-toast.ts";

const WorkspacePageCreate = () => {

    const { toast } = useToast()

    return (
        <div className="w-full">
            <StandaloneLayout>
                <div className="max-w-xl">
                    <CreateWorkspaceForm onCancel={() => toast({
                        variant: 'destructive',
                        title: 'Внимание',
                        description: "Для начала работы необходимо создать рабочее пространство",
                    })}/>
                </div>
            </StandaloneLayout>
        </div>
    )
}

export default WorkspacePageCreate