import { httpClient } from "@activepieces/pieces-common";
import { Property, DynamicPropsValue } from "@activepieces/pieces-framework";

import {
  buildGraphqlHttpRequest,
  GetOrgsListResponse,
  GetPhasesListResponse,
  GetPipeLabelsListResponse,
  GetPipeMemberListResponse,
  GetPipesListResponse,
  GetStartFormFieldsResponse,
  GraphqlRequestsHelper,
} from ".";

const PipefyFieldsMapping = {
  phone: Property.Number,
  number: Property.Number,
  currency: Property.Number,
  time: Property.ShortText,
  datetime: Property.ShortText,
  due_date: Property.ShortText,
  date: Property.ShortText,
  long_text: Property.LongText,
  email: Property.ShortText,
  id: Property.ShortText,
  attachment: Property.Object,
  cpf: Property.ShortText,
  cnpj: Property.ShortText,
  short_text: Property.ShortText,
  statement: Property.ShortText,
  select: Property.StaticDropdown,
  radio_vertical: Property.StaticDropdown,
  radio_horizontal: Property.StaticMultiSelectDropdown,
  checklist_vertical: Property.StaticMultiSelectDropdown,
  checklist_horizontal: Property.StaticMultiSelectDropdown,
  assignee_select: Property.StaticMultiSelectDropdown,
  label_select: Property.StaticMultiSelectDropdown,
  connector: Property.ShortText,
}
export const CommonProps = {
  pipefyOAuth: Property.OAuth2({
    description: "OAuth",
    displayName: 'Authentication',
    authUrl: "https://app.pipefy.com/oauth/authorize",
    tokenUrl: "https://app.pipefy.com/oauth/token",
    required: false,
    scope: []
  }),
  authentication: Property.SecretText({
    description: "API Key",
    displayName: 'API Key',
    required: true,
  }),
  orgsList: Property.Dropdown({
    displayName: "Organization",
    refreshers: ["authentication"],
    description: "Select a Organization.",
    required: true,
    options: async (props: { authentication?: string; }) => {
      if (!props.authentication) {
        return {
          disabled: true,
          options: [],
          placeholder: "Please fill the fields: API KEY."
        }
      }

      const listResponse = await getOrgsList(props.authentication);
      const options = listResponse.data.organizations.map(org => ({
        label: org.name,
        value: org.id,
      }));

      return {
        disabled: false,
        options,
      };
    }
  }),
  pipesList: Property.Dropdown({
    displayName: "Pipe",
    refreshers: ["organization_id", "authentication"],
    description: "Select a Pipe where you want to setup the card action.",
    required: true,
    options: async (props: { authentication?: string; organization_id?: number; }) => {
      if (!props.authentication || !props.organization_id) {
        return {
          disabled: true,
          options: [],
          placeholder: "Please fill the fields: API KEY and Organization ID."
        }
      }

      const listResponse = await getPipesList(props.organization_id, props.authentication);
      const options = listResponse.data.organization.pipes.map(phase => ({
        label: phase.name,
        value: phase.id,
      }));

      return {
        disabled: false,
        options,
      };
    }
  }),
  phasesList: Property.Dropdown({
    displayName: "Phase",
    refreshers: ["pipe_id", "authentication"],
    description: "Select the Phase you want to move the card.",
    required: true,
    options: async (props: { authentication?: string; pipe_id?: number; }) => {
      if (!props.authentication || !props.pipe_id) {
        return {
          disabled: true,
          options: [],
          placeholder: "Please fill the fields: API Key and Pipe"
        }
      }

      const listResponse = await getPhasesList(props.pipe_id, props.authentication);
      const options = listResponse.data.pipe.phases.map(phase => ({
        label: phase.name,
        value: phase.id,
      }));

      return {
        disabled: false,
        options,
      };
    }
  }),
  startFormFields: Property.DynamicProperties({
    displayName: 'Fields',
    required: true,
    refreshers: ["authentication", "pipe_id"],
    props: async ({ authentication, pipe_id }) => {
      if (!authentication) return {}
      if (!pipe_id) return {}

      return await mapPipefyFieldsToPieceProperties(pipe_id as unknown as string, authentication as unknown as string)
    }
  }),
}

