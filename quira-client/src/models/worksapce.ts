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
}

export type ResponseWorkspace = {
  workspaces: TWorkspace[]
  total_count: number
}