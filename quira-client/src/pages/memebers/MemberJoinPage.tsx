import {Navigate, useParams} from "react-router";
import {StandaloneLayout} from "@/components/standalone-layout.tsx";
import {useGetCurrentUser} from "@/app/api/query-hooks/useUser.tsx";
import {useGetWorkSpace} from "@/app/api/query-hooks/useWorkSpace.tsx";
import {Loader} from "@/components/ui/loader.tsx";
import {JoinWorkspaceForm} from "@/features/workspace/components/join-workspace-form.tsx";

const MemberJoinPage = () => {

    const {id} = useParams()
    useGetCurrentUser()
    const {data, isLoading} = useGetWorkSpace(id)

    if (isLoading) {
        return <Loader/>
    }

    if (!data) {
        return <Navigate to="/"/>
    }

    return (
        <div className="w-full">
            <StandaloneLayout>
                <div className="w-full max-w-xl">
                    <JoinWorkspaceForm initialValues={data.data.data}/>
                </div>
            </StandaloneLayout>
        </div>
    )
}

export default MemberJoinPage