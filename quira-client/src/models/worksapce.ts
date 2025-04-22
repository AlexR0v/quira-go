export type TCreateWorkspaceRequest = {
  name: string;
  image?: string
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