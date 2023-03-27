
export interface GetPhasesListResponse {
  data: GetPhasesListResponseData
}

interface GetPhasesListResponseData { 
  pipe: PipePhasesList
}

interface PipePhasesList {
  phases: PhaseListItem[]
}

interface PhaseListItem {
  id: number
  name: string
}



export interface GetPipesListResponse {
  data: GetPipesListResponseData
}

interface GetPipesListResponseData { 
  organization: OrganizationPipesList
}

interface OrganizationPipesList {
  pipes: PipeListItem[]
}

interface PipeListItem {
  id: number
  name: string
}
