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
  id: number
  name: string;
  workspace_id: string
  project_id: string
  assignee_id: string
  description: string
  due_date: string
  status: TaskStatus
  position: number
}

export type TTask = {
  id: number
  name: string;
  created_at: string,
  workspace_id: string
  project_id: string
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