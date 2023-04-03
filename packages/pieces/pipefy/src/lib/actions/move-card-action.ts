import { createAction } from '@activepieces/framework';
import { httpClient } from '@activepieces/framework';
import { Property } from '@activepieces/framework';

import { CommonProps, buildGraphqlHttpRequest, BaseResponse, GraphqlRequestsHelper } from '../common';

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
			required: true,
		}),
	},
	async run(context) {
    const result = await httpClient.sendRequest<BaseResponse>(
      buildGraphqlHttpRequest(
        GraphqlRequestsHelper.buildMoveCardRequest(context.propsValue.card_id as number, context.propsValue.phase_id as number),
        context.propsValue.authentication
      )
    )

    console.debug("Card move result", result.body)
    return result.body
  }
})