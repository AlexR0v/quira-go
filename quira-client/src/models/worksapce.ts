export type TCreateWorkspaceRequest = {
  name: string;
}

export type TWorkspace = {
  name: string;
  id: number;
  created_at: Date;
  user_id: number;
}

export type ResponseWorkspace = {
  workspaces: TWorkspace[]
  total_count: number
}