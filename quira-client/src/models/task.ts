export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    IN_REVIEW = 'IN_REVIEW',
    BACKLOG = 'BACKLOG'
}

export type TCreateTaskRequest = {
  name: string;
  workspace_id: string
  project_id: string
  assignee_id: string
  description: string
  due_date: Date
  status: TaskStatus
  position: number
}

export type TUpdateTaskRequest = {
  id: number
  name: string;
  workspace_id: string
  project_id: string
  assignee_id: string
  description: string
  due_date: Date
  status: TaskStatus
  position: number
}

export type TTask = {
  id: number
  name: string;
  workspace_id: string
  project_id: string
  assignee_id: string
  description: string
  due_date: Date
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
  userId?: number
  projectId?: number
}