import {StandaloneLayout} from "@/components/standalone-layout.tsx";
import {CreateWorkspaceForm} from "@/features/workspace/components/create-workspace-form.tsx";

const WorkspacePageCreate = () => {

    return (
        <div className="w-full">
            <StandaloneLayout>
                <div className="max-w-xl">
                    <CreateWorkspaceForm />
                </div>
            </StandaloneLayout>
        </div>
    )
}

export default WorkspacePageCreate