import { useGetWorkSpace } from "@/app/api/query-hooks/useWorkSpace.tsx";
import { useParams } from "react-router";

const WorkspacePage = () => {

    const { id } = useParams()

    const { data, isLoading } = useGetWorkSpace(id)

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="w-full lg:max">
            <h1>Workspace Page {data?.data.data.id}</h1>
        </div>
    )
}

export default WorkspacePage