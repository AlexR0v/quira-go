import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { TaskStatus } from "@/models/task.ts";

export const useTasksFilters = () => {
    return useQueryStates({
        status: parseAsStringEnum(Object.values(TaskStatus)),
        userId: parseAsString,
        name: parseAsString,
        dueDate: parseAsString,
    })
}