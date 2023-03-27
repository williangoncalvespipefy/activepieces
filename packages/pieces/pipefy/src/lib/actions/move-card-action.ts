import { AuthenticationType, createAction, HttpRequest } from '@activepieces/framework';
import { HttpMethod } from '@activepieces/framework';
import { httpClient } from '@activepieces/framework';
import { Property } from '@activepieces/framework';

import { CommonProps, GraphQLRequest, GraphqlRequestsHelper, PIPEFY_API_URL } from '../common';

export const moveCard = createAction({
	name: 'move_card', // Must be a unique across the piece, this shouldn't be changed.
  displayName:'Move card in Pipefy',
  description: 'Move card in Pipefy',
	props: {
    authentication: CommonProps.authentication,
		organization_id: Property.Number({
			displayName: 'Organization',
			description: 'Select a Pipefy Organization where you want to setup the card action.',
			required: true,
		}),
    pipe_id: CommonProps.pipesList,
    phase_id: CommonProps.phasesList,
    card_id: Property.Number({
			displayName: 'Card ID',
			description: 'Pipefy Card ID of the card to be moved.',
			required: false,
		}),
	},
	async run(context) {
    const request: HttpRequest<GraphQLRequest> = {
      method: HttpMethod.POST,
      url: PIPEFY_API_URL,
      body: GraphqlRequestsHelper.buildMoveCardRequest(context.propsValue.pipe_id as number, context.propsValue.phase_id as number),
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: context.propsValue.authentication,
      }
    }

    const result = await httpClient.sendRequest<GraphQLRequest>(request)
    console.debug("Card move result", result)

    if (result.status === 200) {
      return result.body
    }
    
    return result
  }
})

