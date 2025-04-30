export type TCreateProjectRequest = {
  name: string;
  image?: string
  workspace_id: string
}

export type TUpdateProjectRequest = {
  id: string
  workspace_id: string
  name?: string;
  image?: string
}

export type TProject = {
  name: string;
  id: number;
  created_at: Date;
  workspace_id: number;
  image: string
}

export type ResponseProject = {
  projects: TProject[]
  total_count: number
}