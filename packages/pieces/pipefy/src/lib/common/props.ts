import { httpClient, Property } from "@activepieces/framework";

import { 
  buildGraphqlHttpRequest,
  GetPhasesListResponse, 
  GetPipesListResponse, 
  GraphqlRequestsHelper, 
} from ".";


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
  pipesList: Property.Dropdown({
    displayName: "Pipe",
    refreshers: ["organization_id", "authentication"],
    description: "Select a Pipe where you want to setup the card action.",
    required: true,
    options: async (propsValue) => {
      if (!propsValue['organization_id']) {
        return {
          disabled: true,
          options: [],
          placeholder: "Please fill the Organization ID field."
        }
      }


      console.info(propsValue)
      const listResponse = await getPipesList(propsValue["organization_id"] as number, propsValue["authentication"] as string);
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
    options: async (propsValue) => {
      if (!propsValue['pipe_id']) {
        return {
          disabled: true,
          options: [],
          placeholder: "Please select a Pipe"
        }
      }
  
      const listResponse = await getPhasesList(propsValue["pipe_id"] as number, propsValue["authentication"] as string);
      const options = listResponse.data.pipe.phases.map(phase => ({
        label: phase.name,
        value: phase.id,
      }));
  
      return {
        disabled: false,
        options,
      };  
    }
  })
}

async function getPipesList (organizationId: number, apiKey: string) {
  const result = await httpClient.sendRequest<GetPipesListResponse>(
    buildGraphqlHttpRequest(
      GraphqlRequestsHelper.buildGetPipesListRequest(organizationId),
      apiKey
    )
  )

  console.debug("Pipes List found", result)
  return result.body
}

async function getPhasesList (pipeId: number, apiKey: string) {
  const result = await httpClient.sendRequest<GetPhasesListResponse>(
    buildGraphqlHttpRequest(
      GraphqlRequestsHelper.buildGetPhasesListRequest(pipeId),
      apiKey
    )
  )

  console.debug("Phases List found", result.body)
  return result.body
}
