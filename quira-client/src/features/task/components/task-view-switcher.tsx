import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator.tsx";
import { useTasksList } from "@/app/api/query-hooks/useTasks.tsx";
import { useParams } from "react-router";
import { useCreateTaskModal } from "@/features/task/hooks/useCreateTaskModal.tsx";
import { useQueryState } from "nuqs";

export const TaskViewSwitcher = () => {

    const [view, setView] = useQueryState("tasks-view", {
        defaultValue: "list"
    })

    const { projectId } = useParams()
    const { open } = useCreateTaskModal()

    useTasksList({
        projectId: projectId ? Number(projectId) : undefined,
        sortField: "position",
        sortOrder: "desc",
        //startDate: format(new Date(), 'yyyy-MM-dd') + ' 00:00:00',
        //endDate: format(new Date().setMonth(12), 'yyyy-MM-dd') + ' 00:00:00',
    })

    return (
        <Tabs
            defaultValue={view}
            onValueChange={setView}
            className="flex-1 w-full border rounded-lg"
        >
            <div className="h-full flex flex-col overflow-auto p-4">
                <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
                    <TabsList className="w-full lg:w-auto">
                        <TabsTrigger className="h-8 w-full lg:w-auto" value="list">Список</TabsTrigger>
                        <TabsTrigger className="h-8 w-full lg:w-auto" value="board">Доска</TabsTrigger>
                        <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">Календарь</TabsTrigger>
                    </TabsList>
                    <Button
                        size="sm"
                        className="w-full lg:w-auto"
                        onClick={open}
                    >
                        <PlusIcon className="size-4 mr-2"/>
                        Новая задача
                    </Button>
                </div>
                <Separator className="my-4"/>
                <div>Filters</div>
                <Separator className="my-4"/>
                <>
                    <TabsContent value="list">
                        <div>list</div>
                    </TabsContent>
                    <TabsContent value="board">
                        <div>board</div>
                    </TabsContent>
                    <TabsContent value="calendar">
                        <div>calendar</div>
                    </TabsContent>
                </>
            </div>
        </Tabs>
    )
}