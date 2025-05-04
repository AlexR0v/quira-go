export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    IN_REVIEW = 'IN_REVIEW',
    BACKLOG = 'BACKLOG'
}

export enum TaskStatusRu {
    TODO = 'К выполнению',
    IN_PROGRESS = 'В процессе',
    DONE = 'Выполнено',
    IN_REVIEW = 'На ревью',
    BACKLOG = 'Бэклог'
}

export enum TaskStatusColor {
    TODO = 'text-blue-600',
    IN_PROGRESS = 'text-purple-600',
    DONE = 'text-green-600',
    IN_REVIEW = 'text-yellow-600',
    BACKLOG = 'text-gray-400',
}

export enum TaskStatusBorderColor {
    TODO = 'border-l-blue-600',
    IN_PROGRESS = 'border-l-purple-600',
    DONE = 'border-l-green-600',
    IN_REVIEW = 'border-l-yellow-600',
    BACKLOG = 'border-l-gray-400',
}

export type TCreateTaskRequest = {
    name: string;
    workspace_id: string
    project_id: string
    assignee_id: string
    description?: string
    due_date: string
    status: TaskStatus
}

export type TUpdateTaskRequest = {
    id: string
    name: string;
    workspace_id: string
    project_id: string
    assignee_id: string
    description?: string
    due_date: string
    status: TaskStatus
    position: number
}

export type TTask = {
    id: number | string
    name: string;
    created_at: string,
    workspace_id: string
    workspace_name: string
    project_id: string
    project_name: string
    assignee_id: string
    assignee_first_name: string
    assignee_last_name: string
    description: string
    due_date: string
    status: TaskStatus
    position: number
}

export type ResponseTask = {
    tasks: TTask[]
    total_count: number
    count_assigned: number
    count_assigned_difference: number
    count_complete: number
    count_complete_difference: number
    count_difference: number
    count_incomplete: number
    count_incomplete_difference: number
    count_overdue_difference: number
    count_overdue: number
}


export type RequestParamsTasks = {
    size?: number
    page?: number
    userId?: string
    projectId?: string
    sortField?: string
    sortOrder?: "asc" | "desc"
    status?: TaskStatus
    name?: string
    dueDate?: string
}