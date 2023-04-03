export interface BaseResponse {
  errors?: string[]
}

export interface GetPhasesListResponse extends BaseResponse {
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

export interface GetPipesListResponse extends BaseResponse {
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

export interface CreatePipeWebhookResponse extends BaseResponse {
  data: CreatePipeWebhookResponseData
}

interface CreatePipeWebhookResponseData {
  createWebhook: CreatePipeWebhook
}

interface CreatePipeWebhook {
  clientMutationId: string
  webhook: PipeWebhook
}

interface PipeWebhook {
  id: number
  actions: string
  headers: string[]
  email: string
  name: string
  url: string
}


export interface GetStartFormFieldsResponse extends BaseResponse {
  data: GetStartFormFieldsResponseData
}

interface GetStartFormFieldsResponseData {
  pipe: PipeStartFormFields
}

interface PipeStartFormFields {
  start_form_fields: StartFormField[]
}

type FieldType = 
  | "assignee_select" 
  | "attachment" 
  | "checklist_horizontal" 
  | "checklist_vertical" 
  | "cnpj"
  | "connector"
  | "cpf"
  | "currency"
  | "date"
  | "datetime"
  | "due_date"
  | "email"
  | "id"
  | "label_select"
  | "long_text"
  | "number"
  | "phone"
  | "radio_horizontal"
  | "radio_vertical"
  | "select"
  | "short_text"
  | "statement"
  | "time"

interface StartFormField {
  id: string
  type: FieldType
  index: number
  label: string
  options: string[]
  required: boolean
  help: string
  description: string
}

export interface GetPipeMemberListResponse extends BaseResponse {
  data: GetPipeMemberListResponseData
}

interface GetPipeMemberListResponseData {
  pipe: PipeMemberList
}

interface PipeMemberList {
  members: PipeMember[]
}

interface PipeMember {
  user: MemberUser
}

interface MemberUser {
  id: string
  name: string
}

export interface GetPipeLabelsListResponse extends BaseResponse {
  data: GetPipeLabelsListResponseData
}

interface GetPipeLabelsListResponseData {
  pipe: PipeLabelList
}

interface PipeLabelList {
  labels: PipeLabel[]
}

interface PipeLabel {
  id: string
  name: string
}
