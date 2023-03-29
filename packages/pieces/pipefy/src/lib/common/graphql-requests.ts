import { AuthenticationType, HttpMethod, HttpRequest } from "@activepieces/framework"

export const PIPEFY_API_URL = "https://api.pipefy.com/graphql"

export interface GraphqlRequest {
  query: string,
}

export function buildGraphqlHttpRequest<T>(body: GraphqlRequest, apiKey: string) : HttpRequest<GraphqlRequest> {
  const request: HttpRequest<GraphqlRequest> = {
    method: HttpMethod.POST,
    url: PIPEFY_API_URL,
    body,
    authentication: {
      type: AuthenticationType.BEARER_TOKEN,
      token: apiKey,
    },
  }

  return request
}

export const GraphqlRequestsHelper = {
  buildMoveCardRequest: function (cardId: number, phaseId: number) : GraphqlRequest {
    return {
      query: JSON.stringify(`mutation {
        moveCardToPhase(input:{
          card_id: ${cardId}
          destination_phase_id: ${phaseId}
        }) {
          clientMutationId
          card {
            id
            title
            createdAt
            updated_at
            started_current_phase_at
            url
            createdBy {
              id
              name
              email
            }
            labels {
              id
              name
            }
            assignees {
              id
              name
              email
            }
            fields {
              field {
                id
                label
              }
              report_value
            }
            uuid
            comments_count
            attachments_count
          }
        }
      }`
      )
    }
  },
  buildGetPipesListRequest: function (organization_id: number) : GraphqlRequest {
    return {
      query: `query {
        organization(id: ${organization_id}){
          pipes (include_publics: true){
            id
            name
          }
        }
      }`
    }
  },
  buildGetPhasesListRequest: function (pipeId: number) : GraphqlRequest {
    return  {
      query: `query {
        pipe(id: ${pipeId}){
          phases {
            id
            name
          }
        }
      }`
    }
  },
  buildCreatePipeWebhookRequest: function (action: string, webhookUrl: string, pipeId: number) : GraphqlRequest {
    return {
      query: `mutation {
        createWebhook(input: {
            clientMutationId: "active-pieces-called-at-${Date.now}"
            actions: "${action}"
            name: "${action}"
            url: "${webhookUrl}"
            pipe_id: ${pipeId}
          }) {
          clientMutationId
          webhook {
            id
            actions
            headers
            email
            name
            url
          }
        }
      }`
    }
  },
  buildCreatTableWebhookRequest: function (name: string, actions: string[], webhookUrl: string, tableId: number) : GraphqlRequest {
    return {
      query: `mutation {
        createWebhook(input: {
            clientMutationId: "active-pieces-called-at-${Date.now}"
            name: "${name}"
            url: "${webhookUrl}"
            pipe_id: ${tableId}
          }) {
          clientMutationId
          webhook {
            id
            actions
            headers
            email
            name
            url
          }
        }
      }`
    }
  },
  buildDeleteWebhookRequest: function (webhookId: number, clientMutationId: string) : GraphqlRequest {
    return {
      query: `mutation {
        deleteWebhook(input: {id: ${webhookId}, clientMutationId: "${clientMutationId}") {
          clientMutationId
          success
        }
      }`
    }
  }
}