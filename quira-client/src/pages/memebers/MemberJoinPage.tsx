import {useParams} from "react-router";
import {useMemberJoin} from "@/app/api/query-hooks/useMembers.tsx";
import {useEffect} from "react";

const MemberJoinPage = () => {

    const {id, code} = useParams()
    const {mutateAsync} = useMemberJoin()

    useEffect(() => {
        if(id && code) {
            mutateAsync({
                workspace_id: id,
                invite_code: code
            })
        }
    },[id, code])

    return <div>MemberJoinPage</div>
}

export default MemberJoinPage