import { ColumnDef } from "@tanstack/react-table";
import { TaskStatus, TaskStatusRu, TTask } from "@/models/task.ts";
import { differenceInCalendarDays, format, formatDistanceToNow, set } from "date-fns"
import { ru } from "date-fns/locale"
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";

export const columns: ColumnDef<TTask>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Название
                    {column.getIsSorted() && <ArrowUp className={cn(
                        "ml-2 h-4 w-4",
                        column.getIsSorted() === "asc" ? "rotate-180" : ""
                    )}/>}
                </Button>
            )
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Статус
                    {column.getIsSorted() && <ArrowUp className={cn(
                        "ml-2 h-4 w-4",
                        column.getIsSorted() === "asc" ? "rotate-180" : ""
                    )}/>}
                </Button>
            )
        },
        cell: info => {
            const row = info.row.original
            return <Badge variant={TaskStatus[row.status]}>{TaskStatusRu[row.status]}</Badge>
        },
    },
    {
        accessorKey: 'assignee_first_name',
        cell: info => {
            const row = info.row.original
            return `${row.assignee_first_name} ${row.assignee_last_name}`
        },
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Ответственный
                    {column.getIsSorted() && <ArrowUp className={cn(
                        "ml-2 h-4 w-4",
                        column.getIsSorted() === "asc" ? "rotate-180" : ""
                    )}/>}
                </Button>
            )
        },
    },
    {
        accessorKey: 'created_at',
        cell: info => {
            const row = info.row.original
            return format(row.created_at, 'dd.MM.yyyy')
        },
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Дата создания
                    {column.getIsSorted() && <ArrowUp className={cn(
                        "ml-2 h-4 w-4",
                        column.getIsSorted() === "asc" ? "rotate-180" : ""
                    )}/>}
                </Button>
            )
        },
    },
    {
        accessorKey: 'due_date',
        cell: info => {
            const row = info.row.original
            return format(row.due_date, 'dd.MM.yyyy')
        },
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Дата выполнения
                    {column.getIsSorted() && <ArrowUp className={cn(
                        "ml-2 h-4 w-4",
                        column.getIsSorted() === "asc" ? "rotate-180" : ""
                    )}/>}
                </Button>
            )
        },
    },
    {
        accessorKey: 'due_date',
        header: 'Срок выполнения',
        cell: info => {
            const row = info.row.original

            const dueDate = new Date(row.due_date)
            const dueAt18 = set(dueDate, { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 })
            const diffInDays = differenceInCalendarDays(row.due_date, new Date())

            return <span className={cn(
                diffInDays < 0 && row.status !== TaskStatus.DONE && "text-red-600",
                diffInDays === 0 && row.status !== TaskStatus.DONE && "text-yellow-600",
                diffInDays > 0 && "text-green-600"
            )}>{formatDistanceToNow(dueAt18, { addSuffix: true, locale: ru })}</span>
        },
    },
]