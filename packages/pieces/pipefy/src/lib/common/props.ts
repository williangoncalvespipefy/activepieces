import { AuthenticationType, httpClient, HttpMethod, HttpRequest, Property } from "@activepieces/framework";

import { 
  GetPhasesListResponse, 
  GetPipesListResponse, 
  GraphQLRequest, 
  GraphqlRequestsHelper, 
  PIPEFY_API_URL 
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
    refreshers: ["organization_id", "a"],
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
      const listResponse = await getPipesList(propsValue["organization_id"] as number, (propsValue["authentication"] as string));
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
    refreshers: ["pipe_id"],
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
  
      console.debug(propsValue)
      const listResponse = await getPhasesList(propsValue["pipe_id"] as number, propsValue["api_key"] as string);
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

async function getPipesList (organization_id: number, api_key: string) {
  const request: HttpRequest<GraphQLRequest> = {
    method: HttpMethod.POST,
    url: PIPEFY_API_URL,
    body: GraphqlRequestsHelper.buildGetPipesListRequest(organization_id),
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: api_key
    }
  }

  const result = await httpClient.sendRequest<GetPipesListResponse>(request)

  console.debug("Pipes List found", result)
  return result.body
}


async function getPhasesList (pipe_id: number, api_token: string) {
  const request: HttpRequest<GraphQLRequest> = {
    method: HttpMethod.POST,
    url: PIPEFY_API_URL,
    body: GraphqlRequestsHelper.buildGetPhasesListRequests(pipe_id),
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: api_token
    }
  }

  const result = await httpClient.sendRequest<GetPhasesListResponse>(request)

  console.debug("Phases List found", result)
  return result.body
}
