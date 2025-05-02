import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { TTask } from "@/models/task.ts";
import { Button } from "@/components/ui/button.tsx";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";
import * as React from "react";
import { SIZE } from "@/features/task/components/task-view-switcher.tsx";
import { Separator } from "@/components/ui/separator.tsx";

interface DataTableProps {
    columns: ColumnDef<TTask>[]
    data: TTask[]
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    totalCount: number
    sorting: SortingState
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>
}

export function DataTable({ columns, data, totalCount, setPage, page, sorting, setSorting }: DataTableProps) {

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualSorting: true,
        state: {
            sorting
        },
        onSortingChange: setSorting
    })

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup, index) => (
                        <TableRow key={index}>
                            {headerGroup.headers.map((header, i) => {
                                return (
                                    <TableHead key={i}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row, rowIndex) => (
                            <TableRow
                                key={rowIndex}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell, cellIndex) => (
                                    <TableCell key={cellIndex}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                Нет данных
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Separator/>
            <div className="flex items-center justify-between space-x-2 py-4 mx-2 h-16">
                <span className="text-muted-foreground text-sm">Общее количество: {totalCount}</span>
                {totalCount > SIZE && (
                    <div className="flex items-center justify-end space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(() => 1)}
                            disabled={page === 1}
                        >
                            <ChevronsLeftIcon/>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(prev => prev - 1)}
                            disabled={page === 1}
                        >
                            <ChevronLeftIcon/>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(prev => prev + 1)}
                            disabled={totalCount <= page * SIZE}
                        >
                            <ChevronRightIcon/>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(() => Math.ceil(totalCount / SIZE))}
                            disabled={totalCount <= page * SIZE}
                        >
                            <ChevronsRightIcon/>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
