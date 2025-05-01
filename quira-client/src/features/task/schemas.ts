import { z } from 'zod'
import { TaskStatus } from "@/models/task.ts";

export const createTaskSchema = z.object({
    name: z.string().trim().min(1, { message: 'Поле обязательно для заполнения' }),
    description: z.string().optional(),
    project_id: z.string().trim().min(1, { message: 'Поле обязательно для заполнения' }),
    assignee_id: z.string().trim().min(1, { message: 'Поле обязательно для заполнения' }),
    status: z.nativeEnum(TaskStatus, {required_error: 'Поле обязательно для заполнения'}),
    due_date: z.coerce.date(),
})