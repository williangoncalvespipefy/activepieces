import { AuthenticationType, HttpMethod, HttpRequest } from "@activepieces/framework"

export const PIPEFY_API_URL = "https://api.pipefy.com/graphql"

export interface GraphqlRequest {
  query: string,
}

export function buildGraphqlHttpRequest(body: GraphqlRequest, apiKey: string) : HttpRequest<GraphqlRequest> {
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

export type PipeIdInput = string | number

export const GraphqlRequestsHelper = {
  buildMoveCardRequest: function (cardId: number, phaseId: PipeIdInput) : GraphqlRequest {
    return {
      query: `mutation {
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
    }
  },
  buildGetPipesListRequest: function (organization_id: PipeIdInput) : GraphqlRequest {
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
  buildGetPhasesListRequest: function (pipeId: PipeIdInput) : GraphqlRequest {
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
  buildCreatePipeWebhookRequest: function (actions: string[], webhookUrl: string, pipeId: PipeIdInput) : GraphqlRequest {
    return {
      query: `mutation {
        createWebhook(input: {
            clientMutationId: "active-pieces-called-at-${Date.now}"
            actions: ${JSON.stringify(actions)}
            name: "${actions}"
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
  },
  buildGetStartFormFieldsListRequest: function (pipeId: PipeIdInput) : GraphqlRequest {
    return {
      query: `query{
        pipe(id: ${pipeId}){
            start_form_fields {
                id
                type
                index
                label
                options
                required
                help
                description
            }
        }
      }`
    }
  },
  buildGetPipeMembersListRequest: function (pipeId: PipeIdInput) : GraphqlRequest {
    return {
      query: `query{
        pipe(id: "${pipeId}"){
          members{
            user {
              id
              name
            }
          }
        }
      }`
    }
  },
  buildGetPipeLabelsListRequest: function (pipeId: PipeIdInput) : GraphqlRequest {
    return {
      query: `query{
        pipe(id: "${pipeId}"){
          labels{
            id
            name
          }
        }
      }`
    }
  },
  buildCreateCardRequest: function (pipeId: PipeIdInput) : GraphqlRequest {
    return {
      query: `mutation{
        createCard(input:{
            pipe_id: ${pipeId}}
            fields_attributes: [
              ${"teste"}
            ]
          }) {
            clientMutationId
              card {
                id
              }
            }
          }`
    }
  },
  buildGetCardWithFieldsByIdRequest: function (cardId: number) : GraphqlRequest {
    return {
      query: `query {
        card (id: ${cardId}) {
          id
          uuid
          age
          title
          comments_count
          createdAt
          current_phase_age
          done
          due_date
          emailMessagingAddress
          expired
          late
          started_current_phase_at
          updated_at
          url
          creatorEmail
          fields {
            field{
              label
              id
              type
            }
            name
            value
            array_value
            report_value
            date_value
            datetime_value
            float_value
            filled_at
            updated_at
            phase_field {
              id
              label
            }
            label_values {
              id
              name
            }
            assignee_values {
              id
              email
            }
          }
          current_phase {
            id
            name
            sequentialId
            done
            cards_count
          }
          pipe {
            cards_count
            emailAddress
            id
            name
          }
        }
      }`
    }
  },
}