async function getOrgsList (apiKey: string) : Promise<GetOrgsListResponse> {
  const result = await httpClient.sendRequest<GetOrgsListResponse>(
    buildGraphqlHttpRequest(
      GraphqlRequestsHelper.buildGetOrgsListRequest(),
      apiKey
    )
  )

  console.debug("Orgs List found", JSON.stringify(result, null, 2))
  return result.body
}

async function getPipesList (organizationId: number, apiKey: string) : Promise<GetPipesListResponse> {
  const result = await httpClient.sendRequest<GetPipesListResponse>(
    buildGraphqlHttpRequest(
      GraphqlRequestsHelper.buildGetPipesListRequest(organizationId),
      apiKey
    )
  )

  console.debug("Pipes List found", result)
  return result.body
}

async function getPhasesList (pipeId: number | string, apiKey: string) : Promise<GetPhasesListResponse> {
  const result = await httpClient.sendRequest<GetPhasesListResponse>(
    buildGraphqlHttpRequest(
      GraphqlRequestsHelper.buildGetPhasesListRequest(pipeId),
      apiKey
    )
  )

  console.debug("Phases List found", result.body)
  return result.body
}

async function getStartFormFieldsList(pipeId: number | string,  apiKey: string) : Promise<GetStartFormFieldsResponse> {
  const result = await httpClient.sendRequest<GetStartFormFieldsResponse>(
    buildGraphqlHttpRequest(
      GraphqlRequestsHelper.buildGetStartFormFieldsListRequest(pipeId),
      apiKey
    )
  )

  console.debug("Start Form Fields List found", result.body)
  return result.body
}

async function getPipeMemberList(pipeId: number | string, apiKey: string) : Promise<GetPipeMemberListResponse> {
  const result = await httpClient.sendRequest<GetPipeMemberListResponse>(
    buildGraphqlHttpRequest(
      GraphqlRequestsHelper.buildGetPipeMembersListRequest(pipeId),
      apiKey
    )
  )

  console.debug("Member list found", result.body)
  return result.body
}

async function getPipeLabelsList(pipeId: number | string, apiKey: string) : Promise<GetPipeLabelsListResponse> {
  const result = await httpClient.sendRequest<GetPipeLabelsListResponse>(
    buildGraphqlHttpRequest(
      GraphqlRequestsHelper.buildGetPipeLabelsListRequest(pipeId),
      apiKey
    )
  )

  console.debug("Member list found", result.body)
  return result.body
}

async function mapPipefyFieldsToPieceProperties (pipeId: number | string, apiKey: string) :  Promise<DynamicPropsValue> {
  const startFormFields = await getStartFormFieldsList(pipeId, apiKey)

  const fields: DynamicPropsValue = {}

  startFormFields.data.pipe.start_form_fields.forEach(async (pipefyField) => {
    const fieldProperties = {
      displayName: pipefyField.label,
      description: pipefyField.description,
      required: pipefyField.required,
    }

    switch(pipefyField.type) {
      case "select":
      case "radio_vertical":
      case "radio_horizontal":
      case "checklist_vertical":
      case "checklist_horizontal":  {
        const fieldOptions = pipefyField.options.map(option => {
          return {
            label: option,
            value: option,
          }
        })

        fields[pipefyField.id] = (PipefyFieldsMapping[pipefyField.type])({
          ...fieldProperties,
          options: {
            options: fieldOptions ?? []
          }
        })

        break
      }
      case "assignee_select": {
        const response = await getPipeMemberList(pipeId, apiKey)

        fields[pipefyField.id] = (PipefyFieldsMapping[pipefyField.type])({
          ...fieldProperties,
          options: {
            options: response.data.pipe.members.map(member => {
              return {
                label: member.user.name,
                value: member.user.id
              }
            })
          }
        })

        break
      }
      case "label_select": {
        const response = await getPipeLabelsList(pipeId, apiKey)

        fields[pipefyField.id] = (PipefyFieldsMapping[pipefyField.type])({
          ...fieldProperties,
          options: {
            options: response.data.pipe.labels.map(label => {
              return {
                label: label.name,
                value: label.id
              }
            })
          }
        })

        break
      }
      default:
        fields[pipefyField.id] = (PipefyFieldsMapping[pipefyField.type])(fieldProperties)
    }
  })

  return fields
}
