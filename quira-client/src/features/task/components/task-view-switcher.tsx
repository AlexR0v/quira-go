import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator.tsx";
import { useTasksList } from "@/app/api/query-hooks/useTasks.tsx";
import { useParams } from "react-router";
import { useCreateTaskModal } from "@/features/task/hooks/useCreateTaskModal.tsx";
import { useQueryState } from "nuqs";
import { Filters } from "@/features/task/components/filters.tsx";
import { Loader } from "@/components/ui/loader.tsx";
import { useTasksFilters } from "@/features/task/hooks/use-tasks-filters.tsx";
import { format } from "date-fns";
import { useDebounce } from "react-use";
import { useState } from "react";
import { DataTable } from "@/features/task/components/data-table.tsx";
import { columns } from "@/features/task/components/columns.tsx";
import { SortingState } from "@tanstack/react-table";

export const SIZE = 10

export const TaskViewSwitcher = () => {

    const [view, setView] = useQueryState("tasks-view", {
        defaultValue: "list"
    })

    const { projectId } = useParams()
    const { open } = useCreateTaskModal()
    const [{ status, userId, name, dueDate }] = useTasksFilters()

    const [search, setSearch] = useState<string | null>("")
    const [page, setPage] = useState(1)
    const [sorting, setSorting] = useState<SortingState>([])

    useDebounce(
        () => {
            setSearch(name)
        },
        700,
        [name]
    )

    const { data: tasks, isLoading: isLoadingTasks } = useTasksList({
        projectId: projectId ?? undefined,
        status: status ?? undefined,
        userId: userId ?? undefined,
        name: search && search?.length > 3 ? search : undefined,
        dueDate: dueDate ? format(new Date(dueDate), 'yyyy-MM-dd') + ' 00:00:00' : undefined,
        page,
        size: SIZE,
        sortOrder: sorting[0]?.id && sorting[0]?.desc ? "desc" : "asc",
        sortField: sorting[0]?.id
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
                <Filters/>
                <Separator className="my-4"/>
                {isLoadingTasks ? (
                    <Loader/>
                ) : (
                    <>
                        <TabsContent value="list">
                            <DataTable
                                data={tasks?.tasks ?? []}
                                columns={columns}
                                page={page}
                                setPage={setPage}
                                totalCount={tasks?.total_count ?? 0}
                                sorting={sorting}
                                setSorting={setSorting}
                            />
                        </TabsContent>
                        <TabsContent value="board">
                            <div>board</div>
                        </TabsContent>
                        <TabsContent value="calendar">
                            <div>calendar</div>
                        </TabsContent>
                    </>
                )}
            </div>
        </Tabs>
    )
}