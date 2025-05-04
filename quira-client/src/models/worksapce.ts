export type TCreateWorkspaceRequest = {
  name: string;
  image?: string
  invite_code: string
}

export type TUpdateWorkspaceRequest = {
  id: string
  name?: string;
  image?: string
  invite_code?: string
}

export type TWorkspace = {
  name: string;
  id: number;
  created_at: Date;
  user_id: number;
  image: string
  invite_code: string
}

export type ResponseWorkspace = {
  workspaces: TWorkspace[]
  total_count: number
}

export type TWorkspaceAnalytics = {
  count_assigned: number
  count_assigned_difference: number
  count_complete: number
  count_complete_difference: number
  total_count_all: number
  total_count_all_difference: number
  count_incomplete: number
  count_incomplete_difference: number
  count_overdue_difference: number
  count_overdue: number
}