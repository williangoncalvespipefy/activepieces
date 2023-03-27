export const PIPEFY_API_URL = "https://api.pipefy.com/graphql"

export interface GraphQLRequest {
  query: string,
}

export const GraphqlRequestsHelper = {
  buildMoveCardRequest: function (cardId: number, phaseId: number) : GraphQLRequest {
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
  buildGetPipesListRequest: function (organization_id: number) : GraphQLRequest {
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
  buildGetPhasesListRequests: function (pipe_id: number): GraphQLRequest {
    return  {
      query: JSON.stringify(`query{
      pipe(id: ${pipe_id}){
        phases {
          id
          name
        }
        startFormPhaseId
      }`)
    }
  }
}