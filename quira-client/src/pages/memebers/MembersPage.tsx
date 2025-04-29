import {StandaloneLayout} from "@/components/standalone-layout.tsx";
import {useParams} from "react-router";
import {useGetWorkSpace} from "@/app/api/query-hooks/useWorkSpace.tsx";
import {Loader} from "@/components/ui/loader.tsx";
import {useMembersList} from "@/app/api/query-hooks/useMembers.tsx";
import {useGetCurrentUser} from "@/app/api/query-hooks/useUser.tsx";
import {MembersList} from "@/features/members/components/members-list.tsx";

const MembersPage = () => {

    const {id} = useParams()

    const {data: workspaces, isLoading} = useGetWorkSpace(id)
    const {data: members, isLoading: isLoadingMembers} = useMembersList({size: 20, page: 1}, id)
    const {data: user, isLoading: isLoadingUser} = useGetCurrentUser()

    if (isLoading || isLoadingMembers || isLoadingUser) {
        return <Loader/>
    }

    return (
        <div className="w-full">
            <StandaloneLayout>
                <div className="w-full max-w-xl">
                    {workspaces?.data.data && user && members && (
                        <MembersList members={members} currentUser={user} workspace={workspaces?.data.data}/>
                    )}
                </div>
            </StandaloneLayout>
        </div>
    )
}

export default MembersPage