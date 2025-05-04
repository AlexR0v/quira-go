import { useGetWorkSpace, useGetWorkSpaceAnalytics } from "@/app/api/query-hooks/useWorkSpace.tsx";
import { useParams } from "react-router";
import { Loader } from "@/components/ui/loader.tsx";

const WorkspacePage = () => {

    const { id } = useParams()

    const { data, isLoading } = useGetWorkSpace(id)
    useGetWorkSpaceAnalytics(id)

    if (isLoading) {
        return <Loader/>
    }

    return (
        <div className="w-full lg:max">
            <h1>Workspace Page {data?.data.data.id}</h1>
        </div>
    )
}

export default WorkspacePage