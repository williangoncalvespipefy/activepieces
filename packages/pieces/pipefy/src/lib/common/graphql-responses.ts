


export interface BaseResponse {
  errors?: string[]
}

export interface MoveCardToPhaseResponse extends BaseResponse {
  data: MoveCardToPhaseResponseData
}

interface MoveCardToPhaseResponseData {
  moveCardToPhase: MoveCardToPhase
}

interface MoveCardToPhase {
  clientMutationId: string
  card: CardMoved
}

interface CardMoved {
  id: string
  title: string
  createdAt: string
  updated_at: string
  started_current_phase_at: string
  url: string
  uuid: string
  labels: CardMovedLabel[]
  assignees: CardMovedAssignee[]
  fields: CardMovedField[]
  comments_count: 0
  attachments_count: 0
}

interface CardMovedLabel {
  id: string
  name: string
}

interface CardMovedAssignee {
  id: string
  name: string
  email: string
}

interface CardMovedField {
  field: CardMovedFieldInfo
  report_value: string
}

interface CardMovedFieldInfo {
  id: string
  label: string
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

export interface GetCardByIdWithFieldsResponse extends BaseResponse {
  data: GetCardByIdWithFieldsResponseData
}

interface GetCardByIdWithFieldsResponseData {
  card: CardWithFields
}

interface CardWithFields {
  id: string
  uuid: string
  age: number
  title: string
  comments_count: number
  createdAt: string
  current_phase_age: number
  done: boolean
  due_date?: string
  emailMessagingAddress: string
  expired: boolean
  late: boolean
  started_current_phase_at: string
  updated_at: string
  url: string
  creatorEmail: string
  fields: CardField[]
  current_phase: CardCurrentPhase
  pipe: CardPipe
}

interface CardField {
  field: CardFieldInfo
  name: string
  value: string
  array_value?: string[]
  report_value?: string
  date_value?: string
  datetime_value?:  string
  float_value?: number
  filled_at: string
  updated_at: string
  phase_field: CardPhaseField
  label_values?: CardFieldLabels[]
  assignee_values?: CardFieldAssignee[]
}

interface CardFieldInfo {
  label: string
  id: string
  type: string
}

interface CardPhaseField {
  id: string
  label: string
}

interface CardFieldLabels {
  id: string
  name: string
}

interface CardFieldAssignee {
  id: string
  email: string
}

interface CardCurrentPhase {
  id: string
  name: string
  sequentialId: string
  done: boolean
  cards_count: number
}

interface CardPipe {
  cards_count: number
  emailAddress: string
  id: string
  name: string
}
