import { useParams } from "react-router";
import { useMembersList } from "@/app/api/query-hooks/useMembers.tsx";
import { Loader } from "@/components/ui/loader.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx";
import { ListChecksIcon } from "lucide-react";
import { TaskStatus } from "@/models/task.ts";
import { useTasksFilters } from "@/features/task/hooks/use-tasks-filters.tsx";
import { DatePicker } from "@/components/date-picker.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

interface Props {
    userIdProps?: string
}

export const Filters = ({ userIdProps }: Props) => {
    const { id } = useParams()

    const { data: members, isLoading: isLoadingMembers } = useMembersList({ size: 2000, page: 1 }, id)

    const [{ status, userId, name, dueDate }, setFilters] = useTasksFilters()

    const membersOptions = members?.users.map((member) => ({
        first_name: member.first_name,
        last_name: member.last_name,
        value: member.id,
    }))

    const onStatusChange = (value: string) => {
        if (value === 'all') {
            setFilters(prev => ({ ...prev, status: null }))
        } else {
            setFilters(prev => ({ ...prev, status: value as TaskStatus }))
        }
    }

    const onUserChange = (value: string) => {
        if (value === 'all') {
            setFilters(prev => ({ ...prev, userId: null }))
        } else {
            setFilters(prev => ({ ...prev, userId: value }))
        }
    }

    if (isLoadingMembers) {
        return <Loader/>
    }

    return (
        <div className="flex flex-col lg:flex-row gap-2">
            <Select
                defaultValue={status ?? undefined}
                onValueChange={onStatusChange}
            >
                <SelectTrigger className="w-full lg:w-auto h-8">
                    <div className="flex items-center pr-2">
                        <ListChecksIcon className="size-4 mr-2"/>
                        <SelectValue placeholder="Все статусы"/>
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Все статусы </SelectItem>
                    <SelectSeparator/>
                    <SelectItem value={TaskStatus.BACKLOG}>
                        Бэкдлог
                    </SelectItem>
                    <SelectItem value={TaskStatus.IN_PROGRESS}>
                        В процессе
                    </SelectItem>
                    <SelectItem value={TaskStatus.IN_REVIEW}>
                        В ревью
                    </SelectItem>
                    <SelectItem value={TaskStatus.TODO}>
                        К выполнению
                    </SelectItem>
                    <SelectItem value={TaskStatus.DONE}>
                        Выполнена
                    </SelectItem>
                </SelectContent>
            </Select>
            {!userIdProps && (
                <Select
                    defaultValue={userId ?? undefined}
                    onValueChange={onUserChange}
                >
                    <SelectTrigger className="w-full lg:w-auto h-8">
                        <div className="flex items-center pr-2">
                            <ListChecksIcon className="size-4 mr-2"/>
                            <SelectValue placeholder="Все участники"/>
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Все участники</SelectItem>
                        <SelectSeparator/>
                        {membersOptions?.map((member) => (
                            <SelectItem key={member.value} value={member.value.toString()}>
                                {member.first_name} {member.last_name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            <DatePicker
                isFilter
                className="w-full lg:w-auto h-8"
                placeholder="Дата выполнения"
                value={dueDate ? new Date(dueDate) : undefined}
                onChange={date => {
                    setFilters(prev => ({ ...prev, dueDate: date ? date.toISOString() : null }))
                }}
            />
            <Input
                className="w-full lg:w-auto h-8"
                placeholder="Название"
                value={name ?? ""}
                onChange={(e) => {
                    setFilters(prev => ({ ...prev, name: e.target.value }))
                }}
            />
            <Button
                size="sm"
                variant="light"
                onClick={() => {
                    setFilters(prev => ({
                        ...prev,
                        status: null,
                        userId: null,
                        name: null,
                        dueDate: null
                    }))
                }}
            >
                Очистить фильтры
            </Button>
        </div>
    )
}